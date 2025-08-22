import useStorage from "../hooks/useStorage";

const GB = 1024 ** 3;
const toGB = (b) => Math.round((b || 0) / GB);
const prettyMount = (label = "") => {
  if (label === "/") return "/";
  const m = label.match(/^([A-Za-z]:)/); // "C:" no Windows
  if (m) return m[1];
  return label.length > 18 ? label.slice(0, 16) + "…" : label;
};

const badgeByPct = (p) =>
  p >= 90
    ? "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/25"
    : p >= 75
    ? "bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/25"
    : "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/25";

export default function Storage({ max = 3 }) {
  const { rows, loading } = useStorage();
  const list = (rows || []).slice(0, max);

  return (
    <div className="space-y-3 w-full">
      <div className="text-xs uppercase tracking-wider text-slate-400 mb-3">
        Storage
      </div>

      {loading && !list.length && (
        <div className="text-xs text-slate-500">lendo discos…</div>
      )}

      {list.map((d) => {
        const pct = Math.max(0, Math.min(100, Math.round(d.pct || 0)));
        const used = toGB(d.usedBytes);
        const total = toGB(d.totalBytes);

        return (
          <div
            key={d.id}
            className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 items-center"
            title={`${d.label} — ${used}GB / ${total}GB (${pct}%)`}
          >
            {/* Barra (glass) */}
            <div className="relative h-4 rounded-full overflow-hidden min-w-0 bg-gradient-to-b from-white/12 to-white/5 ring-1 ring-white/10 shadow-inner">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500
                           bg-[linear-gradient(90deg,#22c55e,#eab308_75%,#f43f5e)]"
                style={{ width: `${pct}%` }}
                aria-hidden
              />
              {/* etiqueta central */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[11px] leading-none font-mono text-white/90 bg-slate-900/40 px-2 py-[2px] rounded">
                  {used}GB / {total}GB
                </span>
              </div>
            </div>

            {/* Rótulo + badge de % */}
            <div className="flex items-center gap-2 justify-start sm:justify-end">
              <span className="text-slate-300 text-sm whitespace-nowrap truncate">
                {prettyMount(d.label)}
              </span>
              <span
                className={`text-[10px] px-2 py-[2px] rounded-full ${badgeByPct(
                  pct
                )}`}
              >
                {pct}%
              </span>
            </div>
          </div>
        );
      })}

      {!loading && !list.length && (
        <div className="text-xs text-slate-500">Sem discos detectados.</div>
      )}
    </div>
  );
}
