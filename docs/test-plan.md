# Test record and low-credit checks

## Verified through the session

| Case | Observed |
| --- | --- |
| Availability opening times | Saturday lunch, Sunday late dinner, and Monday rejected; permitted slots accepted |
| Combined Make booking | Successful demo calendar entry with name, phone, 90-minute duration, and short `bookingRef` |
| Combined Make change | Same reference and phone updated the existing event to another open slot |
| Combined Make rejection | Saturday lunch change and Monday booking returned `slot_unavailable` |
| Vapi direct tool tests | Book and change rejected invalid slots with JSON `success:false` |
| Short voice call | German first message, English switch, recognized change intent with no reference, no accidental booking/tool call |

**Remaining:** one complete voice change with a spoken reference and phone after the latest assistant prompt. Separate backend tests do not prove the full voice path. Notifications have not been configured or tested. Avoid extra paid calls while credit is low.

## One final end-to-end check when ready

Use one existing fictional demo event with a recorded reference and saved phone. Choose a fresh future open slot and request a change by voice through the web page. Confirm the assistant uses only the change tool, says success only after tool success, and that exactly the original calendar event moved with the same reference and phone. Inspect Vapi call log and Make history if the outcome differs; avoid repeating the call blindly. Do not treat a demonstration as a real restaurant booking.
