import type {
  DomainId,
  EvidenceAsset,
  RoleId,
} from "../access-control.ts";

export interface RoleCatalogStats {
  assets: number;
  owners: number;
  warnings: number;
}

export interface RoleCatalog {
  userId: string;
  role: RoleId;
  team: string;
  domains: readonly DomainId[];
  assets: readonly EvidenceAsset[];
  stats: RoleCatalogStats;
}

export type CatalogApiResult =
  | { ok: true; catalog: RoleCatalog }
  | {
      ok: false;
      error: {
        code: "UNKNOWN_PERSONA" | "CATALOG_UNAVAILABLE";
        message: string;
      };
    };
