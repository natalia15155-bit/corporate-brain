# Revisión: "Velas Artesanales para Emprender"

Landing revisada: https://velas-artesanales-curso.netlify.app (capturada el 2026-11-18).
Versión nueva: `landing/velas-emprender/index.html`, hecha con la skill `landing-productos-digitales`.

## Lo que la original ya hacía bien (se conservó)
- Promesa con número y con el dolor concreto ("sin que se hundan ni se agrieten").
- Temario en 5 bloques y tabla "este curso vs. videos sueltos".
- **Reseñas reales** con nombre, fecha y fuente ("reseña pública en Hotmart"), incluida la aclaración de ortografía corregida. Se copiaron textualmente.
- Cuenta de días para Navidad calculada con la fecha real.
- Aviso de afiliada y "no garantiza ingresos"; aclaración de que el cupón lo define la academia.
- Precio en pesos para Argentina.
- Link de afiliada (`N88481459S?ap=f3cd`, origen `LPDYE_`) y píxel (mismo ID): **intactos**.

## Problemas encontrados

| # | Problema | Corrección |
|---|---|---|
| 1 | **El botón de compra quedaba fuera de la primera pantalla** del celular (arriba en y=842 px, con pantalla de 844). | Ahora termina en y=771 px. |
| 2 | La barra superior decía "Cupón PROMO62 activo **hoy, miércoles 18 de noviembre**" con la fecha de cada día generada por código. Afirma que se verificó hoy, y no es así. | "Cupón PROMO62 · Pago único · 7 días de garantía", sin fecha inventada. |
| 3 | La imagen principal era una ilustración genérica que no muestra ninguna vela real del curso. | Hero con las fotos reales del curso como polaroids sobre la mesa. |
| 4 | Las fotos eran círculos chicos con bordes de color de otra página. | Recortadas dentro de marcos de foto; los bordes ya no se ven. |
| 5 | La cuenta para Navidad pasaba al año siguiente después del 25/12 ("Faltan 364 días"). | Se muestra solo en los 60 días previos y se oculta sola el resto del año. |
| 6 | El aviso de afiliada estaba solo en el pie. | También bajo el primer botón. |
| 7 | La garantía estaba a mitad de página. | Sello giratorio en el hero, junto a cada botón y como sello grande al final. |
| 8 | Sin barra de compra fija; 3 botones en total. | 6 botones y barra fija que aparece al pasar el primero. |
| 9 | El clic bloqueaba ctrl/cmd/clic central. | Solo se intercepta el clic normal. |
| 10 | Los eventos del píxel no enviaban valor ni moneda. | `ViewContent` e `InitiateCheckout` ahora llevan `currency: USD, value: 37.5` (mismo ID y mismos nombres de evento). Ayuda a Meta a optimizar. |
| 11 | Diseño en cajas blancas iguales y centradas. | Rediseño completo (abajo). |

## El rediseño: "del taller a tu marca"
- Noche color ciruela con la luz de una llama y el **rosa de la marca del curso** como color de acción.
- **¿Qué le pasó a tu vela?**: 5 botones ilustrados (se hundió, se agrietó, suda, manchas, sin aroma). La persona toca su problema y lee que el curso tiene un módulo entero para eso. Es el micro-compromiso de la página.
- **Temario como cuaderno de taller** con espiral y renglones.
- **Etiqueta colgante de papel kraft** para el módulo 22 (emprender): precio, costos, marca, etiquetas, fotos.
- **Comparación** en tarjetas con ✓ y ✗.
- **Bonos** como tarjetas de colores; la lista de proveedores con su portada.
- **Ticket del pedido**: todo lo incluido, precio regular USD 100, cupón −USD 62,50, "Hoy pagás USD 37,50".
- Prueba social con la valoración grande, las 3 reseñas reales y la garantía.

## Para confirmar antes de publicar
1. **4,8 · 271 evaluaciones · 96 % positivas · +49.800 estudiantes**: que sigan vigentes en Hotmart.
2. **Precio regular USD 100 y cupón PROMO62**: que el cupón siga activo. Si tiene fecha de vencimiento real, cargarla en `CONFIG.deadline` y aparece una cuenta regresiva.
3. **Precios en pesos** (ARS 184.254 / 69.095): escritos a mano, se desactualizan.
4. **Fotos**: son recortes de 250 px. En celular se ven bien; en computadora quedan algo borrosas. Con fotos originales más grandes la página gana mucho.
5. **Instructora**: una reseña menciona a "Erika". Con su nombre completo y una frase real sobre su experiencia se puede sumar una sección de autoridad.
