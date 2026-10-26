# Change an existing reservation — current demo

**Implemented in Make:** the combined Book or Change scenario accepts `action=change`. The Vapi assistant has a separate change tool and prompt. The backend was tested with a fictional booking reference and saved phone: it moved the **same** calendar event to a new slot while preserving the reference and phone.

**26 October update:** New bookings now receive 8-character references without hyphens. The older exported change route requires length 16; check the live filter for 8/16 compatibility before testing a change. Phone-only lookup is not implemented.

## Caller path

1. The assistant asks for booking reference and phone saved with the original booking, then the new date, start time, and guest count (1–4).
2. It repeats those details and asks for a clear yes.
3. The change tool verifies the event by reference and phone, checks time and capacity excluding that original event, then updates it.
4. Only `success:true` means it changed. `slot_unavailable` leaves the old event; `reservation_not_found_or_unverified` means the details were not matched.

**Voice verification still outstanding:** a complete spoken change using the real short reference has not been confirmed end to end after the final prompt update. A short English voice call did verify change intent and no-reference handling, with no calendar write.

## Known limits

The caller currently gets the booking reference spoken on the successful call only. Automated email/SMS is [planned](confirmations.md). New bookings require a confirmed phone. Legacy bookings without a saved phone cannot be changed automatically. A spoken matching phone does not prove ownership, and simultaneous callers could exceed capacity. Cancellation and staff recovery are not implemented. Keep this in the demo calendar until those issues are addressed.
