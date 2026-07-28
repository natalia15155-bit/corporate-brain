export type QuestionIntent = "decision" | "data-discovery";

const discoveryPatterns = [
  /\bwhat (data|datasets|sources|information)\b/i,
  /\bwhich (data|datasets|sources)\b/i,
  /\b(data|datasets|sources).*\bavailable\b/i,
  /\bavailable.*\b(data|datasets|sources)\b/i,
  /\bqué (datos|fuentes|información)\b/i,
  /\bcuáles? (datos|fuentes)\b/i,
  /\b(datos|fuentes).*\bdisponibles?\b/i,
  /\btipo.*\b(datos|información)\b/i,
] as const;

export function classifyQuestionIntent(question: string): QuestionIntent {
  return discoveryPatterns.some((pattern) => pattern.test(question))
    ? "data-discovery"
    : "decision";
}
