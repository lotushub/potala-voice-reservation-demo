# Potala reservation assistant checklist

Updated 25 October 2026. This is a demo calendar, not the restaurant's live reservation system.

## Working and observed

- [x] Availability Make scenario applies future start, Zurich time, weekday start-time rules, and demo 15-table capacity.
- [x] Combined Book or Change Make scenario replaces separate active booking/change scenarios under the two-active-scenario constraint.
- [x] Combined scenario: `action=book` creates a 90-minute event with name, guests, optional phone, and a short `bookingRef`; `action=change` verifies reference+saved phone and updates the same event.
- [x] Confirm combined Make actions with fictional data; reject Monday booking and Saturday lunch change.
- [x] Publish Vapi assistant with German first message, English switch, multilingual transcription, and three tools for availability, booking, change.
- [x] Short voice test: change intent without a reference was handled in English and did not call booking/availability tools.
- [x] Public Start Conversation page built and linked from README.

## Remaining for the demo

- [ ] Verify one complete **spoken change** using a known fictional reference and phone, with one new open slot; then check the same Calendar event moved. Keep Vapi/Make credit use low.
- [ ] Add **optional email** confirmation or **opt-in SMS** after successful booking and change; see [confirmations](confirmations.md). No notification delivery is live yet.
- [ ] Export/sanitize the **current combined** Make blueprint into the repo. Existing `make/` exports are older references.
- [ ] Confirm new Vapi organization's balance and recreate three tools and assistant if changing organizations; update the web page's public key and assistant ID in each browser.
- [ ] Review the live Vapi prompt against [prompt reference](vapi-system-prompt.md); track any later UI edits.

## Before real restaurant use

- [ ] Resolve concurrent capacity checks so two calls cannot book the last table.
- [ ] Verify caller ownership for booking changes; reference plus spoken phone is insufficient.
- [ ] Set cancellation, holiday exceptions, staff escalation, contact consent, notification failure, data retention, and privacy rules.
- [ ] Set up production calendar and inbound phone routing and run approved end-to-end tests.
