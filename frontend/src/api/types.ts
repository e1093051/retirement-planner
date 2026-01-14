export type RiskProfileKey = "conservative" | "balanced" | "aggressive";

export interface SimulateRequest {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  yearlyContribution: number;
  targetAmount: number;
  numSimulations: number;
  riskProfile: RiskProfileKey;
}

export interface SimulateResponse {
  numSimulations: number;
  targetAmount: number;
  medianWealth: number;
  p10Wealth: number;
  p90Wealth: number;
  probabilityReachTarget: number; // 例如 0.42 或 "42%"
  samplePaths?: number[][];
}

export type RiskProfilesResponse = Record<
  RiskProfileKey,
  { mean: number; volatility: number }
>;
