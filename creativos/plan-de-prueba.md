# Plan de prueba de creativos

**Qué se puede medir con tu píxel hoy:** `PageView`, `ViewContent` e `InitiateCheckout`. **No se mide la compra** en las landings de afiliada (la venta ocurre en Hotmart). Todo se decide hasta `InitiateCheckout`. No es lo mismo que vender: que alguien llegue al pago no prueba que compre.

## Antes de empezar (bloqueos)
1. **Kit "Consultorio en Orden": falta el píxel.** Sin él no hay datos. Pasame el ID, o decime si querés usar el mismo de las otras landings (mezcla datos de productos distintos) u otro nuevo.
2. **Las 3 landings de afiliada usan el mismo píxel.** Separá los productos por **campaña** y por el parámetro de la URL (`utm_campaign`, `utm_content` con el id de la pieza, ej. `A1-gancho1`).
3. **Línea base:** anotá hoy el costo por `InitiateCheckout`, el CTR de enlace y la retención a 3 s de tus piezas actuales. Sin línea base, no se sabe si una variante mejora.

## Reglas de la prueba
- **Una sola variable por prueba.** Mismo cuerpo, mismo audiencia, mismo presupuesto; cambia solo el elemento. Primero el **gancho** (los primeros 3 s), después el formato, después el llamado a la acción.
- **Ordenar las pruebas por etapa del embudo, de adelante hacia atrás:** si la gente no frena (retención a 3 s baja), no sirve optimizar el cierre.
- **Nombrar todo igual**: `producto-pieza-variable-version`, ej. `A1-gancho-v1`.
- **No tocar una prueba en curso** (ni creatividad, ni presupuesto, ni público).

## Qué mirar por etapa
| Etapa | Métrica | Dónde | Qué decide |
|---|---|---|---|
| Atención | Retención a 3 s (hook rate) | Ads Manager | Si el gancho funciona |
| Interés | CTR de enlace | Ads Manager | Si la promesa atrae |
| Coherencia | `ViewContent` / clics | Píxel | Si la landing coincide con el anuncio (si cae, hay desvío de mensaje) |
| Intención | `InitiateCheckout` / visita; **costo por `InitiateCheckout`** | Píxel | El criterio final de la prueba |

## Duración y tamaño (reglas prácticas; **no son estadística formal**, valores de orientación)
- **Mínimo de 5 a 7 días** por prueba, para cubrir días de semana y fin de semana.
- **Apuntar a unos 50 eventos `InitiateCheckout` por variante** antes de decidir; con menos, la diferencia suele ser ruido. Con presupuestos chicos, esto puede no alcanzarse: en ese caso, decidí con la etapa anterior (retención y CTR) y decilo así.
- **Presupuesto igual en cada variante.**

## Cuándo parar
- **Parar una variante** si gastó **2 a 3 veces el costo objetivo por `InitiateCheckout`** y no tuvo ninguno.
- **Parar la prueba entera** si los dos brazos tienen un CTR de enlace muy por debajo de tu línea base: el problema está antes del gancho (audiencia o promesa).
- **Declarar ganadora** solo si cumple las dos: mejora en la métrica de la etapa **y** en el costo por `InitiateCheckout`. Si solo mejora una, es una pista, no un ganador.
- **No se declara "winner"** con datos de un solo día ni de menos de ~50 eventos.

## Orden sugerido de la primera ronda
1. **Gancho** (uno por producto): A1 con dos ganchos (problema vs. el alternativo), B1, C1, D1.
2. **Formato** (con el mejor gancho): comparar UGC/proceso/carrusel dentro de cada producto.
3. **Llamado a la acción y cierre**.

## Cada resultado vuelve al ledger
Cuando una prueba termina, **actualizá la fila del ledger** (`en_prueba` → `confirmada_propia` o `refutada`) con los datos. Ese es el único camino para que una afirmación pase a ser conocimiento propio.

## Lo que este plan NO hace
- **No publica ni gasta nada.** Crear anuncios, pagar o publicar necesita tu confirmación explícita.
- **No usa datos de conversión de terceros** (no los tenemos).
