# Dirección visual: que se note el trabajo de fondo

La clienta lo pidió así: "algo impactante que transmita seguridad, que se vea que hay un trabajo de fondo, que es lo que el curso les va a dar". La página tiene que demostrar el mismo cuidado que promete el producto.

## Lo que no funcionó
1. **Corregir sin rediseñar**: mismos colores, mismo orden, contenido mejorado. Resultado: "no veo diferencias".
2. **Cambiar colores pero mantener bloques uniformes**: todas las secciones como cajas redondeadas iguales, centradas. Resultado: "rígida, básica".

## Lo que funcionó: objetos del oficio
Convertir cada sección en algo que pertenece al mundo del producto. Para velas y jabones:

| Sección | Objeto | Por qué funciona |
|---|---|---|
| Hero | Fotos tipo polaroid sueltas sobre la mesa, con cinta adhesiva | Se siente hecho a mano, no plantilla |
| Garantía | Sello circular giratorio con texto en el borde | Transmite seguridad y se ve "oficial" |
| Qué incluye | Etiqueta de frasco con doble marco y filas punteadas | Es literalmente el lenguaje del producto |
| Valor | Ticket de pedido con bordes troquelados y tipografía monoespaciada | Hace tangible "todo esto por tan poco" |
| Problema | Ilustraciones SVG de una vela hundida, agrietada y sin aroma | Muestra que se entiende el problema real |
| Cursos | Colores de tintes de jabón (lavanda, salvia, durazno, rosa) | Sistema de color que sale del oficio |

Para otros productos, buscar sus equivalentes: una plantilla de Notion puede usar ventanas de app y post-its; un curso de cocina, recetarios y etiquetas de frascos; un curso de diseño, reglas, cuadrículas y muestras de color.

## Ingredientes de "impacto" que se usaron
- **Fondo oscuro cálido con una fuente de luz** (halo ámbar que "respira"): da profundidad y dirige la mirada al botón.
- **Tipografía de autor** para títulos (Fraunces, con eje SOFT) y una sans limpia para el cuerpo (Manrope). Itálica en las palabras clave.
- **Un gesto a mano**: el subrayado de "Desde cero" se dibuja con un trazo SVG animado.
- **Textura**: grano de papel sutil sobre toda la página (SVG `feTurbulence`, opacidad ~0,07).
- **Movimiento con intención**: cinta inclinada con técnicas, brillo que cruza el botón, sellos que giran lento, aparición suave al hacer scroll. Todo se desactiva con `prefers-reduced-motion`, y sin JS todo queda visible.
- **Alternancia oscuro/claro** entre secciones (ébano y cera) para dar ritmo.
- **Layouts asimétricos en escritorio**: título fijo a la izquierda y contenido a la derecha; en el hero, texto y "mesa de fotos" en dos columnas.

## Cuidados
- Evitar los clichés de diseño generado: crema con serif y terracota, gradiente violeta-azul, todo centrado, la misma tarjeta repetida.
- Un solo color de acción (el ámbar) para todos los botones.
- Contraste suficiente: texto secundario claro sobre fondo oscuro (~#bfb0a0 sobre #140f0b).
- Fotos de 600 px alcanzan para móvil; en escritorio grande se notan, así que conviene pedir originales de mayor resolución.
