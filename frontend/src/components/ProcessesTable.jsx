import Card from "./Card";
import { bytes } from "../utils/format";

export default function ProcessesTable({ rows = [] }) {
  const empty = !rows || rows.length === 0;

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
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {empty
              ? [...Array(8)].map((_, i) => (
                  <tr key={i} className="hover:bg-white/5">
                    <td className="px-3 py-2">—</td>
                    <td className="px-3 py-2">Loading…</td>
                    <td className="px-3 py-2">—</td>
                    <td className="px-3 py-2">—</td>
                  </tr>
                ))
              : rows.map(p => (
                  <tr key={p.pid} className="hover:bg-white/5">
                    <td className="px-3 py-2 tabular-nums">{p.pid}</td>
                    <td className="px-3 py-2">{p.name}</td>
                    <td className="px-3 py-2 tabular-nums">{(p.cpu ?? 0).toFixed(1)}%</td>
                    <td className="px-3 py-2 tabular-nums">
                      {bytes(p.memBytes || 0).replace('/s','')} {/* mostra MB/GB */}
                      <span className="text-slate-400"> ({(p.memPct ?? 0).toFixed(1)}%)</span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {empty && <p className="mt-2 text-xs text-slate-400">Buscando processos…</p>}
    </Card>
  );
}
