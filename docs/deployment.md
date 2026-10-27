# Hosting the Potala voice demo

## Live sites

- **Render:** <https://booking-voice-agent-1wde.onrender.com/>
- Existing hosted version: <https://potala-voice-demo-2026.ochrescout3.chatgpt.site>

The page is a static Vite frontend. Vapi handles the live voice conversation; Make handles calendar actions. Hosting does not provide Vapi or Make credits.

## Deployed Render configuration

Deployment reached **live** on 27 October 2026. The page, waveform and connection settings were checked without a paid call. Service `booking-voice-agent` uses repository `lotushub/potala-voice-reservation-demo`, branch `main`, with automatic deploys enabled.

| Setting | Live value |
| --- | --- |
| Service type | Static Site |
| Root directory | Repository root (blank) |
| Build command | `cd web && npm ci && npm run build` |
| Publish directory | `web/dist` |

An equivalent manual setup can set Root Directory to `web`, Build Command to `npm ci && npm run build`, and Publish Directory to `dist`. Do not mix the two path configurations.

Static hosting is free within Render's included bandwidth/build allowances; check the account's current limits. Documentation-only commits use `[skip render]` to avoid unnecessary builds.

## Enable voice on the new origin

1. In Vapi, allow the exact origin `https://booking-voice-agent-1wde.onrender.com` on the restricted public key, and allow the intended assistant.
2. On the Render page, select **Demo einrichten**. Save the public key and Assistant ID in that browser. Never enter a private API key.
3. Use the free local microphone check if needed. Select **Sprachdemo starten** only when ready for a paid call; it starts immediately in a configured browser.

The waveform has connecting/listening/speaking states driven by Vapi events. Reduced-motion preferences disable its animation. The current live-call speech response has not been re-tested since the visual change.

A new domain or browser does not inherit saved setup values. Each visitor currently needs the owner's restricted public key and assistant ID. The repository and deployment contain no embedded Vapi credentials. A shared link alone does not automatically configure the visitor's voice access.

## Changing Make/Vapi accounts

Follow [account-migration.md](account-migration.md). Keep this Render service and URL. Replace browser settings after creating the new assistant, and point its tools to the new Make webhooks. **No redeployment is required for changing those browser settings.** Retain the same Google Calendar to preserve existing demo reservations.

Official references: [Render static sites](https://render.com/docs/static-sites), [Render deploy behavior](https://render.com/docs/deploys), [Vapi public key restrictions](https://docs.vapi.ai/security-and-privacy/api-keys).
