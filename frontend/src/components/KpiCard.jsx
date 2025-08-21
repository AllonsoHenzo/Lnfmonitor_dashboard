// card de KPI
export default function KpiCard({ title, value, subtitle, accent }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f1722]/70 p-4 shadow-xl shadow-black/30">
      {/* glow de fundo */}
      <div className={`pointer-events-none absolute -inset-10 opacity-40 blur-2xl bg-gradient-to-br ${accent}`} />
      {/* conteúdo */}
      <div className="relative space-y-1">
        <p className="text-xs uppercase tracking-wider text-slate-400">{title}</p>
        <p className="mt-1 text-4xl font-bold text-slate-100">{value}</p>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}
