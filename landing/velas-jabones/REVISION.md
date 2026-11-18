# Revisión de la landing "Velas y jabones 3 en 1"

Landing revisada: https://velas-y-jabones-3en1.netlify.app (capturada el 2026-11-18, escritorio y móvil 390 px).
Versión corregida: `landing/velas-jabones/index.html` (HTML estático, sin dependencias; solo carga el píxel de Meta).

Base de la revisión: los patrones observados en los informes de `research/` (Gumroad, Maven, Coursera, Kajabi, Notion, Huel, Ridge, etc.) y el análisis de esta página. Las mejoras son **hipótesis a probar**, no resultados medidos: no tengo datos de conversión de esta página.

## Lo que ya estaba bien (se conservó)

- Promesa con números en el H1 ("más de 30 tipos de velas y 20 jabones, desde cero").
- Sección "Este curso es para vos si…" centrada en dolores concretos (vela que se hunde, que se agrieta).
- Precio y botón repetidos 3 veces, garantía y preguntas frecuentes.
- Aviso de afiliada y de que el curso no garantiza ingresos.
- Pocos scripts de terceros (solo el píxel).
- Link de afiliada y eventos del píxel (`ViewContent`, `InitiateCheckout`): **intactos**, mismo ID y mismo link.

## Problemas encontrados y cómo se corrigieron

### Confianza y honestidad

| # | Problema en la original | Corrección |
|---|---|---|
| 1 | La imagen principal tiene "**50% OFF HOY**" dentro de la foto, sin ninguna fecha límite. "Hoy" sin vencimiento real es urgencia falsa. | Se eliminó esa imagen. El hero es un collage de 4 fotos sin texto. |
| 2 | La primera foto muestra una vela de una marca ajena ("Moonglow / Slow North, Austin TX") y el pie decía "Imágenes de referencia **del material del curso**". Eso puede inducir a error. | Se dejó de usar esa foto. El pie dice solo "Imágenes de referencia." |
| 3 | La barra superior decía "Precio promocional" sin fecha. | Ahora dice hechos: "Pago único · acceso inmediato · 7 días de garantía". |
| 4 | El aviso de afiliada estaba solo en el pie, en letra de 12 px. | Se agregó una línea visible bajo el primer botón y se mantuvo el aviso completo al final. |
| 5 | Los precios de referencia de los bonos incluían "Certificado USD 35" (igual al precio del curso) y "Comunidad USD 20", que no son bonos y restan credibilidad. | Se mantuvieron los valores de los 9 bonos de recetas (suma USD 148, indicado como "valor de referencia del productor") y se movieron certificado, comunidad y lista de proveedores a "También incluye", sin precio. |
| 6 | Decía "**16 bonos**", pero la lista muestra 12 (9 recetas + 3 que no son bonos). | Se quitó el número. **Falta que confirmes la cantidad real.** |
| 7 | "Sin preguntas" en la garantía: promesa que no controlás, porque el reembolso lo gestiona Hotmart. | Se quitó. |

### Conversión

| # | Problema | Corrección |
|---|---|---|
| 8 | **El primer botón de compra quedaba en y=934 px**, debajo del pliegue en un celular de 844 px. | Collage más compacto y chips bajo el botón: ahora el botón empieza en y=714 px y se ve completo en la primera pantalla. |
| 9 | Sin botón fijo al hacer scroll. Un estudio citado en los informes reporta ~+11% con CTA fijo (sin verificar). | Barra inferior con precio y botón; aparece al pasar el primer botón y se oculta en el final. |
| 10 | La garantía estaba a mitad de página, lejos del botón. | Línea "7 días de garantía" pegada bajo cada botón. |
| 11 | La prueba social era solo una cifra (4,9 ★, 283 evaluaciones). | Se subió a la zona del H1. Se agregó un espacio para **testimonios reales** (ver abajo). |
| 12 | Nada explicaba qué pasa después de pagar. | Sección "Cómo funciona" en 3 pasos, basada en lo que ya decían tus preguntas frecuentes. |
| 13 | Los 3 cursos aparecían mezclados en una lista. | Una tarjeta por curso (Velas, Velas navideñas, Jabones). |
| 14 | La urgencia no tenía base real. | Franja "Faltan N días para Navidad" calculada con la fecha real (25/12), visible hasta 60 días antes. Si la promo tiene una fecha límite real, se puede cargar y se muestra una cuenta regresiva. |

### Técnico

| # | Problema | Corrección |
|---|---|---|
| 15 | Los botones bloqueaban el clic del medio y ctrl/cmd+clic. | Solo se intercepta el clic normal (para dar 350 ms al píxel). |
| 16 | Imágenes de la galería sin `width`/`height` (el contenido salta al cargar). | Con dimensiones fijas. |
| 17 | Error de ortografía: "El curso **empezá** desde cero". | "empieza". |
| 18 | Sin etiquetas para compartir en WhatsApp/Facebook ni ícono. | Se agregaron `og:` y favicon. |
| 19 | Texto secundario de 12–13 px. | Mínimo 13–14 px. |

## Lo que tenés que revisar vos (no puedo verificarlo)

1. **"4,9 de 5" y "283 evaluaciones"**: confirmar que siguen vigentes en Hotmart.
2. **Precio "USD 70 → USD 35"**: confirmar que USD 70 fue o es el precio de lista real. Si no, quitar el precio tachado.
3. **Cantidad real de bonos** (la original decía 16).
4. **Precio en pesos** (`ARS 128.977 / ≈ ARS 64.489`): está escrito a mano y se desactualiza con el tipo de cambio.
5. **Derechos de las fotos**: no sé de dónde salen. Si no son tuyas o del productor, conviene reemplazarlas.
6. **Testimonios reales**: es lo que más falta. No inventé ninguno. Se cargan en `CONFIG.testimonials` y la sección los muestra sola.
7. **Quién da el curso**: la autoridad del instructor pesa mucho en Maven y Coursera. Se carga en `CONFIG.producer` y aparece sola.
8. **Idioma**: la página usa voseo ("Aprendé", "Tenés"), que coincide con tu bloque para Argentina, pero tu texto menciona OXXO (México). Si vas a pautar en México u otros países, probá una versión en español neutro.
9. **Insignia "Powered by Netlify"**: en la captura de la original aparece sobre la imagen principal. Es de Netlify (plan gratuito); no depende del HTML.

## Cómo publicarla

La carpeta `landing/velas-jabones/` es un sitio estático completo. En Netlify se puede arrastrar la carpeta, o subirla a un sitio nuevo para comparar contra la original antes de reemplazarla. **No la publiqué.**

## Cómo medir si mejoró

Dividir el tráfico entre la original y esta (por ejemplo, dos anuncios o dos URLs) y comparar clics a Hotmart (`InitiateCheckout`) por visita. Con el píxel actual solo se mide el clic al checkout, no la compra final.
