/* Blinking-eye favicon: swaps the tab icon through a few eyelid frames every few seconds.
   Browsers only show still SVG favicons, so the animation is done by changing the icon from script.
   Safari ignores favicon changes and simply shows the open eye. */
(function(){
  function eye(o){                       // o = how open the eye is, 0..1
    const t = (32 - 30 * o).toFixed(1), b = (32 + 30 * o).toFixed(1);
    const lid = `M6 32 Q32 ${t} 58 32 Q32 ${b} 6 32 Z`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22262e"/><stop offset="1" stop-color="#0e1014"/></linearGradient>
<linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc533"/><stop offset="1" stop-color="#f59a00"/></linearGradient>
<clipPath id="c"><path d="${lid}"/></clipPath></defs>
<rect x="1.5" y="1.5" width="61" height="61" rx="14" fill="url(#g)" stroke="#ffb000" stroke-width="3"/>
<path d="${lid}" fill="url(#a)"/>
<g clip-path="url(#c)"><circle cx="32" cy="32" r="11" fill="#14171c"/><circle cx="32" cy="32" r="4.4" fill="#ffb000"/><circle cx="35.5" cy="28.5" r="2" fill="#fff" opacity=".8"/></g>
${o < 0.15 ? '<path d="M7 32 Q32 41 57 32" fill="none" stroke="#ffb000" stroke-width="3.6" stroke-linecap="round"/>' : ''}
</svg>`;
  }
  if (typeof module !== 'undefined') { module.exports = eye; return; }   // lets the build make favicon.svg from the same drawing
  const url = o => 'data:image/svg+xml,' + encodeURIComponent(eye(o));
  const FRAMES = [1, 0.55, 0.12, 0, 0.12, 0.55, 1].map(url);
  document.querySelectorAll('link[rel~="icon"]').forEach(l => l.remove());
  const link = document.createElement('link');
  link.rel = 'icon'; link.type = 'image/svg+xml'; link.href = FRAMES[0];
  document.head.appendChild(link);
  function blink(){
    let i = 0;
    const step = () => { link.href = FRAMES[i++]; if (i < FRAMES.length) setTimeout(step, 45); };
    step();
    const twice = Math.random() < 0.2;                       // now and then a quick double blink
    setTimeout(blink, twice ? 450 : 2500 + Math.random() * 3500);
  }
  setTimeout(blink, 1500);
})();
