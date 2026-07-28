export type QuestionIntent = "decision" | "data-discovery" | "readiness";

const readinessPatterns = [
  /\b(build|create|configure|set up).*(dashboard|alert)/i,
  /\b(dashboard|alert).*(need|require|ready|enough)/i,
  /\b(stockout|inventory|complaint).*(dashboard|alert)/i,
  /\b(construir|crear|configurar).*(dashboard|tablero|alerta)/i,
  /\b(dashboard|tablero|alerta).*(necesit|alcanz|list|suficient)/i,
  /\b(quiebre|inventario|reclamo).*(dashboard|tablero|alerta)/i,
] as const;

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
  if (readinessPatterns.some((pattern) => pattern.test(question))) {
    return "readiness";
  }

  return discoveryPatterns.some((pattern) => pattern.test(question))
    ? "data-discovery"
    : "decision";
}
