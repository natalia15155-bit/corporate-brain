export type QuestionIntent = "decision" | "data-discovery" | "readiness";

function normalizeQuestion(question: string): string {
  return question
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const discoveryPatterns = [
  /\bwhat (data|datasets|sources|information)\b/i,
  /\bwhich (data|datasets|sources)\b/i,
  /\b(data|datasets|sources).*\bavailable\b/i,
  /\bavailable.*\b(data|datasets|sources)\b/i,
  /\bque (datos|datasets|fuentes|informacion)\b/i,
  /\bcuales? (datos|datasets|fuentes)\b/i,
  /\b(datos|fuentes).*\bdisponibles?\b/i,
  /\btipo.*\b(datos|informacion)\b/i,
  /\b(fields?|columns?|schema|owners?|lineage|connections?)\b/i,
  /\b(campos?|columnas?|esquema|responsables?|linaje|conexiones?)\b/i,
] as const;

const explicitReadinessPatterns = [
  /\b(do (i|we) have|have we got).*(need|required|enough)\b/i,
  /\b(need|required|ready|enough).*(dashboard|alert)\b/i,
  /\b(todo lo necesario|lo que necesito|lo que necesitamos)\b/i,
  /\bque (datos|datasets|fuentes|informacion) (necesito|necesitamos|requiere|requieren)\b/i,
  /\b(tenemos|tengo|hay).*(necesario|suficiente).*(dashboard|tablero|alerta)\b/i,
  /\b(listo|lista|preparado|preparada|suficiente).*(dashboard|tablero|alerta)\b/i,
] as const;

const readinessPatterns = [
  /\b(build|create|configure|set up).*(dashboard|alert)/i,
  /\b(dashboard|alert).*(need|require|ready|enough)/i,
  /\b(stockout|inventory|complaint).*(dashboard|alert)/i,
  /\b(construir|crear|configurar).*(dashboard|tablero|alerta)/i,
  /\b(dashboard|tablero|alerta).*(necesit|alcanz|list|suficient)/i,
  /\b(quiebre|inventario|reclamo).*(dashboard|tablero|alerta)/i,
] as const;

export function classifyQuestionIntent(question: string): QuestionIntent {
  const normalized = normalizeQuestion(question);
  const isDiscovery = discoveryPatterns.some((pattern) =>
    pattern.test(normalized),
  );
  const isExplicitReadiness = explicitReadinessPatterns.some((pattern) =>
    pattern.test(normalized),
  );

  if (isDiscovery && !isExplicitReadiness) {
    return "data-discovery";
  }

  if (
    isExplicitReadiness ||
    readinessPatterns.some((pattern) => pattern.test(normalized))
  ) {
    return "readiness";
  }

  return isDiscovery ? "data-discovery" : "decision";
}
