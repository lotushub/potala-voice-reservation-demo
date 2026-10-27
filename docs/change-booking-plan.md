# Change an existing reservation — demo

Updated 27 October 2026.

For demo changes, provide either a booking reference or the phone saved with the booking. A supplied reference takes priority; Make uses phone only when the reference is empty. It does not automatically retry a wrong reference using the phone. Exactly one search result is required; zero or multiple results are rejected without a calendar update. Phone formatting must match the saved value; automatic normalization is not implemented.

## Implemented

- Vapi change tool: `newDate`, `newTime`, `newGuests` required; `bookingRef` and `phone` individually optional. Assistant must supply at least one identifier and obtain explicit confirmation before calling.
- Make entry filter accepts reference length 8 or 16, or a phone-only request with reference empty.
- Search Events 22 uses `lower(trim(ifempty(1.bookingRef; 1.phone)))`: normalize the selected reference/phone query to lowercase and trim surrounding whitespace. Reference still takes priority. The aggregator/route requires exactly one result.
- The later description filter matches a nonempty reference with **Contains (case insensitive)**, OR a supplied phone (length > 4) against `Demo contact number: ` plus that phone. Its phone group no longer requires reference to be empty. Preserve the space after each label. This does not add a second search or automatic phone fallback.
- Capacity check excludes the original event; Update 33 preserves `25.Description`, so omitted inputs do not erase stored contact/reference details.
- Success is reported only after `success:true`. Failed or ambiguous results do not authorize a change.

## Verified

Reference-only change and phone-only change both returned success in Make and showed the expected existing calendar event with its saved description preserved. The final phone-only test event was 5 November 2026, 19:00–20:30 for 3 guests. These were direct webhook tests. A later reference-based voice change was also verified end to end through the Render page with published assistant v5; phone-only voice changes were not separately re-tested in the migrated setup.


On 27 October, an uppercase reference passed a direct Make test and matched the stored lowercase reference. The user verified the same calendar event moved to Tuesday 1 December 2026, 19:00–20:30, 3 guests, with phone/reference preserved. The previously failed voice request proposed Monday 30 November, which is closed; a successful lookup does not make a closed start valid.

On 27 October 2026, the user verified a complete voice change through the Render page using the migrated Vapi/Make setup: the same demo event moved to 3 November 2026, 18:30–20:00 for 2 guests, with its saved phone and reference preserved. The assistant announced success automatically without a reminder.

Published v5 added the three tool attachments missing from the failed v4 calls. Those earlier calls had no tools supplied to the model and their spoken success claims were not evidence of a calendar update.

## Limits

Demo calendar only. No automatic fallback from an incorrect reference to phone; no normalization of phone formatting, separate booking preview, or selection among multiple matches. Email/SMS and cancellation are not implemented. Before real use, add verified ownership, atomic capacity control, and operational recovery. The old blueprint export predates these changes.
