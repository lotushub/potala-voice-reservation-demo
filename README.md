# Potala AI voice reservation demo

German-first, English-capable voice assistant for practice indoor table bookings at Potala Restaurant in Olten. **Demo calendar only:** it does not create real restaurant reservations.

**Status (25 October 2026):** Two active Make scenarios support availability, new bookings, and changes. The web page launches the Vapi assistant. A new booking returns a short `bookingRef`; the assistant reads it aloud. Automatic SMS/email confirmations and cancellations are not implemented.

## Flow

- Web page or Vapi test call → Potala Vapi assistant → availability Make scenario → demo Google Calendar.
- Confirmed new booking → combined Make scenario (`action=book`) → 90-minute calendar event with name, guests, optional phone, and booking reference → `{"success":true,"bookingRef":"..."}`.
- Confirmed change → same combined scenario (`action=change`) → verifies reference and saved phone, checks the proposed slot excluding the original event, updates that event → `{"success":true}`.
- A booking reference is spoken after a successful booking. It is **not** sent by SMS or email today. The caller needs the reference and saved phone to request a change.

## Current configuration

| Component | State |
| --- | --- |
| Make | Availability scenario and combined Book or Change scenario active |
| Calendar | Separate demo calendar; one 90-minute event per table |
| Vapi | Three API Request tools: availability, booking, change; German first, switch to English on request/speech |
| Web | Start Conversation page uses a restricted Vapi **public** key and assistant ID entered by each browser |
| Notifications | Planned; no SMS/email module or delivery confirmation |

For exact rules see [workflow](docs/workflow.md). For restoring the setup and moving to a **different Vapi organization**, see [setup](docs/setup.md). For how a guest receives a reference and the SMS/email design, see [confirmations](docs/confirmations.md). The [test record](docs/test-plan.md) separates verified Make tests from untested voice paths. The [current prompt](docs/vapi-system-prompt.md) is a reference copy; compare it with the published Vapi assistant before republishing.

## Files

- `web/`: source of Start Conversation page.
- `make/`: sanitized reference exports, including the combined booking/change blueprint. Reconnect webhook, Google connection, and demo calendar after import; these are not one-click live backups.
- `docs/`: workflow, setup, confirmations, prompt, test record, and checklist.

Public demo page: <https://potala-voice-demo-2026.ochrescout3.chatgpt.site>. Do not put Make webhook URLs, private Vapi keys, Google Calendar IDs, real contact details, or unredacted blueprints in GitHub. A restricted public key still permits calls and can consume Vapi credit. For production, address concurrency, customer verification, exceptions, consent, data retention, and inbound phone routing.
