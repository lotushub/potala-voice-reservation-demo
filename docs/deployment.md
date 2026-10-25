# Hosting the Potala demo page

The redesigned page is already published at <https://potala-voice-demo-2026.ochrescout3.chatgpt.site>. It is a static Vite page; Vapi handles the voice call, and Make handles calendar requests. The page does not need its own backend server.

## Existing ChatGPT Sites deployment

Use the current public URL for the presentation. ChatGPT Sites hosting is currently included with eligible Plus/Pro plans, although editing consumes Codex usage and Vapi/Make have their own usage and credit limits. The source in `web/` is synchronized with the published page.

## Optional separate free host: Render Static Site

Render supports free static sites, subject to its monthly included bandwidth and pipeline usage. If a separate `onrender.com` address is wanted:

1. In Render, choose **New → Static Site**, connect the private GitHub repository `lotushub/potala-voice-reservation-demo`, and choose the `main` branch.
2. Set **Root Directory** to `web`, **Build Command** to `npm ci && npm run build`, and **Publish Directory** to `dist`.
3. After Render provides the actual site URL, add that exact origin to the **Allowed Origins** of the restricted Vapi public key. If the key is limited to specific assistants, include the intended Potala assistant.
4. Open the new site and enter the **public** Vapi key and assistant ID in its setup panel. Check microphone permission. Keep any **private** Vapi key, Make webhook URL, and customer data off the static site.

The page's setup is stored separately in each browser. A new domain will not inherit values saved on the existing site. Hosting the static page does not include Vapi call credits, Make operations, or SMS costs.

Official references: [ChatGPT Sites hosting](https://help.openai.com/en/articles/20001339-creating-and-using-chatgpt-sites), [Render static sites](https://render.com/docs/static-sites), [Vapi public key restrictions](https://docs.vapi.ai/security-and-privacy/api-keys).
