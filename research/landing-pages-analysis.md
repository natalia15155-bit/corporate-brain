# Análisis de landings que venden producto

Fecha de captura: 2026-11-18 (semana de Black Friday: las promos observadas son estacionales).
Método: Playwright (Chromium) en escritorio 1440px y móvil 390px, solo carga inicial sin scroll ni interacción, más búsqueda web.

## Alcance y límites (leer primero)

- **Analizadas (6):** Apple iPhone, Ridge, Allbirds, Oura, Huel, Gymshark.
- **No analizadas:** AG1 (verificación anti-bot de Vercel; no se evadió) y Stripe (redirige a un host no permitido).
- Los CDN de imágenes estaban bloqueados, así que las capturas salen sin imágenes. El texto, la estructura, los CTAs y los scripts sí son fiables.
- Solo se vio la carga inicial. Flujos de compra, carrito, checkout, tests A/B y comportamiento al scroll **no** se midieron.
- Los scripts de terceros se infieren de las peticiones de red. Indican qué herramientas se cargan, no cómo las usan.
- Marcado **[Obs]** = observado en la captura. **[Inf]** = inferencia mía. **[Fuente]** = dato de un artículo externo, sin verificar.

## 1. Cómo están hechas (funcionamiento)

| Sitio | Plataforma [Obs] | Terceros destacados [Obs] |
|---|---|---|
| Apple | Propia, sin terceros en la carga | Ninguno detectado |
| Ridge | Shopify | Klaviyo, Okendo (reseñas), Intelligems (testeo de precios/ofertas), Northbeam (atribución), GTM, Elevar, Replo, Superfiliate (afiliados), Richpanel, Mailchimp, píxeles de TikTok, Pinterest, Twitter y AppLovin, Shopify Pay |
| Allbirds | Shopify | GTM, Microsoft Clarity, Attentive, Elevar, getredo, banner de cookies |
| Oura | Propia | Klarna (pago en cuotas), Sentry, OneTrust, Statsig (experimentos), Noibu |
| Huel | Shopify + Sanity (CMS) | GTM, chat flotante |
| Gymshark | Shopify | Algolia (búsqueda), Datadog, GA, GTM, OneTrust |

Lectura [Inf]:
- Cuatro de seis usan Shopify. Es el estándar para vender producto físico DTC.
- **Ridge es la más cargada en instrumentación:** más de 40 hosts, con testeo de precios, atribución multicanal, afiliados y píxeles en 5 redes. Es una máquina de optimización, no solo una web.
- **Oura usa Statsig:** corre experimentos. Es una señal de que optimiza con tests, no una prueba de qué testea.
- **Apple es el contrapunto:** cero terceros en la carga inicial y la página más larga (~16.100 px). Vende con marca, no con optimización visible.

## 2. UI/UX observado

- **Barra superior de anuncios con 3 a 4 mensajes rotativos** [Obs]: Huel ("Envío gratis $65+", "Suscríbete y ahorra 25%", "Da 25%, recibe 25%", "Apto HSA/FSA"), Gymshark (10% por email, 12% extra a estudiantes, $10 por referir) y Ridge ("99 días de prueba sin riesgo", "garantía de por vida"). Resuelve el precio, el envío y el riesgo antes del primer scroll.
- **Un H1 con una promesa, un CTA dominante.** Oura: "Wear your best life" con un único botón azul "Shop Now" en móvil [Obs]. Es la landing más simple de las seis.
- **Navegación por objetivo, no por catálogo.** Huel entra con "Lose weight / More protein / Eat healthy / On-the-go" y el botón "Which Huel is right for you?" [Obs]. Reduce la parálisis de elección.
- **Quick-add y precios visibles en la home.** Allbirds muestra el precio y "QUICK ADD" en cada tarjeta, y el carrito avisa "Spend $100 more to earn free shipping" [Obs].
- **Umbral de envío gratis como palanca de ticket.** Allbirds $100, Gymshark $75, Huel $65 [Obs].
- **Ridge usa lenguaje de regalo en temporada:** "For every guy on the list", "Gifts he'll still be carrying next December" [Obs].
- **Apple** usa un banner de financiación ("lease low monthly payments") arriba, "Ways to Buy" y trade-in abajo, y atajos por segmento (educación, empresas, veteranos) [Obs].

## 3. Estrategias de marketing que ayudan a vender

Cada una con la evidencia que la respalda.

1. **Quitar el riesgo antes de pedir la compra.** Ridge: 99 días de prueba y garantía de por vida, en la barra superior [Obs]. Oura: pago en cuotas con Klarna y uso de fondos HSA/FSA [Obs]. Huel: HSA/FSA [Obs].
2. **Suscripción como descuento principal.** Huel pone "Subscribe and save 25%" en la primera fila de la web [Obs]. Ojo: una fuente recomienda un pack o bundle antes que la suscripción para tráfico frío [Fuente: [Swanky](https://swankyagency.com/high-converting-subscription-landing-page-ecommerce/)].
3. **Referidos con doble beneficio.** Huel "Give 25%, Get 25%" y Gymshark "$10 off when you refer a friend" [Obs]. Ridge carga una plataforma de afiliados (Superfiliate) [Obs].
4. **Captura de email a cambio de descuento.** Gymshark 10%, Huel 15% ("Want 15% Off and the Inside Scoop?") [Obs]. Alimenta el email, que se mide con Klaviyo en Ridge [Obs].
5. **Segmentos con descuento propio.** Gymshark: estudiantes 12% extra [Obs]. Apple: tiendas por segmento [Obs].
6. **Estacionalidad como urgencia legítima.** Black Friday en las 6 landings: Allbirds "Early Access, up to 70% off", Gymshark "up to 50% off everything", Ridge "up to 49% off" [Obs]. Es urgencia real (calendario), no temporizadores falsos. Las fuentes advierten que la urgencia falsa perjudica [Fuente: [Digital Applied](https://www.digitalapplied.com/blog/landing-page-conversion-study-2000-pages-tested-2026)].
7. **Prueba social cuantificada.** Oura: "86% of Oura Members see their health improve" y "Real members, real stories" [Obs]. Huel: "Recommended by top performers & nutrition experts" [Obs]. Las fuentes dicen que la prueba social específica supera a los sellos genéricos [Fuente, sin verificar].
8. **Autoridad científica como sección propia.** Oura: "How Oura Measures Sleep and Validates Accuracy". Huel: "Why Huel works" y menú "Science" [Obs].
9. **Medición y optimización continua** [Inf desde terceros observados]: testeo de precios (Ridge/Intelligems), experimentos (Oura/Statsig), atribución (Ridge/Northbeam), búsqueda propia (Gymshark/Algolia).

## 4. Cómo se hacen "vitales" (recurrencia y marca)

- **Producto de uso diario más relato de por vida:** Ridge "Carried 365 days a year", "Built for life".
- **Datos personales que enganchan:** Oura vende comprensión del propio cuerpo ("Understand your body. Own your health."). [Inf] La suscripción posterior a la app retiene, pero no se observó en esta carga.
- **Consumible recurrente + suscripción:** Huel.
- **Comunidad y pertenencia:** Gymshark ("built in the weight room"), Allbirds ("Follow the flock").

## 5. Qué aplicar (propuesta, a validar con tu producto)

1. Barra superior con 3 mensajes: envío, riesgo (garantía/prueba) y una oferta.
2. Un H1 con una promesa y un único CTA dominante en móvil.
3. Entrada guiada por objetivo del cliente ("¿cuál es para vos?").
4. Cifra concreta de prueba social con fuente, no sellos genéricos.
5. Umbral de envío gratis visible en el carrito.
6. Captura de email con incentivo y referidos con beneficio doble.
7. Instrumentar desde el inicio: atribución y un framework de experimentos.

## Siguientes pasos para profundizar

- Scroll completo, página de producto y carrito de 2 o 3 de estas marcas.
- AG1 y Stripe (requieren otro host o permiso aparte).
- Tus competidores directos, una vez que me indiques el rubro.
