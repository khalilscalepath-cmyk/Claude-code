#!/usr/bin/env python3
"""Compile a client profile into finished agent prompts.

    python3 brains/compile.py --client northside-hvac --channel whatsapp
    python3 brains/compile.py --client northside-hvac --all --out out/northside/

One brain per client, one prompt per channel. Facts live in the JSON profile, reasoning lives in
core-brain.md, channel differences live in agents/*.md. Nothing is hand-edited after compiling:
change the profile and recompile.
"""
import argparse, json, pathlib, re, sys

ROOT = pathlib.Path(__file__).parent
CHANNELS = {
    "whatsapp": "whatsapp-booking.md",
    "email":    "gmail-speed-to-lead.md",
    "voice":    "voice-receptionist.md",
    "review":   "review-reactivation.md",
}
# Voice is self-contained: a 2k-token ceiling is what keeps it fast.
SELF_CONTAINED = {"voice"}
VOICE_TOKEN_CEILING = 2000

REQUIRED = [("agent_name",), ("business", "name"), ("business", "trade"),
            ("business", "service_area"), ("business", "owner_or_office")]


def dig(d, path):
    for k in path:
        if not isinstance(d, dict) or k not in d:
            return None
        d = d[k]
    return d


def money(s):
    """89 -> $89 ; 180..1200 -> $180-$1,200"""
    a, b = s.get("price_from"), s.get("price_to")
    if a is None:
        return "price on request"
    if b is None or a == b:
        return f"${a:,}"
    return f"${a:,}-${b:,}"


def ground_truth(p):
    """Full markdown fact block for the text channels."""
    b, out = p["business"], []
    out.append(f"**{b['name']}** — {b['trade']}, {b.get('years_in_business','')}".rstrip(" ,-"))
    if b.get("license"):
        out.append(f"Licence: {b['license']}")
    out.append(f"Phone: {b.get('phone','(not listed)')}")
    if b.get("address"):
        out.append(f"Address: {b['address']}")
    out.append(f"Service area: {b['service_area']}")

    h = p.get("hours", {})
    if h:
        out.append("\n**Hours**")
        for label, key in (("Open", "regular"), ("Closed", "closed"), ("After hours", "after_hours")):
            if h.get(key):
                out.append(f"- {label}: {h[key]}")

    if p.get("services"):
        out.append("\n**Services and prices**\n")
        out.append("| Service | Price | Notes |")
        out.append("|---|---|---|")
        for s in p["services"]:
            out.append(f"| {s['name']} | {money(s)} | {s.get('notes') or ''} |")
        out.append("\nPrices shown as a range are ranges, not quotes. Give the range, then say the "
                   "exact figure comes after a tech sees the job.")

    if p.get("policies"):
        out.append("\n**Policies**")
        for k, v in p["policies"].items():
            out.append(f"- {k.replace('_',' ').capitalize()}: {v}")

    if p.get("booking"):
        out.append("\n**Booking**")
        for k, v in p["booking"].items():
            out.append(f"- {k.replace('_',' ').capitalize()}: {v}")

    if p.get("faqs"):
        out.append("\n**Questions they actually get**")
        for f in p["faqs"]:
            out.append(f"- *{f['q']}* — {f['a']}")

    if p.get("unknowns"):
        out.append("\n**You do not know these — the office confirms**")
        for u in p["unknowns"]:
            out.append(f"- {u}")

    return "\n".join(out)


def ground_truth_compact(p):
    """Terse prose for voice, where every token costs latency."""
    b, out = p["business"], []
    out.append(f"{b['name']}, {b['trade']}, {b.get('years_in_business','')}. "
               f"Covers {b['service_area']}.".replace(" ,", ""))
    if b.get("address"):
        out.append(f"Address: {b['address']}.")
    if b.get("phone"):
        out.append(f"Phone: {b['phone']}.")
    h = p.get("hours", {})
    if h:
        out.append(f"Hours: {h.get('regular','')} Closed {h.get('closed','—')}. "
                   f"{h.get('after_hours','')}".strip())
    if p.get("services"):
        out.append("Prices: " + "; ".join(f"{s['name']} {money(s)}" for s in p["services"]) + ".")
    pol = p.get("policies", {})
    for k in ("after_hours_fee", "warranty", "emergency"):
        if pol.get(k):
            out.append(f"{k.replace('_',' ').capitalize()}: {pol[k]}.")
    if p.get("faqs"):
        out.append(" ".join(f"{f['q']} {f['a']}" for f in p["faqs"]))
    return " ".join(x for x in out if x)


def tokens(s):
    return len(s) // 4  # rough, deliberately pessimistic


def build(p, channel):
    gas = p.get("safety", {}).get("gas_emergency_line")
    trade = p["business"]["trade"]
    # "an HVAC company", "a plumbing company" — acronyms read by letter take "an" on A,E,F,H,I,L,M,N,O,R,S,X
    article = "an" if (trade[:1].upper() in "AEFHILMNORSX" and trade.isupper()) \
        or trade[:1].lower() in "aeiou" else "a"
    rv = p.get("review", {})
    vals = {
        "AGENT_NAME":            p["agent_name"],
        "BUSINESS_NAME":         p["business"]["name"],
        "TRADE":                 p["business"]["trade"],
        "SERVICE_AREA":          p["business"]["service_area"],
        "SERVICE_AREA_SHORT":    p["business"].get("service_area_short", p["business"]["service_area"]),
        "TRADE_ARTICLE":         article,
        "OWNER_OR_OFFICE":       p["business"]["owner_or_office"],
        "TONE":                  p.get("tone", "Warm, brief, plainly spoken."),
        "GROUND_TRUTH":          ground_truth(p),
        "GROUND_TRUTH_COMPACT":  ground_truth_compact(p),
        "GAS_LINE_CLAUSE":       f", and {gas}" if gas else "",
        "GAS_LINE_CLAUSE_SPOKEN": f", and then {gas}" if gas else "",
        "SMS_WINDOW":            rv.get("sms_window", "9am to 7pm"),
        "REVIEW_LINK":           rv.get("link", "[REVIEW LINK NOT SET]"),
        "REACTIVATION_DAYS":     str(rv.get("reactivation_days", 90)),
        "REACTIVATION_SERVICE":  rv.get("reactivation_service", "a check-up"),
    }

    parts = []
    if channel not in SELF_CONTAINED:
        parts.append((ROOT / "core-brain.md").read_text())
    parts.append((ROOT / "agents" / CHANNELS[channel]).read_text())
    text = "\n\n".join(parts)

    # Strip the compiler notes and the platform-config tail: neither belongs in a system prompt.
    text = re.sub(r"^#.*?\n\nPlaceholders.*?\n\n---\n", "", text, flags=re.S)
    text = re.sub(r"\n## VOICE SETTINGS.*$", "", text, flags=re.S)
    text = re.sub(r"^# Channel: .*?\n", "", text, flags=re.M)
    text = re.sub(r"Voice agents degrade badly.*?warns past 2,000\.\n\n---\n", "", text, flags=re.S)

    for k, v in vals.items():
        text = text.replace("{{" + k + "}}", v)

    left = re.findall(r"\{\{(\w+)\}\}", text)
    if left:
        print(f"  ! unfilled placeholders in {channel}: {sorted(set(left))}", file=sys.stderr)
    return text.strip() + "\n"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--client", required=True, help="profile name in brains/clients/ (no .json)")
    ap.add_argument("--channel", choices=CHANNELS)
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--out", help="directory to write into (default: stdout)")
    a = ap.parse_args()

    if not a.channel and not a.all:
        ap.error("pass --channel or --all")

    path = ROOT / "clients" / f"{a.client}.json"
    if not path.exists():
        sys.exit(f"no profile at {path}")
    p = json.loads(path.read_text())

    missing = [".".join(r) for r in REQUIRED if dig(p, r) in (None, "")]
    if missing:
        sys.exit(f"profile is missing required fields: {', '.join(missing)}")
    if p.get("review", {}).get("link", "").find("EXAMPLE") != -1:
        print("  ! review.link is still the placeholder — the review agent will send a dead link",
              file=sys.stderr)

    todo = list(CHANNELS) if a.all else [a.channel]
    for ch in todo:
        text = build(p, ch)
        n = tokens(text)
        if ch == "voice" and n > VOICE_TOKEN_CEILING:
            print(f"  ! voice prompt is ~{n} tokens, over the {VOICE_TOKEN_CEILING} ceiling — "
                  f"trim it or the agent will lag", file=sys.stderr)
        if a.out:
            d = pathlib.Path(a.out); d.mkdir(parents=True, exist_ok=True)
            f = d / f"{a.client}-{ch}.md"
            f.write_text(text)
            print(f"  {f}  (~{n} tokens)")
        else:
            print(text)


if __name__ == "__main__":
    main()
