# Checklist de auditoría

Recorrer con la landing capturada en móvil (390×844) y escritorio, y con el HTML leído entero. Entre corchetes, el error real encontrado en la landing de velas y jabones.

## Confianza y honestidad
- [ ] ¿Hay urgencia sin fecha real? Revisar también el texto **dentro de las imágenes**. [La foto principal decía "50% OFF HOY" sin vencimiento.]
- [ ] ¿Alguna foto muestra productos de otra marca presentados como propios? [Vela "Moonglow / Slow North" rotulada como "material del curso".]
- [ ] ¿Las cantidades coinciden con las listas? [Decía "16 bonos" y listaba 12.]
- [ ] ¿Los valores de referencia son creíbles y están rotulados? [Certificado valuado igual que el curso; comunidad listada como bono.]
- [ ] ¿El aviso de afiliada se ve sin buscarlo? [Solo en el pie, en 12 px.]
- [ ] ¿Hay promesas que no controla quien vende? ["Reembolso sin preguntas", cuando el reembolso lo gestiona la plataforma.]
- [ ] ¿La valoración y el precio tachado son actuales y reales? (Confirmar con la clienta.)
- [ ] ¿El precio en moneda local está escrito a mano? Se desactualiza con el tipo de cambio.

## Conversión
- [ ] ¿El botón de compra termina dentro de la primera pantalla del celular? [Quedaba en y=934 px con pantalla de 844.]
- [ ] ¿Hay barra de compra fija al hacer scroll?
- [ ] ¿La garantía está pegada a cada botón?
- [ ] ¿La prueba social aparece arriba, cerca del título?
- [ ] ¿Se explica qué pasa después de pagar?
- [ ] ¿Hay un micro-compromiso (elegir por dónde empezar, quiz corto)?
- [ ] ¿Existe anclaje de valor claro antes del último botón?
- [ ] ¿Faltan testimonios reales o quién crea el producto? (Suele ser lo que más falta.)

## Técnico
- [ ] Píxel: ID, `PageView`, `ViewContent` y `InitiateCheckout` al hacer clic.
- [ ] El link de checkout conserva el parámetro de origen (`src` / `utm_content`).
- [ ] El clic no bloquea ctrl/cmd/clic central.
- [ ] Imágenes con `width` y `height` (evita saltos al cargar) y `loading="lazy"` debajo del pliegue.
- [ ] Etiquetas `og:` para compartir en WhatsApp y Facebook; favicon.
- [ ] Ortografía y consistencia del idioma (voseo vs. neutro según los países del anuncio). [Mezclaba voseo con OXXO de México.]
- [ ] Texto secundario de al menos 12–13 px.
- [ ] Sin scroll horizontal en móvil.
- [ ] En el plan gratuito de Netlify aparece una insignia "Powered by Netlify" que puede tapar contenido.
