import { useEffect, useMemo, useState } from "react";
import type { RiskProfileKey, RiskProfilesResponse } from "../api/types";
import { getRiskProfiles } from "../api/client";

export default function RiskProfileSelect({
  value,
  onChange,
  disabled,
}: {
  value: RiskProfileKey;
  onChange: (v: RiskProfileKey) => void;
  disabled: boolean;
}) {
  const [profiles, setProfiles] = useState<RiskProfilesResponse | null>(null);

  useEffect(() => {
    getRiskProfiles()
      .then(setProfiles)
      .catch(() => setProfiles(null));
  }, []);

  const tooltipHtml = useMemo(() => {
    if (!profiles) return "Risk profile assumptions unavailable.";
    const order: RiskProfileKey[] = ["conservative", "balanced", "aggressive"];
    return order
      .filter((k) => profiles[k])
      .map((k) => {
        const meanPct = Math.round(profiles[k].mean * 100);
        const volPct = Math.round(profiles[k].volatility * 100);
        const name = k[0].toUpperCase() + k.slice(1);
        return `${name}: annual return=${meanPct}%, volatility=${volPct}%`;
      })
      .join("\n");
  }, [profiles]);

  return (
    <>
      <label className="label-row">
        Risk Profile
        <span className="info" tabIndex={0} aria-label="Risk profile assumptions">
          ⓘ
          <span className="tooltip">
            {tooltipHtml.split("\n").map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </span>
        </span>
      </label>

      <select value={value} onChange={(e) => onChange(e.target.value as RiskProfileKey)} disabled={disabled}>
        <option value="conservative">conservative</option>
        <option value="balanced">balanced</option>
        <option value="aggressive">aggressive</option>
      </select>
    </>
  );
}
