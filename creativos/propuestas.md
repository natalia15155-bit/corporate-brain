# Propuestas de piezas: 4 productos × 3 formatos

Estado: **propuestas sin producir ni publicar**. Nada de esto se subió a ninguna cuenta publicitaria; producir, pagar o publicar requiere tu confirmación explícita.

## Cómo leer esto
- **Cada pieza replica estructura y formato** observados en el corpus (`research/creativos-teardowns*.md`), **no contenido**. El guion, las imágenes y la voz son originales.
- **"Patrón"** indica la fila del ledger (`.claude/skills/creativos-anuncios-virales/references/ledger-afirmaciones.csv`) en que se apoya. **Ninguna de esas hipótesis está confirmada con tus datos**: las piezas existen justamente para ponerlas a prueba.
- **Nada promete ingresos, resultados ni curas.** Sin testimonios, sin escasez falsa, sin precios tachados. Los hechos del producto salen de cada landing; si un dato no está allí, no se usa.
- **Material propio:** las tomas de elaboración y de las recetas deben ser tuyas o con derechos. No se presenta como "material del curso" algo que no lo sea (regla de la skill de landings).
- **Zonas seguras (regla práctica, cifras de memoria, a verificar en la documentación de Meta):** dejar libres la franja superior (~14%) y la inferior (~35%) de un 9:16, donde la interfaz tapa el texto.
- **Idioma:** voseo para Argentina (velas y jabones, velas para emprender, kit). **Español neutro** para pastelería, porque su landing escribe en neutro ("Pruébalo", "Es para ti").

## Antes de lanzar cualquiera
| # | Bloqueo | Dónde |
|---|---|---|
| 1 | **El kit no tiene píxel**: `CONFIG.pixelId` está vacío en la página publicada. No se mide `ViewContent` ni `InitiateCheckout` para D1 a D3. | consultorio-en-orden-kit.netlify.app |
| 2 | Las 3 landings de afiliada **comparten el mismo ID de píxel** (`1844504486862894`): se distinguen por la campaña, el conjunto de anuncios y el parámetro de la URL, no por el píxel. | Plan de prueba |
| 3 | **H1 de velas y jabones**: publicado "Aprendé a hacer más de 30 tipos de velas y 20 jabones artesanales, desde cero"; en el repo, "Más de 30 velas y 20 jabones artesanales. Desde cero." Hay que decidir cuál sale y alinear el anuncio. | velas-y-jabones-3en1.netlify.app |
| 4 | **Precios y cupones**: no aparecen en ninguna pieza. Cambian y algunos son de cupón (ej. 37,50 con cupón). Si querés mostrar precio, verificá el vigente el día de publicar. | |
| 5 | **Garantía de 7 días**: figura en las landings; confirmá que sigue vigente en Hotmart antes de nombrarla. | |

---

# Producto A: Curso de velas y jabones 3 en 1 (afiliada) · voseo
**Destino:** https://velas-y-jabones-3en1.netlify.app · **Promesa (H1):** más de 30 velas y 20 jabones artesanales, desde cero · **Evento:** `ViewContent` (llegó) → `InitiateCheckout` (fue al pago).
**Hechos de la landing que sí se pueden usar:** empieza desde cero (materiales, términos, primera vela paso a paso), tres cursos (velas, velas navideñas, jabones), más de 120 clases en video, 6 meses de acompañamiento, lista de proveedores por país.

## A1 · "Se hundió en el medio": gancho de problema específico, a cámara con manos
- **Formato:** UGC con voz en off y manos · **9:16 · 25 s** · **Gancho:** problema con identidad.
- **Patrón:** C45 y C46 (problema específico, 534 días en un anunciante de velas), C39 (ritmo de un corte cada ~3 s).

| Seg | Imagen | Voz | Texto en pantalla |
|---|---|---|---|
| 0 a 3 | Primer plano de una vela con el centro hundido | "Hiciste tu primera vela y se hundió en el medio." | "¿Se te hundió la vela?" |
| 3 a 8 | Corte a vela con grietas, luego a una que no huele | "O se agrietó. O la encendés y no tiene aroma." | "Se agrieta · No huele" |
| 8 a 16 | Manos preparando materiales sobre la mesa | "Este curso arranca desde cero: qué materiales comprar, los términos básicos y tu primera vela, paso a paso." | "Desde cero" · "Tu primera vela, paso a paso" |
| 16 a 22 | Vela terminada encendida, plano fijo | "Son tres cursos: velas, velas navideñas y jabones. Y tenés 6 meses para consultar tus dudas." | "3 cursos en 1" · "6 meses de acompañamiento" |
| 22 a 25 | Pantalla de cierre con el logo del curso | "Mirá qué incluye en el enlace." | "Mirá qué incluye ↓" |

- **CTA:** "Mirá qué incluye". **Hipótesis:** el gancho de problema concreto (vs. un gancho de beneficio) frena más y manda a más gente a la landing. **Gancho alternativo para testear:** "Tu primera vela no tiene por qué salir mal."
- **Política:** no afirma que la vela "va a salir bien"; muestra el problema común y lo que incluye el curso. Sin ingresos.
- **Material:** 3 tomas de problemas (vela hundida, agrietada, sin aroma) **hechas por vos** y una vela terminada.

## A2 · "¿Qué te gustaría hacer primero?": carrusel de elección
- **Formato:** carrusel o imagen con grilla · **4:5 (1080×1350) · 4 tarjetas** · **Gancho:** elección que hace que la persona se busque.
- **Patrón:** C21 y C27 (grilla rotulada que invita a buscar tu ítem).

| Tarjeta | Contenido | Texto |
|---|---|---|
| 1 | Foto de una vela decorativa | "¿Qué te gustaría hacer primero?" |
| 2 | Velas decorativas | "Más de 30 técnicas, desde tu primera vela en vaso" |
| 3 | Regalos de Navidad (**solo mientras falten días reales**) | "Velas navideñas para regalar" |
| 4 | Jabones naturales | "20 jabones artesanales" + "Los 3 cursos en uno" |

- **CTA:** "Elegí por dónde empezar" · el que toque llega a la sección homónima de la landing.
- **Hipótesis:** una pregunta de elección en la imagen sube el clic frente a una imagen de producto única.
- **Política:** sin cifras de ventas ni ingresos. La tarjeta de Navidad se usa solo en temporada real y se retira después.
- **Material:** 3 fotos con derechos; maquetado en Canva.

## A3 · Proceso sin hablar: B-roll con subtítulos
- **Formato:** proceso con música, **sin locución** · **9:16 · 20 s** · **Gancho:** proceso que se mira solo.
- **Patrón:** C48 (formato de proceso, 389 días en un anunciante), C30 (planos largos con pocos cortes).

| Seg | Imagen | Texto en pantalla |
|---|---|---|
| 0 a 4 | Manos vertiendo cera en un frasco, plano cerrado | "Primera vela, paso a paso" |
| 4 a 10 | Colocar la mecha, aroma, colorante | "Materiales que se compran una vez" |
| 10 a 16 | Desmoldar jabón / vela encendida | "Velas y jabones, desde cero" |
| 16 a 20 | Pantalla de cierre | "3 cursos en 1 · Mirá qué incluye ↓" |

- **CTA:** "Mirá qué incluye". **Hipótesis:** un proceso sin voz con subtítulos retiene lo mismo que uno a cámara y es más barato de producir.
- **Política:** sin promesas. **Música con licencia** (de la biblioteca de música comercial de la plataforma), no una pista copiada.
- **Material:** 20 s de proceso filmados por vos.

---

# Producto B: Velas artesanales para emprender (afiliada) · voseo
**Destino:** https://velas-artesanales-curso.netlify.app · **Promesa (H1):** "Más de 30 velas artesanales, sin que se hundan." · **Evento:** `ViewContent` → `InitiateCheckout`.
**Hechos de la landing:** 22 módulos, un módulo entero de errores (hundimientos, grietas, sudor, manchas, falta de aroma), lista de proveedores por país, módulo 22 sobre cómo cobrar, calculadora de costos, marca, etiquetas y fotos. **El curso es educativo: aprender a vender no garantiza ingresos.**

## B1 · Lista: "5 cosas que le pasan a una vela"
- **Formato:** lista con voz · **9:16 · 25 s** · **Gancho:** lista cerrada con nombres técnicos.
- **Patrón:** C22 (lista como palanca de gancho, fuente), C46.

| Seg | Imagen | Voz | Texto en pantalla |
|---|---|---|---|
| 0 a 3 | Vela con defecto | "Cinco cosas que le pueden pasar a tu vela (y cómo se llaman)." | "5 problemas de una vela" |
| 3 a 18 | Un plano por problema (3 s c/u): hundimiento, grietas, sudor, manchas, sin aroma | Nombra cada uno | "1 Se hunde" … "5 Sin aroma" |
| 18 a 25 | Pantalla de cierre | "El curso tiene un módulo entero para esto." | "Un módulo entero para esto ↓" |

- **CTA:** "Mirá el temario". **Gancho alternativo:** "Tu vela se hundió. Tiene nombre y tiene solución." (la landing dice "Tiene solución").
- **Hipótesis:** nombrar los defectos conecta con quien ya los vivió y manda tráfico más calificado.
- **Política:** nombra problemas, no promete resultados.

## B2 · Pantalla grabada: "¿Cuánto cuesta hacer UNA vela?"
- **Formato:** pantalla grabada con planilla · **9:16 · 28 s** · **Gancho:** pregunta con curiosidad abierta.
- **Patrón:** C19 (resultado/valor antes que adjetivos), demostración del producto.

| Seg | Imagen | Voz | Texto |
|---|---|---|---|
| 0 a 4 | Planilla vacía con "Costo por vela" | "¿Cuánto cuesta de verdad hacer una sola vela?" | "¿Cuánto cuesta UNA vela?" |
| 4 a 20 | Se completan cera, pabilo, frasco, aroma y se suma | "Sumás cera, pabilo, frasco y aroma, y recién ahí sabés cuánto cobrar." | "Ejemplo con números inventados" |
| 20 a 28 | Pantalla de cierre | "En el módulo 22 aprendés a ponerle precio." | "Módulo 22: cuánto cobrar ↓" |

- **CTA:** "Mirá el módulo 22".
- **Política:** **los números son ilustrativos y se rotulan así**; no hay ganancia mostrada. Lleva el aviso en pantalla: "El curso es educativo: no garantiza ingresos."
- **Hipótesis:** una pregunta práctica atrae a quien piensa en vender, el segmento que más le sirve a este producto.
- **Material:** una planilla propia, **no la calculadora del curso** (a menos que el productor autorice mostrarla).

## B3 · Pantalla dividida: "Videos sueltos vs. un curso en orden"
- **Formato:** pantalla dividida · **1:1 (1080×1080) · 15 s** (o 9:16) · **Gancho:** contraste.
- **Patrón:** C22 (contraste), tabla comparativa de la landing.

| Lado izquierdo | Lado derecho |
|---|---|
| "Videos sueltos" (pestañas abiertas, desorden) | "22 módulos en orden" (lista de módulos) |
| "Prueba y error con tus materiales" | "Un módulo entero de errores" |
| "Buscar proveedores" | "Lista de proveedores por país" |

- **CTA:** "Mirá los 22 módulos".
- **Política:** compara formas de aprender, sin nombrar canales ni marcas ajenas.
- **Material:** maquetado en Canva con capturas propias.

---

# Producto C: Pastelería canina y felina (afiliada) · español neutro
**Destino:** https://pasteleria-canina-curso.netlify.app · **Promesa (H1):** "Más de 30 recetas de pastelería para tu mascota. Desde cero." · **Evento:** `ViewContent` → `InitiateCheckout`.
**Hechos de la landing:** 30+ recetas (galletas, muffins, tortas y especiales, decoración), ingredientes aptos y a evitar, conservación. **"Según el productor": proporciones revisadas por un veterinario y sin azúcar en las recetas.** El curso es educativo y no reemplaza al veterinario.
**Sin corpus propio en este nicho**: estas piezas se apoyan en patrones de otros nichos y no en un anuncio de pastelería canina observado.

## C1 · "¿Es seguro para mi mascota?": pregunta y respuesta con sticker de comentario
- **Formato:** UGC a cámara con sticker de respuesta a comentario · **9:16 · 25 s** · **Gancho:** pregunta de objeción.
- **Patrón:** C25 (sticker de respuesta a comentario), C46.

| Seg | Imagen | Voz | Texto |
|---|---|---|---|
| 0 a 3 | Persona a cámara; sticker con la pregunta | "La primera duda de todas: ¿es seguro darle tortas a mi mascota?" | "¿Es seguro para mi mascota?" |
| 3 a 15 | Cocina, ingredientes sobre la mesa | "El curso te enseña qué ingredientes son aptos y cuáles evitar." | "Ingredientes aptos y a evitar" |
| 15 a 22 | Mascota con un premio casero | "Y si tu mascota tiene alguna condición, consulta primero a tu veterinario." | "Consulta a tu veterinario" |
| 22 a 25 | Pantalla de cierre | "Mira las 30 recetas en el enlace." | "30+ recetas ↓" |

- **CTA:** "Mira las recetas". **Hipótesis:** responder la objeción principal en el primer segundo atrae a quien duda de la seguridad.
- **Política:** **no afirma beneficios de salud** ni "recetas saludables"; remite al veterinario. **El sticker debe ser un comentario real** recibido en tus redes; si no lo tenés, se usa un texto de pregunta sin simular un comentario ajeno.
- **Material:** vos a cámara, una mascota y los ingredientes.

## C2 · Resultado primero: la torta de cumpleaños
- **Formato:** resultado primero, con música · **9:16 · 18 s** · **Gancho:** resultado visual.
- **Patrón:** C19 (resultado primero), C28 (un solo plano principal).

| Seg | Imagen | Texto |
|---|---|---|
| 0 a 3 | La torta terminada con la vela y la mascota | "Torta de cumpleaños para tu perro" |
| 3 a 12 | Tres cortes rápidos: galletas, muffins, torta | "De la galleta a la torta" |
| 12 a 18 | Pantalla de cierre | "30+ recetas, desde cero ↓" |

- **CTA:** "Mira las recetas". **Gancho alternativo:** "Mi perro cumple años y la torta la hice yo."
- **Política:** sin texto de salud. La mascota no debe estar en riesgo (nada de ingredientes tóxicos a la vista: chocolate, xilitol, uvas).
- **Material:** tus propias fotos y tomas, **no material del curso**.

## C3 · Carrusel: "Así está organizado el curso"
- **Formato:** carrusel · **4:5 · 5 tarjetas** · **Gancho:** índice visual.
- **Patrón:** C21 (grilla rotulada).

| Tarjeta | Contenido |
|---|---|
| 1 | "De la galleta a la torta: así está organizado el curso" |
| 2 | Ficha 1: Galletas (hígado y perejil, pollo y cilantro, calabaza y cúrcuma, manzana y canela) |
| 3 | Ficha 2: Muffins · Ficha 3: Tortas y especiales (incluye gelatina para gatos, tamales) |
| 4 | Ficha 4: Decoración apta (cobertura de yogur griego) |
| 5 | "Más de 30 recetas, desde cero" + "Mira el temario ↓" |

- **Hipótesis:** mostrar el contenido concreto sube la calidad del clic. **Política:** las recetas se nombran, no se dan cantidades. Incluir "Consulta a tu veterinario" en la última tarjeta.
- **Material:** fotos con derechos; Canva.

---

# Producto D: Consultorio en Orden (producto propio) · voseo
**Destino:** https://consultorio-en-orden-kit.netlify.app · **Promesa (H1):** "Los 20 documentos que tu consultorio necesita, listos para completar" · **Evento:** `ViewContent` → `InitiateCheckout` **(hoy sin medición: falta el píxel)**.
**Hechos de la landing:** 20 documentos editables en Word, ordenados en 8 momentos del tratamiento, campos entre corchetes, kit de primera sesión (5 documentos), garantía de 7 días, pago único.
**Transparencia obligatoria que no se oculta:** son **modelos de referencia**, no garantizan validez legal, se redactaron con ayuda de IA y no pasaron por revisión legal formal. **Ninguna pieza debe sugerir validez legal ni reemplazo del asesoramiento.**
**Salud mental:** las piezas hablan de **tu práctica profesional** (papeles, orden), **nunca de la salud mental de quien mira ni de pacientes con una condición** (política de atributos personales; ver `politicas-meta.md`). **Sin corpus propio en este nicho.**

## D1 · POV: "Terminás de atender y todavía te queda redactar el consentimiento"
- **Formato:** POV a cámara · **9:16 · 20 s** · **Gancho:** situación reconocible.
- **Patrón:** C45 y C46 (gancho de situación específica).

| Seg | Imagen | Voz | Texto |
|---|---|---|---|
| 0 a 3 | Escritorio, pantalla en blanco | "Terminás de atender y todavía te falta armar el consentimiento… de cero." | "POV: tenés que redactar otra vez el consentimiento" |
| 3 a 12 | Carpeta con papeles sueltos; pantalla con documento | "Honorarios, ausencias, informes: cada cosa en un archivo distinto." | "Honorarios · Ausencias · Informes" |
| 12 a 20 | Carpeta ordenada con los 8 momentos | "Un documento para cada momento del tratamiento." | "20 documentos · 8 momentos" |

- **CTA:** "Mirá qué incluye". **Gancho alternativo:** "Hablar de honorarios y ausencias te incomoda porque nunca quedó por escrito" (frase de la landing).
- **Política:** el protagonista es el profesional. Nada de pacientes con diagnósticos.

## D2 · Carrusel: "¿En qué momento del tratamiento estás?"
- **Formato:** carrusel · **4:5 · 5 tarjetas** · **Gancho:** pregunta de elección.
- **Patrón:** C21 y C27.

| Tarjeta | Contenido |
|---|---|
| 1 | "¿En qué momento del tratamiento estás?" |
| 2 | Antes de la primera sesión · Primera sesión |
| 3 | Durante el tratamiento · Cuando te piden un papel · Trabajo con otros |
| 4 | Casos particulares · Honorarios · Cierre |
| 5 | "20 documentos editables · Mirá qué incluye ↓" + "Modelos de referencia: adaptalos a tu jurisdicción" |

- **Hipótesis:** una estructura visible de 8 momentos comunica orden mejor que una lista.
- **Política:** la última tarjeta lleva el aviso corto de modelos de referencia.

## D3 · Pantalla grabada: "Campos entre corchetes"
- **Formato:** pantalla grabada · **9:16 · 25 s** · **Gancho:** demostración.
- **Patrón:** demostración del producto; reduce la incertidumbre de "¿qué recibo?".

| Seg | Imagen | Voz | Texto |
|---|---|---|---|
| 0 a 4 | Documento en Word con campos entre corchetes | "Así se ve uno de los 20 documentos del kit." | "Documento editable (Word)" |
| 4 a 18 | Se reemplazan [NOMBRE], [FECHA], [HONORARIOS] | "Completás los campos entre corchetes y lo adaptás a tu matrícula." | "Completás los campos" |
| 18 a 25 | Pantalla de cierre | "Son modelos de referencia: adaptalos a tu jurisdicción." | "Modelos de referencia · Mirá el kit ↓" |

- **CTA:** "Mirá el kit". **Material:** una captura de pantalla de **uno de tus documentos, con datos ficticios**.
- **Política:** **no muestra datos de pacientes reales**; ficticios y rotulados.

---

## Resumen
| # | Producto | Formato | Gancho | Prox. | Destino |
|---|---|---|---|---|---|
| A1 | Velas y jabones | UGC con manos | Problema específico | 9:16 | velas-y-jabones-3en1 |
| A2 | Velas y jabones | Carrusel de elección | Elegí por dónde empezar | 4:5 | velas-y-jabones-3en1 |
| A3 | Velas y jabones | Proceso sin voz | Proceso | 9:16 | velas-y-jabones-3en1 |
| B1 | Velas emprender | Lista | 5 cosas | 9:16 | velas-artesanales-curso |
| B2 | Velas emprender | Pantalla grabada | ¿Cuánto cuesta una vela? | 9:16 | velas-artesanales-curso |
| B3 | Velas emprender | Pantalla dividida | Contraste | 1:1 | velas-artesanales-curso |
| C1 | Pastelería | UGC + sticker | Objeción de seguridad | 9:16 | pasteleria-canina-curso |
| C2 | Pastelería | Resultado primero | Torta de cumpleaños | 9:16 | pasteleria-canina-curso |
| C3 | Pastelería | Carrusel | Índice visual | 4:5 | pasteleria-canina-curso |
| D1 | Consultorio | POV | Situación | 9:16 | consultorio-en-orden-kit |
| D2 | Consultorio | Carrusel | Elegí tu momento | 4:5 | consultorio-en-orden-kit |
| D3 | Consultorio | Pantalla grabada | Demostración | 9:16 | consultorio-en-orden-kit |
