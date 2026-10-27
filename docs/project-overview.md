# How the Potala reservation demo works

**Vapi speaks with the guest. Make applies the booking rules. Google Calendar stores the practice reservation.** The [public Render page](https://booking-voice-agent-1wde.onrender.com/) starts a Vapi call in a browser. It has a focused **Sprachdemo starten** action and an orange waveform voice window; setup is under **Demo einrichten**.

## New booking

1. Vapi asks for guests (1–4), date, and time, then calls the **availability tool**.
2. Make checks opening times, future time, and existing events in the **demo** calendar; it sends the result to Vapi.
3. If free, Vapi collects a name and required phone, repeats the details, and asks for confirmation.
4. After a clear yes, Vapi calls the **booking tool**. Make checks again and creates one 90-minute calendar event.
5. Make returns `success:true` and a short `bookingRef`. Vapi reads the reference aloud only after success.

## Change a booking

1. Vapi asks for either the booking reference or saved phone, plus the new date, time, and guest count.
2. After confirmation, Vapi calls the **change tool**.
3. Make requires exactly one matching event, checks the new slot, and updates that same event while preserving its reference and phone. Vapi reports success only if Make returns `success:true`.

For demo changes, provide either a booking reference or the phone saved with the booking. A supplied reference takes priority; Make uses phone only when the reference is empty. It does not automatically retry a wrong reference using the phone. Exactly one search result is required; zero or multiple results are rejected without a calendar update. Phone formatting must match the saved value; automatic normalization is not implemented.

Both lookup paths are tested in Make. The reference query is now trimmed/lowercased and the description comparison ignores letter case; a direct uppercase-reference change passed on 27 October. The latest voice flow still needs an end-to-end check.

## How Make is organized

| Active Make scenario | Job |
| --- | --- |
| Check Indoor Availability | Receives a Vapi webhook request, checks the demo calendar, and returns `available:true/false`. |
| Book or Change Indoor Reservation | A router uses `action=book` or `action=change`; the selected branch writes to the demo calendar and returns a result. |

Monday is closed. Tuesday–Friday permit lunch and dinner starts; Saturday and Sunday permit dinner starts. Exact times and limits are in [workflow.md](workflow.md).

**Current limits:** This is a demo, not a real restaurant confirmation. The reference is spoken, but no email or SMS is sent yet. Cancellation, outdoor seating, and parties over four are not automated. Concurrent capacity checks need stronger protection before live use.

**Possible next additions:** Written confirmation by [email or SMS](confirmations.md), an inbound phone number, cancellation, staff alerts, holiday hours, and stronger caller verification.

## Moving accounts

The public Render URL can stay while Make/Vapi accounts change. Import fresh Make blueprints, reconnect the same Google Calendar, update the new Vapi tools with the new webhook URLs, then replace the public key and Assistant ID in each browser. See [Account migration](account-migration.md). No account migration has been performed yet.
