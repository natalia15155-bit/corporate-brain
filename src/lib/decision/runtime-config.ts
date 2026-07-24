interface RuntimeEnvironment {
  [key: string]: string | undefined;
  AI_PROVIDER?: string;
  GROQ_API_KEY?: string;
  GEMINI_API_KEY?: string;
}

export interface RuntimeConfig {
  provider: "demo" | "openrouter";
  evidenceSource: "demo" | "datahub";
  demoMode: boolean;
}

export class UnsafeProviderConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsafeProviderConfigurationError";
  }
}

export function getRuntimeConfig(
  environment: RuntimeEnvironment = process.env,
): RuntimeConfig {
  const requestedProvider = environment.AI_PROVIDER?.trim().toLowerCase();
  const requestedEvidence =
    environment.EVIDENCE_SOURCE?.trim().toLowerCase() ?? "demo";

  if (requestedEvidence !== "demo" && requestedEvidence !== "datahub") {
    throw new UnsafeProviderConfigurationError(
      "EVIDENCE_SOURCE must be demo or datahub.",
    );
  }

  if (!requestedProvider || requestedProvider === "demo") {
    return {
      provider: "demo",
      evidenceSource: requestedEvidence,
      demoMode: requestedEvidence === "demo",
    };
  }

  if (requestedProvider === "openrouter") {
    const model = environment.OPENROUTER_MODEL ?? "openrouter/free";
    const explicitlyFree =
      model === "openrouter/free" || model.endsWith(":free");
    if (!environment.OPENROUTER_API_KEY) {
      throw new UnsafeProviderConfigurationError(
        "OPENROUTER_API_KEY is required when AI_PROVIDER=openrouter.",
      );
    }
    if (!explicitlyFree || environment.ALLOW_PAID_MODELS === "true") {
      throw new UnsafeProviderConfigurationError(
        "OpenRouter must use an explicitly free model and paid models must remain disabled.",
      );
    }
    return {
      provider: "openrouter",
      evidenceSource: requestedEvidence,
      demoMode: requestedEvidence === "demo",
    };
  }

  if (requestedProvider === "openai") {
    throw new UnsafeProviderConfigurationError(
      "OpenAI API is disabled by the zero-additional-cost policy.",
    );
  }

  if (requestedProvider === "groq" || requestedProvider === "gemini") {
    throw new UnsafeProviderConfigurationError(
      `${requestedProvider} is not enabled until its adapter and free-tier safeguards are verified.`,
    );
  }

  throw new UnsafeProviderConfigurationError(
    "AI_PROVIDER must be demo or openrouter.",
  );
}
