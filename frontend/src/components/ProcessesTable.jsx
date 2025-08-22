import { useEffect, useState } from "react";
import Card from "./Card";
import { API_BASE } from "../utils/format";

function fmtPct(v) {
  return `${(v ?? 0).toFixed(1)}%`;
}
function fmtMB(v) {
  return `${(v ?? 0).toFixed(v < 10 ? 2 : 1)} MB`;
}

export default function ProcessesTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

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
      } catch (e) {
        if (!mounted) return;
        setErr(e.message || String(e));
        setLoading(false);
      }
    };

    const loop = async () => {
      await fetchOnce();
      timer = setTimeout(loop, 5000); // atualiza a cada 5s
    };

    loop();
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <Card className="xl:col-span-2" title="Processos">
      <div className="overflow-hidden rounded-xl border border-white/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              <th className="px-3 py-2">PID</th>
              <th className="px-3 py-2">Nome</th>
              <th className="px-3 py-2">CPU</th>
              <th className="px-3 py-2">RAM</th>
              <th className="px-3 py-2">User</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading &&
              [...Array(8)].map((_, i) => (
                <tr key={i} className="hover:bg-white/5">
                  <td className="px-3 py-2">—</td>
                  <td className="px-3 py-2 text-slate-400">Loading…</td>
                  <td className="px-3 py-2">—</td>
                  <td className="px-3 py-2">—</td>
                  <td className="px-3 py-2">—</td>
                </tr>
              ))}
            {!loading &&
              rows.map((p) => (
                <tr key={p.pid} className="hover:bg-white/5">
                  <td className="px-3 py-2">{p.pid}</td>
                  <td className="px-3 py-2">{p.name}</td>
                  <td className="px-3 py-2">{fmtPct(p.cpu)}</td>
                  <td className="px-3 py-2">{fmtMB(p.ramMB)}</td>
                  <td className="px-3 py-2 text-slate-400">{p.user || "—"}</td>
                </tr>
              ))}
            {!loading && !rows.length && (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-slate-400">
                  Nenhum processo encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-2 text-xs text-slate-400">
        {loading
          ? "Buscando processos…"
          : err
          ? `Erro: ${err}`
          : "Atualiza a cada 5s."}
      </div>
    </Card>
  );
}
