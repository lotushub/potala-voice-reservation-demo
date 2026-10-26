# Reservation workflow and rules

## New booking

1. Caller starts a web conversation. The assistant greets in German and can switch to English.
2. Collect 1–4 guests, exact date, and permitted future start time. Vapi calls `check_potala_demo_availability(date, time, guests)`.
3. Make checks hours and overlaps in the dedicated demo Google Calendar. It returns `{"available":true}` or `{"available":false,"reason":"slot_unavailable"}`.
4. If free, collect a name and required phone. Repeat all details and obtain a clear yes.
5. Vapi calls `book_potala_demo_indoor_table(date, time, guests, name, phone)`. The combined Make scenario rechecks the slot and creates a 90-minute event, recording the name, guests, required phone, and short reference. Success response includes `bookingRef`.
6. Only after `success:true`, the assistant says the practice booking is saved and spells the reference. No SMS/email is sent.

Phone is required in the Vapi tool and prompt. Make's Free slot filter requires `length(trim(ifempty(1.phone; emptystring))) > 0`; its fallback returns `phone_required` for a missing/blank phone, otherwise `slot_unavailable`. This is a presence check, not phone validation or ownership verification. Availability checks do not require phone.

New references use `substring(uuid; 0; 8)` (8 hexadecimal characters, no hyphens). There is no collision check. Legacy references are unchanged. **Check the live change route before using a new reference:** the saved reference blueprint still requires length 16 and is older than these edits. Accept 8 or 16 characters while retaining the saved-phone and exact-reference checks.

## Change existing booking

1. Caller explicitly asks to change, then supplies the **booking reference** and **same saved phone number**. Without either, this demo cannot automatically change it. Legacy bookings without a phone cannot be changed by this voice flow. New bookings require a phone.
2. Collect new exact date, time, and guest count. Repeat the request and obtain a clear yes.
3. Vapi calls `change_potala_demo_indoor_reservation(bookingRef, phone, newDate, newTime, newGuests)`. Do not call the separate availability tool: Make searches the proposed slot while excluding this original event.
4. Make verifies matching reference and phone, checks hours/capacity, and updates the existing Google Calendar event. The response is `{"success":true}` or a reason such as `slot_unavailable` or `reservation_not_found_or_unverified`. The assistant claims success only after true. Cancellation is not implemented.

A reference plus a spoken number is a matching check, **not proof of phone ownership**. Add stronger verification before serving actual customers.

## Accepted starts (Europe/Zurich)

| Day | Start times |
| --- | --- |
| Monday | Closed |
| Tuesday–Friday | 11:30, 12:00, 12:30; 17:00–20:30 each 30 minutes |
| Saturday | 17:00–20:30 each 30 minutes |
| Sunday | 17:00–19:30 each 30 minutes |

A start must be in the future. Each event lasts 90 minutes. The current model treats 15 indoor tables as capacity and each booking as one table for 1–4 guests. Outdoors and larger parties are not automated. Availability checks can race under concurrent requests; do not use this setup for real bookings without an atomic capacity control. Demo entries and call artifacts can contain personal details; use fictional data until retention and access rules are approved.
