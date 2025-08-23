import React from "react";

const ACCENT_VARIANTS = {
  cpu: "from-cyan-400/15 to-blue-500/10",
  ram: "from-emerald-400/15 to-green-500/10",
  disk: "from-amber-400/15 to-orange-500/10",
  network: "from-purple-400/15 to-violet-500/10",
  default: "from-slate-400/15 to-gray-500/10",
};

const BAR_COLORS = {
  cpu: "from-cyan-400 to-blue-500",
  ram: "from-emerald-400 to-green-500",
  disk: "from-amber-400 to-orange-500",
  network: "from-purple-400 to-violet-500",
  default: "from-slate-400 to-gray-500",
};

export default function KpiCardBar({
  title,
  value,
  percent = 0,
  subtitle,
  variant = "default", // cpu, ram, disco, rede
  accent,
  className = "",
}) {
  const pct = Math.max(0, Math.min(100, Number(percent) || 0));
  const accentClass =
    accent || ACCENT_VARIANTS[variant] || ACCENT_VARIANTS.default;
  const barColorClass = BAR_COLORS[variant] || BAR_COLORS.default;

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm p-5 shadow-2xl shadow-black/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-black/60 hover:border-slate-600/60 ${className}`}
    >
      <div
        className={`pointer-events-none absolute -inset-12 opacity-30 blur-3xl bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-40 ${accentClass}`}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_70%_at_0%_0%,rgba(255,255,255,0.06),transparent_50%)]" />

      {/* Conteúdo */}
      <div className="relative">
        {/* Título */}
        <p className="text-xs font-medium uppercase tracking-widest text-slate-400 transition-colors duration-200 group-hover:text-slate-300">
          {title}
        </p>

        {/* Valor principal */}
        <div className="mt-3 flex items-baseline gap-2">
          <span
            className="text-3xl font-bold text-slate-50 transition-colors duration-200"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {value}
          </span>
        </div>

        {/* Subtítulo */}
        {subtitle && (
          <p className="mt-1 text-xs font-medium text-slate-400 transition-colors duration-200 group-hover:text-slate-300">
            {subtitle}
          </p>
        )}

        {/* Barra de progresso */}
        <div className="mt-4 space-y-1">
          <div className="flex justify-between items-center">
            <div className="h-2 flex-1 rounded-full bg-slate-700/60 shadow-inner overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out shadow-sm ${barColorClass}`}
                style={{
                  width: `${pct}%`,
                  boxShadow:
                    pct > 0 ? `0 0 8px rgba(59, 130, 246, 0.3)` : "none",
                }}
              />
            </div>
            {/* Indicador de porcentagem */}
            <span
              className="ml-3 text-xs font-bold text-slate-300 min-w-[2.5rem] text-right"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {pct.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Borda interna */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-slate-600/30" />

      {/* Highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-400/30 to-transparent" />
    </div>
  );
}
