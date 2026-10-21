"""Create a per-prospect demo assistant on Vapi (the "I already built you a demo" hook).

Dry-run by default: writes the JSON payload so you can inspect it. Pass --live with
VAPI_API_KEY set to create it. Optionally point your shared demo phone number at the new
assistant (VAPI_DEMO_PHONE_NUMBER_ID) so the prospect can call it right away.
Check field names against https://docs.vapi.ai/api-reference/assistants/create if Vapi changes its API.
"""
import json
import os

import requests

VAPI_BASE = "https://api.vapi.ai"


def assistant_payload(name: str, system_prompt: str) -> dict:
    return {
        "name": f"{name[:30]} demo",
        "firstMessage": (
            f"Thanks for calling {name}, this is the after-hours line. "
            "Is this an emergency, or would you like to schedule service?"
        ),
        "model": {
            "provider": "openai",
            "model": "gpt-4o-mini",
            "messages": [{"role": "system", "content": system_prompt}],
        },
        "voice": {"provider": "vapi", "voiceId": "Elliot"},
        "endCallMessage": "Thanks for calling, have a good night.",
    }


def create_demo(name: str, system_prompt: str, out_path, live: bool = False) -> dict:
    payload = assistant_payload(name, system_prompt)
    out_path.write_text(json.dumps(payload, indent=2))
    if not live:
        return {"status": "dry-run", "payload_file": str(out_path)}
    key = os.getenv("VAPI_API_KEY")
    if not key:
        raise SystemExit("Missing VAPI_API_KEY in .env")
    headers = {"Authorization": f"Bearer {key}"}
    r = requests.post(f"{VAPI_BASE}/assistant", json=payload, headers=headers, timeout=30)
    r.raise_for_status()
    assistant = r.json()
    result = {"status": "created", "assistant_id": assistant.get("id")}
    phone_id = os.getenv("VAPI_DEMO_PHONE_NUMBER_ID")
    if phone_id:
        p = requests.patch(f"{VAPI_BASE}/phone-number/{phone_id}",
                           json={"assistantId": assistant.get("id")}, headers=headers, timeout=30)
        p.raise_for_status()
        result["demo_phone_now_routes_to"] = name
    return result
