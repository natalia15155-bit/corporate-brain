// Motor de piezas animadas en la estética de las landings de velas.
// Uso: NODE_PATH=$(npm root -g) node render.cjs <A1|B1|B2|B3|A2> <carpeta_salida>
// Renderiza cuadro por cuadro (determinista) y codifica con ffmpeg. No usa créditos ni imágenes ajenas.
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');

const FONTS = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,400..800,100;1,9..144,400..800,100&family=Manrope:wght@400..800&family=Caveat:wght@600;700&display=swap">`;

const PAL = {
  A: { bg: '#140f0b', fg: '#f7f0e6', ac: '#f5a83a', ac2: '#ffd28a', mu: '#bfb0a0', glow: '245,168,58', wax: '#f3e6d2', line: '#3a2c20',
       t1: '#c9b6ea', t2: '#a9c9ad', t3: '#f6c4a2', t4: '#f0aebb', btnfg: '#140f0b' },
  B: { bg: '#1a0f1c', fg: '#fbf1f4', ac: '#ff8fb1', ac2: '#ffc6d7', mu: '#c7b4cb', glow: '255,143,177', wax: '#f6e6ea', line: '#46304e',
       t1: '#c9a8f2', t2: '#a6dcc6', t3: '#f6e38a', t4: '#d8b78c', btnfg: '#1a0f1c', kraft: '#d8b78c', llama: '#f6b24a' },
};

// ---------- ilustraciones SVG (vocabulario de la landing) ----------
function candle(state, o = {}) {
  const w = o.w || 520, wax = o.wax || '#f3e6d2', ds = o.drawStart || 0.4;
  const flame = (lit) => lit ? `<g class="flame"><ellipse cx="200" cy="126" rx="46" ry="62" fill="rgba(255,190,90,.18)"/><path d="M200 84 C228 120 228 150 200 166 C172 150 172 120 200 84 Z" fill="url(#fl)"/><path d="M200 120 C210 134 210 148 200 156 C190 148 190 134 200 120 Z" fill="#fff4d6" opacity=".85"/></g>` : '';
  const top = state === 'sunk'
    ? `M76 200 Q130 204 160 246 Q200 312 240 246 Q270 204 324 200 L324 470 Q324 484 310 484 L90 484 Q76 484 76 470 Z`
    : `M76 200 H324 V470 Q324 484 310 484 H90 Q76 484 76 470 Z`;
  let extra = '', lit = false;
  if (state === 'sunk') extra = `<path d="M200 270 Q216 238 238 244" stroke="#3a2c20" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  else {
    extra = `<line x1="200" y1="200" x2="200" y2="166" stroke="#3a2c20" stroke-width="5" stroke-linecap="round"/>`;
    if (state === 'cracked') { lit = true; extra += `<g stroke="#7a6450" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path data-draw="${ds}" d="M200 200 L186 238 L210 268 L190 308 L206 346"/><path data-draw="${ds + 0.5}" d="M186 238 L158 258"/><path data-draw="${ds + 0.7}" d="M210 268 L244 282"/></g>`; }
    if (state === 'noaroma') { lit = true; extra += `<g stroke="#bfb0a0" stroke-width="5" fill="none" stroke-dasharray="4 12" stroke-linecap="round" opacity=".5"><path d="M150 70 q16 -18 0 -36 t0 -36"/><path d="M200 50 q16 -18 0 -36"/><path d="M250 70 q16 -18 0 -36 t0 -36"/></g>`; }
    if (state === 'good') { lit = true; extra += `<g stroke="#ffd28a" stroke-width="5" fill="none" stroke-linecap="round" opacity=".75"><path d="M146 70 q16 -18 0 -36"/><path d="M200 44 q16 -18 0 -36"/><path d="M254 70 q16 -18 0 -36"/></g>`; }
    if (state === 'sweat') extra += [[128, 214, 8], [178, 209, 6], [238, 215, 9], [292, 210, 6], [108, 300, 5], [300, 380, 7], [120, 420, 6]].map(([x, y, r]) => `<g><circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,255,255,.85)"/><circle cx="${x - r / 3}" cy="${y - r / 3}" r="${r / 3}" fill="#fff"/></g>`).join('');
    if (state === 'stains') extra += `<g><ellipse cx="116" cy="330" rx="26" ry="44" fill="rgba(122,92,60,.38)"/><ellipse cx="288" cy="410" rx="30" ry="36" fill="rgba(122,92,60,.32)"/><ellipse cx="256" cy="300" rx="18" ry="26" fill="rgba(255,255,255,.55)"/><ellipse cx="150" cy="430" rx="22" ry="16" fill="rgba(122,92,60,.28)"/></g>`;
  }
  return `<svg viewBox="0 0 400 520" width="${w}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd28a"/><stop offset="1" stop-color="#f5a83a"/></linearGradient></defs>
  <ellipse cx="200" cy="500" rx="170" ry="14" fill="rgba(0,0,0,.35)"/>
  <rect x="60" y="170" width="280" height="324" rx="36" fill="rgba(255,255,255,.07)" stroke="rgba(247,240,230,.55)" stroke-width="4"/>
  <path d="${top}" fill="${wax}"/>
  ${extra}${flame(lit)}</svg>`;
}
function soaps(w = 560) {
  const P = PAL.A; const bars = [[30, 40, P.t1, -4], [200, 30, P.t3, 3], [40, 150, P.t2, 2], [210, 150, P.t4, -3]];
  return `<svg viewBox="0 0 400 290" width="${w}" xmlns="http://www.w3.org/2000/svg">${bars.map(([x, y, c, r]) => `<g transform="rotate(${r} ${x + 80} ${y + 50})"><rect x="${x}" y="${y}" width="160" height="100" rx="16" fill="${c}"/><rect x="${x + 10}" y="${y + 10}" width="140" height="80" rx="10" fill="none" stroke="rgba(20,15,11,.18)" stroke-width="3" stroke-dasharray="3 7"/></g>`).join('')}</svg>`;
}
const draw = (s, e = 99) => ``;

// ---------- motor de animación (en la página) ----------
const ENGINE = `
const ease=t=>1-Math.pow(1-t,3);
function setTime(t){
  document.querySelectorAll('[data-s]').forEach(el=>{
    const s=+el.dataset.s, e=el.dataset.e===undefined?1e9:+el.dataset.e;
    const dur=+(el.dataset.d||0.45);
    const a=Math.min(1,Math.max(0,(t-s)/dur)), o=Math.min(1,Math.max(0,(e-t)/0.3));
    const vis=t>=s&&t<e;
    el.style.opacity=vis?Math.min(ease(a),o):0;
    const rise=(1-ease(a))*(+(el.dataset.rise===undefined?34:el.dataset.rise));
    const pop=(1-ease(a))*(+(el.dataset.pop||0));
    el.style.transform='translateY('+rise+'px) scale('+(1-pop)+') rotate('+(el.dataset.rot||0)+'deg)';
  });
  document.querySelectorAll('.flame').forEach((f,i)=>{f.style.transformOrigin='200px 170px';f.style.transform='scale('+(1+0.05*Math.sin(t*9+i))+','+(1+0.09*Math.sin(t*7+i*2))+')';});
  document.querySelectorAll('[data-draw]').forEach(p=>{const s=+p.dataset.draw;const L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L*(1-Math.min(1,Math.max(0,(t-s)/0.7)));});
  document.querySelectorAll('[data-count]').forEach(el=>{const s=+el.dataset.countS,to=+el.dataset.count;const k=Math.min(1,Math.max(0,(t-s)/1.2));el.textContent=Math.round(to*ease(k)).toLocaleString('es-AR');});
  document.documentElement.style.setProperty('--h',(0.75+0.25*Math.sin(t*1.7)).toFixed(3));
}
window.setTime=setTime;`;

function page(pal, W, H, body, extraCss = '') {
  const c = PAL[pal];
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
  :root{--bg:${c.bg};--fg:${c.fg};--ac:${c.ac};--ac2:${c.ac2};--mu:${c.mu};--glow:${c.glow};--line:${c.line};--h:1}
  *{box-sizing:border-box;margin:0;padding:0}
  body{width:${W}px;height:${H}px;overflow:hidden;background:var(--bg);color:var(--fg);font-family:Manrope,system-ui,sans-serif;position:relative}
  .halo{position:absolute;inset:0;background:radial-gradient(62% 42% at 50% 40%,rgba(var(--glow),calc(var(--h)*.34)) 0%,transparent 72%)}
  .grain{position:absolute;inset:0;opacity:.09;mix-blend-mode:overlay;pointer-events:none}
  .scene{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:${Math.round(H * .105)}px 90px ${Math.round(H * .31)}px}
  h1{font-family:Fraunces,Georgia,serif;font-weight:600;font-variation-settings:'SOFT' 100;font-size:${W >= 1080 && H > 1500 ? 108 : 70}px;line-height:1.04;letter-spacing:-.01em;margin:26px 0}
  h1 em{font-style:italic;color:var(--ac)}
  .lab{font-family:ui-monospace,Menlo,Consolas,monospace;letter-spacing:.14em;text-transform:uppercase;font-size:32px;color:var(--mu);margin:8px 0}
  .btn{display:inline-block;background:var(--ac);color:${c.btnfg};font:800 50px Manrope,sans-serif;padding:34px 66px;border-radius:90px;margin-top:40px;box-shadow:0 0 70px rgba(var(--glow),.45)}
  .small{font:500 30px/1.35 Manrope,sans-serif;color:var(--mu);margin-top:34px;max-width:860px}
  .hand{font-family:Caveat,cursive;font-weight:700;color:var(--ac);font-size:76px}
  .chip{display:inline-block;font:800 46px Manrope,sans-serif;color:#140f0b;padding:20px 44px;border-radius:70px;margin:10px}
  ${extraCss}
  </style></head><body><div class="halo"></div>${body}
  <svg class="grain" width="100%" height="100%"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 1 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
  <script>${ENGINE}</script></body></html>`;
}
const sc = (s, e, inner, cls = '') => `<div class="scene ${cls}" data-s="${s}" data-e="${e}" data-rise="0" data-d="0.3">${inner}</div>`;
const it = (s, html, attrs = '') => `<div data-s="${s}" ${attrs}>${html}</div>`;

// ---------- piezas ----------
const VID = {};
VID.A1 = () => { // Velas y jabones 3 en 1: problema específico (9:16, 25 s)
  const P = PAL.A;
  const body = [
    sc(0, 3.1, it(0, candle('sunk', { w: 560 })) + it(0.35, `<h1>¿Se te <em>hundió</em><br>la vela?</h1>`)),
    sc(3.1, 5.6, it(3.1, candle('cracked', { w: 520, drawStart: 3.5 })) + it(3.3, `<h1>Se <em>agrieta</em>.</h1>`)),
    sc(5.6, 8.1, it(5.6, candle('noaroma', { w: 520 })) + it(5.8, `<h1><em>Sin aroma</em> al<br>encenderla.</h1>`)),
    sc(8.1, 16.1,
      it(8.2, `<div class="lab">Este curso empieza</div>`) +
      it(8.5, `<h1><em>Desde cero</em></h1>`) +
      it(9.1, `<svg width="640" height="40" viewBox="0 0 640 40" style="margin-top:-30px"><path data-draw="9.2" d="M12 24 C120 6 220 34 330 18 S560 10 628 22" stroke="#f5a83a" stroke-width="9" fill="none" stroke-linecap="round"/></svg>`) +
      [['Qué materiales comprar', 10.4], ['Los términos básicos', 12.0], ['Tu primera vela, paso a paso', 13.6]].map(([t, s]) => it(s, `<div style="font:700 56px Manrope;margin:22px 0;display:flex;gap:26px;align-items:center"><span style="color:#f5a83a;font-size:64px">✓</span>${t}</div>`)).join('')),
    sc(16.1, 22.1,
      it(16.2, `<div class="lab">Incluye</div>`) +
      it(16.4, `<h1>3 cursos <em>en 1</em></h1>`) +
      [['Velas', P.t1, 17.4], ['Velas navideñas', P.t3, 18.2], ['Jabones', P.t2, 19.0]].map(([t, c, s]) => it(s, `<span class="chip" style="background:${c}">${t}</span>`, 'data-pop="0.2"')).join('') +
      it(20.0, `<div style="margin-top:46px;border:5px solid #f5a83a;border-radius:50%;width:330px;height:330px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 0 60px rgba(245,168,58,.25)"><div style="font:600 120px Fraunces,serif;color:#f5a83a;line-height:1">6</div><div style="font:800 34px Manrope;letter-spacing:.06em;text-transform:uppercase;line-height:1.25">meses de<br>acompañamiento</div></div>`, 'data-pop="0.25"')),
    sc(22.1, 99,
      it(22.1, candle('good', { w: 380 })) +
      it(22.3, `<h1>Tu primera vela,<br><em>paso a paso</em></h1>`) +
      it(22.9, `<div class="btn">Mirá qué incluye ↓</div>`, 'data-pop="0.12"') +
      it(23.3, `<div class="small">Publicidad · Enlace de afiliada de Hotmart</div>`)),
  ].join('');
  return { pal: 'A', W: 1080, H: 1920, fps: 24, dur: 25.2, html: page('A', 1080, 1920, body) };
};
VID.B1 = () => { // Velas para emprender: lista de 5 (9:16, 22 s)
  const items = [['Hundimiento', 'sunk', 3.3], ['Grietas', 'cracked', 6.3], ['Sudor', 'sweat', 9.3], ['Manchas', 'stains', 12.3], ['Falta de aroma', 'noaroma', 15.3]];
  const body = [
    sc(0, 3.3, it(0, `<h1>5 cosas que le<br>pasan a tu <em>vela</em></h1>`) + it(0.9, `<div class="hand" style="transform:rotate(-3deg)">(y cómo se llaman)</div>`, 'data-rot="-3"')),
    ...items.map(([n, st, s], i) => sc(s, s + 3, it(s, `<div class="lab">Problema ${i + 1} de 5</div>`) + it(s + .05, candle(st, { w: 500, wax: PAL.B.wax, drawStart: s + .4 })) + it(s + .3, `<h1><em>${n}</em></h1>`))),
    sc(18.3, 99, it(18.3, `<h1>El curso tiene un<br>módulo <em>entero</em><br>para esto</h1>`) + it(19.2, `<div class="lab">22 módulos · de la teoría a la venta</div>`) + it(19.8, `<div class="btn">Mirá el temario ↓</div>`, 'data-pop="0.12"') + it(20.3, `<div class="small">Publicidad · Enlace de afiliada de Hotmart</div>`)),
  ].join('');
  return { pal: 'B', W: 1080, H: 1920, fps: 24, dur: 22.4, html: page('B', 1080, 1920, body) };
};
VID.B2 = () => { // Velas para emprender: pantalla grabada, costo de UNA vela (9:16, 28 s)
  const rows = [['Cera', 420, 5.2], ['Pabilo', 95, 8.2], ['Frasco', 310, 11.2], ['Aroma', 180, 14.2]];
  const css = `.sheet{width:900px;border-radius:26px;overflow:hidden;background:#fff8f5;color:#2e1a33;box-shadow:0 30px 90px rgba(0,0,0,.45)}
  .sh{background:#d8b78c;font:800 40px Manrope;padding:30px 40px;display:flex;justify-content:space-between}
  .r{display:flex;justify-content:space-between;font:600 52px Manrope;padding:30px 40px;border-bottom:3px solid #eadbe0}
  .r b{font-weight:800;font-variant-numeric:tabular-nums}
  .tot{background:#2e1a33;color:#ffc6d7;font:800 58px Manrope;padding:36px 40px;display:flex;justify-content:space-between}
  .tag{font:800 34px ui-monospace,Menlo,monospace;letter-spacing:.1em;color:#f6b24a;border:3px dashed #f6b24a;border-radius:14px;padding:12px 26px;margin-bottom:34px}`;
  const body = [
    sc(0, 4.2, it(0, `<h1>¿Cuánto cuesta de<br>verdad hacer <em>UNA</em><br>vela?</h1>`)),
    sc(4.2, 20.2, it(4.3, `<div class="tag">EJEMPLO CON NÚMEROS INVENTADOS</div>`) +
      `<div class="sheet" data-s="4.4" data-rise="40"><div class="sh"><span>Costo de UNA vela</span><span>$</span></div>` +
      rows.map(([n, v, s]) => `<div class="r" data-s="${s}" data-rise="18"><span>${n}</span><b>$ ${v}</b></div>`).join('') +
      `<div class="tot" data-s="17"  data-rise="18"><span>Total</span><b>$ <span data-count="1005" data-count-s="17.1">0</span></b></div></div>`),
    sc(20.2, 24.2, it(20.2, `<h1>Recién ahí sabés<br><em>cuánto cobrar</em></h1>`)),
    sc(24.2, 99, it(24.2, `<div class="lab">Módulo 22</div>`) + it(24.4, `<h1>Cuánto <em>cobrar</em></h1>`) + it(25.0, `<div class="btn">Mirá el módulo 22 ↓</div>`, 'data-pop="0.12"') + it(25.5, `<div class="small">El curso es educativo: no garantiza ingresos.<br>Publicidad · Enlace de afiliada de Hotmart</div>`)),
  ].join('');
  return { pal: 'B', W: 1080, H: 1920, fps: 24, dur: 28.2, html: page('B', 1080, 1920, body, css) };
};
VID.B3 = () => { // Velas para emprender: pantalla dividida 1:1, 15 s
  const css = `.col{position:absolute;top:200px;width:470px;height:600px;border-radius:30px;padding:34px}
  .col h2{font:700 46px Fraunces,serif;margin-bottom:26px}.col div.i{font:700 38px/1.25 Manrope;margin:22px 0}`;
  const L = [['Partes sueltas, sin orden', 1.2], ['Prueba y error con tus materiales', 2.6], ['Buscar proveedores por tu cuenta', 4.0]];
  const R = [['De la teoría a la venta', 6.4], ['Un módulo entero de errores', 7.8], ['Lista de proveedores por país', 9.2]];
  const body = `<div style="position:absolute;top:52px;left:0;right:0;text-align:center" data-s="0" data-rise="0"><h1 style="font-size:60px;margin:0">Videos sueltos o un curso <em>en orden</em></h1></div>
  <div class="col" style="left:40px;background:#2a1f2e;filter:saturate(.35)" data-s="0.4"><h2>Videos sueltos</h2>${L.map(([t, s]) => `<div class="i" data-s="${s}" data-rise="14"><span style="color:#8e7a93">✗</span> ${t}</div>`).join('')}</div>
  <div class="col" style="right:40px;background:#301c37;border:5px solid #ff8fb1" data-s="5.6"><h2 style="color:#ff8fb1">22 módulos en orden</h2>${R.map(([t, s]) => `<div class="i" data-s="${s}" data-rise="14"><span style="color:#ff8fb1">✓</span> ${t}</div>`).join('')}</div>
  <div style="position:absolute;left:0;right:0;bottom:130px;text-align:center" data-s="11" data-pop=".12"><div class="btn" style="margin:0;font-size:44px;padding:26px 56px">Mirá los 22 módulos ↓</div></div>
  <div style="position:absolute;left:0;right:0;bottom:46px;text-align:center;font:500 25px Manrope;color:#c7b4cb" data-s="11.4">El curso es educativo: aprender a vender no garantiza ingresos · Publicidad · Enlace de afiliada de Hotmart</div>`;
  return { pal: 'B', W: 1080, H: 1080, fps: 24, dur: 15, html: page('B', 1080, 1080, body, css) };
};
VID.A2 = () => { // Carrusel 4:5, 4 tarjetas (estáticas)
  const card = (art, title, sub, cta) => `<div class="scene" style="padding:90px 80px 120px;justify-content:center" data-s="0" data-rise="0">${art}<h1 style="font-size:90px">${title}</h1><div style="font:600 46px/1.3 Manrope;color:#bfb0a0">${sub}</div>${cta ? `<div class="btn" style="font-size:44px">${cta}</div>` : ''}</div>`;
  const cards = [
    card(`<div style="display:flex;gap:30px;align-items:flex-end">${candle('good', { w: 340 })}${soaps(380)}</div>`, '¿Qué te gustaría hacer <em>primero</em>?', 'Elegí por dónde empezar.'),
    card(candle('good', { w: 420 }), 'Velas <em>decorativas</em>', 'Más de 30 técnicas, desde tu primera vela en vaso.'),
    card(candle('good', { w: 420, wax: '#c94a4a' }), 'Velas <em>navideñas</em>', 'Para regalar.'),
    card(soaps(520), 'Jabones <em>naturales</em>', '20 jabones artesanales. Los 3 cursos, en uno.', 'Mirá qué incluye ↓'),
  ];
  return { pal: 'A', W: 1080, H: 1350, cards: cards.map(c => page('A', 1080, 1350, c).replace(/padding:\d+px 90px \d+px/, '')) };
};

// ---------- ejecución ----------
(async () => {
  const [name, out] = [process.argv[2], process.argv[3]];
  if (!VID[name]) { console.error('Pieza desconocida'); process.exit(1); }
  fs.mkdirSync(out, { recursive: true });
  const v = VID[name]();
  const br = await chromium.launch();
  const pg = await br.newPage({ viewport: { width: v.W, height: v.H } });
  if (v.cards) {
    for (let i = 0; i < v.cards.length; i++) {
      await pg.setContent(v.cards[i]); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
      await pg.evaluate(() => setTime(5)); await pg.screenshot({ path: path.join(out, `${name}_${i + 1}.png`) });
    }
  } else {
    await pg.setContent(v.html); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(500);
    const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'fr_'));
    const N = Math.round(v.dur * v.fps);
    for (let i = 0; i < N; i++) {
      await pg.evaluate(t => setTime(t), i / v.fps);
      await pg.screenshot({ path: path.join(tmp, `f_${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 92 });
    }
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(v.fps), '-i', path.join(tmp, 'f_%04d.jpg'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', path.join(out, `${name}.mp4`)]);
    fs.writeFileSync(path.join(out, `${name}_prev.jpg`), fs.readFileSync(path.join(tmp, `f_${String(Math.round(N * .5)).padStart(4, '0')}.jpg`)));
  }
  await br.close(); console.log('listo', name);
})();
