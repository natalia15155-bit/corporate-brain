import { demoUsers } from "../access-control.ts";
import { dataHubSnapshotAssets } from "../evidence/datahub-snapshot-adapter.ts";
import type { RoleCatalog } from "./types.ts";

export function getCatalogForUser(userId: string): RoleCatalog | null {
  const user = demoUsers.find((candidate) => candidate.id === userId);

  if (!user) return null;

  const assets = dataHubSnapshotAssets.filter((asset) =>
    user.allowedDomains.includes(asset.domain),
  );
  const owners = new Set(assets.map((asset) => asset.owner));
  const warnings = assets.filter((asset) => asset.tone === "warning");

  return {
    userId: user.id,
    role: user.role,
    team: user.team,
    domains: user.allowedDomains,
    assets,
    stats: {
      assets: assets.length,
      owners: owners.size,
      warnings: warnings.length,
    },
  };
}
