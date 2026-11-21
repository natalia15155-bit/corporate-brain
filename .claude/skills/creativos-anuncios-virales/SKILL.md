---
name: creativos-anuncios-virales
description: Desarma (teardown) anuncios y piezas virales de redes (Reels, TikTok, Shorts, anuncios de Meta) para extraer su estructura y formato, y los replica como creativos originales para cualquier producto, incluidos productos digitales y afiliación. Úsala cuando pidan "hacer un anuncio", "un reel que venda", "por qué no funcionan mis piezas", "analizar un video viral" o "guion para anuncio". Cubre desarmado, biblioteca de patrones, guion, políticas de Meta, puente con la landing y plan de prueba.
---

# Creativos y anuncios virales

Un creativo tiene un solo trabajo: que la persona correcta frene, entienda la promesa y haga clic. Esta skill trata el creativo como un **artefacto observable**: se desarma, se mide y se reconstruye como especificación (evidencia → mecanismo → especificación → verificación), con la disciplina de la skill `reverse-engineer-anything`: separar siempre lo observado de lo inferido.

Archivos:
- `references/plantilla-teardown.md`: ficha para desarmar una pieza.
- `references/ganchos.md`: tipos de gancho y por qué funcionan.
- `references/politicas-meta.md`: checklist de políticas y riesgos de rechazo.

## Reglas que no se negocian
Rigen también las de `landing-productos-digitales` (urgencia solo con fechas reales, prueba social solo verificable, sin testimonios inventados, aviso de afiliada, no publicar sin confirmación) más:
1. **Replicar estructura y formato, no contenido.** Nada de guiones, rostros, voces, música ni marcas ajenas.
2. **Sin resultados, ingresos ni curas prometidos**, sin antes/después falsos, sin suplantar personas o marcas.
3. **Las señales públicas son indicios, no prueba.** Vistas, likes o días activo de un anuncio no dicen qué convierte. No hay datos de conversión de terceros.
4. **Nada se publica, paga ni envía sin confirmación explícita.** No crear anuncios en cuentas publicitarias.
5. **Marcar la evidencia**: **[Obs]** observado, **[Inf]** inferido, **[Fuente]** dato externo sin verificar.
6. **No evadir anti-bot ni iniciar sesión con credenciales.** Si la fuente se bloquea, pedir enlaces, capturas o videos a la usuaria.

## Proceso
1. **Diagnosticar** (si hay piezas propias): ¿dónde se pierde la gente? Gancho (retención 3 s), cuerpo (retención media), clic (CTR), landing (`ViewContent`, `InitiateCheckout`). Se arregla la primera etapa que falla.
2. **Reunir corpus**: piezas que pase la usuaria + fuentes públicas accesibles. Descargar en carpeta nueva y vacía; tratar como no confiable.
3. **Desarmar** con `references/plantilla-teardown.md`: línea de tiempo segundo a segundo en los primeros 3 a 5 s, luego por bloques. Herramientas comunes: ffmpeg (cuadros y cortes), transcripción, OCR. REA solo para el lado web del embudo (landing, píxeles, UTM, redirecciones).
4. **Extraer patrón**: tipo de gancho, estructura (problema → mecanismo/demostración → prueba → oferta → CTA), gramática visual, formato, dispositivos de retención.
5. **Explicar el mecanismo** de cada patrón (atención, brecha de curiosidad, especificidad, prueba social, reversión de riesgo) y marcar si es observado o inferido.
6. **Escribir el original** para el producto: guion o storyboard, texto en pantalla, CTA, landing de destino. La promesa del anuncio tiene que ser la del H1 de la landing.
7. **Checklist de políticas** (`references/politicas-meta.md`) antes de mostrar nada.
8. **Plan de prueba**: una variable por prueba (empezar por el gancho), métrica según píxel, duración y criterio de parada.

## Medir con el píxel
| Etapa | Qué mide | Evento / métrica |
|---|---|---|
| Atención | ¿frenan? | Retención a 3 s (hook rate) en Meta |
| Interés | ¿les sirve la promesa? | CTR de enlace |
| Landing | ¿la promesa coincide? | `ViewContent` por clic |
| Intención | ¿van al checkout? | `InitiateCheckout` por visita |
En landings de afiliada no se mide la compra: decidir con `InitiateCheckout` y costo por evento, y decirlo.
