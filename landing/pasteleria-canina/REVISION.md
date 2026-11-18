# Revisión: "Pastelería Canina y Felina"

Landing revisada: https://pasteleria-canina-curso.netlify.app (capturada el 2026-11-18).
Versión nueva: `landing/pasteleria-canina/index.html`, hecha con la skill `landing-productos-digitales`.

## Lo que la original ya hacía bien (se conservó)
- Promesa con número ("más de 30 recetas") y "desde cero".
- Lista concreta de recetas y técnicas de decoración.
- **Reseñas reales** con nombre, fecha y fuente; se copiaron textualmente.
- La aclaración de seguridad bien redactada: "según el productor… revisadas por un veterinario… consultá a tu veterinario".
- Aviso de afiliada, "no reemplaza la consulta veterinaria" y "no garantiza ingresos".
- Precio en pesos para Argentina.
- Link de afiliada (`N108533748H?ap=3734`, origen `LPPC_`) y píxel (mismo ID): **intactos**.

## Problemas encontrados

| # | Problema | Corrección |
|---|---|---|
| 1 | **El botón de compra quedaba fuera de la primera pantalla** del celular (terminaba en y=851 px, con pantalla de 844). | Ahora termina en y=797 px. |
| 2 | Mezcla de tuteo y voseo: "**Aprende** a hacer" en el título, y "Querés", "Pagás", "Empezá" en el resto. | Voseo en toda la página. Si el anuncio apunta a México o Colombia, conviene una versión en español neutro. |
| 3 | La cuenta para Navidad pasaba al año siguiente después del 25/12 ("Faltan 364 días"). | Se muestra solo en los 60 días previos. |
| 4 | La seguridad de las recetas, la duda número uno en comida para mascotas, estaba escondida en una pregunta frecuente. | Sección propia con una etiqueta tipo "información nutricional", con la misma aclaración del productor y su asterisco. |
| 5 | El aviso de afiliada estaba solo en el pie. | También bajo el primer botón. |
| 6 | La garantía era una línea a mitad de página. | Sello giratorio en el hero, junto a cada botón y como bloque grande al final. |
| 7 | Sin barra de compra fija; 3 botones. | 6 botones y barra fija. |
| 8 | El precio aparecía solo, sin contexto de valor. | "Comanda" con todo lo incluido y una cuenta real: menos de USD 1,63 por clase (69,99 ÷ 43). En Argentina se calcula con el precio en pesos. |
| 9 | La profesora (Diana) solo aparecía dentro de una reseña. | Se nombra junto a la valoración: te acompaña en el grupo privado. |
| 10 | El clic bloqueaba ctrl/cmd/clic central. | Solo se intercepta el clic normal. |
| 11 | Los eventos del píxel no enviaban valor ni moneda. | `ViewContent` e `InitiateCheckout` con `currency: USD, value: 69.99` (mismo ID y nombres). |
| 12 | Sin etiquetas para compartir ni descripción. | `og:` y meta descripción. |

## El rediseño: "la vitrina de una pastelería para mascotas"
- Fondo menta (el mismo tono de la foto), tinta verde azulado y coral de glaseado para la acción.
- **Hero como vitrina con toldo a rayas**, con calcomanías "Sin azúcar" y "4,8 · 661 evaluaciones" y el sello de garantía.
- **¿Para quién vas a cocinar?**: perro, gato, los dos o para vender. Cada opción muestra sus recetas y un botón propio. La de vender agrega "no garantiza ingresos".
- **Recetario en fichas de cocina** con pestañas de colores: galletas, muffins, tortas y especiales, decoración y básicos caseros.
- **Etiqueta de "información del recetario"** para la seguridad.
- **Comanda de la pastelería** como anclaje de valor.

## Para confirmar antes de publicar
1. **4,8 · 661 evaluaciones**: que siga vigente en Hotmart.
2. **Precio USD 69,99** y el valor en pesos (ARS 128.959 al 17-nov): se desactualiza con el tipo de cambio.
3. **La foto principal** (gato y perro con torta y velas) parece de banco de imágenes y no del curso. Confirmá que tenés derecho a usarla. Fotos reales de las recetas del curso sumarían mucha confianza.
4. **Idioma**: voseo o español neutro según el país de los anuncios.
5. **Diana**: con su apellido y una frase real sobre su experiencia se puede sumar una sección de autoridad.
