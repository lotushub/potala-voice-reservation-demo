# Potala reservation assistant — to-do list

Updated 23 October 2026. Presentation: Monday, 2 November 2026.

## Completed

- [x] Create separate Make scenarios for indoor availability and demo calendar booking.
- [x] Connect Vapi availability and booking tools to the respective Make webhooks.
- [x] Use the Potala demo Google Calendar and create 90-minute events.
- [x] Apply 15-table capacity, 1–4 guests per table, future start times, and a search limit of 100 events in both scenarios.
- [x] Apply restaurant start-time rules in both Make filters: Monday closed; Tuesday–Friday lunch 11:30, 12:00, 12:30 and dinner every 30 minutes from 17:00 through 20:30; Saturday dinner 17:00–20:30; Sunday dinner 17:00–19:30. Timezone: Europe/Zurich.
- [x] Test availability: Saturday lunch rejected and dinner accepted; Sunday 18:00 accepted and 20:00 rejected; Monday rejected; Tuesday lunch accepted.
- [x] Test booking rejection for Saturday lunch, and successful Tuesday lunch booking with matching 12:00–13:30 demo calendar event.
- [x] Activate the two demo Make scenarios and clear old webhook test data before activation.
- [x] Publish a German-first Vapi assistant with spoken demo disclosure and confirmation before booking.
- [x] Change Vapi transcription from English-only to Deepgram Nova 3 German; German guest count is now recognized.
- [x] Improve the German voice language; spoken conversation now works.
- [x] Add the short reservation-time question to the Vapi reservation flow (confirm it was saved/published in the assistant).
- [x] Build and privately publish the Start Conversation page. It awaits the owner's public Vapi key and assistant ID before it can start a call.
- [x] Prepare project workflow, setup, tests, presentation notes, page source, and sanitized Make blueprint references in a downloadable package.
- [x] Create a private GitHub repository and upload the project package.
- [x] Update the restaurant-style demo page and publish it as a public link. Visitors still need a restricted Vapi public key and assistant ID.
- [x] Open the private page in a standalone browser tab, verify sound from the built-in microphone with the free local check, and complete a short Vapi web call: “4 Personen” was transcribed and the assistant asked for a date.

## Next session — 22 October

- [x] Save and publish the short time question and date clarification wording in the Vapi reservation flow (confirmed by the owner on 22 October).
- [ ] Run one complete Vapi Talk reservation for a fresh future date and confirm exact date, time, guests, name, 90-minute calendar event, and honest demo-only confirmation. Do not run a positive test against an already booked demo slot unless intentional.
- [ ] Test one closed-day or out-of-hours request by voice; verify that no calendar event is created.
- [ ] If pauses persist, inspect a specific call’s transcript and per-turn latency in Vapi Logs → Calls. Distinguish waiting for speech, model delay, and tool delay before changing providers.
- [ ] Verify the Vapi **public** key is restricted to the Potala page origin and assistant. Browser setup, microphone permission, and a short call were tested.
- [ ] Complete a booking through the page to a fresh future open slot and confirm the matching demo calendar event. Short audio exchange worked on 22 October; booking was not tested in that call.
- [ ] Verify the published date clarification wording during the final low-credit call. Listen to the greeting recording before changing pronunciation based on the transcript alone.
- [ ] Prepare a short presentation script and workflow view for 2 November, using a future open date because Monday is normally closed.
- [ ] Replace the reconstructed prompt reference with the exact published Vapi prompt.
- [ ] Apply the optional phone mapping in the live Vapi booking tool and Make booking scenario; verify a fictional number in the demo calendar event description. The repository blueprint is prepared, but the live configuration is not yet changed.

## Before real restaurant use

- [ ] Replace the demo calendar and demo-only language only after restaurant approval and end-to-end production testing.
- [ ] Resolve simultaneous-booking capacity: Make's sequential-processing setting conflicts with the current Webhook response modules, so 15-table availability is not yet an atomic reservation lock.
- [ ] Define large-party handling, contact details, cancellations, holidays/exceptions, and staff escalation.
- [ ] Connect and test the restaurant's actual inbound phone number, privacy/retention settings, and operational monitoring.

Keep webhook URLs and calendar/connection identifiers out of any shared or public materials.
