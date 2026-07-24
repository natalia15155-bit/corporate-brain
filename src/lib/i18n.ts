export type Locale = "en" | "es";

export const copy = {
  en: {
    brandDescriptor: "Decision intelligence",
    navAsk: "Ask",
    navBrief: "Decision Brief",
    navMemory: "Corporate Memory",
    newInquiry: "New inquiry",
    activeWorkspace: "Active workspace",
    authorizedDomains: "authorized domains",
    security: "Security",
    defaultDeny: "Default deny",
    demoPersona: "Demo persona",
    syntheticPersonaNotice: "Synthetic identity · no production data",
    roles: {
      executive: "Executive",
      analyst: "Growth analyst",
      "data-steward": "Data steward",
    },
    demoConnected: "DataHub demo connected",
    eyebrow: "Grounded in your organization",
    askTitle: "Make the next decision with evidence, not assumptions.",
    askDescription:
      "Ask a strategic question. Corporate Brain connects the recommendation to ownership, lineage, quality and the decisions your team already made.",
    questionLabel: "What decision are you facing?",
    questionPlaceholder:
      "Should we consolidate customer data into the Unified Customer 360 dataset?",
    suggestionLabel: "Try a demonstration question",
    suggestionOne: "Should we consolidate customer data into Customer 360?",
    suggestionTwo: "Can the executive team rely on the churn dashboard?",
    suggestionThree: "What changed since the last retention decision?",
    generate: "Build decision brief",
    generating: "Evaluating authorized evidence…",
    decisionError:
      "Corporate Brain could not build the decision brief. Your question is still here so you can try again.",
    evidenceReady: "Evidence ready",
    evidenceReadyDescription:
      "12 assets, 4 owners and 3 prior decisions are available for this scenario.",
    trustFramework: "Trust framework",
    trustFrameworkDescription:
      "Corporate Brain calculates evidence strength before asking AI to explain it.",
    sourceData: "Synthetic demonstration data",
    sourceDataDescription:
      "No customer or company information is sent to an external model.",
    briefEyebrow: "Decision brief · generated from traceable evidence",
    briefTitle: "Consolidate in phases, starting with retention analytics.",
    structuredEvidence: "Structured evidence",
    dataPoints: "data points",
    scopeComplete: "Authorized scope complete",
    scopeLimited: "Authorized scope limited",
    scopeFor: "Evidence filtered for",
    assetDescriptions: {
      "EVP-029":
        "Competitor spend declined while high-yield channels continued to create qualified demand.",
      "EVP-044":
        "Current blended CAC remains below the lifetime-value efficiency threshold.",
      "EVP-052":
        "The customer finance feed missed its freshness target and requires owner review.",
    },
    sensitivity: {
      internal: "Internal",
      confidential: "Confidential",
    },
    insufficientTitle: "Insufficient authorized evidence",
    insufficientAuthorizedEvidence:
      "Corporate Brain cannot provide a trustworthy recommendation from the evidence available to this profile. No restricted source details are disclosed.",
    projectedOutcome: "Projected outcome",
    pipelineGrowth: "Expected pipeline growth",
    outcomeUnavailable: "Outcome unavailable",
    outcomeDescription:
      "Based on the authorized evidence, the staged plan is expected to improve qualified pipeline over 90 days.",
    outcomeLimited:
      "A projected outcome is withheld until enough authorized evidence is available.",
    riskAssessment: "Risk assessment",
    risks: [
      "Diminishing returns if spend exceeds the tested threshold.",
      "Content production remains the primary bottleneck.",
      "Recent channel volatility requires weekly review.",
    ],
    limitedRisks: [
      "The available scope does not support a complete risk assessment.",
      "Request an authorized reviewer instead of inferring hidden context.",
    ],
    personalizedFor: "Explanation tailored for",
    roleViews: {
      executive: {
        title: "Decision impact",
        complete:
          "The phased option protects downside while preserving the expected growth opportunity.",
        limited:
          "Decision impact is withheld because the authorized evidence is incomplete.",
      },
      analyst: {
        title: "Evidence quality and lineage",
        complete:
          "The visible sources are current, owned, and connected to the proposed outcome.",
        limited:
          "Visible sources are traceable, but they are not sufficient for a final recommendation.",
      },
      "data-steward": {
        title: "Governance remediation",
        complete:
          "Resolve the freshness warning and document the accountable owner before the next review.",
        limited:
          "Document the evidence gap and route the decision to an authorized reviewer.",
      },
    },
    readyToFinalize: "Ready to finalize this decision with the authorized evidence?",
    reviewBeforeDecision:
      "An authorized reviewer is required before this decision can be finalized.",
    approveDecision: "Approve decision",
    contextualAnchors: "Contextual anchors",
    anchors: [
      { title: "Q2 Budget Report", meta: "Official archive · 3.2 MB" },
      { title: "Marketing Dependency Graph", meta: "Internal tool · Real-time" },
      { title: "Stakeholder Decision Log", meta: "Shared context · 14 entries" },
    ],
    recommendation:
      "Proceed with a staged consolidation into Customer 360. Start with the retention domain, resolve the two ownership gaps, and keep the legacy finance feed read-only until its quality incident is closed.",
    trustBand: "Trust band",
    medium: "Medium",
    mediumReason: "Strong lineage · 2 unresolved warnings",
    keyReasons: "Why this recommendation",
    reasonOne:
      "Customer 360 already supplies 78% of the fields used by the retention dashboard.",
    reasonTwo:
      "The approved FY26 data strategy names Customer 360 as the canonical customer layer.",
    reasonThree:
      "Finance ownership and freshness remain unresolved, so a full migration would be premature.",
    whatChanged: "What changed since the last decision",
    changeDescription:
      "The retention model now depends on Customer 360, but the finance feed has missed its freshness target twice in seven days.",
    evidenceTrail: "Evidence trail",
    evidenceTrailDescription:
      "Every claim links back to an asset, owner or prior decision in DataHub.",
    viewInDataHub: "View in DataHub",
    owner: "Owner",
    freshness: "Freshness",
    quality: "Quality",
    current: "Current",
    warning: "Warning",
    verified: "Verified",
    saveMemory: "Save to Corporate Memory",
    askAnother: "Ask another question",
    confirmationTitle: "Confirm shared write",
    confirmationDescription:
      "This will attach the approved decision context to Customer 360 in the demonstration workspace. Corporate Brain never writes shared context without confirmation.",
    cancel: "Cancel",
    confirmSave: "Confirm and save",
    memoryEyebrow: "Durable organizational context",
    memoryTitle: "The decisions your company should not have to make twice.",
    memoryDescription:
      "Approved decisions stay connected to the evidence that supported them. When that evidence changes, the decision becomes reviewable—not silently obsolete.",
    saved: "Saved",
    savedNotice: "Decision saved to Corporate Memory",
    active: "Active",
    reviewNeeded: "Review needed",
    decided: "Decided",
    evidence: "evidence",
    changedEvidence: "Evidence changed 2 days ago",
    stableEvidence: "Evidence remains stable",
    memoryDecisionOne: "Consolidate retention data into Customer 360",
    memoryDecisionTwo: "Use churn score v3 for executive reporting",
    memoryDecisionThree: "Keep finance customer feed read-only",
    decisionOneDate: "Today",
    decisionTwoDate: "July 18",
    decisionThreeDate: "July 11",
    integrityTitle: "Memory integrity",
    integrityDescription:
      "1 decision needs review because supporting evidence changed.",
    openDecision: "Open decision",
    footer: "Corporate Brain · Built for the DataHub AI Hackathon",
    demoMode: "Demo mode",
    navLabel: "Primary navigation",
    languageLabel: "Language",
  },
  es: {
    brandDescriptor: "Inteligencia para decisiones",
    navAsk: "Preguntar",
    navBrief: "Informe de decisión",
    navMemory: "Memoria Corporativa",
    newInquiry: "Nueva consulta",
    activeWorkspace: "Espacio activo",
    authorizedDomains: "dominios autorizados",
    security: "Seguridad",
    defaultDeny: "Denegado por defecto",
    demoPersona: "Persona de demostración",
    syntheticPersonaNotice: "Identidad sintética · sin datos reales",
    roles: {
      executive: "Dirección ejecutiva",
      analyst: "Analista de Growth",
      "data-steward": "Responsable de datos",
    },
    demoConnected: "Demo de DataHub conectada",
    eyebrow: "Basado en tu organización",
    askTitle: "Tomá la próxima decisión con evidencia, no con supuestos.",
    askDescription:
      "Hacé una pregunta estratégica. Corporate Brain conecta la recomendación con responsables, linaje, calidad y las decisiones que tu equipo ya tomó.",
    questionLabel: "¿Qué decisión estás evaluando?",
    questionPlaceholder:
      "¿Deberíamos consolidar los datos de clientes en Unified Customer 360?",
    suggestionLabel: "Probá una pregunta de demostración",
    suggestionOne: "¿Deberíamos consolidar los datos en Customer 360?",
    suggestionTwo: "¿El equipo ejecutivo puede confiar en el panel de abandono?",
    suggestionThree: "¿Qué cambió desde la última decisión de retención?",
    generate: "Crear informe de decisión",
    generating: "Evaluando evidencia autorizada…",
    decisionError:
      "Corporate Brain no pudo crear el informe. Tu pregunta sigue disponible para que vuelvas a intentar.",
    evidenceReady: "Evidencia preparada",
    evidenceReadyDescription:
      "Hay 12 activos, 4 responsables y 3 decisiones anteriores disponibles para este escenario.",
    trustFramework: "Marco de confianza",
    trustFrameworkDescription:
      "Corporate Brain calcula la solidez de la evidencia antes de pedirle a la IA que la explique.",
    sourceData: "Datos sintéticos de demostración",
    sourceDataDescription:
      "No se envía información de clientes o empresas a un modelo externo.",
    briefEyebrow: "Informe de decisión · generado desde evidencia trazable",
    briefTitle: "Consolidar por etapas, comenzando por analítica de retención.",
    structuredEvidence: "Evidencia estructurada",
    dataPoints: "puntos de datos",
    scopeComplete: "Alcance autorizado completo",
    scopeLimited: "Alcance autorizado limitado",
    scopeFor: "Evidencia filtrada para",
    assetDescriptions: {
      "EVP-029":
        "La inversión de competidores bajó mientras los canales de mayor rendimiento mantuvieron demanda calificada.",
      "EVP-044":
        "El costo de adquisición combinado permanece por debajo del umbral de eficiencia de valor de vida.",
      "EVP-052":
        "La fuente financiera de clientes incumplió su objetivo de actualización y requiere revisión.",
    },
    sensitivity: {
      internal: "Interno",
      confidential: "Confidencial",
    },
    insufficientTitle: "Evidencia autorizada insuficiente",
    insufficientAuthorizedEvidence:
      "Corporate Brain no puede dar una recomendación confiable con la evidencia disponible para este perfil. No se revelan detalles de fuentes restringidas.",
    projectedOutcome: "Resultado proyectado",
    pipelineGrowth: "Crecimiento esperado del pipeline",
    outcomeUnavailable: "Resultado no disponible",
    outcomeDescription:
      "Según la evidencia autorizada, el plan gradual podría mejorar el pipeline calificado en 90 días.",
    outcomeLimited:
      "La proyección se oculta hasta contar con suficiente evidencia autorizada.",
    riskAssessment: "Evaluación de riesgos",
    risks: [
      "Rendimientos decrecientes si la inversión supera el umbral probado.",
      "La producción de contenido sigue siendo el principal cuello de botella.",
      "La volatilidad reciente exige una revisión semanal.",
    ],
    limitedRisks: [
      "El alcance disponible no permite evaluar todos los riesgos.",
      "Solicitá una revisión autorizada en lugar de inferir contexto oculto.",
    ],
    personalizedFor: "Explicación adaptada para",
    roleViews: {
      executive: {
        title: "Impacto de la decisión",
        complete:
          "La opción gradual protege el resultado y conserva la oportunidad de crecimiento.",
        limited:
          "El impacto se omite porque la evidencia autorizada está incompleta.",
      },
      analyst: {
        title: "Calidad y linaje de evidencia",
        complete:
          "Las fuentes visibles están vigentes, tienen responsables y se conectan con el resultado.",
        limited:
          "Las fuentes visibles son trazables, pero no alcanzan para una recomendación final.",
      },
      "data-steward": {
        title: "Corrección de gobernanza",
        complete:
          "Resolvé la advertencia de actualización y documentá al responsable antes de revisar.",
        limited:
          "Documentá el vacío de evidencia y derivá la decisión a una persona autorizada.",
      },
    },
    readyToFinalize: "¿Listo para finalizar con la evidencia autorizada?",
    reviewBeforeDecision:
      "Se requiere una revisión autorizada antes de finalizar esta decisión.",
    approveDecision: "Aprobar decisión",
    contextualAnchors: "Anclas contextuales",
    anchors: [
      { title: "Informe de presupuesto Q2", meta: "Archivo oficial · 3,2 MB" },
      { title: "Grafo de dependencias de Marketing", meta: "Herramienta interna · En vivo" },
      { title: "Registro de decisiones", meta: "Contexto compartido · 14 entradas" },
    ],
    recommendation:
      "Avanzá con una consolidación gradual en Customer 360. Empezá por el dominio de retención, resolvé los dos vacíos de responsabilidad y mantené la fuente financiera anterior en modo de sólo lectura hasta cerrar su incidente de calidad.",
    trustBand: "Nivel de confianza",
    medium: "Medio",
    mediumReason: "Linaje sólido · 2 advertencias pendientes",
    keyReasons: "Por qué recomendamos esto",
    reasonOne:
      "Customer 360 ya provee el 78 % de los campos usados por el panel de retención.",
    reasonTwo:
      "La estrategia de datos FY26 aprobada define Customer 360 como la capa canónica de clientes.",
    reasonThree:
      "La responsabilidad y actualización de Finanzas siguen pendientes; una migración completa sería prematura.",
    whatChanged: "Qué cambió desde la última decisión",
    changeDescription:
      "El modelo de retención ahora depende de Customer 360, pero la fuente financiera incumplió su objetivo de actualización dos veces en siete días.",
    evidenceTrail: "Rastro de evidencia",
    evidenceTrailDescription:
      "Cada afirmación se conecta con un activo, responsable o decisión anterior en DataHub.",
    viewInDataHub: "Ver en DataHub",
    owner: "Responsable",
    freshness: "Actualización",
    quality: "Calidad",
    current: "Vigente",
    warning: "Advertencia",
    verified: "Verificado",
    saveMemory: "Guardar en Memoria Corporativa",
    askAnother: "Hacer otra pregunta",
    confirmationTitle: "Confirmar escritura compartida",
    confirmationDescription:
      "Esto adjuntará el contexto aprobado a Customer 360 en el entorno de demostración. Corporate Brain nunca escribe contexto compartido sin confirmación.",
    cancel: "Cancelar",
    confirmSave: "Confirmar y guardar",
    memoryEyebrow: "Contexto organizacional duradero",
    memoryTitle: "Las decisiones que tu empresa no debería tener que tomar dos veces.",
    memoryDescription:
      "Las decisiones aprobadas permanecen conectadas con la evidencia que las respaldó. Si esa evidencia cambia, la decisión pasa a revisión; no queda obsoleta en silencio.",
    saved: "Guardado",
    savedNotice: "Decisión guardada en Memoria Corporativa",
    active: "Activa",
    reviewNeeded: "Requiere revisión",
    decided: "Decidida",
    evidence: "evidencias",
    changedEvidence: "La evidencia cambió hace 2 días",
    stableEvidence: "La evidencia permanece estable",
    memoryDecisionOne: "Consolidar datos de retención en Customer 360",
    memoryDecisionTwo: "Usar churn score v3 para reportes ejecutivos",
    memoryDecisionThree: "Mantener la fuente financiera en sólo lectura",
    decisionOneDate: "Hoy",
    decisionTwoDate: "18 de julio",
    decisionThreeDate: "11 de julio",
    integrityTitle: "Integridad de la memoria",
    integrityDescription:
      "1 decisión necesita revisión porque cambió la evidencia que la respalda.",
    openDecision: "Abrir decisión",
    footer: "Corporate Brain · Creado para el Hackathon de IA de DataHub",
    demoMode: "Modo demo",
    navLabel: "Navegación principal",
    languageLabel: "Idioma",
  },
} as const;
