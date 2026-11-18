# Landings de productos digitales: análisis

Fecha de captura: 2026-11-18. Complementa `landing-pages-analysis.md` (producto físico).
Método: Playwright (Chromium) en escritorio 1440px y móvil 390px, con scroll completo de la home y extracción de texto, CTAs, precios y scripts de terceros.

## Alcance y límites

- **Analizadas (5):** Gumroad, Canva, Grammarly, Notion, Linear.
- **No analizadas:** Masterclass y Skillshare (desafío anti-bot de Cloudflare; no se evadió) y Duolingo (cargó vacío en este entorno).
- Solo la **home** de cada sitio. No se vieron páginas de producto, precios completos, checkout, onboarding ni correos.
- Los CDN de estilos e imágenes estaban bloqueados, así que las capturas salen sin estilo ni imágenes (la captura móvil de Gumroad se ve sin CSS). El texto y la estructura sí son fiables; **el diseño visual no se pudo evaluar.**
- **[Obs]** = observado en la captura. **[Inf]** = inferencia mía.
- Canva: solo se extrajeron títulos de sección y CTAs; no se leyó su texto completo.

## 1. Qué venden y cómo entran

| Sitio | Promesa principal [Obs] | CTA principal [Obs] | Modelo de entrada [Obs] |
|---|---|---|---|
| Gumroad | "Go from 0 to $1" | "Start selling" | Vender es gratis de empezar; marketplace de creadores |
| Grammarly | "Think big. We'll take care of the details." | "Sign up. It's free" + "Sign up with Google" | Freemium, con 3 planes visibles en la home |
| Notion | "Where teams and agents create together." | "Get Notion free" + "Request a demo" | Freemium + venta asistida |
| Linear | "The product development system for teams and agents" | "Sign up" / "Get started" | Registro directo |
| Canva | "What will you design today?" | "Start designing for free" | Freemium; entrada por casos de uso |

Lectura [Inf]:
- **Los cinco ofrecen entrada gratis.** No encontré ninguno que pida pagar antes de probar.
- Ninguno muestra garantía de devolución ni "sin tarjeta" en la home. La baja fricción la da el plan gratis, no la garantía.

## 2. Funcionamiento observado

- **Muy poca instrumentación de terceros en la carga inicial.** Linear: ninguno. Gumroad: solo Cloudflare Insights y unpkg. Canva: solo Cloudflare Insights. Grammarly: Transcend (consentimiento) y Google accounts. Notion: Sentry, Transcend y Google accounts [Obs].
- **Esto contrasta con Ridge (producto físico),** que cargaba más de 40 hosts. [Inf] En productos digitales la medición suele estar dentro del propio producto, no en la landing.
- **Registro con Google dentro del hero** en Grammarly ("Sign up with Google") [Obs]. Elimina el formulario.
- **Gumroad es de código abierto**: muestra un contador de estrellas de GitHub (10,1K) y un enlace "Contribute or fork on GitHub" arriba de todo [Obs].
- **Longitud de página** [Obs]: Canva ~34.800 px, Linear ~16.600 px, Grammarly ~15.700 px, Gumroad ~6.500 px, Notion ~4.700 px. La más corta (Notion) también es la más enfocada.

## 3. Estrategias de marketing observadas

1. **Meta pequeña y aspiracional (Gumroad).** "Go from 0 to $1": baja la barrera ("tu primer dólar") en vez de prometer riqueza.
2. **Contador de ingresos reales en el hero (Gumroad).** "$2,025,218 — el ingreso ganado por emprendedores digitales la semana pasada". [Inf] Prueba de que el mercado funciona; no pude verificar si se actualiza en vivo.
3. **Testimonios con nombre, qué vende y cifra concreta (Gumroad).** Ej.: "$10k+ por mes", "más que mi sueldo de 6 cifras" [Obs]. Incluye un caso de fracaso y pivote: las preventas dieron $0, así que publicó la mitad gratis y la otra mitad paga; hoy el 99% de sus ingresos es recurrente [Obs]. Eso da credibilidad.
4. **Franja de cifras de autoridad (Notion).** "100M usuarios en más de 50 países", "más del 50% de las empresas de YC", "1,4M+ miembros de la comunidad", "62% de Fortune 100", "#1 en G2 tres años seguidos" [Obs]. Cada cifra responde a un tipo de comprador distinto.
5. **Citas con nombre y cargo (Notion)** y una lista de casos de uso concretos: "Triage product feedback", "Resolve support tickets in Slack", "Automate weekly reporting" [Obs].
6. **Dos CTAs para dos tipos de comprador (Notion y Grammarly):** autoservicio ("Get Notion free") y venta asistida ("Request a demo") [Obs].
7. **Precios visibles en la home (Grammarly):** planes Free, Pro y Enterprise, más una sección "What's the ROI on better work?" para justificar el costo [Obs]. No asigné precios a cada plan porque la extracción no los separa de forma fiable.
8. **Herramientas gratuitas como puerta de entrada (Grammarly):** corrector, detector de IA, parafraseador, traductor, generador de citas [Obs, en el menú]. [Inf] Funcionan como captación orgánica.
9. **Entrada por casos de uso o categoría (Canva, Gumroad):** Canva ordena por "Presentaciones, Redes, Videos…"; Gumroad por etiquetas de nicho (plantillas de Notion, pinceles de Procreate, samples, fuentes, LUTs…) [Obs].
10. **Changelog como prueba de ritmo (Linear):** sección "Changelog" en la home y frase "Built for the future. Available today." [Obs]. [Inf] Muestra que el producto avanza.
11. **Posicionamiento de categoría nueva (Linear):** "A new species of product tool" [Obs].
12. **Flexibilidad de cobro (Gumroad):** pago único, recurrente o por plazo fijo, en la moneda del comprador, y pagos semanales ("cada viernes", según un testimonio) [Obs].

## 4. Lo que haría vital a un producto digital [Inf]

- **Quitar el costo de probar:** nivel gratis o muestra (Gumroad: media gratis, media paga).
- **Hacerlo parte del flujo diario:** integración en donde ya se trabaja (Grammarly en el navegador y el editor, Notion en Slack).
- **Efecto de red:** comunidad y marketplace (Gumroad, Notion con 1,4M miembros).
- **Recurrencia:** suscripciones y niveles de plan en lugar de compra única.

## 5. Qué aplicar a tus productos digitales

1. Una promesa de resultado pequeña y concreta, con un único CTA dominante.
2. Entrada gratis: muestra, capítulo, plantilla básica o versión limitada.
3. Testimonios con nombre, qué compraron y una cifra de resultado. Si tienes un caso de pivote o error, úsalo.
4. Una franja de 3 a 5 cifras reales de autoridad (usuarios, descargas, reseñas, medios).
5. Mostrar precios o niveles en la página, con una línea que justifique el retorno.
6. Una herramienta o recurso gratis que traiga tráfico orgánico.
7. Dos caminos si vendes a empresas: comprar ya o pedir demo.
8. Probar una garantía de devolución. Ninguno de los cinco la muestra, así que es una oportunidad de diferenciarse, pero hay que probarla, no asumirla.

## Siguiente paso

Falta saber qué tipo de producto digital vendes (cursos, plantillas, software, ebooks o membresías) para elegir competidores directos y bajar la propuesta a tu caso.
