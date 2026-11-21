# Teardowns de creativos: lote 1

Fecha de captura: 2026-11-21. Fuentes: `admanage.ai` y `topgrowthmarketing.com`, agregadores de terceros que republican anuncios de la Biblioteca de Anuncios de Meta. Lectura con `curl`, sin iniciar sesión.

## Alcance y límites (leer primero)
- **Vi solo texto** (titular, copy, etiquetas, días activo). **No vi ningún video ni imagen**: los servidores de miniaturas no están habilitados. Por eso no hay línea de tiempo segundo a segundo, ni planos, ni cortes, ni música. Esos campos de la plantilla quedan **sin observar**.
- **Fuente de los datos = agregador, no Meta.** Los datos no se verificaron contra la Biblioteca de Anuncios.
- **Los "why it works" de TGM son su interpretación** **[Fuente]**; no los tomo como mecanismo probado.
- Días activo, vistas o presencia en un swipe file son **indicios, no prueba de conversión**.
- Los 25 anuncios de TGM son de **producto físico** (belleza, moda, hogar). Sirven para extraer palancas, no formato de curso. Leí 15; los demás quedaron fuera del texto extraído.

---

## T01: anuncio de curso de velas (la única pieza de tu nicho)
Fuente: `admanage.ai/ad-library/homemade-candle-making`

| Campo | Dato | Marca |
|---|---|---|
| Anunciante | Homemade Candle Making | Obs |
| Producto | Curso de velas | Obs (por el texto del propio anuncio) |
| Formato | Video | Obs |
| Anuncios del anunciante | 1 (vivo), desde ago 2023 | Obs (según agregador) |
| Tiempo activo | ~1.188 a 1.189 días | Obs (según agregador) |
| Primera línea del copy | Testimonio en primera persona: terminó el curso hace un mes y recibe "tantos pedidos" que no lo puede creer | Obs |
| CTA | "Learn more" | Obs |
| Destino | yourhomemadeworld.com | Obs |
| Gancho (tipo) | **Resultado primero, con voz de cliente** (testimonio) | Inf |
| Estructura | Resultado → valor del curso ("superó mis expectativas") → agradecimiento | Inf (solo del copy) |
| Archivo de video | 12,6 s, 640×640 (**1:1**), H.264 + audio AAC. Fuente: bucket público del agregador; SHA-256 (16 primeros) `1b4a9feb129e025c`. No se guarda en el repo | Obs |
| Cortes | **0** (detección de escena > 0,3): un solo plano fijo | Obs |
| Visual | Plantilla estática tipo Canva: óvalo con foto/clip de una vela en mano, ondas de color tierra, tipografía en mayúsculas | Obs |
| Movimiento | Solo el clip del óvalo: la vela está encendida (s0 a s2) y se apaga echando humo (s3 a s12). Todo lo demás no se mueve | Obs |
| Texto en pantalla (fijo los 12 s) | "CANDLE MAKING"; viñetas: scented candle, massage candles, natural wax candles, certificate included, "+23.000 students"; botón "CLICK ON LEARN MORE"; barra de búsqueda falsa "Exclusive candle recipes" | Obs |
| Audio | Presente, continuo (volumen medio −18,7 dB, pico −0,5 dB; sin silencios de más de 0,4 s a −35 dB). **Detección de voz: 0 tramos**, o sea que no hay habla detectable. Whisper tiny devolvió "Thank you." con 44% de confianza: es una alucinación típica ante música, **no se toma como dato** | Obs |
| Tipo de audio | Probablemente música o ambiente de fondo. No se identificó la pista | Inf |
| Rol del video frente al copy | El video es una **ficha de especificaciones**; la promesa y el testimonio van en el texto del anuncio | Inf |

**Mecanismo [Inf]:** prueba social específica en primera persona; el resultado ("pedidos") aparece antes que la explicación del producto.
**Qué NO se replica:** el testimonio ni su contenido. Nosotros solo podemos usar testimonios reales, con permiso y verificables.
**Riesgo de política [Fuente]:** promete un resultado económico ("muchos pedidos"). En Meta, las afirmaciones de ingresos o resultados son terreno de rechazo. No usar este ángulo sin testimonio real y sin leer la política vigente.
**Lectura de las señales:** 1.188 días activo con un solo anuncio es un indicio de que sigue corriendo; no dice si convierte ni cuánto gasta.

---

## T02 a T12: palancas de gancho observadas (anuncios de producto físico)
Fuente: `topgrowthmarketing.com/paid-ads-library/product-ad-examples/`. Titulares citados tal cual figuran **[Obs]**; la palanca es **[Inf]** mía, coincidente con la etiqueta de TGM **[Fuente]**.

| # | Marca | Formato | Primera línea | Palanca |
|---|---|---|---|---|
| T02 | Jones Road | Video | "Okay, the before and after??" | Resultado primero |
| T03 | Tarte | Carrusel | "NOT a foundation. NOT a skin tint…" | Definir por negación + 3 datos |
| T04 | Rare Beauty | Video | "…rethinking design to make beauty more accessible" | Historia detrás del diseño |
| T05 | Peach & Lily | Imagen | "The results are in." | Estudio primero, con fuente chica |
| T06 | Adore Me | Imagen | "…a lingerie style… for every Zodiac sign" | Personalización: grilla de 12 signos |
| T07 | Tracksmith | Carrusel | "Inspired by… Roger Bannister…" | Historia/herencia que justifica precio |
| T08 | Sunday Riley | Video | "Viral, clinically proven, and now an Allure… winner" | Pila de pruebas |
| T09 | Mott & Bow | Video | "…whenever I need to look put together…" | Primera persona + descripción de ajuste |
| T10 | NuFACE | Video | "BACK IN STOCK" | Prueba social + urgencia ("Sold out 3x") |
| T11 | Abercrombie & Fitch | Imagen | "…in collaboration with the fitness experts at Barry's" | Credibilidad prestada |
| T12 | Jenni Kayne | Video | "The skirt that earns its way back into rotation every fall." | Durabilidad/uso repetido |

## Patrones que se repiten (lo que sí se puede decir)
1. **Una sola razón de compra por anuncio** y se dice en la primera línea **[Obs]** (11 de 11 leídos).
2. **Resultado, estudio o prueba antes que adjetivos** (T02, T05, T08) **[Obs]**; el mecanismo (credibilidad por especificidad) es **[Inf]**.
3. **Personalizar para que la persona se busque a sí misma** (T06) **[Obs]**.
4. **Escasez solo cuando es un dato** (T10: "Sold out 3x") **[Obs]**. Para nosotros: solo con fechas o cupos reales.
5. **Claims clínicos llevan la fuente a la vista** (T05) **[Obs]**.

## Observación visual (miniaturas, agregada tras habilitar los servidores de imágenes)
Cada archivo es **un solo cuadro de 600 px**; en los videos es una captura, no la línea de tiempo. Cuatro cuadros revisados a ojo **[Obs]**:

| Pieza | Proporción | Qué se ve | Texto en pantalla |
|---|---|---|---|
| Brooklyn Candle Studio (video) | 9:16 | Persona a cámara, luz natural, sostiene dos productos hacia el lente | Subtítulo blanco sin caja, tercio superior, frase cortada ("that instantly elevate") |
| Jones Road (video) | 9:16 | Primerísimo plano: aplica el producto sobre la piel; cajas del producto en mano | Título serif con nombre y producto; **sticker de "respuesta a comentario"** ("Is it full coverage") |
| Peach & Lily (imagen) | 4:5 | Frasco y textura a la derecha, cifras en columna a la izquierda | Titular con promesa, 4 porcentajes y **nota al pie con la fuente del estudio** |
| Adore Me (imagen) | 4:5 | Grilla 3×4 de 12 productos, cabecera de color, logo al pie | "Your Lingerie Horoscope"; cada producto rotulado con un signo |

**Proporciones de los 25 cuadros [Obs]:** 14 en 9:16, 8 en 4:5, 2 en 1:1, 1 en 3:4. Es decir, 9:16 domina, y el 4:5 es el segundo formato (imagen estática).

**Inferencias [Inf] (a validar):**
- El **sticker de comentario** convierte el anuncio en una respuesta a una duda real; es un formato replicable sin copiar nada, solo con comentarios propios.
- El **subtítulo cortado a mitad de frase** sugiere subtítulos "palabra por palabra"; solo se confirma viendo el video.
- La **grilla rotulada** hace que la persona busque su ítem: sirve para "elegí por dónde empezar" en velas, jabones o recetas.

**T01 completo:** la miniatura del agregador era solo el logo (60×34 px), pero el video entero se obtuvo aparte y se desarmó (ver tabla de T01). Dispositivos de retención observados: ninguno por montaje (sin cortes); solo el humo de la vela como movimiento. **La retención se apoya en el texto y en el copy, no en el ritmo [Inf].** Frente a Brooklyn Candle Studio (UGC a cámara, 9:16) es el extremo opuesto: plantilla fija 1:1.

**Cifra de prueba social:** "+23.000 students" aparece sin fuente. Para tus piezas solo se usan cifras reales y verificables de la plataforma.

## Qué falta para completarlo
- Ver los **videos** (línea de tiempo, plano, cortes, subtítulos, audio): requiere que me pases archivos o enlaces, o habilitar los servidores de miniaturas y video.
- Piezas de **tus otros 3 nichos** (pastelería canina/felina, psicología): no aparecieron.
- Confirmar T01 y los demás directamente en la Biblioteca de Anuncios de Meta.
