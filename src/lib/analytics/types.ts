export interface AnalyticalBar {
  label: string;
  value: number;
  formattedValue: string;
}

export interface AnalyticalResult {
  status: "answered" | "partial";
  title: string;
  answer: string;
  primaryValue: string;
  primaryLabel: string;
  period: string;
  metricDefinition: string;
  bars: readonly AnalyticalBar[];
  sourceAssetIds: readonly string[];
  limitations: readonly string[];
  suggestedFollowUps: readonly string[];
}
