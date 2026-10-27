import Vapi from '@vapi-ai/web';
import './style.css';
import './audio-check.css';

const app = document.querySelector('#app');
const storageKey = 'potala-demo-vapi-settings-v1';
let saved = {};
try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { saved = {}; }

app.innerHTML = `
  <header class="topbar" id="top">
    <div class="topbar-inner">
      <a class="brand-lockup" href="#top" aria-label="Potala Demo Startseite"><span class="brand-mark">✦</span><span class="brand">POTALA <small>RESTAURANT · OLTEN</small></span></a>
      <nav aria-label="Seitennavigation"><a href="#experience">Sprachdemo</a><a href="#hours">Öffnungszeiten</a><a href="https://www.potalarestaurant.com/" target="_blank" rel="noopener noreferrer">Restaurant ↗</a></nav>
      <span class="badge">TESTVERSION</span>
    </div>
  </header>
  <main>
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-shade"></div>
      <div class="hero-copy">
        <span class="eyebrow">POTALA RESTAURANT · OLTEN</span>
        <h1 id="hero-title">Tibetische &amp;<br>Asiatische Spezialitäten</h1>
        <p>Ein Tisch beginnt mit einem Gespräch. Entdecken Sie unseren KI-Reservierungsassistenten als Testversion.</p>
        <a class="hero-link" href="#experience">Sprachdemo starten <span aria-hidden="true">↗</span></a>
      </div>
    </section>
    <div class="brand-ribbon"><span>✦</span> P O T A L A <span>✦</span></div>
    <section class="experience shell" id="experience">
      <div class="section-heading"><span class="eyebrow">EINE RESERVIERUNG IM GESPRÄCH</span><h2>Sprechen Sie mit unserem Assistenten.</h2><p>Fragen Sie auf Deutsch oder Englisch nach einem freien Termin, oder ändern Sie eine bestehende Testbuchung.</p></div>
      <div class="call-panel"><div class="orb-wrap"><div class="orb" id="orb"><div class="orb-inner"></div></div></div><div class="call-copy"><div class="kicker">POTALA SPRACHASSISTENT</div><h3 id="call-title">Bereit zum Gespräch</h3><p id="call-status" role="status" aria-live="polite">Richten Sie diesen Browser einmal ein und starten Sie dann das Gespräch.</p></div><button id="call-button" class="call-button" type="button" disabled>Gespräch starten <span aria-hidden="true">↗</span></button></div>
      <div class="audio-check" id="audio-check"><div><strong>Mikrofon zuerst prüfen</strong><p id="mic-status" role="status" aria-live="polite">Dieser lokale Test startet keinen Vapi-Anruf und kostet kein Guthaben.</p></div><button id="mic-button" type="button">Mikrofon prüfen</button></div>
      <div class="preview-warning" id="preview-warning" hidden>Bitte öffnen Sie die Potala-Seite vor einem Anruf in einem eigenen Browser-Tab. In dieser Vorschau kann der Mikrofonzugriff anders funktionieren. <a href="https://potala-voice-demo-2026.ochrescout3.chatgpt.site" target="_blank" rel="noopener noreferrer">Vollständige Seite öffnen ↗</a></div>
      <p class="demo-note">Dies ist eine Testversion mit einem separaten Demo-Kalender. Es wird keine echte Restaurantreservierung vorgenommen. Ein Anruf verbraucht Vapi-Guthaben.</p>
    </section>
    <section class="story-band"><div class="shell story-grid">
      <div class="steps"><span class="eyebrow">SO FUNKTIONIERT DIE DEMO</span><h2>Von der Anfrage<br>zum Kalender.</h2><div class="step"><b>01</b><span>Wählen Sie ein zukünftiges Datum, eine Uhrzeit und 1–4 Personen.</span></div><div class="step"><b>02</b><span>Geben Sie einen Testnamen und eine Telefonnummer mit Landesvorwahl an und bestätigen Sie die Angaben.</span></div><div class="step"><b>03</b><span>Bei Erfolg wird ein 90-minütiger Testtermin gespeichert und eine 8-stellige Buchungsreferenz ohne Bindestriche genannt.</span></div></div>
      <div class="hours" id="hours"><span class="eyebrow">MÖGLICHE STARTZEITEN IN DER DEMO</span><h2>Öffnungszeiten</h2><div class="hours-row"><span>Montag</span><strong>Geschlossen</strong></div><div class="hours-row"><span>Dienstag – Freitag</span><strong>11:30–12:30 · 17:00–20:30</strong></div><div class="hours-row"><span>Samstag</span><strong>17:00–20:30</strong></div><div class="hours-row"><span>Sonntag</span><strong>17:00–19:30</strong></div><p>Startzeiten im 30-Minuten-Takt. Diese Regeln gelten für die Demo und garantieren keinen freien Tisch.</p></div>
    </div></section>
    <section class="setup-band shell"><div class="setup-intro"><span class="eyebrow">FÜR EINGELADENE TESTPERSONEN</span><h2>Einmalig im Browser einrichten</h2><p>Der Gastgeber gibt Ihnen einen eingeschränkten <strong>öffentlichen Vapi-Schlüssel</strong> und die Assistant ID. Nur in diesem Browser speichern. Bitte niemals einen privaten API-Schlüssel eingeben.</p><p class="small-note">Für eine Testbuchung ist eine Telefonnummer erforderlich. Sie wird im Demo-Kalendereintrag gespeichert. Für Demo-Änderungen genügt die Buchungsreferenz oder die gespeicherte Telefonnummer. Es muss genau eine Buchung gefunden werden; mehrere Treffer werden nicht automatisch geändert. Verwenden Sie für Tests erfundene Angaben.</p></div><div class="setup" id="setup"><label for="public-key">Öffentlicher Vapi-Schlüssel</label><input id="public-key" type="text" spellcheck="false" autocomplete="off" placeholder="Vom Gastgeber erhalten" /><label for="assistant-id">Assistant ID</label><input id="assistant-id" type="text" spellcheck="false" autocomplete="off" placeholder="Potala Assistant ID" /><button id="save-settings" type="button">In diesem Browser speichern</button><p class="setup-feedback" id="setup-feedback" role="status" aria-live="polite"></p></div></section>
  </main>
  <footer><div class="shell footer-grid"><div><strong>Potala Restaurant</strong><span>Neuhardstrasse 20 · 4600 Olten</span></div><div><strong>Demo-Reservierungen</strong><span>Europe/Zurich · Keine echten Buchungen</span></div><a href="https://www.potalarestaurant.com/" target="_blank" rel="noopener noreferrer">Zur Restaurantseite ↗</a></div></footer>`;

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
function resetCall() { starting = false; inCall = false; orb.classList.remove('active'); callButton.disabled = embedded || !vapi; callButton.innerHTML = 'Gespräch starten <span aria-hidden="true">↗</span>'; }
function wire(client) {
  client.on('call-start', () => { starting = false; inCall = true; orb.classList.add('active'); setStatus('Gespräch läuft', 'Sprechen Sie frei. Beenden Sie das Gespräch mit dem Knopf.'); callButton.disabled = false; callButton.textContent = 'Gespräch beenden'; });
  client.on('call-end', () => { resetCall(); setStatus('Gespräch beendet', 'Sie können später erneut starten.'); });
  client.on('error', (error) => { console.error('Vapi call error', error); resetCall(); setStatus('Verbindung fehlgeschlagen', 'Bitte öffentlichen Schlüssel, Assistant ID, Mikrofonberechtigung und Internetverbindung prüfen.'); });
}
function configure() {
  if (!saved.key || !saved.assistantId) { vapi = null; callButton.disabled = true; setStatus('Einrichtung nötig', 'Bitte unten den öffentlichen Schlüssel und die Assistant ID eingeben.'); return; }
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
  callButton.disabled = true;
  setStatus('Verbindung wird aufgebaut', 'Bitte erlauben Sie gegebenenfalls den Mikrofonzugriff.');
  try { await vapi.start(saved.assistantId); }
  catch (error) { console.error('Vapi start failed', error); resetCall(); setStatus('Start fehlgeschlagen', 'Bitte öffentlichen Schlüssel, Assistant ID, Mikrofon und Internetverbindung prüfen.'); }
});
configure();
