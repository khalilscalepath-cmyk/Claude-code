import csv
import sys

from leadengine import cli, sources
from leadengine.scoring import score_business
from leadengine.signals import classify_review, scan_reviews, scan_website

# Wording taken from real public complaints found during research (docs/01-research-findings.md).
REAL_COMPLAINTS = [
    ("The phone number rings and rings and goes to a voicemail which I left multiple but "
     "never received a returned call.", 1),
    ("I called multiple times and left several voicemail messages requesting service.", 1),
    ("They said they would come back. It has been four weeks and they still have not even "
     "called back.", 1),
    ("We were told they all left for the day and we have called several times a day every "
     "day since with no response.", 1),
]


def test_real_complaints_are_detected():
    for text, rating in REAL_COMPLAINTS:
        cats = classify_review(text, rating)
        assert {"missed_call", "no_callback"} & set(cats), text


def test_after_hours_needs_negative_context():
    assert classify_review("Came out on a Saturday, great job!", 5) == []
    assert "after_hours" in classify_review("Left for the day and never called back", 1)


def test_positive_responsive_review_not_counted():
    text = "Left a voicemail and they called me back right away. Very responsive!"
    assert classify_review(text, 5) == []


def test_lost_to_competitor():
    text = "Nobody answered so we went with another company."
    assert "lost_to_competitor" in classify_review(text, 1)


def test_website_flags():
    html = ('<p>24/7 Emergency Service</p><form action="/contact"></form>'
            '<script>gtag("config", "AW-123456789")</script>')
    flags = scan_website(html)
    assert flags["claims_24_7"] and flags["has_form"] and flags["runs_google_ads"]
    assert not flags["chat_widget"]


def test_hours_summary_weekend_closed():
    opening = {
        "periods": [{"open": {"day": d, "hour": 8, "minute": 0},
                     "close": {"day": d, "hour": 17, "minute": 0}} for d in range(1, 6)],
        "weekdayDescriptions": ["Monday: 8:00 AM – 5:00 PM"],
    }
    h = sources.summarize_hours(opening)
    assert h["open_saturday"] is False and h["open_sunday"] is False
    assert h["latest_weekday_close"] == 17


def test_hours_summary_247():
    h = sources.summarize_hours({"periods": [{"open": {"day": 0, "hour": 0, "minute": 0}}]})
    assert h["open_24_7"] and h["open_sunday"]


def _biz(name="Quality Plumbing Co", n=80, weekend_closed=True):
    return {"name": name, "review_count": n, "business_status": "OPERATIONAL",
            "hours": {"known": True, "open_24_7": False, "open_saturday": not weekend_closed,
                      "open_sunday": not weekend_closed, "latest_weekday_close": 17, "text": []}}


def test_scoring_picks_flagship_for_multi_pain():
    rev = scan_reviews([{"text": t, "rating": r} for t, r in REAL_COMPLAINTS])
    web = scan_website('<p>24/7 emergency service</p><form></form>')
    s = score_business(_biz(), rev, web)
    assert s["scores"]["flagship"] > 0
    assert s["recommended_key"] in ("flagship", "voice_ai", "text_back")
    assert s["need_score"] >= 60
    assert any("24/7" in r for r in s["reasons"])


def test_franchise_is_downweighted():
    rev = scan_reviews([{"text": t, "rating": r} for t, r in REAL_COMPLAINTS])
    indie = score_business(_biz(), rev, {})
    franchise = score_business(_biz("One Hour Heating & Air"), rev, {})
    assert franchise["is_franchise"] and franchise["need_score"] < indie["need_score"]
    # "Stars" must not match the ARS franchise pattern
    assert not score_business(_biz("Five Stars Plumbing"), rev, {})["is_franchise"]


def test_happy_business_scores_low():
    rev = scan_reviews([{"text": "Answered right away, fixed it same day.", "rating": 5}] * 5)
    s = score_business(_biz(weekend_closed=False) | {"hours": {"known": False}}, rev,
                       {"chat_widget": True, "online_booking": True})
    assert s["need_score"] < 40


def test_end_to_end_run(tmp_path, monkeypatch):
    place = sources.normalize_place({
        "id": "abc", "displayName": {"text": "Test Plumbing LLC"},
        "formattedAddress": "1 Main St, Houston, TX 77070, USA",
        "nationalPhoneNumber": "(713) 555-0100", "websiteUri": "https://testplumbing.example",
        "rating": 4.3, "userRatingCount": 49, "businessStatus": "OPERATIONAL",
        "regularOpeningHours": {"periods": [
            {"open": {"day": d, "hour": 8}, "close": {"day": d, "hour": 17}} for d in range(1, 6)]},
        "reviews": [{"rating": 1, "text": {"text": REAL_COMPLAINTS[2][0]}}],
    })
    monkeypatch.setattr(sources, "search_places", lambda q, max_results: [place])
    monkeypatch.setattr(sources, "fetch_website", lambda url: {
        "html": "<p>Drain cleaning, water heater repair. 24/7 emergency service. "
                "office@testplumbing.example</p><form></form>",
        "text": "Drain cleaning, water heater repair. 24/7 emergency service.", "error": None})
    monkeypatch.setattr(sys, "argv", ["leadengine", "run", "--trade", "plumber", "--city",
                                      "Houston, TX", "--out", str(tmp_path)])
    cli.main()
    run = tmp_path / "houston-tx-plumber"
    rows = list(csv.DictReader((run / "leads.csv").open()))
    assert rows[0]["name"] == "Test Plumbing LLC" and int(rows[0]["need_score"]) > 0
    pack = run / "leads" / "test-plumbing-llc"
    prompt = (pack / "voice_ai_prompt.md").read_text()
    assert "Test Plumbing LLC" in prompt and "drain cleaning" in prompt.lower() and "{{" not in prompt
    assert "Built a small AI demo for Test Plumbing LLC" in (pack / "email.md").read_text()
    imp = list(csv.DictReader((run / "instantly_import.csv").open()))
    assert imp[0]["email"] == "office@testplumbing.example"


def test_email_only_claims_evidence_it_has():
    from leadengine.outreach import cold_email
    sender = {"name": "K", "company": "S", "calendly": "x"}
    base = {"name": "Biz", "trade": "plumbing", "recommended_key": "voice_ai",
            "hours": _biz()["hours"], "website_flags": {}}
    no_evidence = cold_email({**base, "pain_counts": {}}, sender)["body"]
    assert "customers mentioned" not in no_evidence and "closed weekends" in no_evidence
    with_evidence = cold_email({**base, "pain_counts": {"after_hours": 2, "no_callback": 1}},
                               sender)["body"]
    assert "evening or on weekends" in with_evidence and "not hearing back" in with_evidence
