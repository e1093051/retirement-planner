import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function formatMoney(x: number) {
  if (!Number.isFinite(x)) return String(x);
  return x.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function PathsChart({ samplePaths }: { samplePaths: number[][] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!Array.isArray(samplePaths) || samplePaths.length === 0) {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
      return;
    }

    const toDraw = samplePaths.slice(0, Math.min(5, samplePaths.length));
    const labels = Array.from({ length: toDraw[0].length }, (_, i) => i);

    const datasets = toDraw.map((path, idx) => ({
      label: `Path ${idx + 1}`,
      data: path,
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.15,
    }));

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvas, {
      type: "line",
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "nearest", intersect: false },
        plugins: {
          legend: { display: true },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${formatMoney(ctx.parsed.y as number)}`,
            },
          },
        },
        scales: {
          x: { title: { display: true, text: "Year (index)" } },
          y: {
            title: { display: true, text: "Wealth" },
            ticks: {
              callback: (value) => {
                const n = Number(value);
                if (!Number.isFinite(n)) return String(value);
                if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1) + "M";
                if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + "K";
                return String(n);
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [samplePaths]);

  return (
    <div className="card" style={{ height: 520 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Sample Paths</h2>
        <span className="muted">
          {samplePaths?.length ? `Showing ${samplePaths.length} random sample paths` : "No samplePaths returned."}
        </span>
      </div>
      <div style={{ height: 440 }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
