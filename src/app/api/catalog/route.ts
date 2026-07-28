import { NextResponse } from "next/server";
import { getCatalogForUser } from "@/lib/catalog/get-catalog";
import type { CatalogApiResult } from "@/lib/catalog/types";

export async function GET(request: Request) {
  const userId = new URL(request.url).searchParams.get("userId")?.trim();

  if (!userId) {
    return NextResponse.json<CatalogApiResult>(
      {
        ok: false,
        error: {
          code: "UNKNOWN_PERSONA",
          message: "A known demonstration persona is required.",
        },
      },
      { status: 400 },
    );
  }

  const catalog = getCatalogForUser(userId);

  if (!catalog) {
    return NextResponse.json<CatalogApiResult>(
      {
        ok: false,
        error: {
          code: "UNKNOWN_PERSONA",
          message: "This profile is not available.",
        },
      },
      { status: 403 },
    );
  }

  return NextResponse.json<CatalogApiResult>(
    { ok: true, catalog },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}
