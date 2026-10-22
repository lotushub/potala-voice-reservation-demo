import Vapi from '@vapi-ai/web';
import './style.css';
import './audio-check.css';

const app = document.querySelector('#app');
const storageKey = 'potala-demo-vapi-settings-v1';
let saved = {};
try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { saved = {}; }

app.innerHTML = `
  <main class="shell">
    <header class="topbar"><span class="brand-mark">P</span><span class="brand">POTALA <small>RESTAURANT</small></span><span class="badge">PRIVATE DEMO</span></header>
    <section class="hero">
      <div class="eyebrow">VOICE RESERVATION EXPERIENCE <span class="line"></span> OLTEN, SWITZERLAND</div>
      <h1>A table begins<br><em>with a conversation.</em></h1>
      <p class="intro">Try the Potala reservation assistant in German. Ask for a table, hear the availability response, and watch the demo calendar update when a booking succeeds.</p>
      <div class="call-panel">
        <div class="orb-wrap"><div class="orb" id="orb"><div class="orb-inner"></div></div></div>
        <div class="call-copy"><div class="kicker">POTALA ASSISTANT</div><h2 id="call-title">Ready to talk</h2><p id="call-status" role="status" aria-live="polite">Set up this browser once, then start when you’re ready.</p></div>
        <button id="call-button" class="call-button" type="button" disabled>Start Conversation <span aria-hidden="true">↗</span></button>
      </div>
      <div class="audio-check" id="audio-check"><div><strong>Check your microphone first</strong><p id="mic-status" role="status" aria-live="polite">This local check does not start a Vapi call or use credit.</p></div><button id="mic-button" type="button">Check microphone</button></div>
      <div class="preview-warning" id="preview-warning" hidden>Open the Potala page in its own browser tab before calling. Microphone access in this embedded preview may differ from the site’s permission. <a href="https://potala-voice-demo-2026.ochrescout3.chatgpt.site" target="_blank" rel="noopener noreferrer">Open full page ↗</a></div>
      <p class="demo-note">This is a demonstration. Reservations created here are practice entries in a demo calendar, not restaurant bookings. Starting a conversation uses Vapi call credit.</p>
    </section>
    <section class="lower">
      <div class="steps"><div class="eyebrow">HOW TO DEMONSTRATE</div><div class="step"><b>01</b><span>Choose a future open date and a party of 1–4.</span></div><div class="step"><b>02</b><span>Confirm the proposed time and your demo name.</span></div><div class="step"><b>03</b><span>Check the 90-minute event in the demo Google Calendar.</span></div></div>
      <div class="setup" id="setup"><div class="eyebrow">ONE-TIME BROWSER SETUP</div><p>Use the <strong>public</strong> Vapi key and your Potala assistant ID. These values stay in this browser. Never enter a private API key.</p><label for="public-key">Vapi public key</label><input id="public-key" type="text" spellcheck="false" autocomplete="off" placeholder="Public key" /><label for="assistant-id">Assistant ID</label><input id="assistant-id" type="text" spellcheck="false" autocomplete="off" placeholder="Potala assistant ID" /><button id="save-settings" type="button">Save in this browser</button><p class="setup-feedback" id="setup-feedback" role="status" aria-live="polite"></p></div>
    </section>
    <footer>Potala Reservation Demo <span>Europe/Zurich · Presentation edition</span></footer>
  </main>`;

const keyInput = document.querySelector('#public-key');
const idInput = document.querySelector('#assistant-id');
const saveButton = document.querySelector('#save-settings');
const callButton = document.querySelector('#call-button');
const callTitle = document.querySelector('#call-title');
const callStatus = document.querySelector('#call-status');
const feedback = document.querySelector('#setup-feedback');
const orb = document.querySelector('#orb');
const micButton = document.querySelector('#mic-button');
const micStatus = document.querySelector('#mic-status');
const previewWarning = document.querySelector('#preview-warning');
const embedded = window.self !== window.top;
if (embedded) previewWarning.hidden = false;
keyInput.value = saved.key || '';
idInput.value = saved.assistantId || '';
let vapi = null;
let starting = false;
let inCall = false;

function setStatus(title, detail) { callTitle.textContent = title; callStatus.textContent = detail; }
function resetCall() { starting = false; inCall = false; orb.classList.remove('active'); callButton.disabled = embedded; callButton.innerHTML = 'Start Conversation <span aria-hidden="true">↗</span>'; }
function wire(client) {
  client.on('call-start', () => { starting = false; inCall = true; orb.classList.add('active'); setStatus('Conversation live', 'Speak naturally. Press End Conversation when finished.'); callButton.disabled = false; callButton.textContent = 'End Conversation'; });
  client.on('call-end', () => { resetCall(); setStatus('Conversation ended', 'You can start another call when you choose.'); });
  client.on('error', (error) => { console.error('Vapi call error', error); resetCall(); setStatus('Could not connect', 'Check your public key, assistant ID, microphone permission, and browser connection.'); });
}
function configure() {
  if (!saved.key || !saved.assistantId) { callButton.disabled = true; setStatus('Ready to set up', 'Enter your public key and assistant ID below.'); return; }
  vapi = new Vapi(saved.key);
  wire(vapi);
  callButton.disabled = embedded;
  setStatus('Ready to talk', embedded ? 'Open the full page in a new tab before starting.' : 'Check your microphone below, then click Start Conversation.');
}
micButton.addEventListener('click', async () => {
  micButton.disabled = true;
  micStatus.textContent = 'Requesting microphone access…';
  let stream, context;
  try {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('Microphone access is unavailable in this browser context.');
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);
    const samples = new Float32Array(analyser.fftSize);
    let heardSound = false;
    let loudest = 0;
    const device = stream.getAudioTracks()[0]?.label || 'browser default microphone';
    for (let i = 0; i < 80; i++) {
      if (i % 10 === 0) micStatus.textContent = `Using ${device}. Speak now: “Potala test”. ${8 - i / 10} seconds left…`;
      await new Promise(resolve => setTimeout(resolve, 100));
      analyser.getFloatTimeDomainData(samples);
      let sum = 0;
      for (const sample of samples) sum += sample * sample;
      loudest = Math.max(loudest, Math.sqrt(sum / samples.length));
      if (loudest > 0.004) heardSound = true;
    }
    micStatus.textContent = heardSound ? `Sound detected from ${device}. You can start one short call.` : `No sound detected from ${device}. Check System Settings → Sound → Input, select the microphone you are speaking into, then retry this free check.`;
  } catch (error) {
    micStatus.textContent = 'Microphone could not be used here. Open the full page in a new tab and allow its microphone permission.';
    console.error('Local microphone check failed', error);
  } finally {
    stream?.getTracks().forEach(track => track.stop());
    await context?.close();
    micButton.disabled = false;
  }
});
saveButton.addEventListener('click', () => {
  const key = keyInput.value.trim();
  const assistantId = idInput.value.trim();
  if (!key || !assistantId) { feedback.textContent = 'Enter both values to continue.'; return; }
  if (inCall || starting) { feedback.textContent = 'End the current conversation before changing setup.'; return; }
  saved = { key, assistantId };
  localStorage.setItem(storageKey, JSON.stringify(saved));
  feedback.textContent = 'Saved in this browser. No call has started.';
  configure();
});
callButton.addEventListener('click', async () => {
  if (!vapi || starting || embedded) return;
  if (inCall) { callButton.disabled = true; setStatus('Ending conversation', 'Disconnecting…'); vapi.stop(); return; }
  starting = true;
  callButton.disabled = true;
  setStatus('Connecting', 'Allow microphone access if your browser asks.');
  try { await vapi.start(saved.assistantId); }
  catch (error) { console.error('Vapi start failed', error); resetCall(); setStatus('Could not start', 'Check the public key, assistant ID, microphone permission, and browser connection.'); }
});
configure();
