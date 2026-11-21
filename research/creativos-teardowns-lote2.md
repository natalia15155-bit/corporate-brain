# Teardowns de creativos: lote 2 (videos completos de velas y de un curso de velas)

Fecha de captura: 2026-11-21. Fuente de las páginas: `admanage.ai` (agregador de la Biblioteca de Meta). Los videos están alojados en `files.adscan.ai`. Se bajaron a una carpeta aparte, se leyeron con ffmpeg/ffprobe y **no se ejecutaron ni se guardaron en el repo**.

## Qué significa "winner" acá
No hay datos de conversión de terceros. Como **indicio** uso solo lo público: cuánto lleva activo un anuncio y cuántas variantes corre el anunciante. Un anuncio que sigue vivo mucho tiempo sugiere que su anunciante lo sigue financiando; **no prueba que venda ni que sea rentable.**

| Anunciante | Señal pública (según agregador) | Lectura |
|---|---|---|
| Living Good Candle Co (velas de cera de abeja, kits) | 8 anuncios en video, **todos activos**; los más largos: 534, 389 y 93 días | **Mejor indicio de duración en tu nicho** [Fuente] |
| The Soapbox (guía de recetas de velas, tráfico a `offer.easycraftforbeginners.com`) | 24 anuncios desde oct 2025, **0 activos hoy**; sus titulares más largos corrieron 5 o 6 días | **No es winner por este indicio.** Por qué se apagaron: **no se sabe** |
| Homemade Candle Making (T01) y Homemade Method | 1 anuncio cada uno, ambos "1.188 a 1.189 días, desde ago 2023" | Fechas idénticas en dos anunciantes distintos: puede ser un **tope o artefacto del agregador** [Inf]. Verificar. Homemade Method es de cambio corporal (otro nicho, riesgo alto): no se descargó |

El orden de las tarjetas (más vistos primero) se cruzó con los días activo; es una **inferencia** que coincide con los titulares, no un dato directo.

## Medidas de los 6 videos [Obs, medición propia]
Todos son **9:16 (360×640)**, con audio y locución en inglés (transcripción con modelo `tiny`: **revisar a oído**).

| Video | Duración | Cortes | Ritmo | Primer corte |
|---|---|---|---|---|
| LG-534 (activo 534 d) | 24,9 s | 9 | 1 corte cada 2,8 s | 4,7 s |
| LG-389 (activo 389 d) | 52,7 s | 31 | 1 cada 1,7 s | |
| LG-93 (activo 93 d) | 38,9 s | 5 | 1 cada 7,8 s | |
| SB-1 | 31,6 s | 12 | 1 cada 2,6 s | 0,7 s |
| SB-2 | 48,2 s | 30 | 1 cada 1,6 s | 1,1 s |
| SB-3 | 56,9 s | 16 | 1 cada 3,6 s | |

## Fichas

### LG-534: el más duradero de velas (534 días)
- **Gancho (0 a 4 s) [Obs]:** voz en primera persona: busca una vela que no le moleste a su nariz sensible y sea segura para sus mascotas. Imagen: manos acomodando una vela sobre un mueble, planta al fondo.
- **Tipo [Inf]:** gancho de **problema específico con identidad** (nariz sensible, mascotas) en formato de historia de búsqueda.
- **Estructura [Obs]:** problema → "encontré la indicada" → quién es la marca y qué la distingue (aceites esenciales propios, pruebas) → recomendación final.
- **Visual [Obs]:** B-roll de la vela encendida y del recorte de mecha, un plano con un gato, **subtítulos blancos sin caja** en el tercio inferior, luz natural, sin música destacada de por medio detectada.
- **Retención [Inf]:** movimiento de manos en el primer plano largo (4,7 s sin corte), luego un corte cada ~2 s; el gato es una interrupción de patrón.

### LG-389: "empaquetá pedidos conmigo" (389 días)
- **Gancho [Obs]:** "vamos a empacar pedidos del menos caro al más caro". Formato de **proceso/detrás de escena**.
- **Estructura [Obs]:** un pedido por vez con nombre del cliente, contenido y total; cierre con otro pedido. 31 cortes en 53 s.
- **Mecanismo [Inf]:** prueba de demanda (hay pedidos reales) más satisfacción de ver armar paquetes.
- **Riesgo para replicar:** muestra **nombres y montos de clientes**. Para tus piezas, solo con permiso o con datos anonimizados.

### LG-93 (93 días)
- **Gancho [Obs]:** estacionalidad ("todavía es temprano para otoño, pero algunos clientes ya están listos"). Mismo formato de pedido, con detalle de ingredientes de cada vela. 5 cortes: es el más pausado.

### SB-1, SB-2, SB-3: guía de recetas de velas (The Soapbox)
- **Gancho [Obs]:** los tres abren con **resultado económico en primera persona**: "mis primeros 500 dólares", "paga mis compras del súper", "pagó mi factura del teléfono". Precio de entrada de 17 o de 7.
- **Estructura [Obs]:** resultado → cómo empezó (hobby, estrés) → qué incluye (430 recetas) → "sin habilidades" → prueba social → precio → llamado a hacer clic en el enlace.
- **Visual [Obs]:** creadora a cámara alternada con B-roll de elaboración, **subtítulos en caja blanca con texto negro**, mockup del producto, pantalla del área de miembros con zoom, y cierre sobre fondo claro con precio.
- **Prueba social [Obs]:** "más de 1.200 mujeres usando la guía"; **capturas de notificaciones de Shopify** con pedidos (SB-2).
- **Señales de alerta [Obs]:** el mismo producto aparece a **17 en SB-1 y a 7 en SB-2/SB-3**; SB-2 tacha un precio anterior de **97** ("antes de que vuelva a 97"). Sin fecha ni cupo reales, es escasez y ancla dudosas.

## Lo que sí se puede decir (patrones)
1. **Los anuncios que más duran en velas (LG) no usan promesa de ingresos**: usan problema concreto, proceso y producto real **[Obs]**. Los que sí la usan (SB) figuran sin anuncios activos hoy **[Obs, según agregador]**. Es una correlación de dos anunciantes, no una causa **[Inf]**.
2. **Subtítulos incrustados y locución en primera persona** están en los 6 videos **[Obs]**; el formato de caja blanca o texto simple varía.
3. **El gancho entra por una situación específica** (nariz sensible, pedidos de hoy, estacionalidad), no por una categoría **[Inf]**.
4. **Mostrar el proceso** (hacer o empacar) ocupa la mayor parte del metraje en los de más días **[Obs]**.

## Riesgos de política que se observan (no replicar)
- **Promesas de ingresos** en SB-1, SB-2 y SB-3 ("paga mi factura", "ingresos extra", "plano para ganar dinero desde casa").
- **Prueba social no verificable**: capturas de Shopify con pedidos sin identificar la tienda, "más de 1.200 mujeres".
- **Escasez y precio de referencia sin fecha** (97 tachado, 17 vs 7).
- **Encuadre emocional** ("estresada, ansiosa y agotada") ligado a un producto: cuidado con atributos personales.

## Límites
- Todo vía agregador; **no confirmado en la Biblioteca de Meta**.
- Transcripción con `tiny`: puede contener errores de palabras.
- Vi 3 de los 6 videos como hoja de contactos (1 cuadro cada 2 s); de los otros 3 solo medí cortes y transcribí.
- Días activo ≠ conversión.
- Cero piezas de pastelería canina/felina o de psicología: el agregador no devolvió anunciantes de esos nichos (la única cercana a psicología, Naturalistico, es 97% imagen y su gancho "¿Todavía cargás con trauma sin resolver?" es **exactamente el tipo de atributo personal que Meta restringe**; sirve como ejemplo de qué NO hacer).
