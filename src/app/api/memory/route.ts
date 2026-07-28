import { NextResponse } from "next/server";
import { demoUsers } from "@/lib/access-control";
import { createDecision } from "@/lib/decision/create-decision";
import {
  consumeRateLimit,
  getRequestClientKey,
} from "@/lib/http/rate-limit";
import {
  HttpRequestError,
  readLimitedJson,
} from "@/lib/http/request-security";
import { parseMemoryWriteRequest } from "@/lib/memory/write-request";
import {
  DataHubWritebackError,
  saveDecisionToDataHub,
} from "@/lib/memory/writeback";

export async function POST(request: Request) {
  const rateLimit = consumeRateLimit(
    `memory:${getRequestClientKey(request)}`,
    { limit: 10, windowMs: 60_000 },
  );
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many save requests. Please wait and try again.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  try {
    const input = parseMemoryWriteRequest(
      await readLimitedJson(request, 8_192),
    );
    const user = demoUsers.find((candidate) => candidate.id === input.userId);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "The selected profile is not available." },
        { status: 403 },
      );
    }

    if (
      process.env.EVIDENCE_SOURCE?.trim().toLowerCase() !== "datahub" ||
      process.env.DATAHUB_WRITEBACK_ENABLED?.trim().toLowerCase() !== "true"
    ) {
      return NextResponse.json({
        ok: true,
        result: {
          destination: "browser",
          status: "local-only",
          reason: "The public snapshot does not write to shared DataHub context.",
        },
      });
    }

    const decision = await createDecision({
      question: input.question,
      userId: input.userId,
      locale: input.locale,
    });
    const proposedAlerts = decision.readiness?.proposedAlerts ?? [];
    const alertRules = proposedAlerts.map((rule) => {
      const requested = input.alertRules.find(
        (candidate) => candidate.id === rule.id,
      );
      return requested
        ? {
            ...rule,
            enabled: requested.enabled,
            threshold: requested.threshold,
          }
        : rule;
    });
    const result = await saveDecisionToDataHub({
      decision,
      user,
      kind: input.kind,
      alertRules,
    });

    return NextResponse.json(
      { ok: true, result },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    if (error instanceof HttpRequestError) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.status },
      );
    }
    if (error instanceof DataHubWritebackError) {
      return NextResponse.json(
        { ok: false, error: "DataHub write-back is temporarily unavailable." },
        { status: error.code === "disabled" ? 409 : 503 },
      );
    }
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "The memory request is invalid.",
      },
      { status: 400 },
    );
  }
}
