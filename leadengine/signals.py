"""Detect missed-call / slow-response pain in review text and website HTML.

Everything here is plain regex so it costs nothing to run on thousands of reviews.
"""
import re
from dataclasses import dataclass, field

# Review-level pain categories. Each maps to the Scalepath service that fixes it.
REVIEW_PATTERNS = {
    "missed_call": [
        r"\b(never|didn'?t|did not|wouldn'?t|won'?t|no one|nobody|noone)\s+(ever\s+)?(answer(ed|s)?|pick(ed|s)?\s+up)\b",
        r"\bno answer\b",
        r"\bvoice\s?mail",
        r"\bleft (several |multiple |a few |\d+ )?messages?\b",
        r"\brings? and rings?\b",
        r"\bcouldn'?t (get through|reach|get a hold|get ahold)\b",
        r"\b(hard|impossible) to (reach|get a hold of|get ahold of)\b",
        r"\bunanswered\b",
        r"\bphone (just )?(rang|kept ringing)\b",
    ],
    "no_callback": [
        r"\b(never|didn'?t|did not|still (have )?not|haven'?t|has not|hasn'?t)\s+(even\s+)?(call(ed)?|got|get|gotten)\s+(me\s+|us\s+)?back\b",
        r"\bnever (return(ed)?|heard back)\b",
        r"\b(no|without a?) (call ?back|return call|response)\b",
        r"\bnot returning\b",
        r"\bwaiting (for|on) (a|that|their) call ?back\b",
        r"\bpromised to call\b",
    ],
    "after_hours": [
        r"\bafter[\s-]hours\b",
        r"\b(on|over) (a|the) weekend\b",
        r"\b(saturday|sunday)\b",
        r"\b(late at night|middle of the night|at night|overnight)\b",
        r"\bholiday\b",
        r"\bleft for the day\b",
        r"\buntil monday\b",
        r"\bclosed\b",
    ],
    "slow_response": [
        r"\btook (\d+|a few|several|two|three) (days|weeks) to (respond|get back|reply|call)\b",
        r"\bslow to (respond|reply|get back|return)\b",
        r"\bwaited (\d+|a few|several|two|three)? ?(days|a week|weeks)\b",
        r"\bnever (responded|replied|got a quote|sent (a|the) (quote|estimate))\b",
        r"\bno (quote|estimate) (ever|was)\b",
    ],
    "lost_to_competitor": [
        r"\b(went|going|had to go) with (another|someone else|a different|a competitor)\b",
        r"\b(called|found|hired|used) (another|someone else|a different) (company|plumber|electrician|hvac|contractor|guy)\b",
        r"\banswered (my call )?(right away|immediately)\b.*\b(other|another|different)\b",
    ],
}

# Wording that shows the business IS responsive (reduces the pain score).
RESPONSIVE_PATTERNS = [
    r"\banswered (right away|immediately|on the first ring|promptly)\b",
    r"\b(called|got back to) (me|us) (right away|within minutes|immediately|same day)\b",
    r"\bquick to respond\b",
    r"\bvery responsive\b",
]

# Website feature detection.
WEBSITE_PATTERNS = {
    "claims_24_7": r"24\s*/\s*7|24 hours|24-hour|around the clock|emergency service",
    "online_booking": (
        r"book online|schedule online|book now|schedule service online|scheduleengine|"
        r"housecallpro\.com|book\.housecallpro|clienthub\.getjobber|getjobber\.com|"
        r"calendly\.com|servicetitan|leadconnectorhq\.com/widget/booking"
    ),
    "chat_widget": (
        r"podium\.com|birdeye|tawk\.to|intercom|drift\.com|livechatinc|"
        r"widgets\.leadconnectorhq|smartbot|hs-scripts\.com|zendesk|tidio|chatra|olark|"
        r"broadly|nicejob|signpost|hatchapp"
    ),
    "has_form": r"<form\b",
    "runs_google_ads": r"googleadservices|gtag\(['\"]config['\"],\s*['\"]AW-|AW-\d{6,}",
    "runs_meta_ads": r"fbq\(|connect\.facebook\.net",
    "text_us": r"href=['\"]sms:|text us",
    "lead_marketplaces": r"angi\.com|homeadvisor|thumbtack|yelp\.com/biz|porch\.com",
}

COMPILED_REVIEW = {k: [re.compile(p, re.I) for p in v] for k, v in REVIEW_PATTERNS.items()}
COMPILED_RESPONSIVE = [re.compile(p, re.I) for p in RESPONSIVE_PATTERNS]
COMPILED_WEBSITE = {k: re.compile(p, re.I) for k, p in WEBSITE_PATTERNS.items()}


@dataclass
class ReviewHit:
    text: str
    rating: float | None
    categories: list[str]


@dataclass
class ReviewSignals:
    counts: dict[str, int] = field(default_factory=lambda: {k: 0 for k in REVIEW_PATTERNS})
    responsive: int = 0
    hits: list[ReviewHit] = field(default_factory=list)
    reviews_scanned: int = 0


def classify_review(text: str, rating: float | None = None) -> list[str]:
    """Return the pain categories present in one review."""
    if not text:
        return []
    cats = [c for c, pats in COMPILED_REVIEW.items() if any(p.search(text) for p in pats)]
    # "Saturday" or "closed" alone isn't pain. Only count after-hours when the review is
    # negative or also describes an unreachable business.
    if "after_hours" in cats:
        negative = rating is not None and rating <= 3
        unreachable = {"missed_call", "no_callback"} & set(cats)
        if not (negative or unreachable):
            cats.remove("after_hours")
    # Positive reviews that merely mention "voicemail" ("they returned my voicemail in 5 min")
    # shouldn't count as pain.
    if rating is not None and rating >= 4 and any(p.search(text) for p in COMPILED_RESPONSIVE):
        cats = [c for c in cats if c == "lost_to_competitor"]
    return cats


def scan_reviews(reviews: list[dict]) -> ReviewSignals:
    """reviews: [{"text": str, "rating": float|None}, ...]"""
    sig = ReviewSignals()
    for r in reviews:
        text, rating = r.get("text") or "", r.get("rating")
        sig.reviews_scanned += 1
        if any(p.search(text) for p in COMPILED_RESPONSIVE):
            sig.responsive += 1
        cats = classify_review(text, rating)
        if cats:
            for c in cats:
                sig.counts[c] += 1
            sig.hits.append(ReviewHit(text=text.strip(), rating=rating, categories=cats))
    return sig


def scan_website(html: str) -> dict[str, bool]:
    if not html:
        return {k: False for k in WEBSITE_PATTERNS}
    return {k: bool(p.search(html)) for k, p in COMPILED_WEBSITE.items()}
