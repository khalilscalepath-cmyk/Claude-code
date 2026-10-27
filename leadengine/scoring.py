"""Score each business for the 4 Scalepath offers and pick what to pitch."""
import re

from .signals import ReviewSignals

# Franchise brands whose locations are owned by local franchisees. These are "master key" clients
# (JP Middleton): owners compare notes on advisory boards and at conventions, so one win can spread
# across the network. Check whether the location's calls go to a brand call center before pitching
# the receptionist; reactivation, reviews, sales coaching and ads usually still fit.
FRANCHISE_BRANDS = re.compile(
    r"one hour|mr\.? rooter|benjamin franklin|ben franklin plumbing|mister sparky|aire serv|"
    r"mr\.? electric|bluefrog plumbing|zoom drain|rooter-?man|plumbing paramedics",
    re.I,
)
# Company-owned or private-equity groups with central dispatch: a hard sale, keep downweighted.
CORPORATE_BRANDS = re.compile(
    r"roto-?rooter|service experts|\bars\b|rescue rooter|horizon services|any hour|"
    r"len the plumber|parker & sons|goettl|abc home|baker brothers",
    re.I,
)
# Retailers and home-warranty companies are not prospects.
NOT_PROSPECTS = re.compile(r"frontdoor|cinch|home depot|lowe'?s|sears", re.I)

# Kept for anything importing the old name.
FRANCHISES = FRANCHISE_BRANDS


def brand_type(name: str) -> str:
    """'franchise', 'corporate', 'not_prospect' or 'independent'."""
    name = name or ""
    if NOT_PROSPECTS.search(name):
        return "not_prospect"
    if FRANCHISE_BRANDS.search(name):
        return "franchise"
    if CORPORATE_BRANDS.search(name):
        return "corporate"
    return "independent"


OFFERS = {
    "voice_ai": "After-Hours Voice AI Receptionist",
    "text_back": "Missed-Call Text-Back",
    "speed_to_lead": "Speed-to-Lead (60-second response)",
    "flagship": "Full Lead Recovery (flagship: all three)",
}


def _cap(x: float) -> int:
    return int(max(0, min(100, round(x))))


def score_business(biz: dict, rev: ReviewSignals, web: dict[str, bool]) -> dict:
    c = rev.counts
    hours = biz.get("hours") or {}
    reasons: list[str] = []

    missed = c["missed_call"] + c["no_callback"]
    if missed:
        reasons.append(f"{missed} review(s) mention unanswered calls / no callback")
    if c["after_hours"]:
        reasons.append(f"{c['after_hours']} review(s) describe after-hours/weekend problems")
    if c["slow_response"]:
        reasons.append(f"{c['slow_response']} review(s) complain about slow response/quotes")
    if c["lost_to_competitor"]:
        reasons.append(f"{c['lost_to_competitor']} review(s) say they went to a competitor")

    closed_weekend = hours.get("known") and not hours.get("open_24_7") and (
        hours.get("open_saturday") is False or hours.get("open_sunday") is False)
    close_hr = hours.get("latest_weekday_close")
    closes_early = close_hr is not None and close_hr <= 18
    if closed_weekend:
        reasons.append("Closed at least one weekend day on Google")
    if closes_early:
        reasons.append(f"Weekdays close by {int(close_hr)}:00")
    claims_247_but_leaks = web.get("claims_24_7") and (missed or c["after_hours"])
    if claims_247_but_leaks:
        reasons.append("Website promises 24/7/emergency service but reviews say calls go unanswered")
    no_instant_reply = not web.get("chat_widget") and not web.get("text_us")
    if web.get("has_form") and no_instant_reply:
        reasons.append("Web form with no chat/text, so leads wait for a human")
    if web.get("runs_google_ads") or web.get("runs_meta_ads"):
        reasons.append("Runs paid ads (pays for leads → slow response burns money)")

    voice_ai = (
        25 * min(c["after_hours"], 2)
        + 12 * min(missed, 2)
        + 20 * bool(closed_weekend)
        + 10 * closes_early
        + 20 * bool(claims_247_but_leaks)
    )
    text_back = 28 * min(missed, 3) + 10 * no_instant_reply + 10 * min(c["lost_to_competitor"], 1)
    speed = (
        25 * min(c["slow_response"], 2)
        + 15 * min(c["no_callback"], 1)
        + 15 * bool(web.get("has_form") and no_instant_reply)
        + 15 * bool(web.get("runs_google_ads") or web.get("runs_meta_ads"))
        + 10 * (not web.get("online_booking"))
        + 15 * min(c["lost_to_competitor"], 1)
    )
    # Many "they answered instantly" reviews means the pain is small.
    damp = max(0.5, 1 - 0.1 * rev.responsive)
    scores = {
        "voice_ai": _cap(voice_ai * damp),
        "text_back": _cap(text_back * damp),
        "speed_to_lead": _cap(speed * damp),
    }
    strong = [k for k, v in scores.items() if v >= 45]
    scores["flagship"] = _cap(sum(scores.values()) / 2) if len(strong) >= 2 else 0

    # Fit: owner-operated sweet spot is roughly 15-600 Google reviews. Franchisee-owned locations
    # are as good a fit as independents and are flagged as master-key clients.
    n = biz.get("review_count") or 0
    kind = brand_type(biz.get("name") or "")
    is_franchise = kind == "franchise"
    if kind == "not_prospect":
        fit, fit_note = 0.0, "retailer / home warranty (not a prospect)"
    elif kind == "corporate":
        fit, fit_note = 0.4, "company-owned brand (likely central call center)"
    elif is_franchise:
        fit, fit_note = 1.0, ("franchise location: MASTER KEY (one win can spread across the "
                              "network; check if calls go to a brand call center)")
    elif n > 1500:
        fit, fit_note = 0.6, "very large (may already have dispatch staff)"
    elif n < 5:
        fit, fit_note = 0.7, "tiny online footprint (pain likely but budget unknown)"
    else:
        fit, fit_note = 1.0, "owner-operated sweet spot"

    best = max(scores, key=scores.get)
    need = _cap(max(scores.values()) * fit + 5 * len(strong))
    if biz.get("business_status") not in (None, "OPERATIONAL"):
        need = 0
    return {
        "need_score": need,
        "scores": scores,
        "recommended_offer": OFFERS[best] if scores[best] > 0 else "Not a fit right now",
        "recommended_key": best,
        "fit_note": fit_note,
        "pain_counts": dict(c),
        "is_franchise": is_franchise,
        "brand_type": kind,
        "reasons": reasons,
        "evidence": [
            {"rating": h.rating, "categories": h.categories, "quote": _quote(h.text)}
            for h in rev.hits[:5]
        ],
    }


def _quote(text: str, limit: int = 220) -> str:
    text = " ".join(text.split())
    return text if len(text) <= limit else text[: limit - 1].rsplit(" ", 1)[0] + "…"
