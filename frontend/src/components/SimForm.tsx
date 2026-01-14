import { useMemo, useState } from "react";
import type { RiskProfileKey, SimulateRequest } from "../api/types";
import RiskProfileSelect from "./RiskProfileSelect";

export type SimFormValues = SimulateRequest;

function clampNumber(v: string, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export default function SimForm({
  onSubmit,
  disabled,
  status,
}: {
  onSubmit: (values: SimFormValues) => Promise<void> | void;
  disabled: boolean;
  status: string;
}) {
  const [currentAge, setCurrentAge] = useState(25);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(10000);
  const [yearlyContribution, setYearlyContribution] = useState(12000);
  const [targetAmount, setTargetAmount] = useState(1000000);
  const [numSimulations, setNumSimulations] = useState(200);
  const [riskProfile, setRiskProfile] = useState<RiskProfileKey>("balanced");

  const validationError = useMemo(() => {
    if (currentAge < 0) return "Current age must be >= 0.";
    if (retirementAge <= currentAge) return "Retirement age must be greater than current age.";
    if (currentSavings < 0) return "Current savings must be >= 0.";
    if (yearlyContribution < 0) return "Yearly contribution must be >= 0.";
    if (targetAmount < 0) return "Target amount must be >= 0.";
    if (numSimulations < 1) return "Num simulations must be >= 1.";
    return "";
  }, [currentAge, retirementAge, currentSavings, yearlyContribution, targetAmount, numSimulations]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validationError) return;

    onSubmit({
      currentAge,
      retirementAge,
      currentSavings,
      yearlyContribution,
      targetAmount,
      numSimulations,
      riskProfile,
    });
  }

  return (
    <form className={`card ${validationError ? "error" : ""}`} onSubmit={handleSubmit}>
      <div className="grid">
        <div>
          <label>Current Age</label>
          <input
            type="number"
            min={0}
            step={1}
            value={currentAge}
            onChange={(e) => setCurrentAge(clampNumber(e.target.value, 25))}
            disabled={disabled}
            required
          />
        </div>

        <div>
          <label>Retirement Age</label>
          <input
            type="number"
            min={0}
            step={1}
            value={retirementAge}
            onChange={(e) => setRetirementAge(clampNumber(e.target.value, 65))}
            disabled={disabled}
            required
          />
        </div>

        <div>
          <label>Current Savings</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={currentSavings}
            onChange={(e) => setCurrentSavings(clampNumber(e.target.value, 10000))}
            disabled={disabled}
            required
          />
        </div>

        <div>
          <label>Yearly Contribution</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={yearlyContribution}
            onChange={(e) => setYearlyContribution(clampNumber(e.target.value, 12000))}
            disabled={disabled}
            required
          />
        </div>

        <div>
          <label>Target Amount</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={targetAmount}
            onChange={(e) => setTargetAmount(clampNumber(e.target.value, 1000000))}
            disabled={disabled}
            required
          />
        </div>

        <div>
          <label>Rounds of Simulations</label>
          <input
            type="number"
            min={1}
            step={1}
            value={numSimulations}
            onChange={(e) => setNumSimulations(clampNumber(e.target.value, 200))}
            disabled={disabled}
            required
          />
        </div>

        <div>
          <RiskProfileSelect value={riskProfile} onChange={setRiskProfile} disabled={disabled} />
        </div>
      </div>

      <div className="row" style={{ marginTop: 12 }}>
        <button type="submit" disabled={disabled || !!validationError}>
          Run Simulation
        </button>
        <span className="muted">{validationError ? validationError : status}</span>
      </div>
    </form>
  );
}
