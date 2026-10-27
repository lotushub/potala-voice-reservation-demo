# Test record and low-credit checks

Updated 27 October 2026.

## Verified through the session

| Case | Observed |
| --- | --- |
| Availability opening times | Saturday lunch, Sunday late dinner, and Monday rejected; permitted slots accepted |
| Combined Make booking | Successful demo calendar entry with name, phone, 90-minute duration, and short `bookingRef` |
| Combined Make change | Same reference and phone updated the existing event to another open slot |
| Combined Make rejection | Saturday lunch change and Monday booking returned `slot_unavailable` |
| Vapi direct tool tests | Book and change rejected invalid slots with JSON `success:false` |
| Required phone (26 October) | Make-only request without phone returned `phone_required` |
| New reference (26 October) | Make-only booking on 4 November 2026, 18:00–19:30 for 2 guests saved a fictional phone and an 8-character reference without hyphens |
| Reference-only demo change (26 October) | Request omitted phone; existing event moved to 5 November, 18:00–19:30, 2 guests; phone and reference preserved |
| Phone-only demo change (26 October) | Request omitted reference; unique fictional saved phone found the event; moved to 5 November, 19:00–20:30, 3 guests; description preserved |
| Uppercase reference (27 October) | Direct Make request with uppercase bookingRef returned success true; the user verified the same event moved to 1 December 2026, 19:00–20:30, 3 guests, retaining saved phone/reference |
| Render deployment (27 October) | Static Site reached live; landing page, waveform and connection settings checked without starting a Vapi call |
| Migrated Make account (27 October) | Direct availability and booking requests succeeded; an uppercase-reference change updated the same demo event and preserved its phone/reference |
| Complete voice change (27 October) | User verified the reference-based flow through Render with published assistant v5: same event changed to 3 November 2026, 18:30–20:00, 2 guests, retaining phone/reference; assistant announced success automatically without a reminder |
| Short voice call | German first message, English switch, recognized change intent with no reference, no accidental booking/tool call |

**Compatibility:** live entry filter now supports 8- and 16-character references and phone-only requests. Both new lookup paths passed Make-only tests. The repository blueprint is still an older export.

**Voice-change verification complete:** The reference-based path passed with the migrated setup. Evidence is the user's calendar inspection and explicit confirmation that the assistant responded without a reminder; the final successful call log was not separately uploaded. Earlier v4 call logs showed no tools supplied to the model. The v5 version diff confirmed all three tool IDs were added before the successful test.

**Remaining:** automatic fallback from an incorrect reference to a supplied phone is not implemented. A phone-only voice change in the migrated setup has not been separately verified. Notifications have not been configured or tested. Avoid extra paid calls while credit is low.

## Regression check after future configuration changes

Use one existing fictional demo event with a recorded reference and saved phone. Choose a fresh future open slot and request a change by voice through the web page. Confirm the assistant uses only the change tool, says success only after tool success, and that exactly the original calendar event moved with the same reference and phone. Inspect Vapi call log and Make history if the outcome differs; avoid repeating the call blindly. Do not treat a demonstration as a real restaurant booking.

## Checks that do not use Vapi credits

Inspect existing Vapi transcripts and Make history without new calls. Direct Make webhook requests avoid Vapi charges but still consume Make credits and may update demo events. The browser-local microphone test starts no call. **Sprachdemo starten** starts a paid call when the browser is configured; opening **Demo einrichten** does not.

The complete reference-based voice change has passed; waveform speech animation was not separately confirmed during that test. A successful direct Make test or public page load alone is not an end-to-end voice pass.
