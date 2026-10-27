# Potala reservation assistant checklist

Updated 27 October 2026. This is a demo calendar, not the restaurant's live reservation system.

## Working and observed

- [x] Availability Make scenario applies future start, Zurich time, weekday start-time rules, and demo 15-table capacity.
- [x] Combined Book or Change Make scenario replaces separate active booking/change scenarios under the two-active-scenario constraint.
- [x] Combined scenario: `action=book` creates a 90-minute event with name, guests, required phone, and a short `bookingRef`; `action=change` matches either reference or saved phone and updates the same event.
- [x] Confirm combined Make actions with fictional data; reject Monday booking and Saturday lunch change.
- [x] Publish Vapi assistant with German first message, English switch, multilingual transcription, and three tools for availability, booking, change.
- [x] Short voice test: change intent without a reference was handled in English and did not call booking/availability tools.
- [x] Public voice page deployed on Render; simplified launch and orange waveform checked without a paid call.
- [x] Save the live Render URL and build configuration in [deployment.md](deployment.md).
- [x] Configure the test browser with the migrated Vapi public key and assistant ID; a complete voice change through Render succeeded. Review key restrictions and configure any different presentation browser separately.

- [x] Require phone in Vapi booking tool and assistant prompt; require nonblank phone in Make's Free slot filter.
- [x] Verify a missing-phone request returns `{"success":false,"reason":"phone_required"}`.
- [x] Verify one Make-only booking saved a fictional phone and an 8-character, hyphen-free reference in a 90-minute event on 4 November 2026.
- [x] Add automatic Zurich date context, year inference with confirmation, and concise-response instructions to the assistant prompt. Runtime year inference still needs verification after publication.

## Remaining for the demo

- [x] Accept new 8-character and legacy 16-character references in the live change entry filter.
- [x] Add reference-only and phone-only demo lookup; verify both with Make-only tests and calendar inspection.
- [x] Normalize Search 22 query using lower/trim and make the later reference comparison case insensitive.
- [x] Verify an uppercase-reference change directly in Make and confirm the same Calendar event moved on 27 October.
- [ ] Add a second-search fallback if a supplied reference fails and phone is also supplied; not currently implemented.
- [x] Preserve saved phone/reference using `25.Description` in Update Event.
- [ ] Export and sanitize the latest live scenario; current reference exports predate these edits.
- [ ] Add selection/verification for multiple matching bookings if needed; current flow rejects multiple matches.
- [x] Verify one complete **spoken change** using a known fictional reference through Render with published assistant v5. On 27 October, the user confirmed the same event moved to 3 November 2026, 18:30–20:00 for 2 guests, with phone/reference preserved; the assistant announced success without a reminder.
- [ ] Add **optional email** confirmation or **opt-in SMS** after successful booking and change; see [confirmations](confirmations.md). No notification delivery is live yet.
- [x] Add a sanitized combined Make blueprint reference in `make/`. Reconnect and verify it after import; it is not an automatically restored live scenario.
- [x] Complete migration of both Make and Vapi while retaining the demo calendar and Render page; direct availability, booking, uppercase-reference change, and a complete reference-based voice change passed.
- [x] Recreate the three tools and assistant in the new Vapi account, attach all three tools, publish v5, and update the tested browser's public key and assistant ID. Configure other browsers separately and check remaining credits before presenting.
- [ ] Review the live Vapi prompt against [prompt reference](vapi-system-prompt.md); track any later UI edits.

## Before real restaurant use

- [ ] Resolve concurrent capacity checks so two calls cannot book the last table.
- [ ] Verify caller ownership for booking changes; a reference or spoken phone alone is insufficient.
- [ ] Set cancellation, holiday exceptions, staff escalation, contact consent, notification failure, data retention, and privacy rules.
- [ ] Set up production calendar and inbound phone routing and run approved end-to-end tests.
