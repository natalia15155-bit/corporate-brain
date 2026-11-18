# Landings de cursos y plantillas: análisis de referentes

Fecha de captura: 2026-11-18. Complementa los informes de producto físico y de producto digital en esta misma carpeta.
Método: Playwright (Chromium) en escritorio 1440px y móvil 390px, con scroll completo de la home y extracción de texto, CTAs, precios y scripts de terceros.

## Alcance y límites

- **Analizadas (6):** Maven, Coursera, Udemy, Kajabi, Envato Elements (plantillas web) y el marketplace de plantillas de Notion.
- **No analizadas:** Framer (redirige a un host no permitido) y Creative Market (desafío anti-bot de Cloudflare; no se evadió).
- Solo **páginas de inicio o de listado**. No se vieron páginas de un curso o plantilla individual, el checkout, el onboarding ni los correos. Ahí se decide gran parte de la venta.
- Los CDN de imágenes y estilos estaban bloqueados: **no se pudo evaluar el diseño visual.**
- De Udemy y Envato la extracción fue parcial (Udemy sin H1; Envato sin títulos de sección), así que se dice menos de ellos.
- **[Obs]** = observado. **[Inf]** = inferencia mía. Las cifras que muestran los sitios (p. ej. "91% de resultado positivo") son afirmaciones de cada empresa, no verificadas.

## 1. Cursos

### Maven (cursos en vivo por cohorte)
- **Calendario como escasez natural** [Obs]: cada curso muestra duración y fecha de inicio ("8 weeks · Starts Jan 30", "9 days · Starts Dec 5"). Hay una sección "Courses starting soon".
- **Instructor como protagonista** [Obs]: cada tarjeta lleva el nombre y una línea de credenciales ("20 years in UX • Senior UX Lead", "Founder @ Goodie AI").
- **Oferta con fecha límite** [Obs]: "Save 30% through Sunday, Nov 22" en la barra superior.
- **Clases gratuitas como captación** [Obs]: "Free lessons" ("Learn something new in an hour, for free") y "Free series", con contador de inscriptos ("13 signed up").
- **Rankings y etiquetas** [Obs]: "Trending today" numerado del 1 al 9, etiquetas "New" y "Live", y calificaciones en algunos cursos (4.6).
- No muestra precios en la home [Obs].

### Coursera
- **Oferta anual arriba de todo** [Obs]: "Unwrap a year of new skills for $239/year", repetida más abajo ("now $239").
- **Entrada por objetivo** [Obs]: "What brings you to Coursera today?" con cuatro opciones (empezar, cambiar de carrera, crecer en el puesto, explorar).
- **Autoridad por asociación** [Obs]: tira de logos (Google, IBM, Microsoft, Stanford, OpenAI, Anthropic…) y "350+ universidades y empresas".
- **Cifra de resultado** [Obs]: "91% of learners achieved a positive career outcome". Es una afirmación de Coursera, con la salvedad de cómo la miden.
- **Testimonios con nombre abreviado y una frase de transformación** [Obs] y sección de preguntas frecuentes.
- CTA suave: "Join for Free" [Obs].
- Solo 4 hosts de terceros en la carga [Obs].

### Udemy
- **Entrada "Explore by goal"** y sección "Most popular" [Obs].
- Cifra de autoridad: "17,000 companies" [Obs].
- Página con muy pocos enlaces (25) para su tamaño (~8.000 px), es decir, poca navegación competidora [Obs].

### Kajabi (plataforma para vender conocimiento)
- **Posicionamiento por dolor** [Obs]: "All-in-one. Because six separate tools isn't a business plan."
- **Descuento con cuenta regresiva** [Obs]: "Black Friday deal ends in 13 days…", "30% off", "6 month discount". [Inf] La fecha es creíble por ser campaña de calendario, pero no pude verificar que el contador sea real.
- **CTA "Start Free Trial" repetido tras cada bloque de beneficios** [Obs].
- **Mecánicas de monetización que enumera** [Obs]: suscripciones, pagos únicos y planes, upsells, downsells, order bumps, impuestos automáticos, páginas de venta y secuencias de email.
- Página muy larga (~31.400 px) con FAQ [Obs].

## 2. Plantillas

### Marketplace de Notion
- **Volumen como prueba** [Obs]: "30,000+ Notion templates" en el título; categorías con conteo ("Personal Productivity — 26,284", "Personal Planner — 10,090", "Student Life — 8,007"); "23,274 creators".
- **Entrada por caso de uso y estación** [Obs]: "Weekly Planner", "Student Planner", "Back to school".
- **Precios bajos y visibles** [Obs]: en la página aparecen valores de $2,98 a $11,99 (no verifiqué a qué plantilla corresponde cada uno).
- **Creadores destacados** ("Top creator") y colecciones temáticas [Obs].
- **Venta de servicios encima del producto** [Obs]: 280 consultores con perfil y botón "Book", incluida una "llamada de encaje gratis".

### Envato Elements
- Modelo de **suscripción de descargas ilimitadas** ("Get unlimited downloads") y sección "Free Files" [Obs].
- Muy extensa (~57.800 px), con herramientas de IA en el menú [Obs].
- Extracción parcial: no puedo decir más de su estructura.

## 3. Patrones comunes

1. **Entrada por objetivo o caso de uso**, no por catálogo (Coursera, Udemy, Notion).
2. **Muestra gratis como puerta** (Maven: clases y series; Envato: archivos gratis; Coursera: "Join for Free").
3. **Fecha real como escasez**: inicio de cohorte (Maven), campaña de calendario (Kajabi, Maven).
4. **Prueba social con números** y personas con nombre (Coursera, Maven, Notion).
5. **Suscripción o acceso ilimitado** como alternativa a la compra suelta (Coursera, Envato).
6. **Ecosistema encima del producto**: servicios 1:1 (Notion), comunidad, certificados.

## 4. Qué aplicar a tus cursos y plantillas

**Cursos**
1. Páginas con fecha de inicio o cohorte, y duración visible. Si son a tu ritmo, una fecha límite real de la oferta.
2. Una clase o capítulo gratis con inscripción, mostrando el contador de inscriptos solo si es real.
3. Una línea de credenciales del instructor en cada curso.
4. Entrada por objetivo ("quiero conseguir trabajo", "quiero ascender").
5. Si tienes datos de resultado, publícalos con cómo los mediste. Si no, no copies la cifra de otros.
6. Probar un pase anual junto con la compra individual.

**Plantillas**
1. Precio visible en cada tarjeta y un nivel gratis de muestra.
2. Categorías por caso de uso y por temporada, con conteo.
3. Packs y un acceso por suscripción para quien compra varias.
4. Ofrecer instalación o personalización como servicio aparte (como los consultores de Notion).
5. En el checkout, probar upsell y order bump (Kajabi los lista como mecánicas estándar).

**Para ambos**
- Pocos terceros en la landing y un CTA dominante, como en los demás informes.
- Tratar la urgencia solo con fechas reales.

## Siguiente paso sugerido

Ver una **página individual** de un curso (Maven, Udemy) y una de plantilla (Notion), que es donde se decide la compra. Esos hosts ya están permitidos. Faltan por ver: checkout, correos y onboarding, que no son accesibles sin crear cuentas.
