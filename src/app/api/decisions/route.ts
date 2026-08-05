import { NextResponse } from "next/server";
import { createDecision } from "@/lib/decision/create-decision";
import {
  InvalidDecisionRequestError,
  parseDecisionRequest,
  UnknownPersonaError,
} from "@/lib/decision/request-validation";
import { UnsafeProviderConfigurationError } from "@/lib/decision/runtime-config";
import { OpenRouterProviderError } from "@/lib/decision/openrouter-provider";
import { EvidenceSourceError } from "@/lib/evidence/types";
import type {
  DecisionApiResult,
  DecisionErrorCode,
} from "@/lib/decision/types";
import {
  HttpRequestError,
  readLimitedJson,
} from "@/lib/http/request-security";
import {
  consumeRateLimit,
  getRequestClientKey,
} from "@/lib/http/rate-limit";

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
    const rateLimit = consumeRateLimit(getRequestClientKey(request), {
      limit: 30,
      windowMs: 60_000,
    });
    if (!rateLimit.allowed) {
      return NextResponse.json<DecisionApiResult>(
        {
          ok: false,
          error: {
            code: "RATE_LIMITED",
            message: "Too many requests. Please wait a moment and try again.",
          },
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
            "Cache-Control": "private, no-store",
          },
        },
      );
    }

    const body = await readLimitedJson(request);
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
    if (error instanceof HttpRequestError) {
      return errorResponse("INVALID_REQUEST", error.message, error.status);
    }

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

    if (error instanceof OpenRouterProviderError) {
      return errorResponse("PROVIDER_UNAVAILABLE", error.message, 503);
    }

    if (error instanceof EvidenceSourceError) {
      return errorResponse("PROVIDER_UNAVAILABLE", error.message, 503);
    }

    return errorResponse(
      "PROVIDER_UNAVAILABLE",
      "The decision service is temporarily unavailable.",
      503,
    );
  }
}
