# Move Make and Vapi accounts

The Make and Vapi migration was completed and verified during the 27 October 2026 session. The existing Render page and demo calendar were retained. This guide remains a checklist for future migrations; keep the source setup available until a new destination passes verification.

## Verified migration result

Destination Make passed direct availability, booking, and uppercase-reference change tests. On 27 October 2026, the user verified a complete voice change through the Render page using the migrated Vapi/Make setup: the same demo event moved to 3 November 2026, 18:30–20:00 for 2 guests, with its saved phone and reference preserved. The assistant announced success automatically without a reminder.

The failed v4 calls had no tools available to the model. Published v5 added all three tool attachments, and the subsequent voice change succeeded. Creating tools alone does not attach them to an assistant; confirm they are included in the published version. This verifies the tested reference-based path, not automatic phone fallback or every possible migration case.

## What stays and what changes

| Component | Migration action |
| --- | --- |
| Render site and public URL | Keep the existing deployment |
| Google Calendar | Reconnect the same demo calendar to preserve events and references |
| Make scenarios | Import fresh exports and reconnect each module |
| Make webhooks | Create destination webhooks and retain their new URLs privately |
| Vapi assistant and tools | Recreate in the destination organization; new IDs apply |
| Browser voice settings | Replace public key and Assistant ID on each browser/origin |

## 1. Back up the working configuration

1. Export fresh blueprints from **Check Indoor Availability** and **Book or Change Indoor Reservation** after saving all changes.
2. Save the current published Vapi System Prompt, separate First Message, transcriber/model/voice settings, and all three tools' URL, method, body, schemas and response mappings in a private backup.
3. Record the selected demo calendar privately. Use one fictional reservation for verification.

The sanitized blueprints currently in this repository are historical references and predate the latest live changes. Do not import them over a working scenario. Sanitize any fresh export before committing: remove live webhook URLs, connection identifiers, tokens, calendar identifiers and real guest data.

## 2. Set up destination Make

1. Import each fresh blueprint into a separate new scenario.
2. Recreate the Google connection and select the **same Potala Reservation Demo calendar** in every relevant module.
3. Create/select destination Custom webhooks. Verify mapped fields still refer to the intended modules. Preserve response modules, route filters and account/scenario timezone `Europe/Zurich`.
4. Confirm required phone, 8-character reference generation, future/open-start rules, capacity checks, and description preservation.
5. In the change branch, confirm Search 22 uses `lower(trim(ifempty(1.bookingRef; 1.phone)))`, the later reference comparison ignores case, and only one initial search result can proceed.
6. Save and activate both destination scenarios once configuration is complete. Do not replay old queued booking requests.

A blueprint carries module settings/mappings but does not transfer authenticated connections or the old account's webhook endpoint.

## 3. Set up destination Vapi

Recreate the assistant with the published First Message and prompt. Copy the model, voice, multilingual transcriber, turn-taking/timeout settings and other relevant behavior. Check availability of the chosen providers in the destination organization.

Recreate and attach all three API Request tools:

| Tool | Destination Make webhook | Required body |
| --- | --- | --- |
| `check_potala_demo_availability` | New availability webhook | `date`, `time`, `guests` |
| `book_potala_demo_indoor_table` | New combined webhook | Static `action=book`; `date`, `time`, `guests`, `name`, `phone` |
| `change_potala_demo_indoor_reservation` | New combined webhook | Static `action=change`; `newDate`, `newTime`, `newGuests`; at least one of `bookingRef` or `phone` |

Preserve string formats and request methods/body configuration. Publish and check that the assistant uses the **new** tools. Do not reuse old organization tool/assistant IDs or assume that copying the prompt copies tool settings. Keep complete endpoint addresses private.

## 4. Switch the existing Render page

1. Create a restricted **public Vapi key** in the destination organization. Allow `https://booking-voice-agent-1wde.onrender.com` and the intended new assistant. Retain other origins only if still needed.
2. Open <https://booking-voice-agent-1wde.onrender.com/> and select **Demo einrichten**.
3. Replace the old public key and Assistant ID, then save. Repeat on each test browser. Values are stored per browser and origin.

No Render redeployment is needed for this switch. Never enter a private Vapi key into the public page, repository or a client-side environment variable.

## 5. Verify with minimal credit use

1. Check configuration and existing logs first; neither starts a call.
2. Use destination Make webhook tests for availability, one fictional booking and a change of that same event. These consume Make credits and can write demo events but do not use Vapi credits.
3. Test an uppercase reference against its lowercase stored equivalent, plus a phone-only lookup if needed. A supplied reference still has priority; a failed reference does not automatically trigger a second phone search.
4. Verify the calendar result and preserved phone/reference. Use a future open start. Monday is closed.
5. Reserve one short voice call for the complete workflow. The configured page's **Sprachdemo starten** button starts a paid call.

If the destination fails, restore the old public key and Assistant ID in the browser while the old assistant/scenarios remain available. Existing calendar events remain because the same calendar is retained. Do not remove the old setup until the destination is verified.

## Credits

Account migration does not transfer credit balances, call history, Make run history or queued requests. A new login to the same organization does not create a separate funding pool. Introductory credits depend on provider eligibility; another account is not a guaranteed or approved way to renew a trial. Check current account allowances before planning the final voice test.

References: [Make blueprints](https://help.make.com/blueprints), [Vapi assistant configuration](https://docs.vapi.ai/api-reference/assistants/create), [Vapi public API keys](https://docs.vapi.ai/security-and-privacy/api-keys).
