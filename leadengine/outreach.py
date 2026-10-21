"""Turn a scored lead into: a cold email, a voice-AI demo prompt, and a knowledge base.

Template-based on purpose: zero LLM credits per lead. Paste the prompt into
GoHighLevel/Hexona Voice AI (then run Prompting Advisor) or send it to Vapi via demo.py.
"""
import re
from pathlib import Path
from urllib.parse import urlparse

TRADE_WORDS = {
    "hvac": r"hvac|air condition|heating|cooling|furnace|heat pump|\bac\b|a/c",
    "plumbing": r"plumb|drain|sewer|water heater|rooter|leak",
    "electrical": r"electric|panel|wiring|generator|ev charger",
}
SERVICE_TERMS = [
    "AC repair", "AC installation", "furnace repair", "heat pump", "duct cleaning",
    "maintenance plan", "water heater", "tankless water heater", "drain cleaning",
    "sewer line", "leak detection", "repiping", "slab leak", "hydro jetting", "gas line",
    "panel upgrade", "EV charger", "generator", "rewiring", "lighting", "surge protection",
    "ceiling fan", "outlet", "indoor air quality", "mini split", "thermostat",
]

# What the email says about the pain. Soft on purpose: we never shame them with their reviews,
# and each sentence is only used when the evidence behind it was actually found.
def pain_angle(lead: dict) -> str:
    c = lead.get("pain_counts") or {}
    flags = lead.get("website_flags") or {}
    unreachable = c.get("missed_call", 0) + c.get("no_callback", 0)
    hours = hours_phrase(lead.get("hours"))
    key = lead["recommended_key"]
    lines = []
    if key in ("voice_ai", "flagship"):
        if c.get("after_hours"):
            lines.append(f"I noticed you're {hours}, and a couple of customers mentioned trouble "
                         "reaching someone in the evening or on weekends.")
        else:
            lines.append(f"I noticed you're {hours}. Evenings and weekends are usually when the "
                         "urgent, higher-ticket calls come in.")
    if key in ("text_back", "flagship") or (key == "voice_ai" and unreachable):
        if unreachable:
            lines.append("A few customers also mentioned calling and not hearing back. Totally "
                         "normal when your techs are out on jobs, but each of those is a job going "
                         "to whoever picks up next.")
        else:
            lines.append("When your techs are out on jobs, calls that hit voicemail usually just "
                         "call the next company on Google.")
    if key in ("speed_to_lead", "flagship"):
        if flags.get("has_form") and not flags.get("chat_widget"):
            lines.append("New inquiries from your website form wait for someone to get back to "
                         "the office, and the first company to respond usually gets the job.")
        else:
            lines.append("The first company to respond to a new inquiry usually gets the job, "
                         "and most shops take hours.")
    return " ".join(lines)


def hours_phrase(hours: dict) -> str:
    if not hours or not hours.get("known"):
        return "running a busy schedule"
    if hours.get("open_24_7"):
        return "listed as open 24/7"
    bits = []
    if hours.get("latest_weekday_close"):
        h = int(hours["latest_weekday_close"])
        bits.append(f"closing around {h - 12 if h > 12 else h}{'pm' if h >= 12 else 'am'} on weekdays")
    if hours.get("open_saturday") is False and hours.get("open_sunday") is False:
        bits.append("closed weekends")
    elif hours.get("open_sunday") is False:
        bits.append("closed Sundays")
    return " and ".join(bits) or "on a set schedule"


def detect_trade(biz: dict, site_text: str = "") -> str:
    hay = " ".join([biz.get("name") or "", biz.get("primary_type") or "", site_text[:4000]])
    hits = {t: len(re.findall(p, hay, re.I)) for t, p in TRADE_WORDS.items()}
    return max(hits, key=hits.get) if any(hits.values()) else "home services"


def detect_services(site_text: str) -> list[str]:
    return [s for s in SERVICE_TERMS if re.search(re.escape(s), site_text or "", re.I)][:12]


def city_of(address: str) -> str:
    parts = [p.strip() for p in (address or "").split(",")]
    return parts[-3] if len(parts) >= 3 else (parts[0] if parts else "")


def cold_email(lead: dict, sender: dict) -> dict:
    """Matches the structure in the Scalepath operating guide: short subject, demo built from
    public info, two low-pressure options (Calendly or WhatsApp)."""
    name = lead["name"]
    angle = pain_angle(lead)
    subject = f"Built a small AI demo for {name}"
    body = f"""Hi there,

I put together a quick demo for {name} using public info from your website and Google listing.

{angle}

The demo is an AI receptionist that answers like your office would: it knows your services and
service area, books the appointment, and texts the job details to your tech. You can call it yourself
and try to break it.

Two easy options:
1. Grab 15 minutes here: {sender['calendly']}
2. Or just reply "demo" and I'll send it over WhatsApp.

No pressure either way. I'd rather you test it first.

{sender['name']}
{sender['company']}
"""
    follow_up_1 = f"""Hi there, quick bump on this. The demo for {name} is still live.
It takes about 2 minutes to test: call it and pretend to be a customer with a {lead['trade']} emergency
at 9pm on a Saturday. Reply "demo" and I'll send the number.

{sender['name']}"""
    follow_up_2 = f"""Last note from me. If after-hours or missed calls aren't a problem for {name}, ignore
this. If they are, the quick math is usually: missed calls a week × ~40% booking rate × your average
ticket × 52. For most shops your size that's well into five figures a year. Happy to walk through it.

{sender['name']}"""
    return {"subject": subject, "body": body, "follow_up_1": follow_up_1, "follow_up_2": follow_up_2}


def voice_ai_prompt(lead: dict, site_text: str, template_path: Path) -> str:
    hours = lead.get("hours") or {}
    services = detect_services(site_text) or [f"general {lead['trade']} repair and installation"]
    tpl = template_path.read_text()
    return (
        tpl.replace("{{BUSINESS_NAME}}", lead["name"])
        .replace("{{TRADE}}", lead["trade"])
        .replace("{{CITY}}", lead.get("city") or "your area")
        .replace("{{SERVICES}}", ", ".join(services))
        .replace("{{HOURS}}", "; ".join(hours.get("text") or []) or "standard business hours")
        .replace("{{PHONE}}", lead.get("phone") or "the main office line")
        .replace("{{WEBSITE}}", lead.get("website") or "")
    )


def knowledge_base(lead: dict, site_text: str) -> str:
    hours = "\n".join(f"- {h}" for h in (lead.get("hours") or {}).get("text") or []) or "- Not listed"
    return f"""# {lead['name']} knowledge base (auto-built from public info; verify with owner)

Trade: {lead['trade']}
Address: {lead.get('address')}
Phone: {lead.get('phone')}
Website: {lead.get('website')}
Google rating: {lead.get('rating')} ({lead.get('review_count')} reviews)

## Hours
{hours}

## Services found on website
{chr(10).join('- ' + s for s in detect_services(site_text)) or '- (none detected; ask owner)'}

## Website text (raw, trimmed)
{site_text[:6000]}
"""


def domain_of(url: str) -> str:
    try:
        host = urlparse(url).netloc.lower()
    except ValueError:
        return ""
    return host[4:] if host.startswith("www.") else host
