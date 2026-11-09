/* Shared sound effects for Practice Hacks.
   All sounds are synthesized with the Web Audio API (no audio files).
   Usage in a game:  <script src="../sfx.js"></script>  then  SFX.play('ok')
   Volume / mute live in localStorage and apply to every game. */
(function(){
  const store = {
    get(k, d){ try{ const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); }catch(e){ return d; } },
    set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
  };
  let volume = store.get('sfx.volume', 0.6);
  let muted = store.get('sfx.muted', false);
  let ctx = null, master = null, noiseBuf = null;

  function ensure(){
    if (!ctx){
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.connect(ctx.destination);
      applyVolume();
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 1, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }
  function applyVolume(){ if (master) master.gain.value = muted ? 0 : volume * volume; }
  ['pointerdown', 'keydown', 'touchstart'].forEach(ev => window.addEventListener(ev, ensure, {capture:true, passive:true}));

  // ---- primitives ----
  function tone(freq, dur, {type = 'sine', gain = 0.2, attack = 0.004, slide = null, delay = 0, filter = null} = {}){
    const c = ensure(); if (!c || muted) return;
    const t = c.currentTime + delay;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = o;
    if (filter){ const f = c.createBiquadFilter(); f.type = filter.type || 'lowpass'; f.frequency.value = filter.freq; o.connect(f); node = f; }
    node.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(dur, {gain = 0.15, type = 'bandpass', freq = 1200, to = null, q = 1, delay = 0, attack = 0.004} = {}){
    const c = ensure(); if (!c || muted) return;
    const t = c.currentTime + delay;
    const s = c.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    const f = c.createBiquadFilter(); f.type = type; f.Q.value = q; f.frequency.setValueAtTime(freq, t);
    if (to) f.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
  }
  const seq = (notes, step, opts) => notes.forEach((n, i) => tone(n, step * 1.6, {...opts, delay: i * step}));

  // ---- sound library ----
  const SOUNDS = {
    click:    () => tone(1900, 0.03, {type:'square', gain:0.06}),
    tick:     () => tone(1250, 0.025, {type:'triangle', gain:0.1}),
    urgent:   () => { tone(1700, 0.05, {type:'square', gain:0.07}); tone(850, 0.05, {type:'sine', gain:0.08}); },
    blip:     () => tone(700 + Math.random() * 500, 0.05, {type:'sine', gain:0.05}),
    select:   () => tone(660, 0.08, {type:'sine', gain:0.16, slide:990}),
    ok:       () => { tone(880, 0.07, {type:'sine', gain:0.15}); tone(1320, 0.09, {type:'sine', gain:0.13, delay:0.06}); },
    bad:      () => { tone(150, 0.28, {type:'sawtooth', gain:0.16, filter:{freq:900}}); tone(112, 0.28, {type:'square', gain:0.08, filter:{freq:700}}); },
    thud:     () => { tone(130, 0.14, {type:'sine', gain:0.3, slide:55}); noise(0.08, {gain:0.12, type:'lowpass', freq:500}); },
    lock:     () => { tone(320, 0.07, {type:'square', gain:0.1, slide:150, filter:{freq:1500}}); noise(0.05, {gain:0.14, freq:2200, q:2}); },
    open:     () => noise(0.16, {gain:0.12, freq:500, to:2600, q:1.4}),
    close:    () => noise(0.14, {gain:0.11, freq:2400, to:450, q:1.4}),
    pop:      () => tone(520, 0.06, {type:'sine', gain:0.16, slide:1150}),
    stage:    () => seq([660, 880, 1175], 0.07, {type:'triangle', gain:0.16}),
    win:      () => seq([523, 659, 784, 1047, 1319], 0.085, {type:'triangle', gain:0.17}),
    lose:     () => seq([392, 311, 233], 0.16, {type:'sawtooth', gain:0.12, filter:{freq:1200}}),
    key:      () => { noise(0.018, {gain:0.08, type:'highpass', freq:3200}); tone(1800 + Math.random() * 600, 0.012, {type:'square', gain:0.025}); },
    enter:    () => { noise(0.03, {gain:0.1, type:'highpass', freq:2200}); tone(1000, 0.03, {type:'square', gain:0.04}); },
    cycle:    () => tone(980, 0.035, {type:'triangle', gain:0.1, slide:1250}),
    confirm:  () => { tone(740, 0.06, {type:'square', gain:0.07, filter:{freq:2500}}); tone(1110, 0.1, {type:'square', gain:0.06, delay:0.06, filter:{freq:2500}}); },
    granted:  () => seq([784, 1047, 1568], 0.1, {type:'sine', gain:0.18}),
    denied:   () => { tone(220, 0.38, {type:'square', gain:0.09, filter:{freq:1000}}); tone(165, 0.38, {type:'square', gain:0.09, delay:0.16, filter:{freq:900}}); },
    start:    () => seq([440, 660], 0.06, {type:'triangle', gain:0.12}),
    glitch:   () => { noise(0.09, {gain:0.16, type:'highpass', freq:2800}); tone(96, 0.12, {type:'square', gain:0.1, filter:{freq:900}}); noise(0.05, {gain:0.12, freq:900, q:4, delay:0.11}); },
    haunt:    () => { tone(55, 7, {type:'sawtooth', gain:0.11, attack:1.2, filter:{freq:260}}); tone(58.3, 7, {type:'sawtooth', gain:0.08, attack:1.8, filter:{freq:220}});
                      tone(77.8, 6.5, {type:'sine', gain:0.07, attack:2.5, delay:0.5}); tone(1244, 4, {type:'sine', gain:0.012, attack:1.5, slide:1109, delay:2.4});
                      noise(6, {gain:0.02, freq:400, to:1800, q:3, attack:2}); },
  };

  // countdown helper: call every frame with seconds left; ticks once per second in the last `from` seconds
  let lastWhole = null;
  function countdown(left, from = 10){
    const whole = Math.ceil(left);
    if (left <= 0 || left > from){ lastWhole = whole; return; }
    if (lastWhole !== null && whole < lastWhole) SOUNDS.urgent();
    lastWhole = whole;
  }
  function resetCountdown(){ lastWhole = null; }

  window.SFX = {
    play(name){ try{ if (!muted && SOUNDS[name]) SOUNDS[name](); }catch(e){} },
    countdown, resetCountdown,
    get muted(){ return muted; },
    setMuted(m){ muted = !!m; store.set('sfx.muted', muted); applyVolume(); syncUI(); },
    setVolume(v){ volume = Math.max(0, Math.min(1, v)); store.set('sfx.volume', volume); if (volume > 0 && muted) muted = false, store.set('sfx.muted', false); applyVolume(); syncUI(); },
  };

  // ---- floating sound control ----
  let btn, slider;
  function syncUI(){
    if (!btn) return;
    const off = muted || volume === 0;
    btn.innerHTML = off
      ? '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H3v6h3l5 4V5z"/><path d="M22 9l-6 6M16 9l6 6"/></svg>'
      : '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
    btn.title = off ? 'Sound off (M)' : 'Sound on (M)';
    btn.setAttribute('aria-pressed', String(!off));
    slider.value = Math.round(volume * 100);
  }
  function mountUI(){
    const css = document.createElement('style');
    css.textContent = `.sfx-ctl{position:fixed;right:14px;bottom:14px;z-index:9999;display:flex;align-items:center;gap:8px;padding:6px 10px 6px 6px;
      background:rgba(22,23,27,.92);border:1px solid #3a3b40;border-radius:999px;box-shadow:0 6px 20px rgba(0,0,0,.4);font:12px system-ui,sans-serif;color:#ccc}
      .sfx-ctl button{width:32px;height:32px;border-radius:50%;border:1px solid #44454b;background:#26272c;color:#eee;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0}
      .sfx-ctl button:hover{border-color:#777}
      .sfx-ctl input{width:90px;accent-color:#ffb000}
      @media (max-width:520px){.sfx-ctl input{width:64px}}`;
    document.head.appendChild(css);
    const wrap = document.createElement('div'); wrap.className = 'sfx-ctl';
    btn = document.createElement('button'); btn.type = 'button';
    slider = document.createElement('input'); slider.type = 'range'; slider.min = 0; slider.max = 100; slider.setAttribute('aria-label', 'Sound volume');
    btn.addEventListener('click', e => { e.stopPropagation(); ensure(); SFX.setMuted(!(muted || volume === 0)); if (volume === 0) SFX.setVolume(0.6); btn.blur(); if (!muted) SOUNDS.tick(); });
    slider.addEventListener('input', () => SFX.setVolume(slider.value / 100));
    slider.addEventListener('change', () => { slider.blur(); SOUNDS.tick(); });
    ['pointerdown', 'keydown'].forEach(ev => wrap.addEventListener(ev, e => e.stopPropagation()));
    wrap.append(btn, slider);
    document.body.appendChild(wrap);
    syncUI();
  }
  window.addEventListener('keydown', e => {
    const tag = e.target && e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key === 'm' || e.key === 'M') SFX.setMuted(!muted);
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountUI); else mountUI();
})();
