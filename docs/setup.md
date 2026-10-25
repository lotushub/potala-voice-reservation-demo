# Setup and restoration

## 1. Keep the two Make scenarios and demo calendar

- `Potala Demo – Calendar – Check Indoor Availability` handles availability.
- `Potala Demo – Book or Change Indoor Reservation` handles both `action=book` and `action=change`. The scenario branches by action, enforces Zurich-time rules and 15-table capacity, and uses the dedicated demo calendar.
- Preserve the current Make webhook URLs privately. The `make/` exports in this repo are **older reference copies**, not the combined live scenario; importing them does not recreate the current system.
- The book response should expose `success` and `bookingRef`; the event title/description contains name, guest count, optional phone, and reference. The change response should expose `success` or a reason. Do not confuse a webhook's `Accepted` page with a completed JSON result.

## 2. Vapi assistant and tools

First message (separate from System Prompt):

> Guten Tag, Potala Restaurant in Olten. Möchten Sie einen Tisch reservieren oder eine bestehende Testreservierung ändern?

Use the text in [vapi-system-prompt.md](vapi-system-prompt.md) as a reference and compare against the currently published assistant. Deepgram Nova 3 **Multilingual** is configured for German and English. The most recent recorded assistant used GPT-4.1 and Elliot v2. Attach these three API Request tools:

| Tool | Endpoint and fields | Result |
| --- | --- | --- |
| `check_potala_demo_availability` | Availability Make webhook; `date`, `time`, `guests` strings | `available` boolean |
| `book_potala_demo_indoor_table` | Combined Make webhook with `action=book`; `date`, `time`, `guests`, `name` required strings; `phone` optional string | `success`, `bookingRef` on success |
| `change_potala_demo_indoor_reservation` | Same combined webhook with `action=change`; `bookingRef`, `phone`, `newDate`, `newTime`, `newGuests` required strings | `success` or reason |

Keep complete webhook addresses and account tokens out of GitHub. A change should use the **change tool only** after explicit confirmation.

## 3. Move to a Vapi account with separate credits

1. In the new login, check which **organization** is selected and its balance. A second login to the same organization does not move the assistant to a separately funded organization or create a new credit pool.
2. If using a different organization, create/publish a Potala assistant there with the same first message, prompt, transcriber, model, and voice available to that account. Recreate the **three tools** above with the existing Make endpoints and exact fields; attach all three. Keep the old account for comparison. Do not assume the old assistant or tool IDs transfer.
3. Create a **public** Vapi key in the new organization, restricted to the deployed page origin and new assistant. In each browser's setup panel replace both the old public key and assistant ID. Never enter or commit a private key.
4. Save/publish, then use direct tool tests or Make history first; reserve one short Vapi voice call for a final end-to-end check. A successful Make test alone does not prove the new assistant routed the call correctly.

Changing the Vapi organization does not require changing the existing Make scenario or demo Google Calendar when their connections and webhooks are retained.

## 4. Public page

<https://potala-voice-demo-2026.ochrescout3.chatgpt.site> accepts a public key and assistant ID per browser, saved locally there. The source is `web/`. Starting a call consumes Vapi credit. Browser access is not guest authentication. Restrict the public key to the exact origin and assistant; monitor usage.

## Before real restaurant use

Add atomic capacity handling, actual caller verification, explicit cancellation and recovery policy, holiday/special-hours rules, privacy and retention, staff review, a production calendar, delivery confirmations, and an inbound phone number. Keep demo language until the restaurant approves and verifies production.
