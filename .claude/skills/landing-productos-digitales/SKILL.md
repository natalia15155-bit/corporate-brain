---
name: landing-productos-digitales
description: Crea, audita o rediseña landings de venta de productos digitales (cursos, plantillas, ebooks, membresías), incluidas landings de afiliada para Hotmart u otras plataformas. Úsala cuando pidan "hacer una landing", "mejorar mi landing", "revisar esta página de venta", "que venda más" o "que sea impactante", o cuando haya que publicarla en Netlify. Cubre investigación de referentes, estructura de persuasión, dirección visual, código, verificación en móvil y publicación.
---

# Landing de productos digitales

Una landing que vende un producto digital tiene un solo trabajo: que la persona que llega desde un anuncio confíe y haga clic en comprar. Esta skill reúne lo aprendido al investigar landings de referencia (Gumroad, Maven, Coursera, Kajabi, Notion, Huel, Ridge y otras) y al rehacer una landing real de afiliada de Hotmart hasta que la clienta dijo "mucho mejor".

Archivos de la skill:
- `plantilla/index.html`: la landing final aprobada (curso de velas y jabones). Es la base a copiar y adaptar.
- `references/investigacion.md`: qué hacen las landings de referencia y con qué evidencia.
- `references/auditoria.md`: checklist para revisar una landing existente, con los errores reales que aparecieron.
- `references/diseno.md`: cómo lograr una página que se sienta trabajada y no "rígida o básica".
- `scripts/verificar.cjs`: verificación con Playwright (primera pantalla, scroll horizontal, errores, links, capturas).

## Reglas que no se negocian

Persuadir sí, engañar no. Además de ser deshonesto, el engaño trae rechazos de anuncios en Meta, reembolsos y contracargos.

1. **Urgencia solo con fechas reales**: fin de una promo con fecha, inicio de cohorte, temporada (Navidad calculada con la fecha del día). Nunca "OFF HOY" sin vencimiento ni contadores que se reinician.
2. **Prueba social solo verificable**: valoraciones y cantidades reales de la plataforma. Testimonios solo reales y con permiso; si no hay, dejar el espacio preparado y vacío (ver `CONFIG.testimonials` en la plantilla). Nunca inventar nombres ni frases.
3. **Precios de referencia rotulados**: si se muestra "valor" de bonos, decir de dónde sale ("indicado por el productor"). Si un "precio de lista" tachado no fue real, se quita.
4. **Aviso de afiliada visible** cerca del primer botón, además del pie. Más el aviso "no garantiza ingresos" cuando aplique.
5. **Imágenes con derechos y sin marcas ajenas**. Si una foto muestra un producto de otra marca, no se presenta como "material del curso".
6. **Conservar el tracking del cliente**: mismo ID de píxel, mismos eventos, mismo link de afiliada con su parámetro de origen.
7. **No publicar sin confirmación explícita**. Mostrar antes una vista previa sin píxel y con botones inertes, para no ensuciar datos.

## Proceso

### 1. Relevar
Pedir o encontrar: producto y formato, precio real y moneda, link de checkout o afiliada, ID de píxel y eventos, valoración y cantidad de evaluaciones, bonos reales, garantía, países e idioma (voseo o neutro), fotos con derechos, testimonios reales, quién crea el producto. Lo que falte se marca como pendiente, no se inventa.

### 2. Auditar la landing existente (si hay)
Descargar el HTML, leerlo entero y capturarla en móvil (390×844) y escritorio. Recorrer `references/auditoria.md`. Lo más frecuente: botón de compra fuera de la primera pantalla, urgencia falsa impresa en imágenes, cantidades que no coinciden ("16 bonos" con 12 en la lista), aviso de afiliada escondido, garantía lejos del botón.

### 3. Elegir un concepto desde el oficio del producto
No arrancar por colores sino por el mundo del producto: sus materiales, objetos y vocabulario. Para velas y jabones fue "el taller de noche": luz de llama, papel de etiqueta, tintes de jabón. Ver `references/diseno.md`.

Lección clave: **corregir problemas sin cambiar el diseño no se percibe**. La primera versión arreglaba 19 problemas pero mantenía colores y estructura, y la clienta respondió "no veo diferencias". La segunda cambió colores pero siguió con bloques uniformes: "rígida, básica". La aprobada convirtió cada sección en un objeto del oficio.

### 4. Armar la estructura de persuasión
Orden probado (adaptar los nombres al producto):

| # | Sección | Trabajo que hace |
|---|---|---|
| 1 | Franja superior | Hechos que bajan el riesgo: pago único, acceso inmediato, garantía. Más la franja de temporada si aplica. |
| 2 | Hero | Promesa con números + "desde cero", fotos del resultado, valoración, sello de garantía, precio y **botón dentro de la primera pantalla del celular**. |
| 3 | Cinta en movimiento | Nombres concretos de lo que se aprende: muestra amplitud sin texto largo. |
| 4 | El problema | "Seguro te pasó…": los errores típicos ilustrados, y el producto como salida. |
| 5 | Qué incluye | Todo lo incluido como un objeto del oficio (etiqueta de frasco, ficha técnica). |
| 6 | Para quién es | Dolores y deseos en primera persona. |
| 7 | Elegí por dónde empezar | Micro-compromiso: la persona toca una opción y ve su contenido con un botón personalizado. |
| 8 | Cómo funciona | 3 pasos de "pago" a "primer resultado". Quita la incertidumbre del después. |
| 9 | Temporada real | Días que faltan, calculados. Se oculta sola fuera de fecha. |
| 10 | Ticket del pedido | Anclaje de valor: todo lo incluido y bonos con valor de referencia, contra "Hoy pagás X". |
| 11 | Garantía + prueba social | Sello grande de garantía junto a la valoración real; testimonios si existen. |
| 12 | Preguntas frecuentes | Objeciones: experiencia, acceso, duración, pago, seguridad, celular, reembolso. |
| 13 | Cierre | Resumen, precio y botón con luz. |
| 14 | Barra fija | Precio y botón; aparece al pasar el primer botón y se oculta en el cierre. |

Unos 6 botones de compra en total. Todos al mismo link.

### 5. Construir
Partir de `plantilla/index.html`: el bloque `CONFIG` concentra link, fecha límite, testimonios, productor y precio local. Mantener:
- HTML estático sin dependencias salvo Google Fonts y el píxel.
- `prefers-reduced-motion` respetado; animaciones solo como capa (sin JS, todo visible).
- `html,body{overflow-x:clip}` cuando hay elementos girados o halos grandes.
- Texto en círculo con `textLength` y `lengthAdjust="spacing"` para que no se superponga.
- Clic del botón: dispara `InitiateCheckout`, espera 350 ms y navega; con ctrl/cmd/clic central no se intercepta.

### 6. Verificar
Correr `scripts/verificar.cjs` (instrucciones en el archivo). Criterios: botón principal termina antes de 844 px en 390 de ancho; sin scroll horizontal en móvil ni escritorio; sin errores de consola (salvo el píxel bloqueado en la prueba); todos los botones apuntan al mismo link; fuentes cargadas. Mirar las capturas, no solo los números: los problemas visuales (texto superpuesto, márgenes perdidos) solo se ven en la imagen.

### 7. Vista previa y comparación
Publicar como artefacto privado una copia **sin píxel y con botones inertes** y una cinta "VISTA PREVIA". Ofrecer además una página de comparación con capturas antes/después en móvil y la lista de cambios en el orden de la página.

### 8. Publicar
Solo con confirmación. Desplegar una carpeta limpia (solo `index.html` e `img/`, sin notas internas). En Netlify: `deploy-site` con el `siteId` (está en el comentario que Netlify inyecta en el HTML del sitio) y correr el comando que devuelve desde esa carpeta. Desde un entorno con proxy hacen falta los hosts `mcp.netlify.com` y `api.netlify.com` y `NODE_USE_ENV_PROXY=1`. Después, comprobar en vivo: título nuevo, píxel, link de afiliada, imágenes 200 y notas internas 404.

## Medir

Las mejoras son hipótesis hasta medirlas. Recomendar dividir tráfico entre versiones y comparar `InitiateCheckout` por visita. Con un píxel de afiliada solo se mide el clic al checkout, no la compra.
