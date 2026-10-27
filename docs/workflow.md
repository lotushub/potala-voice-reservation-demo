# Reservation workflow and rules

## New booking

1. Caller starts a web conversation. The assistant greets in German and can switch to English.
2. Collect 1–4 guests, exact date, and permitted future start time. Vapi calls `check_potala_demo_availability(date, time, guests)`.
3. Make checks hours and overlaps in the dedicated demo Google Calendar. It returns `{"available":true}` or `{"available":false,"reason":"slot_unavailable"}`.
4. If free, collect a name and required phone. Repeat all details and obtain a clear yes.
5. Vapi calls `book_potala_demo_indoor_table(date, time, guests, name, phone)`. The combined Make scenario rechecks the slot and creates a 90-minute event, recording the name, guests, required phone, and short reference. Success response includes `bookingRef`.
6. Only after `success:true`, the assistant says the practice booking is saved and spells the reference. No SMS/email is sent.

Phone is required in the Vapi tool and prompt. Make's Free slot filter requires `length(trim(ifempty(1.phone; emptystring))) > 0`; its fallback returns `phone_required` for a missing/blank phone, otherwise `slot_unavailable`. This is a presence check, not phone validation or ownership verification. Availability checks do not require phone.

New references use `substring(uuid; 0; 8)` (8 hexadecimal characters, no hyphens). There is no collision check. The live change entry filter accepts 8- or 16-character references, or a nonempty phone when reference is absent. Older references remain stored unchanged.

## Change existing booking — demo only

1. Caller supplies a booking reference **or** the saved phone, plus the proposed new date, time, and guest count. Repeat the supplied identifier and proposed change and obtain a clear yes.
2. Vapi calls `change_potala_demo_indoor_reservation` with `newDate`, `newTime`, and `newGuests` required; `bookingRef` and `phone` are individually optional, but at least one must be provided.
3. Calendar Search Events 22 uses `lower(trim(ifempty(1.bookingRef; 1.phone)))`. For demo changes, provide either a booking reference or the phone saved with the booking. A supplied reference takes priority; Make uses phone only when the reference is empty. It does not automatically retry a wrong reference using the phone. Exactly one search result is required; zero or multiple results are rejected without a calendar update. Phone formatting must match the saved value; automatic normalization is not implemented.
4. The later description filter has a reference group (description **Contains (case insensitive)** `Booking reference: ` plus the supplied reference, AND reference length > 0), OR a phone group (phone length > 4 AND description contains `Demo contact number: ` plus the supplied phone). The phone group no longer requires reference to be empty. Preserve the spaces after the labels. This OR condition cannot recover a booking that the initial reference-priority query did not return.
5. Make checks capacity excluding the existing event, validates the new slot, and updates the **same** Event ID. Update module 33 maps Description from `25.Description`, preserving the stored phone and reference.
6. Report success only after `success:true`. Handle `slot_unavailable` and `reservation_not_found_or_unverified` without claiming success. The tool does not provide a separate preview/selection step or list multiple matching bookings. Cancellation is not implemented.

Reference-only and phone-only changes were verified directly in Make on 26 October. On 27 October, a direct request with an uppercase reference matched its stored lowercase equivalent, returned success true, and moved the same event to 1 December 2026, 19:00–20:30 for 3 guests. The saved phone and reference remained intact. The complete reference-based voice-change flow was verified through Render with published assistant v5 on 27 October: the same event moved to 3 November 2026, 18:30–20:00 for 2 guests, retained its phone/reference, and the assistant confirmed success without a reminder. Either identifier is sufficient only for this **demo**; this is not proof of identity or phone ownership. Stronger verification is required before real restaurant use.

## Accepted starts (Europe/Zurich)

| Day | Start times |
| --- | --- |
| Monday | Closed |
| Tuesday–Friday | 11:30, 12:00, 12:30; 17:00–20:30 each 30 minutes |
| Saturday | 17:00–20:30 each 30 minutes |
| Sunday | 17:00–19:30 each 30 minutes |

A start must be in the future. Each event lasts 90 minutes. The current model treats 15 indoor tables as capacity and each booking as one table for 1–4 guests. Outdoors and larger parties are not automated. Availability checks can race under concurrent requests; do not use this setup for real bookings without an atomic capacity control. Demo entries and call artifacts can contain personal details; use fictional data until retention and access rules are approved.
