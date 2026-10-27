"""Scalepath lead engine.

  python -m leadengine run --trade plumber --city "Houston, TX" --limit 40
  python -m leadengine demo --lead out/houston-tx-plumber/leads/<slug> [--live]
  python -m leadengine reactivate --list export.csv --business "X" --trade hvac --offer "..."

Pipeline per business: Google Places (listing, hours, 5 reviews) → Outscraper (full reviews,
optional) → website audit → pain scoring → cold email + voice-AI prompt + knowledge base.
"""
import argparse
import csv
import json
import os
import re
from pathlib import Path

from dotenv import load_dotenv

from . import outreach, sources
from .demo import create_demo
from .scoring import score_business
from .signals import scan_reviews, scan_website

ROOT = Path(__file__).resolve().parent.parent
PROMPT_TEMPLATE = ROOT / "templates" / "voice-ai" / "after-hours-receptionist.md"


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", (s or "").lower()).strip("-")[:60]


def sender_from_env() -> dict:
    return {
        "name": os.getenv("SENDER_NAME", "Khalil"),
        "company": os.getenv("SENDER_COMPANY", "Scalepath Partnership"),
        "calendly": os.getenv("CALENDLY_LINK", "<your Calendly link>"),
    }


def process(biz: dict, use_web: bool, full_reviews: int, review_sort: str) -> dict:
    reviews = list(biz["reviews"])
    if full_reviews:
        try:
            reviews += sources.fetch_all_reviews(biz["place_id"], limit=full_reviews,
                                               sort=review_sort)
        except Exception as e:  # keep the run going; one bad place shouldn't kill 60
            print(f"  ! outscraper failed for {biz['name']}: {e}")
    site = sources.fetch_website(biz["website"]) if use_web else {"html": "", "text": ""}
    rev = scan_reviews(reviews)
    web = scan_website(site["html"])
    lead = {**biz, **score_business(biz, rev, web)}
    lead["reviews_scanned"] = rev.reviews_scanned
    lead["website_flags"] = web
    lead["trade"] = outreach.detect_trade(biz, site["text"])
    lead["city"] = outreach.city_of(biz.get("address"))
    domain = outreach.domain_of(biz.get("website") or "")
    lead["emails"] = outreach_emails(domain, site["html"])
    lead.pop("reviews", None)
    lead["_site_text"] = site["text"]
    return lead


def outreach_emails(domain: str, html: str) -> list[str]:
    found = sources.emails_from_html(html)
    if not found:
        try:
            found = sources.find_emails(domain)
        except Exception:
            found = []
    return found


def write_lead_pack(lead: dict, out_dir: Path, sender: dict) -> None:
    d = out_dir / "leads" / slug(lead["name"])
    d.mkdir(parents=True, exist_ok=True)
    site_text = lead.pop("_site_text", "")
    email = outreach.cold_email(lead, sender)
    (d / "email.md").write_text(
        f"Subject: {email['subject']}\n\n{email['body']}\n---\nFollow-up 1 (day 3)\n\n"
        f"{email['follow_up_1']}\n\n---\nFollow-up 2 (day 7)\n\n{email['follow_up_2']}\n"
    )
    (d / "voice_ai_prompt.md").write_text(outreach.voice_ai_prompt(lead, site_text, PROMPT_TEMPLATE))
    (d / "knowledge_base.md").write_text(outreach.knowledge_base(lead, site_text))
    (d / "lead.json").write_text(json.dumps(lead, indent=2, default=str))
    lead["_email"] = email


def cmd_run(args) -> None:
    query = f"{args.trade} in {args.city}"
    out_dir = Path(args.out) / slug(f"{args.city}-{args.trade}")
    out_dir.mkdir(parents=True, exist_ok=True)
    print(f"Searching Google Maps: {query}")
    places = sources.search_places(query, max_results=args.limit)
    print(f"  {len(places)} businesses found")
    sender = sender_from_env()
    leads = []
    for i, biz in enumerate(places, 1):
        print(f"[{i}/{len(places)}] {biz['name']}")
        lead = process(biz, use_web=not args.no_website, full_reviews=args.full_reviews,
                       review_sort=args.review_sort)
        write_lead_pack(lead, out_dir, sender)
        leads.append(lead)
    leads.sort(key=lambda l: l["need_score"], reverse=True)
    write_csv(leads, out_dir / "leads.csv")
    write_instantly_csv([l for l in leads if l["need_score"] >= args.min_score and l["emails"]],
                        out_dir / "instantly_import.csv")
    print(f"\nTop prospects (need score ≥ {args.min_score}):")
    for l in leads:
        if l["need_score"] >= args.min_score:
            print(f"  {l['need_score']:>3}  {l['name']}  →  {l['recommended_offer']}")
    print(f"\nWrote {out_dir}/leads.csv, instantly_import.csv and leads/<business>/")


def write_csv(leads: list[dict], path: Path) -> None:
    cols = ["need_score", "name", "recommended_offer", "fit_note", "brand_type", "phone", "emails", "website",
            "address", "rating", "review_count", "reviews_scanned", "voice_ai", "text_back",
            "speed_to_lead", "flagship", "reasons", "top_evidence", "maps_url"]
    with path.open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for l in leads:
            w.writerow({
                **{k: l.get(k) for k in cols if k in l},
                **l["scores"],
                "emails": "; ".join(l["emails"]),
                "reasons": " | ".join(l["reasons"]),
                "top_evidence": " | ".join(e["quote"] for e in l["evidence"][:2]),
            })


def write_instantly_csv(leads: list[dict], path: Path) -> None:
    """Columns Instantly/Smartlead map on import; custom vars carry the personalized copy."""
    with path.open("w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["email", "companyName", "website", "phone", "city", "subject", "body",
                    "followUp1", "followUp2"])
        for l in leads:
            e = l["_email"]
            w.writerow([l["emails"][0], l["name"], l.get("website"), l.get("phone"), l.get("city"),
                        e["subject"], e["body"], e["follow_up_1"], e["follow_up_2"]])


def cmd_demo(args) -> None:
    d = Path(args.lead)
    lead = json.loads((d / "lead.json").read_text())
    prompt = (d / "voice_ai_prompt.md").read_text()
    print(create_demo(lead["name"], prompt, d / "vapi_assistant.json", live=args.live))


def main() -> None:
    load_dotenv(ROOT / ".env")
    p = argparse.ArgumentParser(prog="leadengine")
    sub = p.add_subparsers(dest="cmd", required=True)
    r = sub.add_parser("run", help="find, audit, score and write outreach for one trade+city")
    r.add_argument("--trade", required=True, help='e.g. "plumber", "HVAC company", "electrician"')
    r.add_argument("--city", required=True, help='e.g. "Houston, TX"')
    r.add_argument("--limit", type=int, default=40)
    r.add_argument("--full-reviews", type=int, default=0,
                   help="pull N newest reviews per business via Outscraper (needs key)")
    r.add_argument("--review-sort", default="lowest_rating",
                   choices=["lowest_rating", "newest", "most_relevant"])
    r.add_argument("--no-website", action="store_true")
    r.add_argument("--min-score", type=int, default=40)
    r.add_argument("--out", default=str(ROOT / "out"))
    r.set_defaults(func=cmd_run)
    dm = sub.add_parser("demo", help="build a Vapi demo assistant for one lead")
    dm.add_argument("--lead", required=True, help="path to out/<run>/leads/<business>")
    dm.add_argument("--live", action="store_true")
    dm.set_defaults(func=cmd_demo)
    ra = sub.add_parser("reactivate", help="turn a client's customer export into a text campaign")
    ra.add_argument("--list", required=True, help="CSV export from the client's CRM")
    ra.add_argument("--business", required=True, help="the client's business name")
    ra.add_argument("--trade", default="hvac", help="hvac, plumbing or electrical")
    ra.add_argument("--offer", required=True,
                    help='the client-approved promo, e.g. "a $79 AC tune-up (normally $149)"')
    ra.add_argument("--ticket", type=float, default=350, help="average ticket in dollars")
    ra.add_argument("--no-consent-check", action="store_true",
                    help="keep rows even if the consent column says no (only with written OK)")
    ra.add_argument("--out", default=str(ROOT / "out"))
    ra.set_defaults(func=cmd_reactivate)
    args = p.parse_args()
    args.func(args)


def cmd_reactivate(args) -> None:
    from . import reactivation
    path = Path(args.list)
    res = reactivation.build(path, args.business, args.trade, args.offer,
                             require_consent=not args.no_consent_check)
    with path.open(newline="", encoding="utf-8-sig") as f:
        headers = next(csv.reader(f), [])
    consent_found = reactivation._col(headers, "consent") is not None
    out_dir = Path(args.out) / f"reactivation-{slug(args.business)}"
    reactivation.write_outputs(res, out_dir, args.business, args.ticket, consent_found)
    print(f"{len(res.contacts)} of {res.total_rows} contacts ready. "
          f"Wrote {out_dir}/ghl_import.csv and summary.md")


if __name__ == "__main__":
    main()
