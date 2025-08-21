import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { clamp, pct } from "../utils/format";

// donut simples
export default function Donut({ value, label, color, size = "h-28 w-28 md:h-32 md:w-32", className = "" }) {
  // opções fixas
  const options = useMemo(() => ({
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    cutout: "75%",
    maintainAspectRatio: false,
    layout: { padding: 8 },
  }), []);

  // dados dinâmicos
  const data = useMemo(() => ({
    labels: ["Used", "Free"],
    datasets: [{
      data: [clamp(value), 100 - clamp(value)],
      backgroundColor: [color, "rgba(255,255,255,0.12)"],
      borderWidth: 0,
      hoverOffset: 0,
    }]
  }), [value, color]);

  return (
    <div className={`grid place-items-center gap-3 w-full max-w-[9.5rem] mx-auto ${className}`}>
      <div className={`relative ${size}`}>
        <Doughnut data={data} options={options} />
        {/* valor no centro */}
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-xl font-bold text-slate-100">{pct(value)}</span>
        </div>
      </div>
      <p className="text-sm text-slate-300">{label}</p>
    </div>
  );
}
