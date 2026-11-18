// Verificación de una landing con Playwright.
// Uso: NODE_PATH=$(npm root -g) node verificar.cjs <url-o-ruta-al-html> <carpeta-de-salida>
// Ejemplo: NODE_PATH=$(npm root -g) node verificar.cjs file:///ruta/index.html /tmp/capturas
//
// Revisa en móvil (390x844) y escritorio (1366x860):
// - que el primer botón (#cta1, o el primer [data-go]) termine dentro de la primera pantalla del móvil
// - que no haya scroll horizontal
// - errores de JS y de consola (el píxel de Facebook se bloquea a propósito y no cuenta)
// - que todos los botones de compra ([data-go]) apunten al mismo link
// - que las fuentes web hayan cargado
// Y guarda capturas: primera pantalla y página completa en ambos tamaños.

const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const url = process.argv[2];
  const out = process.argv[3] || '.';
  if (!url) { console.error('Falta la URL o ruta del HTML'); process.exit(1); }
  fs.mkdirSync(out, { recursive: true });
  const target = /^(https?|file):/.test(url) ? url : 'file://' + require('path').resolve(url);

  const browser = await chromium.launch();
  const errores = [];
  const r = {};

  async function abrir(ctx, etiqueta) {
    const p = await ctx.newPage();
    p.on('pageerror', e => errores.push(`[${etiqueta}] ${e.message}`));
    p.on('console', m => { if (m.type() === 'error' && !/ERR_FAILED|facebook/.test(m.text())) errores.push(`[${etiqueta}] consola: ${m.text()}`); });
    await p.route(/facebook\.(com|net)/, x => x.abort());
    await p.goto(target, { waitUntil: 'load', timeout: 45000 });
    await p.evaluate(() => document.fonts && document.fonts.ready);
    await p.waitForTimeout(1500);
    return p;
  }
  async function mostrarTodo(p) {
    // Fuerza la aparición de los elementos con animación al hacer scroll, para la captura completa.
    await p.evaluate(() => document.querySelectorAll('.rv').forEach(e => e.classList.add('in')));
    await p.waitForTimeout(900);
  }

  // Móvil
  let ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 1 });
  let p = await abrir(ctx, 'móvil');
  r.boton = await p.evaluate(() => {
    const b = document.querySelector('#cta1') || document.querySelector('[data-go]');
    if (!b) return null;
    const x = b.getBoundingClientRect();
    return { arriba: Math.round(x.top), abajo: Math.round(x.bottom) };
  });
  r.botonEnPrimeraPantalla = !!r.boton && r.boton.abajo <= 844;
  r.scrollHorizontalMovil = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  r.linksCompra = await p.$$eval('[data-go]', a => [...new Set(a.map(x => x.href))]);
  r.cantidadBotones = await p.$$eval('[data-go]', a => a.length);
  r.fuentes = await p.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family).filter((v, i, a) => a.indexOf(v) === i));
  await p.screenshot({ path: `${out}/movil-primera-pantalla.png` });
  await mostrarTodo(p);
  r.altoMovil = await p.evaluate(() => document.documentElement.scrollHeight);
  await p.screenshot({ path: `${out}/movil-completa.png`, fullPage: true });
  await ctx.close();

  // Escritorio
  ctx = await browser.newContext({ viewport: { width: 1366, height: 860 } });
  p = await abrir(ctx, 'escritorio');
  r.scrollHorizontalEscritorio = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  await p.screenshot({ path: `${out}/escritorio-primera-pantalla.png` });
  await mostrarTodo(p);
  await p.screenshot({ path: `${out}/escritorio-completa.png`, fullPage: true });
  await ctx.close();

  await browser.close();
  r.errores = errores;
  r.ok = r.botonEnPrimeraPantalla && !r.scrollHorizontalMovil && !r.scrollHorizontalEscritorio && errores.length === 0 && r.linksCompra.length === 1;
  console.log(JSON.stringify(r, null, 2));
  console.log(r.ok ? 'OK: pasa todas las comprobaciones. Mirá igual las capturas.' : 'REVISAR: alguna comprobación falló.');
})();
