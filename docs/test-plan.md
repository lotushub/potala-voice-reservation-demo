# Test record and final checks

## Already observed in the demo

| Case | Observed result |
| --- | --- |
| Saturday lunch | Availability rejected |
| Saturday dinner | Availability accepted |
| Sunday 18:00 | Availability accepted |
| Sunday 20:00 | Availability rejected |
| Monday | Availability rejected |
| Tuesday lunch | Availability accepted; booking created matching 90-minute calendar event |
| German guest count | Recognized after changing the transcriber to Deepgram Nova 3 German |

These are conversation-session observations, not automated regression tests.

## Remaining low-credit final test

1. Enter the public Vapi key and assistant ID on the public page. Saving them must **not** start a call.
2. Choose a fresh future open slot with no existing demo event. Start one web conversation. Confirm date, time, guests, and a fictional name before booking.
3. Verify the tool says success and exactly one 90-minute event appears in the demo calendar with the matching details.
4. Record any unusually long pauses and inspect that call in Vapi Logs → Calls to distinguish speech detection, model, and tool delay.
5. If credit permits, test one closed-day or out-of-hours request; ensure no event is created. This can also be checked through Make without using Vapi credit.

Avoid repeated calls to an already booked demo slot unless testing rejection deliberately. Do not perform real customer reservations with this setup.
