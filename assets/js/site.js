(()=>{
'use strict';
const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
const root=document.body.dataset.root||'.';
const theme=$('#themeToggle'),music=$('#musicToggle');
let ctx=null,playing=false,nextPlay=0,seqTimer=null,beat=0;
const notes=[261.63,329.63,392,523.25,392,329.63,293.66,349.23,440,587.33,440,349.23,246.94,329.63,392,493.88];
function tone(freq,at,duration=0.42){
 try{const osc=ctx.createOscillator(),env=ctx.createGain();osc.type='sine';osc.frequency.setValueAtTime(freq,at);env.gain.setValueAtTime(.0001,at);env.gain.exponentialRampToValueAtTime(.025,at+.04);env.gain.exponentialRampToValueAtTime(.0001,at+duration);osc.connect(env);env.connect(ctx.destination);osc.start(at);osc.stop(at+duration+.02);}catch{}
}
function loop(){if(!ctx||!playing)return;while(nextPlay<ctx.currentTime+.8){const n=notes[beat%notes.length];tone(n,nextPlay,.36);if(beat%4===0)tone(n/2,nextPlay,.85);nextPlay+=.45;beat++;}}
function startMusic(){try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;if(!ctx)ctx=new C();ctx.resume();playing=true;nextPlay=ctx.currentTime+.06;loop();clearInterval(seqTimer);seqTimer=setInterval(loop,250);music.textContent='Ⅱ';music.title='Pausar música instrumental';}catch{}}
function stopMusic(){playing=false;clearInterval(seqTimer);music.textContent='♫';music.title='Reproducir música instrumental';}
const preset=localStorage.getItem('finca-theme');if(preset==='dark')document.body.classList.add('dark');
theme?.addEventListener('click',()=>{const isDark=document.body.classList.toggle('dark');localStorage.setItem('finca-theme',isDark?'dark':'light');if(!playing)startMusic();});
music?.addEventListener('click',()=>playing?stopMusic():startMusic());
// The approved logo button opens a full-width, accessible SILO mega-menu on every page.
const mega=$('#megaMenu'),megaTrigger=$('#megaMenuTrigger'),megaClose=$('#megaMenuClose');
function setMega(open){if(!mega)return;mega.hidden=!open;megaTrigger?.setAttribute('aria-expanded',String(open));if(open)megaClose?.focus({preventScroll:true});}
megaTrigger?.addEventListener('click',()=>setMega(mega.hidden));
megaClose?.addEventListener('click',()=>{setMega(false);megaTrigger?.focus({preventScroll:true});});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mega&&!mega.hidden){setMega(false);megaTrigger?.focus({preventScroll:true});}});
// Dedicated official WhatsApp number: DO NOT put a SIE or personal number here.
// Fill only when administration supplies the official contact, digits only with country code.
const officialWhatsApp='';
const waLink=(message)=>`https://wa.me/${officialWhatsApp}?text=${encodeURIComponent(message||'Hola, quiero cotizar un evento en Finca Berthina.')}`;
$$('[data-whatsapp]').forEach(link=>{
 const msg=link.dataset.whatsapp||'Hola, quiero cotizar un evento en Finca Berthina.';
 if(officialWhatsApp){
  if(link.tagName==='A'){link.href=waLink(msg);link.target='_blank';link.rel='noopener noreferrer';}
  if(link.tagName==='BUTTON'){link.addEventListener('click',()=>window.open(waLink(msg),'_blank','noopener'));}
  link.textContent=link.dataset.waLabel||'Enviar por WhatsApp';
 }else{
  if(link.tagName==='A'){link.removeAttribute('target');link.href=`${root}/contacto/`;link.textContent='WhatsApp · número pendiente';}
  if(link.tagName==='BUTTON')link.addEventListener('click',()=>{
   link.insertAdjacentHTML('afterend','<p class="wa-status">Aún no tenemos el número oficial. Puedes escribirnos desde Facebook o preparar tu cotización.</p>');link.disabled=true;
  });
 }
});
// Quote link activates immediately once the verified official number is configured.
const sendQuote=$('#quoteOutput [data-whatsapp]');
quotePlaceholder();
function quotePlaceholder(){if(!sendQuote)return;const msg=$('#quoteText')?.value||'';
 if(officialWhatsApp){sendQuote.href=waLink(msg);sendQuote.target='_blank';sendQuote.rel='noopener noreferrer';sendQuote.textContent='Enviar por WhatsApp ↗';}
 else{sendQuote.href=`${root}/contacto/`;sendQuote.textContent='WhatsApp · pendiente';}
}

// Carousels never advance automatically so the visitor is in control.
$$('[data-carousel]').forEach(car=>{const tr=$('.carousel-track',car);if(!tr)return;let n=0;const max=tr.children.length;function show(v){n=(v+max)%max;tr.style.transform=`translateX(-${n*100}%)`;};const parent=car.parentElement;parent.querySelector('[data-next]')?.addEventListener('click',()=>show(n+1));parent.querySelector('[data-prev]')?.addEventListener('click',()=>show(n-1));let startX=0;car.addEventListener('touchstart',e=>{startX=e.touches[0].clientX},{passive:true});car.addEventListener('touchend',e=>{const diff=e.changedTouches[0].clientX-startX;if(Math.abs(diff)>55)show(n+(diff<0?1:-1));},{passive:true});});
const filter=$('#galleryFilters');filter?.addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;$$('[data-filter]',filter).forEach(x=>x.classList.toggle('active',x===b));$$('[data-cat]').forEach(el=>{el.style.display=b.dataset.filter==='todos'||el.dataset.cat===b.dataset.filter?'':'none';});});
const box=$('#lightbox');$$('[data-zoom]').forEach(item=>item.addEventListener('click',()=>{if(!box)return;const i=$('img',box);i.src=item.dataset.zoom;i.alt=item.querySelector('img')?.alt||'Fotografía real';box.classList.add('open');}));box?.addEventListener('click',e=>{if(e.target===box||e.target.tagName==='BUTTON')box.classList.remove('open')});document.addEventListener('keydown',e=>{if(e.key==='Escape')box?.classList.remove('open');});
const quote=$('#quoteForm');quote?.addEventListener('submit',e=>{e.preventDefault();const form=new FormData(quote);const msg=`Hola, me gustaría solicitar una cotización para Finca Berthina.\n\nNombre: ${form.get('nombre')||'—'}\nContacto: ${form.get('contacto')||'No proporcionado'}\nEvento: ${form.get('tipo')||'Por definir'}\nFecha tentativa: ${form.get('fecha')||'Por definir'}\nInvitados aproximados: ${form.get('personas')||'Por definir'}\nEspacios: ${form.get('espacios')||'Por definir'}\nDetalles: ${form.get('detalles')||'Por definir'}\n\nSolicito información y confirmación de disponibilidad. Sé que los precios y la fecha deben ser autorizados por la administración.`;$('#quoteText').value=msg;$('#quoteOutput').style.display='grid';$('#quoteOutput').scrollIntoView({behavior:'smooth',block:'center'});quotePlaceholder();});$('#copyQuote')?.addEventListener('click',async()=>{const text=$('#quoteText')?.value||'';try{await navigator.clipboard.writeText(text);$('#copyQuote').textContent='Mensaje copiado ✓';}catch{$('#quoteText')?.select();document.execCommand('copy');$('#copyQuote').textContent='Mensaje seleccionado';}});
const chosen=new URLSearchParams(location.search).get('fecha');if(chosen&&$('#qdate')&&/^\d{4}-\d{2}-\d{2}$/.test(chosen))$('#qdate').value=chosen;
const cal=$('#bookingCalendar');if(cal){const now=new Date();now.setHours(0,0,0,0);let y=now.getFullYear(),m=now.getMonth(),selected=null;let busy=[];let updated=false;
fetch(`${root}/data/reservas.json`,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('No disponible');return r.json()}).then(data=>{busy=(data.confirmed_bookings||[]).filter(r=>r.status==='confirmada'&&r.anticipo==='aprobado').map(r=>r.date);updated=!!data.updated_at;$('#calendarStatus').textContent=updated?'Última actualización informada por administración: '+data.updated_at:'Agenda de referencia sin sincronización en tiempo real. Confirma la fecha con administración.';render();}).catch(()=>{$('#calendarStatus').textContent='Agenda aún no sincronizada. Solicita verificación de disponibilidad.';render();});
const months=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];const pad=n=>String(n).padStart(2,'0');const makeDate=d=>`${y}-${pad(m+1)}-${pad(d)}`;function render(){let html='';const dows=['L','M','M','J','V','S','D'];dows.forEach(d=>html+=`<div class="cal-head">${d}</div>`);const start=(new Date(y,m,1).getDay()+6)%7;const days=new Date(y,m+1,0).getDate();for(let i=0;i<start;i++)html+='<div class="cal-day empty"></div>';for(let d=1;d<=days;d++){const date=makeDate(d),past=new Date(y,m,d)<now,occupied=busy.includes(date),sel=selected===date;let klass='cal-day'+(past?' past':'')+(occupied?' confirmed':'')+(sel?' selected':'');html+=`<button type="button" class="${klass}" data-date="${date}" ${past||occupied?'disabled':''} aria-label="${date} ${occupied?'confirmado y ocupado':'solicitar confirmación'}">${d}<small>${occupied?'Ocupada':'Por verificar'}</small></button>`;}cal.innerHTML=html;$('#calTitle').textContent=months[m]+' '+y;$('#calPrev').disabled=y===now.getFullYear()&&m===now.getMonth();}render();
cal.addEventListener('click',e=>{const btn=e.target.closest('[data-date]');if(!btn||btn.disabled)return;selected=btn.dataset.date;$('#calSelectedLabel').textContent='Fecha elegida: '+selected+'. La administración debe confirmar si está libre.';$('#calQuote').href=`${root}/cotizar/?fecha=${selected}`;render();});$('#calPrev')?.addEventListener('click',()=>{if(m===0){m=11;y--}else m--;render()});$('#calNext')?.addEventListener('click',()=>{if(m===11){m=0;y++}else m++;render()});}
})();
