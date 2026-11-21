# Puente entre el creativo y la landing

Una persona que hace clic espera ver **la misma promesa**. Si el anuncio dice una cosa y el H1 otra, el visitante se va y el `ViewContent` por clic cae.

## Regla de coherencia
1. **La promesa del anuncio = el H1** (misma idea, mismas palabras clave). Ej.: anuncio "desde cero" → H1 "…desde cero".
2. **Solo se promete en el anuncio lo que la landing muestra** y puede sostener (garantía, qué incluye, cantidades).
3. **Un anuncio, una landing.** El destino cambia si cambia la promesa.
4. **Mismo idioma y variante** (voseo con voseo, neutro con neutro).
5. **Mismo tono visual** en la primera pantalla.
6. **No se prometen precios ni cupones** en el anuncio salvo que estén vigentes y visibles en la landing.

## Verificar antes de lanzar
- Abrir la URL publicada y leer el H1 (no el del repositorio): puede diferir. Caso real de este proyecto: velas y jabones tenía un H1 publicado distinto del del repo.
- Confirmar que el píxel está inicializado. Caso real: el kit "Consultorio en Orden" estaba sin ID de píxel.
- Confirmar el enlace de afiliada y su parámetro de origen.

## Eventos por etapa
| Etapa | Evento | Cuándo se dispara |
|---|---|---|
| Llegó a la landing | `PageView` | Al cargar |
| Vio el contenido | `ViewContent` | Al cargar (con `content_name`) |
| Fue al pago | `InitiateCheckout` | Clic en el botón de compra |
| Compró | **no medible** en afiliada (ocurre en Hotmart) | |

## Parámetros de seguimiento
Usar `utm_campaign` (producto), `utm_content` (id de la pieza y variante) y `utm_source`. Con un solo píxel para varias landings, los parámetros son lo que permite separar los datos.
