import React from "react";

export default function KpiCardBar({
  title,
  value,
  percent = 0,
  subtitle,
  accent = "from-cyan-400/25 to-sky-500/20",
  className = "",
}) {
  const pct = Math.max(0, Math.min(100, Number(percent) || 0));

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f1722]/70 p-4 shadow-xl shadow-black/30 transition-transform duration-200 hover:scale-[1.01] ${className}`}
    >
      <div
        className={`pointer-events-none absolute -inset-16 opacity-50 blur-2xl bg-gradient-to-br ${accent}`}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_0%,rgba(255,255,255,0.08),transparent_60%)]" />

      <p className="relative text-xs uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <div className="relative mt-2 flex items-baseline gap-2">
        <span className="text-4xl font-bold text-slate-100">{value}</span>
      </div>
      {subtitle && (
        <p className="relative mt-1 text-xs text-slate-400">{subtitle}</p>
      )}

      {/* Barra */}
      <div className="relative mt-3 h-1.5 rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-white/70 to-white/30"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* borda */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/5" />
    </div>
  );
}
