# Modelo de auditoría del conocimiento

Sirve para decidir **qué de lo aprendido se puede usar** y **qué hay que probar antes**. Todo conocimiento vive como una fila en `ledger-afirmaciones.csv` y se revisa con `python3 -I scripts/auditar.py references/ledger-afirmaciones.csv`.

## Escala de confianza
| Grado | Criterio | Uso permitido |
|---|---|---|
| A | Observado por nosotros, o fuente oficial leída completa | Se puede usar |
| B | Oficial o primaria vista solo vía resumen o prensa | Hipótesis fuerte; verificar el texto |
| C | Proveedor o practicante con interés comercial | Hipótesis a probar; no usar como argumento |
| D | Sin fuente | No usar |

## Ciclo de vida de una afirmación
`no_verificada` → `en_prueba` → `confirmada_propia` o `refutada`.
- Una afirmación de fuente **solo** pasa a `confirmada_propia` con datos de la cuenta propia (retención, CTR, `InitiateCheckout`).
- `refutada` no se usa en guiones.
- Con el píxel de afiliada solo se confirma hasta `InitiateCheckout`, nunca compra.

## Auditoría por etapa (preguntas que debe poder responder el ledger)
1. ¿Cada patrón de gancho usado en un guion tiene afirmación asociada y grado?
2. ¿Hay alguna afirmación C/D sosteniendo una decisión? Si sí, es una prueba pendiente, no una regla.
3. ¿Los números (1,7 s, 25%, 63%, 4,8x, 64%) tienen fuente, grado y prueba propia?
4. ¿La política citada se leyó completa en transparency.meta.com?
5. ¿Cada pieza propuesta indica qué afirmación del ledger pone a prueba?

## Ampliar el ledger
Al desarmar una pieza real (plantilla de teardown), cada patrón observado entra como fila **Obs** con id nuevo; su "por qué funciona" entra como **Inf** aparte. Así lo observado y lo inferido nunca se mezclan.

## Límites actuales
- Las afirmaciones de fuentes secundarias **no están confirmadas con datos propios**; el conteo vigente sale de correr `scripts/auditar.py` (no se repite acá para que no quede viejo).
- Corpus: solo texto de anuncios vía agregadores (`research/creativos-teardowns.md`). No hay video ni imagen observados, y Meta y el Creative Center no se pueden leer de forma automatizada. Hace falta que la usuaria aporte piezas y métricas.
