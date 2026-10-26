# How the Potala reservation demo works

**Vapi speaks with the guest. Make applies the booking rules. Google Calendar stores the practice reservation.** The web page starts a Vapi call in a browser.

## New booking

1. Vapi asks for guests (1–4), date, and time, then calls the **availability tool**.
2. Make checks opening times, future time, and existing events in the **demo** calendar; it sends the result to Vapi.
3. If free, Vapi collects a name and required phone, repeats the details, and asks for confirmation.
4. After a clear yes, Vapi calls the **booking tool**. Make checks again and creates one 90-minute calendar event.
5. Make returns `success:true` and a short `bookingRef`. Vapi reads the reference aloud only after success.

## Change a booking

1. Vapi asks for the booking reference, the phone saved with it, and the new date, time, and guest count.
2. After confirmation, Vapi calls the **change tool**.
3. Make matches the existing event, checks the new slot, and updates that same event. Vapi reports success only if Make returns `success:true`.

## How Make is organized

| Active Make scenario | Job |
| --- | --- |
| Check Indoor Availability | Receives a Vapi webhook request, checks the demo calendar, and returns `available:true/false`. |
| Book or Change Indoor Reservation | A router uses `action=book` or `action=change`; the selected branch writes to the demo calendar and returns a result. |

Monday is closed. Tuesday–Friday permit lunch and dinner starts; Saturday and Sunday permit dinner starts. Exact times and limits are in [workflow.md](workflow.md).

**Current limits:** This is a demo, not a real restaurant confirmation. The reference is spoken, but no email or SMS is sent yet. Cancellation, outdoor seating, and parties over four are not automated. Concurrent capacity checks need stronger protection before live use.

**Possible next additions:** Written confirmation by [email or SMS](confirmations.md), an inbound phone number, cancellation, staff alerts, holiday hours, and stronger caller verification.
