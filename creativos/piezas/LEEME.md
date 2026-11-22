# Piezas de velas (motion graphics en la estética de las landings)

Generadas con `creativos/motion/render.cjs` (ilustración vectorial + texto animado). **No usan créditos, fotos ni video de terceros.** Sin audio.

| Archivo | Pieza | Formato | Duración | Destino |
|---|---|---|---|---|
| A1.mp4 | Velas y jabones 3 en 1: "¿Se te hundió la vela?" | 9:16 | 25 s | velas-y-jabones-3en1 |
| A2_1..4.png | Carrusel "¿Qué te gustaría hacer primero?" | 4:5 | 4 tarjetas | velas-y-jabones-3en1 |
| B1.mp4 | Velas para emprender: "5 cosas que le pasan a tu vela" | 9:16 | 22 s | velas-artesanales-curso |
| B2.mp4 | Velas para emprender: "¿Cuánto cuesta UNA vela?" | 9:16 | 28 s | velas-artesanales-curso |
| B3.mp4 | Velas para emprender: videos sueltos vs. curso en orden | 1:1 | 15 s | velas-artesanales-curso |

## Antes de usarlas
- **Sin audio.** Agregá música con licencia de la biblioteca de la plataforma. No hay locución.
- **A2, tarjeta 3 (velas navideñas):** usarla solo en temporada real y sacarla después.
- **B2:** los números son un ejemplo inventado y la pieza lo dice en pantalla. Mantener ese rótulo y el aviso de que el curso no garantiza ingresos.
- **Aviso "Publicidad · Enlace de afiliada de Hotmart":** está al final de A1, B1, B2 y B3. Es una decisión de transparencia; sacalo si preferís otro formato.
- **Precios, cupones y garantía no aparecen**: verificalos antes de agregarlos.
- **Nada se publicó ni se cargó en una cuenta publicitaria.**

## Versiones con voz y música (`*_voz.mp4`)
- **Voz:** sintetizada en local con Piper, modelo `es_AR-daniela-high` (español rioplatense). **Licencia del modelo: CC BY-SA 4.0** (OpenSLR 61). **Revisar antes de usarla en anuncios pagos**: exige atribución y "compartir igual", y no está claro cómo aplica al audio generado. Alternativas con licencia permisiva (pero **sin acento argentino**): `es_MX/claude/high` (Apache 2.0), `es_ES/davefx/medium` (CC0), `es_MX/ald/medium` (Unlicense).
- **Música:** ambiental, **sintetizada por código (original)**; baja de volumen mientras habla la voz. Es simple. Para un resultado más "de plataforma", reemplazala por una pista de la biblioteca de música comercial de Instagram/TikTok.
- **No se escuchó**: la verificación fue por medición (volumen) y por reconocimiento de voz con un modelo chico, que entendió casi todo pero con errores. **Hay que escucharla antes de publicar.**
- Reproducir: `python3 creativos/motion/audio.py <A1|B1|B2|B3> <video_sin_audio> <salida> <modelo.onnx>`.
- Las versiones sin audio (`A1.mp4`, etc.) se conservan.
