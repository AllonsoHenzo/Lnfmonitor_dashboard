import useStorage from "../hooks/useStorage";

const GB = 1024 ** 3;
const toGB = (b) => Math.round((b || 0) / GB);
const prettyMount = (label = "") => {
  if (label === "/") return "/";
  const m = label.match(/^([A-Za-z]:)/); // "C:" no Windows
  if (m) return m[1];
  return label.length > 18 ? label.slice(0, 16) + "…" : label;
};

const colorByPct = (p) =>
  p >= 90
    ? "bg-rose-500/70"
    : p >= 75
    ? "bg-amber-400/70"
    : "bg-emerald-400/70";

export default function Storage({ max = 3 }) {
  const { rows, loading } = useStorage();
  const list = (rows || []).slice(0, max);

  return (
    <div className="space-y-3 w-full">
      <div
        className="text-xs uppercase tracking-wider text-slate-400 mb-2"
        style={{ marginBottom: "7%" }}
      >
        Armazenamento
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
            className="
              grid grid-cols-1 sm:grid-cols-[1fr_7rem]
              gap-1.5 sm:gap-3 items-center
            "
          >
            <div className="relative h-4 rounded-md bg-white/10 overflow-hidden min-w-0">
              <div
                className={`h-full ${colorByPct(
                  pct
                )} transition-[width] duration-300`}
                style={{ width: `${pct}%` }}
                aria-hidden
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[11px] leading-none font-medium text-white/90 bg-slate-900/40 px-2 py-[2px] rounded whitespace-nowrap">
                  {used}GB / {total}GB
                </span>
              </div>
            </div>

            <div className="text-slate-300 text-sm leading-5 whitespace-nowrap truncate sm:pl-2">
              {prettyMount(d.label)}
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
