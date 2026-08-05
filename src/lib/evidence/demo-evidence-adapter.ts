import {
  getAuthorizedEvidence,
  hasSufficientEvidence,
} from "../access-control.ts";
import { copy } from "../i18n.ts";
import type { EvidenceAdapter } from "./types.ts";

export const demoEvidenceAdapter: EvidenceAdapter = {
  id: "demo",
  async retrieve({ locale, user }) {
    const descriptions = copy[locale].assetDescriptions;
    const evidence = getAuthorizedEvidence(user).map((asset) => ({
      ...asset,
      description:
        descriptions[asset.id as keyof typeof descriptions] ??
        asset.description,
    }));

    return {
      source: "demo",
      evidence,
      requiredEvidenceSatisfied: hasSufficientEvidence(user),
    };
  },
};

