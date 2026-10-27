# Change an existing reservation — demo

Updated 27 October 2026.

For demo changes, provide either a booking reference or the phone saved with the booking. A supplied reference takes priority; Make uses phone only when the reference is empty. It does not automatically retry a wrong reference using the phone. Exactly one search result is required; zero or multiple results are rejected without a calendar update. Phone formatting must match the saved value; automatic normalization is not implemented.

## Implemented

- Vapi change tool: `newDate`, `newTime`, `newGuests` required; `bookingRef` and `phone` individually optional. Assistant must supply at least one identifier and obtain explicit confirmation before calling.
- Make entry filter accepts reference length 8 or 16, or a phone-only request with reference empty.
- Search Events 22 selects reference, otherwise phone. The aggregator/route requires exactly one result.
- A later filter matches the selected identifier in the event description. The phone label must include its space: `Demo contact number: `.
- Capacity check excludes the original event; Update 33 preserves `25.Description`, so omitted inputs do not erase stored contact/reference details.
- Success is reported only after `success:true`. Failed or ambiguous results do not authorize a change.

## Verified

Reference-only change and phone-only change both returned success in Make and showed the expected existing calendar event with its saved description preserved. The final phone-only test event was 5 November 2026, 19:00–20:30 for 3 guests. These were direct webhook tests; the latest either-identifier voice flow is not yet verified end to end.

## Limits

Demo calendar only. No automatic fallback from an incorrect reference to phone; no normalization of phone formatting, separate booking preview, or selection among multiple matches. Email/SMS and cancellation are not implemented. Before real use, add verified ownership, atomic capacity control, and operational recovery. The old blueprint export predates these changes.
