import Storage from "./Storage";
import useTemps from "../hooks/useTemps";

function Ring({
  value,
  label,
  warn = 70,
  crit = 85,
  unit = "°C",
  emptyLabel = "-",
}) {
  const v = Number.isFinite(value) ? value : null;
  const pct = Math.max(0, Math.min(100, v ?? 0));
  const color =
    v == null
      ? "#2d3748"
      : v >= crit
      ? "rgb(244 63 94)"
      : v >= warn
      ? "rgb(245 158 11)"
      : "rgb(16 185 129)";

  return (
    <div className="grid place-items-center gap-2">
      <div className="relative h-24 w-24">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(${color} ${
              pct * 3.6
            }deg, #1a2230 0deg)`,
          }}
        />
        <div className="absolute inset-[6px] rounded-full bg-[#0f1722]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="inline-flex items-start gap-1 text-slate-100">
            <span className="text-2xl font-bold leading-none">
              {v == null ? emptyLabel : Math.round(v)}
            </span>
            <span className="text-[10px] leading-none translate-y-[2px] text-slate-400">
              {unit}
            </span>
          </span>
        </div>
      </div>
      <div className="text-sm text-slate-300">{label}</div>
    </div>
  );
}

export default function TemperaturePanel() {
  const { cpu, cpuMax, gpu, fanRpm, fanPercent, loading } = useTemps();
  const hasGpu = Number.isFinite(gpu);

  return (
    <div className="grid gap-4">
      
      <div className="grid grid-cols-2 gap-6">
        <Ring value={cpu} label="CPU Temp" />
        {hasGpu ? (
          <Ring value={gpu} label="GPU Temp" />
        ) : (
          <div className="grid place-items-center gap-2">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-[#0f1722]">
              <span className="text-slate-400 text-sm">—</span>
            </div>
            <div className="text-sm text-slate-300">GPU não detectada</div>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-6">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>CPU</span>
            <span>
              Max sensor:{" "}
              {Number.isFinite(cpuMax) ? `${Math.round(cpuMax)}°C` : "—"} · Fan:{" "}
              {Number.isFinite(fanRpm)
                ? `${Math.round(fanRpm)} RPM`
                : Number.isFinite(fanPercent)
                ? `${Math.round(fanPercent)}%`
                : "-"}
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-full bg-[linear-gradient(90deg,rgba(16,185,129,.4)0%_70%,rgba(245,158,11,.45)70%_85%,rgba(244,63,94,.5)85%_100%)]" />
          </div>

          {Number.isFinite(cpu) && (
            <div className="relative" style={{ height: 0 }}>
              <div
                className="absolute -mt-2 h-4 w-1 rounded bg-cyan-400"
                style={{
                  left: `calc(${Math.min(100, Math.max(0, cpu))}% - 0.125rem)`,
                }}
              />
            </div>
          )}

          <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1">
              <i className="h-2 w-2 rounded-full bg-emerald-400/70" /> ok &lt;
              70°C
            </span>
            <span className="inline-flex items-center gap-1">
              <i className="h-2 w-2 rounded-full bg-amber-400/70" /> alerta
              70–85°C
            </span>
            <span className="inline-flex items-center gap-1">
              <i className="h-2 w-2 rounded-full bg-rose-500/70" /> crítico ≥
              85°C
            </span>
            {loading && (
              <span className="ml-auto italic text-slate-500">
                lendo sensores…
              </span>
            )}
          </div>
        </div>

        {/* 2) Mini Storage */}
        <div className="pt-5 border-t border-white/10">
          <div className="w-full md:max-w-[28rem] justify-self-start">
            <Storage max={3} />
          </div>
        </div>
      </div>
    </div>
  );
}
