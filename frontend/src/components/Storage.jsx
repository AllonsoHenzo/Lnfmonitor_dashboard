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
  p >= 90 ? "bg-rose-500" : p >= 75 ? "bg-amber-400" : "bg-emerald-400";

export default function Storage({ max = 3 }) {
  const { rows, loading } = useStorage();
  const list = (rows || []).slice(0, max);

  return (
    <div className="space-y-4 w-full">
      <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-4">
        Armazenamento
      </div>

      {loading && !list.length && (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="h-3 w-3 border border-slate-600 border-t-slate-400 rounded-full animate-spin" />
          Lendo discos…
        </div>
      )}

      <div className="space-y-3">
        {list.map((d) => {
          const pct = Math.max(0, Math.min(100, Math.round(d.pct || 0)));
          const used = toGB(d.usedBytes);
          const total = toGB(d.totalBytes);

          return (
            <div key={d.id} className="space-y-2">
              {/* Header com caminho e valores */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Ícone do disco */}
                  <div className="h-4 w-4 rounded bg-slate-600/50 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-sm bg-slate-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-300">
                    {prettyMount(d.label)}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <span className="font-medium text-slate-300">{used}GB</span>
                  <span>/</span>
                  <span>{total}GB</span>
                  <span className="text-slate-500">({pct}%)</span>
                </div>
              </div>

              {/* Barra de progresso */}
              <div className="relative h-3 rounded-full bg-slate-800/80 border border-slate-700/50 overflow-hidden">
                <div
                  className={`h-full ${colorByPct(
                    pct
                  )} transition-all duration-500 ease-out rounded-full`}
                  style={{ width: `${pct}%` }}
                />
                {/* Gradiente */}
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-white/10 to-transparent transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {!loading && !list.length && (
        <div className="flex items-center gap-2 text-xs text-slate-500 py-4">
          <div className="h-4 w-4 rounded bg-slate-700/50 flex items-center justify-center">
            <div className="text-slate-500 text-xs">!</div>
          </div>
          Nenhum disco detectado
        </div>
      )}
    </div>
  );
}
