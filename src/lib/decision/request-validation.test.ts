import assert from "node:assert/strict";
import test from "node:test";
import {
  InvalidDecisionRequestError,
  parseDecisionRequest,
  UnknownPersonaError,
} from "./request-validation.ts";

test("normalizes a valid decision request", () => {
  assert.deepEqual(
    parseDecisionRequest({
      question: "  Should we expand the retention program?  ",
      userId: "alex-executive",
      locale: "en",
    }),
    {
      question: "Should we expand the retention program?",
      userId: "alex-executive",
      locale: "en",
    },
  );
});

test("rejects unknown personas before decision generation", () => {
  assert.throws(
    () =>
      parseDecisionRequest({
        question: "Should we expand the retention program?",
        userId: "self-granted-admin",
        locale: "en",
      }),
    UnknownPersonaError,
  );
});

test("rejects malformed or oversized questions", () => {
  assert.throws(
    () =>
      parseDecisionRequest({
        question: "short",
        userId: "alex-executive",
        locale: "en",
      }),
    InvalidDecisionRequestError,
  );

  assert.throws(
    () =>
      parseDecisionRequest({
        question: "a".repeat(501),
        userId: "alex-executive",
        locale: "en",
      }),
    InvalidDecisionRequestError,
  );
});

