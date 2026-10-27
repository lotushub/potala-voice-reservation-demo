import Vapi from '@vapi-ai/web';
import './style.css';
import './audio-check.css';

const app = document.querySelector('#app');
const storageKey = 'potala-demo-vapi-settings-v1';
let saved = {};
try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { saved = {}; }

app.innerHTML = `
<header class="topbar"><div class="topbar-inner"><a class="brand-lockup" href="#" aria-label="Potala Startseite"><span class="brand-mark">✦</span><span class="brand">POTALA <small>RESTAURANT · OLTEN</small></span></a><span class="badge">SPRACHDEMO</span></div></header>
<main><section class="hero" aria-labelledby="hero-title"><div class="hero-shade"></div><div class="hero-copy"><span class="eyebrow">EIN TISCH BEGINNT MIT EINEM GESPRÄCH</span><h1 id="hero-title">Einfach sprechen.<br>Den Tisch reservieren.</h1><p>Ihr KI-Reservierungsassistent für Potala.<br>Auf Deutsch oder Englisch.</p><button class="hero-link" id="open-voice" type="button">Sprachdemo starten <span aria-hidden="true">↗</span></button><p class="hero-disclosure">Testversion · Keine echte Restaurantreservierung</p></div></section>
<section class="quiet-footer shell"><p>Reservieren oder eine bestehende Testbuchung ändern.<br>Der Assistent führt Sie durch das Gespräch.</p><button class="text-button" id="open-settings" type="button">Demo einrichten</button></section></main>
<footer><div class="shell footer-grid"><div><strong>Potala Restaurant</strong><span>Olten · Schweiz</span></div><a href="https://www.potalarestaurant.com/" target="_blank" rel="noopener noreferrer">Zur Restaurantseite ↗</a></div></footer>
<dialog id="voice-dialog" aria-labelledby="call-title"><div class="voice-surface"><div class="voice-top"><span>POTALA · VOICE</span><button class="close-voice" id="close-voice" type="button" aria-label="Sprachfenster schliessen">×</button></div><div class="voice-center"><div class="orb-wrap"><div class="orb" id="orb" aria-hidden="true"><div class="orb-inner"></div></div></div><h2 id="call-title">Bereit zum Gespräch</h2><p id="call-status" role="status" aria-live="polite">Starten Sie Ihr Gespräch.</p><button id="call-button" class="call-button" type="button" disabled>Gespräch starten</button><p class="demo-note">Demo-Kalender · Keine echte Restaurantreservierung<br>Live-Anrufe verbrauchen Vapi- und Make-Guthaben.</p></div>
<div id="preview-warning" class="preview-warning" hidden>Bitte öffnen Sie die vollständige Seite in einem eigenen Browser-Tab für den Mikrofonzugriff.</div>
<details id="voice-settings"><summary>Verbindung &amp; Mikrofon</summary><div class="setup" id="setup"><p>Einmalig den eingeschränkten öffentlichen Vapi-Schlüssel und die Assistant ID eingeben. Niemals einen privaten API-Schlüssel verwenden. Für Testbuchungen bitte erfundene Angaben nutzen.</p><label for="public-key">Öffentlicher Vapi-Schlüssel</label><input id="public-key" type="password" autocomplete="off" spellcheck="false"><label for="assistant-id">Assistant ID</label><input id="assistant-id" type="text" autocomplete="off" spellcheck="false"><button id="save-settings" type="button">In diesem Browser speichern</button><p id="setup-feedback" class="setup-feedback" role="status"></p><div class="audio-check"><p id="mic-status" role="status">Der Mikrofontest ist kostenlos und startet keinen Anruf.</p><button id="mic-button" type="button">Mikrofon prüfen</button></div></div></details></div></dialog>`;

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
function resetCall() { starting = false; inCall = false; orb.classList.remove('active', 'speaking', 'connecting'); orb.style.setProperty('--voice-scale','1'); callButton.disabled = embedded || !vapi; callButton.innerHTML = 'Gespräch starten <span aria-hidden="true">↗</span>'; }
function wire(client) {
  client.on('call-start', () => { if (!voiceDialog.open) { client.stop(); return; } orb.classList.remove('connecting'); starting = false; inCall = true; orb.classList.add('active'); setStatus('Gespräch läuft', 'Sprechen Sie frei. Beenden Sie das Gespräch mit dem Knopf.'); callButton.disabled = false; callButton.textContent = 'Gespräch beenden'; });
  client.on('speech-start', () => { if(inCall) { orb.classList.add('speaking'); setStatus('Potala spricht', 'Sie können jederzeit antworten.'); } });
  client.on('speech-end', () => { if(inCall) { orb.classList.remove('speaking'); setStatus('Ich höre zu', 'Sprechen Sie in Ihrem eigenen Tempo.'); } });
  client.on('volume-level', volume => { if(inCall) orb.style.setProperty('--voice-scale', String(1 + Math.min(1, Math.max(0, Number(volume) || 0)) * .2)); });
  client.on('call-end', () => { resetCall(); setStatus('Gespräch beendet', 'Sie können später erneut starten.'); });
  client.on('error', (error) => { console.error('Vapi call error', error); resetCall(); setStatus('Verbindung fehlgeschlagen', 'Bitte öffentlichen Schlüssel, Assistant ID, Mikrofonberechtigung und Internetverbindung prüfen.'); });
}
function configure() {
  if (!saved.key || !saved.assistantId) { vapi = null; callButton.disabled = true; setStatus('Einrichtung nötig', 'Öffnen Sie Verbindung & Mikrofon und geben Sie die Zugangsdaten ein.'); return; }
  vapi = new Vapi(saved.key);
  wire(vapi);
  callButton.disabled = embedded;
  setStatus('Bereit zum Gespräch', embedded ? 'Öffnen Sie die vollständige Seite in einem neuen Tab.' : 'Prüfen Sie das Mikrofon und klicken Sie auf Gespräch starten.');
}
micButton.addEventListener('click', async () => {
  micButton.disabled = true;
  micStatus.textContent = 'Mikrofonzugriff wird angefragt…';
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
      if (i % 10 === 0) micStatus.textContent = `Mikrofon: ${device}. Sprechen Sie jetzt. Noch ${8 - i / 10} Sekunden…`;
      await new Promise(resolve => setTimeout(resolve, 100));
      analyser.getFloatTimeDomainData(samples);
      let sum = 0;
      for (const sample of samples) sum += sample * sample;
      loudest = Math.max(loudest, Math.sqrt(sum / samples.length));
      if (loudest > 0.004) heardSound = true;
    }
    micStatus.textContent = heardSound ? `Ton erkannt über ${device}. Sie können einen kurzen Anruf starten.` : `Kein Ton über ${device} erkannt. Bitte System-Einstellungen → Ton → Eingabe prüfen und diesen kostenlosen Test wiederholen.`;
  } catch (error) {
    micStatus.textContent = 'Mikrofon nicht verfügbar. Öffnen Sie die vollständige Seite in einem neuen Tab und erlauben Sie den Zugriff.';
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
  if (!key || !assistantId) { feedback.textContent = 'Bitte beide Werte eingeben.'; return; }
  if (inCall || starting) { feedback.textContent = 'Bitte zuerst das laufende Gespräch beenden.'; return; }
  saved = { key, assistantId };
  localStorage.setItem(storageKey, JSON.stringify(saved));
  feedback.textContent = 'In diesem Browser gespeichert. Es wurde kein Anruf gestartet.';
  configure();
});
callButton.addEventListener('click', async () => {
  if (!vapi || starting || embedded) return;
  if (inCall) { callButton.disabled = true; setStatus('Gespräch wird beendet', 'Verbindung wird getrennt…'); vapi.stop(); return; }
  starting = true;
  orb.classList.add('connecting');
  callButton.disabled = true;
  setStatus('Verbindung wird aufgebaut', 'Bitte erlauben Sie gegebenenfalls den Mikrofonzugriff.');
  try { await vapi.start(saved.assistantId); if (!voiceDialog.open) vapi.stop(); }
  catch (error) { console.error('Vapi start failed', error); resetCall(); setStatus('Start fehlgeschlagen', 'Bitte öffentlichen Schlüssel, Assistant ID, Mikrofon und Internetverbindung prüfen.'); }
});
configure();

const voiceDialog = document.querySelector('#voice-dialog');
const settingsPanel = document.querySelector('#voice-settings');
function openVoice(autoStart = false) {
  if (!voiceDialog.open) voiceDialog.showModal();
  if (!vapi || !autoStart) settingsPanel.open = !vapi || !autoStart;
  if (autoStart && vapi && !starting && !inCall) callButton.click();
}
document.querySelector('#open-voice').addEventListener('click', () => openVoice(true));
document.querySelector('#open-settings').addEventListener('click', () => openVoice(false));
function closeVoice() { if (starting || inCall) vapi?.stop(); voiceDialog.close(); }
document.querySelector('#close-voice').addEventListener('click', closeVoice);
voiceDialog.addEventListener('cancel', event => { event.preventDefault(); closeVoice(); });
