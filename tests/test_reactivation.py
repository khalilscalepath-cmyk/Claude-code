from datetime import date

from leadengine import reactivation as r

TODAY = date(2026, 10, 27)

EXPORT = """Customer Name,Mobile Phone,Email,Last Service Date,Equipment Install Year,Estimate Status,Estimate Amount,Do Not Text
JANE DOE,(480) 555-0142,jane@example.com,2026-06-01,,,,
Bob Smith,480.555.0177,,03/15/2023,,,,
Ana Ruiz,+1 602 555 0190,,2025-01-10,2012,,,
Lee Wong,602-555-0111,,2026-02-02,,Open,"$8,450",
Old Lead,602-555-0122,,,,,,
Opted Out,602-555-0133,,2026-01-01,,,,yes
Bad Number,555-01,,2026-01-01,,,,
Dupe Doe,4805550142,,2026-06-01,,,,
"""


def _run(tmp_path, text=EXPORT, **kw):
    p = tmp_path / "export.csv"
    p.write_text(text)
    return r.build(p, "Emergency Air", "HVAC", "a $79 tune-up", today=TODAY, **kw)


def test_phones_normalised_and_bad_rows_skipped(tmp_path):
    res = _run(tmp_path)
    assert [c.phone for c in res.contacts][0] == "+14805550142"
    assert res.skipped == {"no_valid_mobile": 1, "opted_out": 1, "no_consent_recorded": 0,
                           "duplicate": 1}
    assert len(res.contacts) == 5


def test_segments(tmp_path):
    seg = {c.first: c.segment for c in _run(tmp_path).contacts}
    assert seg == {"Jane": "recent", "Bob": "lapsed", "Ana": "aging_equipment",
                   "Lee": "open_estimate", "Old": "never_booked"}


def test_messages_have_name_business_and_opt_out(tmp_path):
    jane = _run(tmp_path).contacts[0]
    assert jane.messages[0].startswith("Hi Jane, it's Emergency Air.")
    assert "STOP" in jane.messages[0] and "$79 tune-up" in jane.messages[0]
    assert len(jane.messages) == 3


def test_consent_column_is_respected(tmp_path):
    text = "Name,Phone,SMS Consent\nA One,4805550101,yes\nB Two,4805550102,no\n"
    res = _run(tmp_path, text)
    assert [c.first for c in res.contacts] == ["A"]
    assert res.skipped["no_consent_recorded"] == 1


def test_outputs_written(tmp_path):
    res = _run(tmp_path)
    r.write_outputs(res, tmp_path / "out", "Emergency Air", 350, consent_column_found=False)
    summary = (tmp_path / "out" / "summary.md").read_text()
    assert "Ready to text: **5**" in summary and "No SMS-consent column" in summary
    assert "$8,450" in summary
    assert (tmp_path / "out" / "ghl_import.csv").read_text().count("+1") == 5
