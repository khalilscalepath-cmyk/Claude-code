"""Data sources: Google Places API (New), Outscraper reviews, and the business website.

Google Places gives listings, hours and up to 5 reviews per business.
Outscraper (optional) gives the full review history, which is where most
"never called back" complaints hide.
"""
import os
import re
import time

import requests
from bs4 import BeautifulSoup

PLACES_URL = "https://places.googleapis.com/v1/places:searchText"
PLACES_FIELDS = ",".join(
    [
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.nationalPhoneNumber",
        "places.websiteUri",
        "places.googleMapsUri",
        "places.rating",
        "places.userRatingCount",
        "places.primaryType",
        "places.businessStatus",
        "places.regularOpeningHours",
        "places.reviews",
        "nextPageToken",
    ]
)
OUTSCRAPER_URL = "https://api.app.outscraper.com/maps/reviews-v3"
HUNTER_URL = "https://api.hunter.io/v2/domain-search"
UA = "Mozilla/5.0 (compatible; ScalepathLeadEngine/1.0)"


def _require(name: str) -> str:
    val = os.getenv(name)
    if not val:
        raise SystemExit(f"Missing {name}. Add it to .env (see .env.example).")
    return val


def search_places(query: str, max_results: int = 60) -> list[dict]:
    """Text-search Google Maps, e.g. 'plumber in Houston, TX'. Up to 60 results (3 pages)."""
    key = _require("GOOGLE_PLACES_API_KEY")
    headers = {"X-Goog-Api-Key": key, "X-Goog-FieldMask": PLACES_FIELDS}
    body = {"textQuery": query, "pageSize": 20}
    out: list[dict] = []
    while len(out) < max_results:
        resp = requests.post(PLACES_URL, json=body, headers=headers, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        out.extend(normalize_place(p) for p in data.get("places", []))
        token = data.get("nextPageToken")
        if not token:
            break
        body = {"textQuery": query, "pageSize": 20, "pageToken": token}
        time.sleep(1)
    return out[:max_results]


def normalize_place(p: dict) -> dict:
    return {
        "place_id": p.get("id"),
        "name": (p.get("displayName") or {}).get("text"),
        "address": p.get("formattedAddress"),
        "phone": p.get("nationalPhoneNumber"),
        "website": p.get("websiteUri"),
        "maps_url": p.get("googleMapsUri"),
        "rating": p.get("rating"),
        "review_count": p.get("userRatingCount") or 0,
        "primary_type": p.get("primaryType"),
        "business_status": p.get("businessStatus"),
        "hours": summarize_hours(p.get("regularOpeningHours")),
        "reviews": [
            {
                "text": ((r.get("text") or {}).get("text")) or "",
                "rating": r.get("rating"),
                "when": r.get("relativePublishTimeDescription"),
            }
            for r in p.get("reviews", [])
        ],
    }


def summarize_hours(opening: dict | None) -> dict:
    """Turn Places opening hours into the facts we sell against."""
    if not opening or not opening.get("periods"):
        return {"known": False, "open_24_7": False, "open_saturday": None,
                "open_sunday": None, "latest_weekday_close": None,
                "text": []}
    periods = opening["periods"]
    # Places encodes 24/7 as a single period opening Sunday 00:00 with no close.
    open_247 = len(periods) == 1 and "close" not in periods[0]
    open_days = {p["open"]["day"] for p in periods if "open" in p}
    weekday_closes = [
        p["close"]["hour"] + p["close"].get("minute", 0) / 60
        for p in periods
        if "close" in p and p["open"]["day"] in (1, 2, 3, 4, 5)
        and p["close"]["day"] == p["open"]["day"]
    ]
    return {
        "known": True,
        "open_24_7": open_247,
        "open_saturday": open_247 or 6 in open_days,
        "open_sunday": open_247 or 0 in open_days,
        "latest_weekday_close": max(weekday_closes) if weekday_closes else None,
        "text": opening.get("weekdayDescriptions", []),
    }


def fetch_all_reviews(place_id: str, limit: int = 100, sort: str = "lowest_rating") -> list[dict]:
    """Review history via Outscraper. Returns [] if no key is set.
    sort: "lowest_rating" surfaces complaints for the least credits; "newest" checks recency."""
    key = os.getenv("OUTSCRAPER_API_KEY")
    if not key:
        return []
    resp = requests.get(
        OUTSCRAPER_URL,
        params={"query": place_id, "reviewsLimit": limit, "sort": sort, "async": "false"},
        headers={"X-API-KEY": key},
        timeout=180,
    )
    resp.raise_for_status()
    data = resp.json().get("data") or []
    reviews = []
    for place in data:
        for r in place.get("reviews_data") or []:
            reviews.append({
                "text": r.get("review_text") or "",
                "rating": r.get("review_rating"),
                "when": r.get("review_datetime_utc"),
            })
    return reviews


def fetch_website(url: str) -> dict:
    """Fetch homepage + contact page. Returns raw html (for feature detection) and clean text
    (for the voice-AI knowledge base)."""
    if not url:
        return {"html": "", "text": "", "error": "no website"}
    html_parts, text_parts = [], []
    pages = [url]
    try:
        r = requests.get(url, headers={"User-Agent": UA}, timeout=20)
        r.raise_for_status()
        html_parts.append(r.text)
        soup = BeautifulSoup(r.text, "html.parser")
        for a in soup.find_all("a", href=True):
            href = a["href"]
            if re.search(r"contact|services|about", href, re.I) and len(pages) < 4:
                full = requests.compat.urljoin(url, href)
                if full.startswith("http") and full not in pages:
                    pages.append(full)
    except requests.RequestException as e:
        return {"html": "", "text": "", "error": str(e)}
    for extra in pages[1:]:
        try:
            r2 = requests.get(extra, headers={"User-Agent": UA}, timeout=20)
            if r2.ok:
                html_parts.append(r2.text)
        except requests.RequestException:
            pass
    for h in html_parts:
        soup = BeautifulSoup(h, "html.parser")
        for t in soup(["script", "style", "noscript", "svg"]):
            t.decompose()
        text_parts.append(re.sub(r"\s+", " ", soup.get_text(" ")).strip())
    return {"html": "\n".join(html_parts), "text": "\n\n".join(text_parts)[:12000], "error": None}


def find_emails(domain: str) -> list[str]:
    """Owner/office emails via Hunter.io. Returns [] if no key is set."""
    key = os.getenv("HUNTER_API_KEY")
    if not key or not domain:
        return []
    resp = requests.get(HUNTER_URL, params={"domain": domain, "api_key": key, "limit": 5},
                        timeout=30)
    if not resp.ok:
        return []
    emails = (resp.json().get("data") or {}).get("emails") or []
    # Owners and generic office inboxes first.
    emails.sort(key=lambda e: (e.get("type") != "generic", -(e.get("confidence") or 0)))
    return [e["value"] for e in emails if e.get("value")]


def emails_from_html(html: str) -> list[str]:
    found = re.findall(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", html or "")
    skip = ("sentry", "wixpress", "example.com", ".png", ".jpg", "godaddy", "schema.org")
    seen = []
    for e in found:
        e = e.lower()
        if not any(s in e for s in skip) and e not in seen:
            seen.append(e)
    return seen[:5]
