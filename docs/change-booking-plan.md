# Change an existing reservation — cost-conscious plan

Status: **planned, not live**. The current Vapi tools check availability and create a demo event. Do not promise that callers can change or cancel one yet.

## Priority before 2 November

Keep the verified booking flow stable. Use the web page, Vapi, Make scenarios, and demo calendar already tested. Do not spend more credits on exploratory calls. Prepare the presentation and a fallback walkthrough using the verified calendar event and Make history, with fictional contact details.

## Requirements for a change flow

1. **Identify one existing booking.** Issue a short booking reference on creation and keep its mapping to the Google Calendar Event ID. For existing events without a reference, staff can change them manually. Do not update an event based on a name alone.
2. **Verify the requester.** Ask for the reference and the contact number or other agreed check. A spoken number is a claim, not proof of phone ownership; a production service needs an approved verification policy. If no unique matching event is found, stop and refer to staff.
3. **Collect the requested change.** Support a new date/time and optionally a new guest count (1–4). Clarify dates and keep the 90-minute duration in `Europe/Zurich`. Monday remains closed; use the same opening-time rules as the live availability and booking scenarios.
4. **Recheck capacity.** Search overlapping demo calendar events for the new slot, excluding the event being changed. Apply the 15-indoor-table cap. A normal availability check that counts the caller's original event may give the wrong answer.
5. **Confirm before writing.** Repeat old and new details and ask for a clear yes. Update the *same* Google Calendar Event ID in the demo calendar; preserve the contact number and any other event fields. Report success only after the update succeeds. If the slot is taken or the update fails, keep the original event and say so.
6. **Separate cancellation.** Cancellation needs its own explicit confirmation and `Delete an Event` action. It is not enabled by this change flow.

## Proposed implementation, when credits are available

1. Extend the existing Make booking response to return a short reference, storing an unambiguous association with the created Event ID. Do not expose the long Google Event ID as a spoken reference. Decide how references are generated and stored before editing the live scenario.
2. Create a separate Make `Change Indoor Table` scenario: webhook → look up reference → verify supplied details → search new slot excluding original event → update the matching event → JSON response.
3. Add one Vapi change-booking tool that accepts the reference and proposed new details. Update the assistant prompt to use it only after confirmation. Keep the existing booking tool unchanged.
4. Test Make directly with one fictional event first. Then make at most one short Vapi web call to verify the voice flow. Inspect Make History and the calendar event; avoid replays that could edit the event twice.

## Budget and deployment gates

- Drafting this plan and reviewing existing logs cost no Vapi call credit and no Make scenario-run credits.
- A real Make test spends credits per module operation; the most recent successful booking run used 5 Make credits. The new change scenario's total is unknown until built.
- Reserve remaining Vapi credit for the live presentation and one final end-to-end test only after the Make-only flow passes.
- For restaurant use, resolve caller verification, privacy and retention, simultaneous capacity updates, and staff exceptions before enabling live changes.
