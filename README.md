<div align="center">

# Potala AI Voice Reservations

**A German-first, English-capable voice reservation demo for Potala Restaurant in Olten.**

[![Status: demo](https://img.shields.io/badge/status-demo-7c3aed)](docs/workflow.md)
[![Voice: Vapi](https://img.shields.io/badge/voice-Vapi-0f766e)](docs/setup.md)
[![Automation: Make](https://img.shields.io/badge/automation-Make-2563eb)](docs/project-overview.md)
[![Calendar: Google](https://img.shields.io/badge/calendar-Google_Calendar-16a34a)](docs/workflow.md)
[![Languages: German + English](https://img.shields.io/badge/languages-German_%2B_English-ea580c)](docs/vapi-system-prompt.md)

[Try the web demo](https://booking-voice-agent-1wde.onrender.com/) · [How it works](docs/project-overview.md) · [Setup](docs/setup.md) · [Test record](docs/test-plan.md)

</div>

![Guest to Vapi to Make to demo Calendar](docs/assets/workflow-banner.svg)

> [!IMPORTANT]
> This project uses a **demo calendar**. Successful tool calls create or change practice events, not confirmed reservations at the real restaurant. The web demo requires a Vapi public key and assistant ID supplied by the owner; starting a call uses Vapi credit.

## What it can do

| Guest request | Result |
| --- | --- |
| “Is Tuesday at 18:00 available?” | Vapi asks Make to check restaurant rules and the demo calendar. |
| “Please book it.” | After the guest confirms, Make rechecks and creates a 90-minute event. Vapi reads the returned booking reference. |
| “I need to change my booking.” | Make finds one demo booking using its reference or saved phone, checks the new slot, and updates the same event. |

**Updated 27 October 2026:** The Render Static Site is live with a simplified voice-launch page and an orange animated waveform. New bookings require a phone and return an 8-character reference. A direct Make test verified that an uppercase reference finds the stored lowercase reference and updates the same calendar event. Earlier phone-only changes also passed. The latest full voice flow still needs a final check; email/SMS is not connected.

**Current scope:** one indoor table for 1–4 guests; 15 demo tables; Monday closed; Zurich time. [Exact permitted start times](docs/workflow.md).

## Quick start

1. Open the [web demo](https://booking-voice-agent-1wde.onrender.com/).
2. Select **Demo einrichten** and enter the **restricted public** Vapi key and assistant ID for the Potala assistant. Never enter a private API key.
3. Save the settings. When ready for a paid call, select **Sprachdemo starten** and allow microphone access. A configured browser starts the call immediately. Use fictional details and a future permitted slot.

To switch both Make and Vapi accounts, follow [Account migration](docs/account-migration.md). No Render redeployment is needed when only the browser key and Assistant ID change. The [original hosted page](https://potala-voice-demo-2026.ochrescout3.chatgpt.site) remains available. The source for the page is in [`web/`](web/); sanitized Make reference exports are in [`make/`](make/). They require reconnection and verification after import.

## Documentation

- [Project overview](docs/project-overview.md) — a short explanation for someone new to Vapi and Make.
- [Hosting](docs/deployment.md) — live Render URL, build settings and Vapi origin setup.
- [Account migration](docs/account-migration.md) — move Make and Vapi while preserving the demo calendar.
- [Detailed workflow](docs/workflow.md) — booking rules, change flow, and limitations.
- [Setup and new Vapi account](docs/setup.md) — the three tools, web key, and reconnection steps.
- [Confirmations](docs/confirmations.md) — how the booking reference works and proposed email/SMS delivery.
- [Vapi system prompt](docs/vapi-system-prompt.md) — latest local reference copy; compare against the published assistant.
- [Test record](docs/test-plan.md) · [Checklist](docs/checklist.md) — what has been checked and what remains.

## Next improvements

Written confirmation, handling multiple lookup matches, cancellation, an inbound phone number, holiday hours, staff escalation, and stronger verification. Before real restaurant use, prevent simultaneous calls from overbooking the last table and agree on privacy and retention rules. **Automatic email/SMS is not active yet.**

Do not commit Make webhook URLs, Google Calendar identifiers, private Vapi keys, real guest data, or unredacted scenario exports.
