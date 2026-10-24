"""Lead endpoint and static host for the Carmel Homes preview.

Standard library only, same as the rest of this repo. One process serves the
site and accepts the request-a-meeting form:

    python3 sites/carmel-homes/server/server.py --port 8000

Every accepted lead is appended to leads.jsonl and then pushed out to whichever
notifiers are configured in the environment. Nothing is required: with no
notifier keys set the lead is still stored and the visitor still gets a
confirmation, and the response says which channels actually fired.

Environment:
    LEAD_STORE              path to the JSONL file (default: alongside this file)
    LEAD_NOTIFY_SMS_TO      Jamie's mobile, E.164, e.g. +16023482430
    BIRD_API_KEY            Bird access key for SMS
    BIRD_WORKSPACE_ID       Bird workspace UUID
    BIRD_SMS_CHANNEL_ID     Bird SMS channel UUID
    LEAD_NOTIFY_EMAIL_TO    office inbox for a copy of the lead
    SMTP_HOST SMTP_PORT SMTP_USER SMTP_PASS SMTP_FROM
"""
from __future__ import annotations

import argparse
import json
import os
import re
import smtplib
import sys
import threading
import time
import urllib.error
import urllib.request
from collections import deque
from email.message import EmailMessage
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

SITE_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_STORE = Path(__file__).resolve().parent / "leads.jsonl"

MAX_BODY_BYTES = 16 * 1024
RATE_LIMIT_WINDOW = 600  # seconds
RATE_LIMIT_MAX = 8       # leads per IP per window

_store_lock = threading.Lock()
_recent: dict[str, deque] = {}
_recent_lock = threading.Lock()

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[a-z]{2,}$", re.I)

SERVICE_TYPES = {
    "Home renovation",
    "Home addition",
    "Custom home design",
    "Custom home build",
    "General contracting",
    "Architect services",
    "Something else",
}


# --------------------------------------------------------------------------- #
# validation
# --------------------------------------------------------------------------- #

def normalise_phone(raw: str) -> str | None:
    """Return E.164 for a US number, or None if it cannot be one."""
    digits = re.sub(r"\D", "", raw or "")
    if len(digits) == 11 and digits.startswith("1"):
        return "+" + digits
    if len(digits) == 10:
        return "+1" + digits
    return None


def clean_lead(payload: dict) -> tuple[dict | None, str | None]:
    """Validate the posted form. Returns (lead, error)."""
    if not isinstance(payload, dict):
        return None, "Send a JSON object."

    name = str(payload.get("name") or "").strip()
    if len(name) < 2:
        return None, "Add a name."
    if len(name) > 120:
        return None, "That name is too long."

    phone = normalise_phone(str(payload.get("phone") or ""))
    if not phone:
        return None, "Add a phone number Jamie can call back."

    email = str(payload.get("email") or "").strip()
    if email and not EMAIL_RE.match(email):
        return None, "That email address does not look right."

    service = str(payload.get("type") or "").strip()
    if service not in SERVICE_TYPES:
        service = "Something else"

    message = str(payload.get("message") or "").strip()[:2000]

    return {
        "received_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "name": name,
        "phone": phone,
        "email": email,
        "type": service,
        "message": message,
        "page": str(payload.get("page") or "")[:200],
    }, None


def rate_limited(ip: str) -> bool:
    now = time.time()
    with _recent_lock:
        seen = _recent.setdefault(ip, deque())
        while seen and now - seen[0] > RATE_LIMIT_WINDOW:
            seen.popleft()
        if len(seen) >= RATE_LIMIT_MAX:
            return True
        seen.append(now)
        return False


# --------------------------------------------------------------------------- #
# storage
# --------------------------------------------------------------------------- #

def store_lead(lead: dict, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    line = json.dumps(lead, ensure_ascii=False)
    with _store_lock:
        with path.open("a", encoding="utf-8") as fh:
            fh.write(line + "\n")


# --------------------------------------------------------------------------- #
# notifiers — each one is a no-op unless its environment is set
# --------------------------------------------------------------------------- #

def lead_summary(lead: dict) -> str:
    bits = [
        f"New request from the website: {lead['name']}",
        f"Phone: {lead['phone']}",
    ]
    if lead["email"]:
        bits.append(f"Email: {lead['email']}")
    bits.append(f"Wants: {lead['type']}")
    if lead["message"]:
        bits.append(f"Notes: {lead['message']}")
    return "\n".join(bits)


def send_sms(lead: dict) -> tuple[bool, str]:
    to = os.getenv("LEAD_NOTIFY_SMS_TO")
    key = os.getenv("BIRD_API_KEY")
    workspace = os.getenv("BIRD_WORKSPACE_ID")
    channel = os.getenv("BIRD_SMS_CHANNEL_ID")

    if not all([to, key, workspace, channel]):
        return False, "sms not configured"

    url = f"https://api.bird.com/workspaces/{workspace}/channels/{channel}/messages"
    body = json.dumps({
        "receiver": {"contacts": [{"identifierValue": to}]},
        "body": {"type": "text", "text": {"text": lead_summary(lead)}},
    }).encode()

    req = urllib.request.Request(
        url,
        data=body,
        headers={
            "Authorization": f"AccessKey {key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as res:
            return 200 <= res.status < 300, f"sms {res.status}"
    except urllib.error.HTTPError as exc:
        return False, f"sms http {exc.code}"
    except Exception as exc:  # network, DNS, timeout
        return False, f"sms failed: {exc.__class__.__name__}"


def send_email(lead: dict) -> tuple[bool, str]:
    to = os.getenv("LEAD_NOTIFY_EMAIL_TO")
    host = os.getenv("SMTP_HOST")
    if not to or not host:
        return False, "email not configured"

    msg = EmailMessage()
    msg["Subject"] = f"Website request: {lead['name']} — {lead['type']}"
    msg["From"] = os.getenv("SMTP_FROM", to)
    msg["To"] = to
    if lead["email"]:
        msg["Reply-To"] = lead["email"]
    msg.set_content(lead_summary(lead))

    port = int(os.getenv("SMTP_PORT", "587"))
    user = os.getenv("SMTP_USER")
    password = os.getenv("SMTP_PASS")

    try:
        with smtplib.SMTP(host, port, timeout=12) as smtp:
            smtp.starttls()
            if user and password:
                smtp.login(user, password)
            smtp.send_message(msg)
        return True, "email sent"
    except Exception as exc:
        return False, f"email failed: {exc.__class__.__name__}"


def notify(lead: dict) -> list[str]:
    """Fire every configured channel. Never raises: a dead notifier must not
    cost us the lead, which is already on disk by this point."""
    results = []
    for fn in (send_sms, send_email):
        try:
            ok, detail = fn(lead)
        except Exception as exc:  # a notifier bug must not cost us the lead
            ok, detail = False, f"{fn.__name__} crashed: {exc.__class__.__name__}"
        results.append(("sent: " if ok else "skipped: ") + detail)
    return results


# --------------------------------------------------------------------------- #
# http
# --------------------------------------------------------------------------- #

class Handler(SimpleHTTPRequestHandler):
    store_path = DEFAULT_STORE

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(SITE_ROOT), **kwargs)

    def log_message(self, fmt, *args):
        sys.stderr.write("%s %s\n" % (self.address_string(), fmt % args))

    def _json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self):
        # The page loads nothing from anywhere else, so lock it down.
        if not self.path.startswith("/api/"):
            self.send_header("X-Content-Type-Options", "nosniff")
            self.send_header("Referrer-Policy", "no-referrer")
        super().end_headers()

    def do_POST(self):
        if self.path.rstrip("/") != "/api/lead":
            self._json(404, {"error": "not found"})
            return

        try:
            length = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            self._json(400, {"error": "bad length"})
            return

        if length <= 0 or length > MAX_BODY_BYTES:
            self._json(413, {"error": "body too large"})
            return

        ip = self.client_address[0]
        if rate_limited(ip):
            self._json(429, {"error": "too many requests, call 602-348-2430"})
            return

        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self._json(400, {"error": "bad json"})
            return

        lead, error = clean_lead(payload)
        if error:
            self._json(422, {"error": error})
            return

        store_lead(lead, self.store_path)
        channels = notify(lead)

        print(f"lead stored: {lead['name']} {lead['phone']} ({'; '.join(channels)})")
        self._json(200, {"ok": True, "channels": channels})


def main() -> int:
    parser = argparse.ArgumentParser(description="Carmel Homes preview server")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--store", default=os.getenv("LEAD_STORE", str(DEFAULT_STORE)))
    args = parser.parse_args()

    Handler.store_path = Path(args.store)

    server = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"Carmel Homes preview on http://{args.host}:{args.port}")
    print(f"Leads append to {Handler.store_path}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nstopped")
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
