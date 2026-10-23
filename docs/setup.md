# Setup and restoration

## 1. Google Calendar

Create or select a dedicated **demo** calendar. Set its timezone to `Europe/Zurich`. Use that same calendar in both Make scenarios. Do not mix demo entries with real restaurant reservations.

## 2. Make

Import the two sanitized blueprints in `make/`, or use them as references to inspect the existing scenarios:

- `availability.reference.blueprint.json`
- `booking.reference.blueprint.json`

The sanitization removed webhook IDs, Google connection IDs, calendar IDs, and related metadata. Recreate/select the custom webhook in module 1, reconnect Google Calendar, and select the demo calendar in every Search Events and Create Event module. Verify filters and field mappings after import. The exports are reference copies and may need manual repair before Make will run them.

Each scenario should be saved and active. Their Webhook response modules must return JSON, not the default `Accepted` page. Store webhook URLs only in the respective Vapi tool configuration or a private secret store.

## 3. Vapi

Use the saved Potala assistant, German-first greeting, German-capable transcription, and the two tools already attached to it. The tools should call the matching Make webhook: availability to availability, booking to booking. Confirm the tool parameter names and response bodies against `docs/workflow.md`.

The exact current Vapi prompt and assistant configuration are **not** part of the exported files here. `docs/vapi-prompt-reference.md` records the intended behavior but should be replaced with an export/copy of the published assistant before this repository is considered a full backup.

## 4. Public browser page

The deployed page is <https://potala-voice-demo-2026.ochrescout3.chatgpt.site>. Visitors can open the link, but each browser must enter the **public** Vapi key and Potala assistant ID in its setup panel. These values are stored locally in that browser. Do not enter a private key.

In Vapi, restrict the public key to the page origin `https://potala-voice-demo-2026.ochrescout3.chatgpt.site` and to the Potala assistant. The page can be built from `web/` with `npm install && npm run build`. Start Conversation opens a Vapi web call and uses call credit; saving setup does not. The page itself has no call quota or guest authentication, so share the key only with intended testers.

If you move to another Vapi account, recreate/publish the assistant and its two tools there, point the tools at the corresponding Make scenarios, create a new restricted public key, and replace the public key and assistant ID in each browser's setup panel. The Make scenarios and demo calendar can remain if their webhook and connection settings are unchanged.

## 5. Before real restaurant use

Obtain approval for real bookings, choose a production calendar, resolve simultaneous booking capacity, define holiday and large-party policies, set retention and privacy rules, and connect an inbound phone number. Run end-to-end production tests before changing the spoken demo disclaimer.
