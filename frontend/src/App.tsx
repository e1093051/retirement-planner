import { useState } from "react";
import "./styles.css";
import type { SimulateResponse } from "./api/types";
import { simulate } from "./api/client";
import SimForm from "./components/SimForm";
import type { SimFormValues } from "./components/SimForm";
import SummaryCard from "./components/SummaryCard";
import PathsChart from "./components/PathsChart";

export default function App() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SimulateResponse | null>(null);
  const [error, setError] = useState<any>(null);

  async function onSubmit(values: SimFormValues) {
    setLoading(true);
    setStatus("Running...");
    setError(null);
    setData(null);

    try {
      const resp = await simulate(values);
      setData(resp);
      setStatus("OK");
    } catch (e: any) {
      setStatus("Error");
      setError(e?.payload ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h1>Retirement Monte Carlo Simulator</h1>
      <p className="muted">
        This tool performs Monte Carlo simulations to model retirement wealth outcomes under different assumptions.
      </p>

      <SimForm onSubmit={onSubmit} disabled={loading} status={status} />

      {data && (
        <>
          <SummaryCard data={data} />
          <PathsChart samplePaths={data.samplePaths ?? []} />
        </>
      )}

      {error && (
        <div className="card error">
          <h2 style={{ marginTop: 0 }}>Raw Response / Error</h2>
          <pre>{typeof error === "string" ? error : JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
