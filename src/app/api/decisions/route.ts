import { NextResponse } from "next/server";
import { createDecision } from "@/lib/decision/create-decision";
import {
  InvalidDecisionRequestError,
  parseDecisionRequest,
  UnknownPersonaError,
} from "@/lib/decision/request-validation";
import { UnsafeProviderConfigurationError } from "@/lib/decision/runtime-config";
import type {
  DecisionApiResult,
  DecisionErrorCode,
} from "@/lib/decision/types";

function errorResponse(
  code: DecisionErrorCode,
  message: string,
  status: number,
) {
  return NextResponse.json<DecisionApiResult>(
    { ok: false, error: { code, message } },
    { status },
  );
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const input = parseDecisionRequest(body);
    const decision = await createDecision(input);

    return NextResponse.json<DecisionApiResult>(
      { ok: true, decision },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (error) {
    if (error instanceof UnknownPersonaError) {
      return errorResponse("UNKNOWN_PERSONA", error.message, 403);
    }

    if (
      error instanceof InvalidDecisionRequestError ||
      error instanceof SyntaxError
    ) {
      return errorResponse(
        "INVALID_REQUEST",
        error instanceof Error ? error.message : "Invalid request.",
        400,
      );
    }

    if (error instanceof UnsafeProviderConfigurationError) {
      return errorResponse("PROVIDER_UNAVAILABLE", error.message, 503);
    }

    return errorResponse(
      "PROVIDER_UNAVAILABLE",
      "The decision service is temporarily unavailable.",
      503,
    );
  }
}
