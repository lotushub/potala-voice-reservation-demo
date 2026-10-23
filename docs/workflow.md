# Reservation workflow and rules

## End-to-end flow

1. A guest starts a web call (or, later, dials an inbound phone number).
2. Vapi greets in Standard German, states that this is a demo, and collects party size, date, and time. It asks one question at a time. The short time question is “Um wie viel Uhr möchten Sie reservieren?”
3. Vapi calls the availability tool with `date` (`YYYY-MM-DD`), `time` (`HH:mm`), and integer `guests`.
4. The Make availability scenario checks the requested start time in `Europe/Zurich`, weekday rules, and existing events in the demo Google Calendar. It replies `{"available":true}` or `{"available":false,"reason":"slot_unavailable"}`.
5. If a slot is available, Vapi collects a demo name and any optional fictional contact detail, repeats the reservation details, and asks for explicit confirmation.
6. After confirmation, Vapi calls the booking tool with `date`, `time`, `guests`, `name`, and optional `phone` after the live mapping is applied. Make rechecks the conditions, creates a 90-minute event when permitted, and replies `{"success":true}` or `{"success":false,"reason":"slot_unavailable"}`.
7. Vapi reports only the tool result it actually received. Successful demo entries are practice reservations, not real restaurant confirmations.

## Guest details currently saved

The booking scenario maps the demo name and guest count into the Google Calendar event title: `DEMO reservation -<name>-<guests> guests`. Its start and end fields contain the requested time and a 90-minute duration. The revised reference blueprint maps the optional `phone` text field into the event **Description** as `Demo contact number: ...`; it writes `Not provided` when skipped. The live Make and Vapi booking tools still need this mapping applied before phone numbers will be saved. A spoken number may appear in Vapi call transcripts or recordings depending on that account's artifact settings. Use fictional details in this demo.

## Current Make rules

| Day | Accepted reservation start times |
| --- | --- |
| Monday | Closed |
| Tuesday–Friday | 11:30, 12:00, 12:30; every 30 minutes from 17:00 through 20:30 |
| Saturday | Every 30 minutes from 17:00 through 20:30 |
| Sunday | Every 30 minutes from 17:00 through 19:30 |

- Timezone: `Europe/Zurich`; start time must be in the future.
- Indoor capacity: 15 tables, each for 1–4 guests. The demo counts a booking as one table.
- Event duration: 90 minutes.
- Both Google Calendar searches currently use a limit of 100 events.
- Outdoors, large parties, cancellations, holidays, and staff escalation are not implemented.

## Operational limitation

Two simultaneous callers may both see the last table as free before either writes its event. The current Make workflow does not provide an atomic capacity lock. Resolve this before using the system for real reservations. The demo calendar and demo disclosure should stay in place until the restaurant approves a production setup.
