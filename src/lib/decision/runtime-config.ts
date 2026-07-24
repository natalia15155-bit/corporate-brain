interface RuntimeEnvironment {
  [key: string]: string | undefined;
  AI_PROVIDER?: string;
  GROQ_API_KEY?: string;
  GEMINI_API_KEY?: string;
}

export interface RuntimeConfig {
  provider: "demo";
  demoMode: true;
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

  if (!requestedProvider || requestedProvider === "demo") {
    return { provider: "demo", demoMode: true };
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
    "AI_PROVIDER must remain demo in the current phase.",
  );
}
