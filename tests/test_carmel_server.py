"""Tests for the Carmel Homes preview lead endpoint."""
import importlib.util
import json
import time
from pathlib import Path

import pytest

SERVER_PATH = Path(__file__).resolve().parent.parent / "sites" / "carmel-homes" / "server" / "server.py"


def load_server():
    spec = importlib.util.spec_from_file_location("carmel_server", SERVER_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


server = load_server()


@pytest.mark.parametrize("raw,expected", [
    ("602-348-2430", "+16023482430"),
    ("(602) 348 2430", "+16023482430"),
    ("16023482430", "+16023482430"),
    ("+1 602 348 2430", "+16023482430"),
])
def test_phone_normalises_to_e164(raw, expected):
    assert server.normalise_phone(raw) == expected


@pytest.mark.parametrize("raw", ["", "12345", "abc", "0123456789012345"])
def test_phone_rejects_junk(raw):
    assert server.normalise_phone(raw) is None


def test_clean_lead_accepts_a_real_request():
    lead, error = server.clean_lead({
        "name": "Dana Whitfield",
        "phone": "(480) 555 0133",
        "email": "dana@example.com",
        "type": "Custom home build",
        "message": "Lot in Paradise Valley, hoping to break ground next spring.",
    })
    assert error is None
    assert lead["phone"] == "+14805550133"
    assert lead["type"] == "Custom home build"
    assert lead["received_at"].endswith("Z")


def test_clean_lead_requires_name_and_phone():
    _, error = server.clean_lead({"name": "A", "phone": "6023482430"})
    assert error == "Add a name."

    _, error = server.clean_lead({"name": "Dana Whitfield", "phone": "nope"})
    assert "phone number" in error


def test_clean_lead_rejects_bad_email():
    _, error = server.clean_lead({
        "name": "Dana Whitfield", "phone": "6023482430", "email": "dana@@example",
    })
    assert "email" in error


def test_unknown_service_type_falls_back_rather_than_failing():
    lead, error = server.clean_lead({
        "name": "Dana Whitfield", "phone": "6023482430", "type": "<script>alert(1)</script>",
    })
    assert error is None
    assert lead["type"] == "Something else"


def test_message_is_truncated():
    lead, _ = server.clean_lead({
        "name": "Dana Whitfield", "phone": "6023482430", "message": "x" * 5000,
    })
    assert len(lead["message"]) == 2000


def test_store_lead_appends_jsonl(tmp_path):
    store = tmp_path / "leads.jsonl"
    lead, _ = server.clean_lead({"name": "Dana Whitfield", "phone": "6023482430"})

    server.store_lead(lead, store)
    server.store_lead(lead, store)

    lines = store.read_text(encoding="utf-8").strip().split("\n")
    assert len(lines) == 2
    assert json.loads(lines[0])["phone"] == "+16023482430"


def test_notify_reports_skipped_channels_when_unconfigured(monkeypatch):
    for key in ("LEAD_NOTIFY_SMS_TO", "BIRD_API_KEY", "LEAD_NOTIFY_EMAIL_TO", "SMTP_HOST"):
        monkeypatch.delenv(key, raising=False)

    lead, _ = server.clean_lead({"name": "Dana Whitfield", "phone": "6023482430"})
    results = server.notify(lead)

    assert len(results) == 2
    assert all(r.startswith("skipped: ") for r in results)


def test_notify_survives_a_broken_notifier(monkeypatch):
    def explode(lead):
        raise RuntimeError("carrier down")

    monkeypatch.setattr(server, "send_sms", explode)
    lead, _ = server.clean_lead({"name": "Dana Whitfield", "phone": "6023482430"})

    results = server.notify(lead)
    assert any("crashed" in r for r in results)


def test_rate_limit_trips_after_the_cap(monkeypatch):
    monkeypatch.setattr(server, "_recent", {})
    ip = "203.0.113.9"

    for _ in range(server.RATE_LIMIT_MAX):
        assert server.rate_limited(ip) is False

    assert server.rate_limited(ip) is True


def test_lead_summary_includes_the_callback_number():
    lead, _ = server.clean_lead({
        "name": "Dana Whitfield", "phone": "6023482430", "type": "Home renovation",
    })
    summary = server.lead_summary(lead)
    assert "+16023482430" in summary
    assert "Home renovation" in summary


def test_honeypot_field_rejects_the_lead():
    """A filled "company" field means a bot: no lead comes back."""
    lead, error = server.clean_lead({
        "name": "Dana Whitfield",
        "phone": "6023482430",
        "company": "Acme SEO Services",
    })
    assert lead is None
    assert error == "__honeypot__"


def test_empty_honeypot_lets_a_real_lead_through():
    lead, error = server.clean_lead({
        "name": "Dana Whitfield", "phone": "6023482430", "company": "",
    })
    assert error is None
    assert lead["name"] == "Dana Whitfield"
    assert "company" not in lead
