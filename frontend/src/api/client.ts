import type { RiskProfilesResponse, SimulateRequest, SimulateResponse } from "./types";

async function readJson<T>(resp: Response): Promise<T> {
  const text = await resp.text();
  const data = text ? JSON.parse(text) : null;

  if (!resp.ok) {
    const err = new Error(`HTTP ${resp.status}`);
    (err as any).payload = data;
    throw err;
  }
  return data as T;
}

export async function simulate(body: SimulateRequest): Promise<SimulateResponse> {
  const resp = await fetch("/api/simulate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return readJson<SimulateResponse>(resp);
}

export async function getRiskProfiles(): Promise<RiskProfilesResponse> {
  const resp = await fetch("/api/risk-profiles");
  return readJson<RiskProfilesResponse>(resp);
}
