import { NextResponse } from "next/server";

export function GET() {
  const configuredSource =
    process.env.EVIDENCE_SOURCE?.trim().toLowerCase() ?? "demo";
  const evidenceMode =
    configuredSource === "datahub"
      ? "live-datahub"
      : configuredSource === "snapshot"
        ? "snapshot"
        : "demo";
  const writebackEnabled =
    evidenceMode === "live-datahub" &&
    process.env.DATAHUB_WRITEBACK_ENABLED?.trim().toLowerCase() === "true";

  return NextResponse.json(
    {
      ok: true,
      status: {
        evidenceMode,
        writebackEnabled,
        dataClassification:
          process.env.DEMO_MODE?.trim().toLowerCase() === "true"
            ? "synthetic"
            : "configured",
      },
    },
    {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    },
  );
}
