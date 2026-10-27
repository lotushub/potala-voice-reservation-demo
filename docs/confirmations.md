# Booking reference and guest notifications

## What works today

New bookings require a confirmed phone number. When the combined Make booking scenario succeeds, it returns an 8-character, hyphen-free `bookingRef` and stores that reference in the demo event. The assistant is instructed to spell it and ask the caller to keep it. The demo change flow accepts either the reference **or the saved phone**, provided the lookup returns exactly one booking. A supplied reference takes priority. There is currently **no SMS or email delivery**. A caller who forgets the reference can supply the saved phone. Multiple matches are rejected; the tool does not list bookings or search by name alone. This relaxed lookup is for demo use, not ownership verification.

Example after `{"success":true,"bookingRef":"..."}`:

> Ihre Testreservierung ist im Demo-Kalender eingetragen. Ihre Buchungsreferenz lautet … Bitte notieren Sie sie. Dies ist noch keine bestätigte Restaurantreservierung.

The assistant must use the actual `bookingRef` returned by Make, read its characters slowly, and never invent one.

## Recommended first addition: email confirmation

For the demo, email can give guests a written reference without relying on recognition of long spoken characters. This is **proposed, not configured**:

1. Add an optional `email` text field to the **booking** tool and Make webhook request. Ask the caller whether they want an email confirmation, repeat the address carefully, and obtain permission to send. Preserve the original booking fields and phone for later changes.
2. On **successful calendar creation only**, send a message via a connected email provider (for example, Make's Gmail Send an Email module). Include demo status, reference, date/time in Europe/Zurich, party size, and a way to contact staff. Do not include the stored phone in the email unless needed.
3. Keep the webhook response useful to Vapi: return `success:true`, `bookingRef`, and a separate `notificationSent` value. If sending fails, keep the booking and tell the caller the entry exists but the email could not be confirmed. Do not send for failed bookings.
4. For successful changes, send an updated confirmation to the **verified stored address** only after the calendar update succeeds. Decide how this address is stored/retrieved without treating a new spoken email as ownership proof.

Make's Gmail app provides a Send an Email module: <https://help.make.com/new-gmail-app-is-now-available>. Sending adds Make operations: <https://help.make.com/operations>.

## SMS alternative

If phone number is collected and the caller consents, a Make Twilio messaging action after successful booking/change can send the reference and details to that number. Twilio requires an account and a supported sender; trial accounts can send only to verified numbers: <https://apps.make.com/twilio>. Check Swiss and recipient-country messaging rules, delivery cost, and whether the phone can receive SMS before promising delivery: <https://www.twilio.com/docs/messaging/guides/sending-international-sms-guide>. An incoming web voice call does **not** automatically prove the spoken phone is the caller's number.

For production, sending a confirmation to an unverified spoken address/number can disclose booking data to someone else. Decide verification, consent, retention, and failure behavior first. Never commit recipient details or mail/SMS credentials to this repo.
