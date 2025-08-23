import { useEffect, useState } from "react";
import Card from "./Card";
import { API_BASE } from "../utils/format";

function fmtPct(v) {
  return `${(v ?? 0).toFixed(1)}%`;
}

function fmtMB(v) {
  return `${(v ?? 0).toFixed(v < 10 ? 2 : 1)} MB`;
}

// Componente para indicador de CPU
function CPUIndicator({ value }) {
  const pct = value ?? 0;
  let colorClass = "text-emerald-400 bg-emerald-400/10";

  if (pct >= 80) colorClass = "text-rose-400 bg-rose-400/10";
  else if (pct >= 50) colorClass = "text-amber-400 bg-amber-400/10";
  else if (pct >= 20) colorClass = "text-cyan-400 bg-cyan-400/10";

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${colorClass}`}
    >
      {fmtPct(pct)}
    </span>
  );
}

// Componente para indicador de RAM
function RAMIndicator({ value }) {
  const mb = value ?? 0;
  let colorClass = "text-slate-400";

  if (mb >= 100) colorClass = "text-rose-400";
  else if (mb >= 50) colorClass = "text-amber-400";
  else if (mb >= 10) colorClass = "text-cyan-400";

  return <span className={`font-mono text-xs ${colorClass}`}>{fmtMB(mb)}</span>;
}

function UserBadge({ user }) {
  if (!user || user === "—") {
    return <span className="text-slate-500 text-xs">—</span>;
  }

  const getUserColor = (username) => {
    const colors = [
      "bg-blue-500/20 text-blue-300 border-blue-500/30",
      "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      "bg-purple-500/20 text-purple-300 border-purple-500/30",
      "bg-amber-500/20 text-amber-300 border-amber-500/30",
      "bg-rose-500/20 text-rose-300 border-rose-500/30",
      "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    ];
    const hash = username.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getUserColor(
        user
      )}`}
    >
      {user}
    </span>
  );
}

function ProcessRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3">
        <div className="h-4 w-16 bg-slate-700/50 rounded"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-24 bg-slate-700/50 rounded"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-6 w-12 bg-slate-700/50 rounded-md"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-16 bg-slate-700/50 rounded"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-6 w-16 bg-slate-700/50 rounded-full"></div>
      </td>
    </tr>
  );
}

export default function ProcessesTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    let mounted = true;
    let timer;

    const fetchOnce = async () => {
      setErr("");
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 5000);
        const res = await fetch(`${API_BASE}/processes`, {
          signal: ctrl.signal,
          cache: "no-store",
        });
        clearTimeout(t);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (!mounted) return;

        setRows(Array.isArray(data?.rows) ? data.rows : []);
        setLoading(false);
        setLastUpdate(new Date());
      } catch (e) {
        if (!mounted) return;
        setErr(e.message || String(e));
        setLoading(false);
      }
    };

    const loop = async () => {
      await fetchOnce();
      timer = setTimeout(loop, 5000);
    };

    loop();
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <Card className="xl:col-span-2" title="Processos">
      {/* Tabela */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-900/20 backdrop-blur-sm">
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-left text-sm">
            {/* Header */}
            <thead className="sticky top-0 bg-gradient-to-r from-slate-800/90 to-slate-700/90 border-b border-white/10 backdrop-blur-sm">
              <tr>
                <th className="px-3 py-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  PID
                </th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  CPU
                </th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  RAM
                </th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  User
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {/* Loading */}
              {loading &&
                [...Array(8)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-3 py-2">
                      <div className="h-3 w-12 bg-slate-700/50 rounded"></div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="h-3 w-20 bg-slate-700/50 rounded"></div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="h-5 w-10 bg-slate-700/50 rounded-md"></div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="h-3 w-14 bg-slate-700/50 rounded"></div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="h-5 w-12 bg-slate-700/50 rounded-full"></div>
                    </td>
                  </tr>
                ))}

              {/* Dados dos processos */}
              {!loading &&
                rows.map((p, index) => (
                  <tr
                    key={p.pid}
                    className={`
                      hover:bg-white/5 transition-colors duration-150
                      ${index % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"}
                    `}
                  >
                    <td className="px-3 py-2 font-mono text-slate-300 text-xs">
                      {p.pid}
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-medium text-slate-200 truncate max-w-[120px] text-sm">
                        {p.name}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <CPUIndicator value={p.cpu} />
                    </td>
                    <td className="px-3 py-2">
                      <RAMIndicator value={p.ramMB} />
                    </td>
                    <td className="px-3 py-2">
                      <UserBadge user={p.user} />
                    </td>
                  </tr>
                ))}

              {/* Estado vazio */}
              {!loading && !rows.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-4 text-center text-slate-400 text-sm"
                  >
                    Nenhum processo encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2 text-xs text-slate-400" style={{ marginTop: "2%" }}>
        {loading
          ? "Buscando processos..."
          : err
          ? `Erro: ${err}`
          : "Atualiza a cada 5s."}
      </div>
    </Card>
  );
}
