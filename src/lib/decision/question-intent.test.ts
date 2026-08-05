import assert from "node:assert/strict";
import test from "node:test";
import { classifyQuestionIntent } from "./question-intent.ts";

test("recognizes English data discovery questions", () => {
  assert.equal(
    classifyQuestionIntent("What datasets are available to my role?"),
    "data-discovery",
  );
});

test("recognizes Spanish data discovery questions", () => {
  assert.equal(
    classifyQuestionIntent("¿Qué tipo de datos tenemos disponibles?"),
    "data-discovery",
  );
});

test("keeps strategic questions in the decision workflow", () => {
  assert.equal(
    classifyQuestionIntent(
      "Should we consolidate customer data into Customer 360?",
    ),
    "decision",
  );
});

test("recognizes dashboard and alert readiness questions", () => {
  assert.equal(
    classifyQuestionIntent(
      "¿Qué datos necesito para construir un dashboard y configurar alertas de quiebre de stock?",
    ),
    "readiness",
  );
});

test("keeps catalog exploration as discovery when a future dashboard is context", () => {
  assert.equal(
    classifyQuestionIntent(
      "¿Qué datasets tengo disponibles para construir un dashboard de Ecommerce, cuáles son sus campos principales, responsables y cómo se conectan entre sí?",
    ),
    "data-discovery",
  );
});

test("keeps an explicit coverage assessment in readiness", () => {
  assert.equal(
    classifyQuestionIntent(
      "¿Tenemos todo lo necesario para construir un dashboard de Ecommerce con alertas?",
    ),
    "readiness",
  );
});

test("recognizes English schema and lineage exploration", () => {
  assert.equal(
    classifyQuestionIntent(
      "Which datasets, fields, owners and lineage are available for an Ecommerce dashboard?",
    ),
    "data-discovery",
  );
});

test("recognizes product profitability as an analytical question", () => {
  assert.equal(
    classifyQuestionIntent("¿Qué producto es el más rentable?"),
    "analysis",
  );
  assert.equal(
    classifyQuestionIntent("Which product has the highest margin?"),
    "analysis",
  );
});

test("keeps product unit comparisons in the analytical workflow", () => {
  assert.equal(classifyQuestionIntent("Comparar unidades vendidas"), "analysis");
  assert.equal(classifyQuestionIntent("Compare units sold by product"), "analysis");
});
