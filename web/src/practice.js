// Browser-only practice: deliberately no fetch, Vapi or Make API calls.
window.addEventListener('DOMContentLoaded', () => {
 const form=document.querySelector('#practice-form'), status=document.querySelector('#practice-status'), review=document.querySelector('#practice-review'), list=document.querySelector('#practice-list');
 const key='potala-local-practice-v1'; let rows=[],pending;
 try { const stored=JSON.parse(localStorage.getItem(key)||'[]'); if(Array.isArray(stored))rows=stored; }catch{}
 const zurich=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Zurich',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date()).replace(',','');
 const persist=()=>{try{localStorage.setItem(key,JSON.stringify(rows));}catch{status.textContent+=' Browser-Speicherung nicht verfügbar; nur für diese Sitzung.';}render();};
 function render(){list.replaceChildren(); if(!rows.length)list.textContent='Noch keine lokalen Testbuchungen / No local bookings yet.'; for(const r of rows){const p=document.createElement('p');p.className='practice-entry';p.textContent=`${r.reference} · ${r.date} ${r.time} · ${r.guests} Personen · ${r.name} · ${r.phone}`;list.append(p);}}
 const tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);while(tomorrow.getDay()===1)tomorrow.setDate(tomorrow.getDate()+1);form.elements.date.value=tomorrow.toLocaleDateString('sv-SE');
 form.addEventListener('submit',e=>{e.preventDefault();pending=null;review.hidden=true;const d=Object.fromEntries(new FormData(form));for(const k in d)d[k]=d[k].trim();
 if(`${d.date} ${d.time}`<=zurich().slice(0,16)){status.textContent='Bitte eine zukünftige Startzeit wählen / Choose a future start.';return;}
 const day=new Date(d.date+'T12:00:00Z').getUTCDay(); const dinner=['17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30'];const allowed=day===1?[]:day===0?dinner.slice(0,6):day===6?dinner:['11:30','12:00','12:30',...dinner];
 if(!allowed.includes(d.time)){status.textContent='Zu dieser Zeit geschlossen / Closed at this start time. Siehe Startzeiten unten.';return;}
 let existing;if(d.action==='change'){if(!d.reference&&!d.phone){status.textContent='Referenz oder gespeichertes Testtelefon eingeben / Enter reference or saved phone.';return;}const matches=rows.filter(r=>d.reference?r.reference===d.reference.toLowerCase():r.phone===d.phone);if(matches.length!==1){status.textContent=matches.length?'Mehrere Treffer: bitte Referenz verwenden / Use a reference.':'Keine lokale Testbuchung gefunden / No local booking found.';return;}existing=matches[0];d.name=existing.name;d.phone=existing.phone;}
 else if(!d.name||!d.phone){status.textContent='Testname und Testtelefon erforderlich / Demo name and phone required.';return;}
 const start=new Date(d.date+'T'+d.time).getTime(),end=start+90*60000;
 const overlaps=rows.filter(r=>r!==existing&&new Date(r.date+'T'+r.time).getTime()<end&&new Date(r.date+'T'+r.time).getTime()+90*60000>start);
 if(overlaps.length>=15){status.textContent='Alle 15 simulierten Tische belegt / All local simulated tables occupied.';return;}
 pending={d,existing};document.querySelector('#practice-summary').textContent=`${d.action==='book'?'Neue Testbuchung / Book':'Ändern / Change'}: ${d.date}, ${d.time}, ${d.guests} Personen, ${d.name}, ${d.phone}. Nur Simulation. Bestätigen?`;review.hidden=false;status.textContent='Bitte Angaben prüfen / Please review the details.';
 });
 document.querySelector('#practice-confirm').addEventListener('click',()=>{if(!pending)return;const {d,existing}=pending;let reference=existing?.reference;while(!reference||(!existing&&rows.some(r=>r.reference===reference)))reference=crypto.randomUUID().replaceAll('-','').slice(0,8);const record={date:d.date,time:d.time,guests:d.guests,name:d.name,phone:d.phone,reference};if(existing)rows[rows.indexOf(existing)]=record;else rows.push(record);pending=null;review.hidden=true;status.textContent=`Simulation gespeichert / Practice saved. Referenz: ${reference}. Kein Google-Kalendereintrag / No Google Calendar event.`;persist();});
 document.querySelector('#practice-back').addEventListener('click',()=>{pending=null;review.hidden=true;status.textContent='Angaben bearbeiten und erneut prüfen / Edit and review again.';});
 form.addEventListener('input',()=>{pending=null;review.hidden=true;});
 document.querySelector('#practice-reset').addEventListener('click',()=>{rows=[];pending=null;review.hidden=true;status.textContent='Lokale Testbuchungen gelöscht / Local practice cleared.';persist();});render();
});
