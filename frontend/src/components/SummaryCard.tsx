import type { SimulateResponse } from "../api/types";

function formatMoney(x: any) {
  const n = Number(x);
  if (!Number.isFinite(n)) return String(x);
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function SummaryCard({ data }: { data: SimulateResponse }) {
  const items: Array<[string, any]> = [
    ["numSimulations", data.numSimulations],
    ["targetAmount", formatMoney(data.targetAmount)],
    ["medianWealth", formatMoney(data.medianWealth)],
    ["p10Wealth", formatMoney(data.p10Wealth)],
    ["p90Wealth", formatMoney(data.p90Wealth)],
    ["probabilityReachTarget", data.probabilityReachTarget],
  ];

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Summary</h2>
      <div className="kvs">
        {items.map(([k, v]) => (
          <div className="kv" key={k}>
            <div className="k">{k}</div>
            <div className="v">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
