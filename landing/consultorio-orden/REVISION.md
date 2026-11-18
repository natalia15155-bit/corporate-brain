# Revisión: "Consultorio en Orden" (kit de 20 documentos)

Landing revisada: https://consultorio-en-orden-kit.netlify.app (capturada el 2026-11-18).
Versión nueva: `landing/consultorio-orden/index.html`, hecha con la skill `landing-productos-digitales`.

Esta landing es distinta de las anteriores: no es de afiliada sino **un producto propio**, sin imágenes, sin píxel y con un link directo de Hotmart (`pay.hotmart.com`).

## Lo que la original ya hacía bien (se conservó)
- **La transparencia legal**: dice que son modelos de referencia, que no garantizan validez legal y que los textos se redactaron con ayuda de IA sin revisión legal formal. Es lo más valioso de la página para un público profesional. En la versión nueva tiene sección propia, con las mismas afirmaciones.
- **La tabla ordenada por el recorrido del paciente** (8 momentos): es la mejor idea de la página y es la base de la sección interactiva.
- "Para quién es" y "Para quién no es".
- El botón ya estaba en la primera pantalla del celular.
- Garantía de 7 días, pago único, y el texto sobre cobro en pesos con tarjeta, Mercado Pago o PayPal.
- El link de pago de Hotmart: **intacto**.
- Voseo, coherente con "pensados para la práctica en Argentina".

## Problemas encontrados

| # | Problema | Corrección |
|---|---|---|
| 1 | **El pie mostraba el texto "[correo de soporte]" sin completar**, a la vista de cualquier visitante. En un producto para profesionales, eso resta mucha confianza. | Se quitó. Hay un campo `CONFIG.soporte`: cuando pongas el correo real, aparece solo. |
| 2 | **Sin píxel de Meta**: no se puede medir visitas ni clics, ni optimizar anuncios. | Se dejó preparado: `CONFIG.pixelId`. No puse el ID de tus otras landings porque no sé si querés mezclar datos. |
| 3 | **Sin forma de saber de dónde viene cada venta.** | El link ahora lleva `?src=LPCO_...` (de la URL o del anuncio). Hotmart lo acepta como parámetro de origen. |
| 4 | **Un solo botón de compra** y ninguno al final de las secciones largas. | 5 botones y barra fija al hacer scroll. |
| 5 | **Nada mostraba cómo es el producto.** Una página de texto, sin ningún elemento visual. | Pila de documentos en el hero con tres del kit (Ficha de admisión, Consentimiento informado, Hoja de evolución) y una hoja de muestra con los campos entre corchetes, rotulada como "Ilustración de ejemplo, no es un documento del kit". |
| 6 | La tabla de momentos era estática. | Selector interactivo: "¿En qué momento del tratamiento estás?" Tocás un momento y ves sus documentos. |
| 7 | El precio (USD 12) aparecía sin contexto de valor. | "USD 0,60 por documento" (12 ÷ 20, cuenta exacta). |
| 8 | Las preguntas frecuentes no cubrían licencia, edición ni tests. | Se agregaron 4 preguntas, todas respondidas con datos que ya estaban en la página (licencia para un solo consultorio, editables, sin tests). |
| 9 | Diseño de texto continuo, sin jerarquía ni identidad. | Rediseño completo (abajo). |
| 10 | Sin etiquetas para compartir (WhatsApp, Facebook). | `og:` y favicon. |

## El rediseño: "el archivo del consultorio, en orden"
- Verde bosque profundo (la identidad de la original) con papeles color hueso apilados como expedientes.
- Pestañas de carpeta de colores, el sello "Confidencial" y campos [entre corchetes] como elementos de diseño.
- Tono sobrio y sereno, adecuado a un público profesional de la salud mental: sin sellos giratorios ni contadores.
- Tipografía editorial (Literata) para los títulos.
- Cifras: 20 documentos · 8 momentos · 5 para atender mañana · 7 días de garantía.

## Para confirmar antes de publicar
1. **Correo de soporte real**, para cargarlo en `CONFIG.soporte`.
2. **ID del píxel**, si querés medir.
3. **Cuántos documentos tiene cada momento.** La tabla original suma 22 si cuento por separado los tres mensajes (bienvenida, recordatorio, reprogramación) y 20 si son un solo documento. Asumí que son uno (así suman 20). No muestro conteos por momento para no equivocarme: confirmame cómo es.
4. **El parámetro `src`** del link de Hotmart: es de uso común, pero conviene hacer una compra de prueba para confirmar que aparece en el reporte.
5. **Reseñas o casos de uso:** el producto es nuevo y no hay ninguna en la página. No inventé nada. Si tenés un testimonio real de una colega, con su permiso, lo sumamos.
