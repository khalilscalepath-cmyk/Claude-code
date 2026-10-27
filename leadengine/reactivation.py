"""Database reactivation (AI employee #2: the outreach specialist).

Takes a client's customer export (ServiceTitan, Housecall Pro, Jobber, QuickBooks, a spreadsheet),
cleans it, drops anyone who can't be texted, sorts people into segments that each get their own
offer, and writes a GoHighLevel-ready import plus a one-page summary with the money math.

  python -m leadengine reactivate --list export.csv --business "Emergency Air" --trade hvac \
      --ticket 350 --offer "a $79 AC tune-up (normally $149)"
"""
from __future__ import annotations

import csv
import re
from dataclasses import dataclass, field
from datetime import date, datetime
from pathlib import Path

# Column names differ by CRM; match loosely on lowercase header text.
COLUMNS = {
    "first": ["first name", "firstname", "first"],
    "name": ["customer name", "customer", "full name", "name", "contact"],
    "phone": ["mobile", "cell", "mobile phone", "phone", "phone number", "primary phone"],
    "email": ["email", "email address", "e-mail"],
    "last_service": ["last service date", "last service", "last job date", "last job",
                     "last visit", "last appointment", "completed date"],
    "equipment_year": ["equipment install year", "install year", "equipment year", "system year",
                       "unit year", "water heater year", "year installed"],
    "estimate_status": ["estimate status", "open estimate", "unsold estimate", "estimate"],
    "estimate_amount": ["estimate amount", "estimate total", "quote amount", "quote total"],
    "estimate_date": ["estimate date", "quote date"],
    "opt_out": ["do not text", "dnt", "sms opt out", "opt out", "unsubscribed", "do not contact"],
    "consent": ["sms consent", "text consent", "marketing consent", "opted in", "sms opt in"],
}

YES = {"y", "yes", "true", "1", "x", "opted out", "unsubscribed"}
OPEN_ESTIMATE = {"open", "unsold", "pending", "sent", "not sold", "dismissed", "yes", "y"}

SEGMENTS = {
    "open_estimate": "Got a quote, never booked",
    "aging_equipment": "Equipment 10+ years old",
    "lapsed": "No service in 12+ months",
    "recent": "Served in the last 12 months",
    "never_booked": "Enquired, never booked a job",
}

# What each segment is offered, per trade. {offer} is the client's main promo from --offer.
SEGMENT_PITCH = {
    "hvac": {
        "open_estimate": "we still have your quote on file, and we can honor it this month plus "
                         "give you a free second look before you decide",
        "aging_equipment": "a system that age is the kind that quits on the hottest or coldest day. "
                           "We're offering {offer} so you know where it stands",
        "lapsed": "it's been a while since we looked at your system. We're doing {offer}",
        "recent": "thanks again for having us out. We're doing {offer} for past customers",
        "never_booked": "you reached out to us a while back. If it's still on your list, "
                        "we're doing {offer}",
    },
    "plumbing": {
        "open_estimate": "we still have your quote on file and can honor it this month",
        "aging_equipment": "water heaters past 10 years are the ones that leak without warning. "
                           "We're offering {offer} so you know where it stands",
        "lapsed": "it's been a while since we've been out. We're doing {offer}",
        "recent": "thanks again for having us out. We're doing {offer} for past customers",
        "never_booked": "you reached out to us a while back. If it's still on your list, "
                        "we're doing {offer}",
    },
    "electrical": {
        "open_estimate": "we still have your quote on file and can honor it this month",
        "aging_equipment": "older panels are worth a safety check. We're offering {offer}",
        "lapsed": "it's been a while since we've been out. We're doing {offer}",
        "recent": "thanks again for having us out. We're doing {offer} for past customers",
        "never_booked": "you reached out to us a while back. If it's still on your list, "
                        "we're doing {offer}",
    },
}


@dataclass
class Contact:
    first: str
    phone: str
    email: str
    segment: str
    last_service: date | None = None
    equipment_year: int | None = None
    estimate_amount: float | None = None
    messages: list[str] = field(default_factory=list)


@dataclass
class Result:
    contacts: list[Contact]
    skipped: dict[str, int]
    total_rows: int


def _col(headers: list[str], key: str) -> str | None:
    low = {h.strip().lower(): h for h in headers}
    for cand in COLUMNS[key]:
        if cand in low:
            return low[cand]
    for cand in COLUMNS[key]:  # fallback: header contains the candidate
        for lh, h in low.items():
            if cand in lh:
                return h
    return None


def normalize_phone(raw: str) -> str | None:
    """US/Canada numbers to E.164 (+1XXXXXXXXXX). Anything else is dropped."""
    digits = re.sub(r"\D", "", raw or "")
    if len(digits) == 11 and digits.startswith("1"):
        digits = digits[1:]
    if len(digits) != 10 or digits[0] in "01" or digits[3] in "01":
        return None
    return "+1" + digits


def parse_date(raw: str) -> date | None:
    raw = (raw or "").strip()
    for fmt in ("%Y-%m-%d", "%m/%d/%Y", "%m/%d/%y", "%d-%b-%Y", "%b %d, %Y", "%Y/%m/%d",
                "%m-%d-%Y", "%Y-%m-%d %H:%M:%S", "%m/%d/%Y %H:%M"):
        try:
            return datetime.strptime(raw, fmt).date()
        except ValueError:
            pass
    return None


def _money(raw: str) -> float | None:
    s = re.sub(r"[^\d.]", "", raw or "")
    try:
        return float(s) if s else None
    except ValueError:
        return None


def segment_for(today: date, last_service: date | None, equipment_year: int | None,
                estimate_open: bool, estimate_date: date | None) -> str:
    if estimate_open and (estimate_date is None or (today - estimate_date).days <= 730):
        return "open_estimate"
    if equipment_year and today.year - equipment_year >= 10:
        return "aging_equipment"
    if last_service is None:
        return "never_booked"
    if (today - last_service).days > 365:
        return "lapsed"
    return "recent"


def write_messages(c: Contact, business: str, trade: str, offer: str) -> list[str]:
    pitch = SEGMENT_PITCH.get(trade, SEGMENT_PITCH["hvac"])[c.segment].format(offer=offer)
    hi = f"Hi {c.first}" if c.first else "Hi there"
    return [
        f"{hi}, it's {business}. {pitch[0].upper() + pitch[1:]}. Want me to find you a time? "
        f"Reply STOP to opt out.",
        f"{hi}, just checking you saw this. Happy to hold a spot this week if it helps. "
        f"Reply YES and I'll send over a couple of open times.",
        f"Last one from me, {c.first or 'promise'}. If now's not the time, no problem at all. "
        f"Just reply whenever you need {business}.",
    ]


def build(path: Path, business: str, trade: str, offer: str, today: date | None = None,
          require_consent: bool = True) -> Result:
    today = today or date.today()
    trade = trade.lower()
    trade = "hvac" if "hvac" in trade or "air" in trade or "heat" in trade else (
        "plumbing" if "plumb" in trade else ("electrical" if "electric" in trade else "hvac"))
    with path.open(newline="", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))
    headers = list(rows[0].keys()) if rows else []
    cols = {k: _col(headers, k) for k in COLUMNS}
    get = lambda r, k: (r.get(cols[k]) or "").strip() if cols[k] else ""  # noqa: E731

    skipped = {"no_valid_mobile": 0, "opted_out": 0, "no_consent_recorded": 0, "duplicate": 0}
    seen: set[str] = set()
    contacts: list[Contact] = []
    for r in rows:
        phone = normalize_phone(get(r, "phone"))
        if not phone:
            skipped["no_valid_mobile"] += 1
            continue
        if get(r, "opt_out").lower() in YES:
            skipped["opted_out"] += 1
            continue
        if require_consent and cols["consent"] and get(r, "consent").lower() not in YES:
            skipped["no_consent_recorded"] += 1
            continue
        if phone in seen:
            skipped["duplicate"] += 1
            continue
        seen.add(phone)
        first = get(r, "first") or (get(r, "name").split() or [""])[0]
        first = first.title() if first.isupper() or first.islower() else first
        year = get(r, "equipment_year")
        year_i = int(year[:4]) if year[:4].isdigit() and 1950 < int(year[:4]) <= today.year else None
        last = parse_date(get(r, "last_service"))
        est_open = get(r, "estimate_status").lower() in OPEN_ESTIMATE
        c = Contact(
            first=first, phone=phone, email=get(r, "email"),
            segment=segment_for(today, last, year_i, est_open, parse_date(get(r, "estimate_date"))),
            last_service=last, equipment_year=year_i, estimate_amount=_money(get(r, "estimate_amount")),
        )
        c.messages = write_messages(c, business, trade, offer)
        contacts.append(c)
    return Result(contacts, skipped, len(rows))


def write_outputs(res: Result, out_dir: Path, business: str, ticket: float,
                  consent_column_found: bool) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    with (out_dir / "ghl_import.csv").open("w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["First Name", "Phone", "Email", "Tags", "Segment", "Message 1 (day 0)",
                    "Message 2 (day 2)", "Message 3 (day 5)"])
        for c in res.contacts:
            w.writerow([c.first, c.phone, c.email, f"reactivation,{c.segment}",
                        SEGMENTS[c.segment], *c.messages])

    counts = {s: sum(c.segment == s for c in res.contacts) for s in SEGMENTS}
    n = len(res.contacts)
    open_value = sum(c.estimate_amount or 0 for c in res.contacts if c.segment == "open_estimate")
    lo, hi = n * 0.05 * ticket, n * 0.12 * ticket  # 5–12% book: assumption, not a promise
    lines = [
        f"# Reactivation summary: {business}", "",
        f"Rows in the export: {res.total_rows}. Ready to text: **{n}**.", "",
        "| Segment | Contacts |", "|---|---|",
        *[f"| {SEGMENTS[s]} | {counts[s]} |" for s in SEGMENTS],
        "", "Skipped (not texted):",
        *([f"- {k.replace('_', ' ')}: {v}" for k, v in res.skipped.items() if v] or ["- none"]),
    ]
    if not consent_column_found:
        lines += ["", "**No SMS-consent column was found.** Before sending, the client must confirm "
                  "these people gave their number for texts (e.g. on a work order or booking form). "
                  "If they can't, call or email this list instead."]
    if open_value:
        lines += ["", f"Unsold estimates on this list add up to **${open_value:,.0f}**. "
                  "Start with that segment: it's the warmest money."]
    lines += [
        "", "## The math to show the owner (say it as a range, not a promise)",
        f"{n} people × 5–12% booking × ${ticket:,.0f} average ticket ≈ "
        f"**${lo:,.0f}–${hi:,.0f}** in booked work, before replacements or memberships.",
        "", "## Send plan",
        "- Send 100–200 a day, 9am–7pm in the customer's time zone, never Sundays or holidays.",
        "- Open-estimate segment first, then aging equipment, then lapsed, then the rest.",
        "- The AI reply agent answers every reply within 5 minutes and books (see the "
        "`database-reactivation` skill). STOP replies are removed automatically.",
    ]
    (out_dir / "summary.md").write_text("\n".join(lines) + "\n")
