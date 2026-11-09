/* After someone has seen the USB hack's hidden ending, the site "remembers" them:
   the next page they open shows a brief watching eye and a message, and later visits
   sometimes do too. Everything is stored in this browser only (localStorage key "ph.watch"). */
(function(){
  let w;
  try{ w = JSON.parse(localStorage.getItem('ph.watch') || 'null'); }catch(e){ return; }
  if (!w || !w.seen) return;
  const first = !!w.pending;
  if (!first && Math.random() > 0.3) return;
  try{ w.pending = false; localStorage.setItem('ph.watch', JSON.stringify(w)); }catch(e){}

  const LINES = ['WELCOME BACK, OPERATOR.', 'WE SAW WHAT YOU DID.', 'STILL WATCHING.', 'YOU CAME BACK.', 'WE NEVER LEFT.'];
  const text = first ? LINES[0] : LINES[Math.random() * LINES.length | 0];
  setTimeout(run, first ? 1500 : 2500 + Math.random() * 7000);

  function run(){
    if (document.querySelector('.hx')) return;          // hidden ending already on screen
    const css = document.createElement('style');
    css.textContent = `
      .pw-flash{position:fixed;inset:0;z-index:99998;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(60,240,124,.07) 0 1px,transparent 1px 3px);animation:pwFlash .5s steps(4) forwards}
      @keyframes pwFlash{0%{opacity:1;transform:translateX(-6px)}50%{opacity:.4;transform:translateX(5px)}100%{opacity:0;transform:none}}
      .pw{position:fixed;z-index:99999;pointer-events:none;display:flex;flex-direction:column;align-items:center;gap:6px;
        font:600 13px "Lucida Console","Courier New",monospace;letter-spacing:.14em;color:#7dffae;text-shadow:0 0 8px rgba(60,240,124,.9)}
      .pw svg{width:112px;height:56px;overflow:visible;filter:drop-shadow(0 0 8px rgba(60,240,124,.7))}
      .pw .lid{transform-origin:60px 30px;transform:scaleY(0);transition:transform .32s cubic-bezier(.2,.8,.2,1)}
      .pw .txt{min-height:1.2em;white-space:nowrap}
      .pw .txt.g{animation:pwG .2s steps(2) 2}
      @keyframes pwG{0%{transform:translate(-4px,1px) skewX(-15deg);text-shadow:-3px 0 #ff2a4d,3px 0 #9ff}100%{transform:translate(3px,-1px)}}`;
    document.head.appendChild(css);

    const corners = [{top:'18px', left:'18px'}, {top:'18px', right:'18px'}, {bottom:'18px', left:'18px'}];   // bottom-right is the sound control
    const el = document.createElement('div'); el.className = 'pw';
    Object.assign(el.style, corners[Math.random() * corners.length | 0]);
    el.innerHTML = `<svg viewBox="0 0 120 60"><defs>
        <clipPath id="pwClip"><path d="M4 30 Q60 -6 116 30 Q60 66 4 30Z"/></clipPath>
        <radialGradient id="pwIris"><stop offset="0" stop-color="#c8ffdc"/><stop offset=".55" stop-color="#32dc6e"/><stop offset="1" stop-color="#0b4a20"/></radialGradient></defs>
      <g class="lid"><path d="M4 30 Q60 -6 116 30 Q60 66 4 30Z" fill="#010a04"/>
        <g clip-path="url(#pwClip)"><g class="iris"><circle cx="60" cy="30" r="16" fill="url(#pwIris)"/><circle cx="60" cy="30" r="7" fill="#000"/><circle cx="57" cy="27" r="1.6" fill="#e6fff0"/></g></g>
        <path d="M4 30 Q60 -6 116 30 Q60 66 4 30Z" fill="none" stroke="#7dffae" stroke-width="2"/></g></svg><div class="txt"></div>`;
    document.body.appendChild(el);
    const flash = document.createElement('div'); flash.className = 'pw-flash'; document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 600);
    try{ window.SFX && SFX.play('glitch'); }catch(e){}

    const lid = el.querySelector('.lid'), iris = el.querySelector('.iris'), txt = el.querySelector('.txt');
    const setLid = v => { lid.style.transform = `scaleY(${v})`; };
    // pupil follows the cursor
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    const look = () => {
      const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + 28;
      const dx = mx - cx, dy = my - cy, d = Math.hypot(dx, dy) || 1;
      iris.setAttribute('transform', `translate(${(dx / d * 22).toFixed(1)} ${(dy / d * 7).toFixed(1)})`);
    };
    const onMove = e => { mx = e.clientX; my = e.clientY; look(); };
    window.addEventListener('pointermove', onMove);
    look();

    setTimeout(() => setLid(1), 120);
    let i = 0;
    const type = setInterval(() => { i++; txt.textContent = text.slice(0, i); if (i >= text.length) clearInterval(type); }, 55);
    setTimeout(() => { setLid(.06); setTimeout(() => setLid(1), 140); }, 1700);          // blink
    setTimeout(() => txt.classList.add('g'), 2300);
    setTimeout(() => { txt.classList.remove('g'); let j = text.length; const del = setInterval(() => { j -= 2; txt.textContent = text.slice(0, Math.max(0, j)); if (j <= 0) clearInterval(del); }, 25); }, 3000);
    setTimeout(() => setLid(0), 3300);
    setTimeout(() => { window.removeEventListener('pointermove', onMove); el.remove(); css.remove(); }, 3800);
  }
})();
