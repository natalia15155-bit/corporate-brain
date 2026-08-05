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
