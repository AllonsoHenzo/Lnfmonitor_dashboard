import Header from "./components/Header";
import Card from "./components/Card";
import KpiCard from "./components/KpiCard";
import Donut from "./components/Donut";
import CpuMemTrend from "./components/charts/CpuMemTrend";
import NetworkBar from "./components/charts/NetworkBar";
import ProcessesTable from "./components/ProcessesTable";
import useProcesses from "./hooks/useProcesses";
import useSysMetrics from "./hooks/useSysMetrics";
import { pct, bytes } from "./utils/format";

// app principal
export default function App() {
  console.log("API_BASE =>", import.meta.env.VITE_API_URL);
  const { stats, cpuSeries, ramGBSeries, upSeriesMBs, downSeriesMBs } = useSysMetrics();
  const { rows: procRows } = useProcesses({ by: "cpu", limit: 10, pollMs: 5000 });

  return (
    <div className="min-h-screen bg-[#0b0f14] text-slate-200">
      <Header />

      <main className="mx-auto max-w-7xl p-6 space-y-6">
        {/* KPIs */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard title="Uso de CPU" value={pct(stats.cpu)} subtitle="Carga atual" accent="from-cyan-400/30 to-blue-500/30" />
          <KpiCard title="Uso de RAM" value={pct(stats.ram)} subtitle="Em uso / Total" accent="from-emerald-400/30 to-lime-500/30" />
          <KpiCard title="Uso de Disco" value={pct(stats.disk)} subtitle="Sistema de arquivos raiz" accent="from-amber-400/30 to-orange-500/30" />
          <KpiCard title="Rede" value={`${bytes(stats.net.downBps)} ↓ / ${bytes(stats.net.upBps)} ↑`} subtitle="Taxa (últimos 2s)" accent="from-fuchsia-400/30 to-pink-500/30" />
        </section>

        {/* Gráficos */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card title="CPU & RAM">
            <CpuMemTrend
              cpuSeries={cpuSeries}
              ramGBSeries={ramGBSeries}
              ramTotalGB={stats?.memGB?.total || 0}
            />
          </Card>

          <Card title="Detalhes de Recursos">
            <div className="h-64 grid grid-cols-3 gap-6 px-4 place-items-center" style={{ marginLeft: "-7%" }}>
              <Donut value={stats.cpu} label="CPU" color="rgba(56,189,248,1)" />
              <Donut value={stats.ram} label="RAM" color="rgba(34,197,94,1)" />
              <Donut value={stats.disk} label="Disco" color="rgba(251,191,36,1)" />
            </div>
          </Card>

          <Card title="Rede (MB/s)">
            <NetworkBar up={upSeriesMBs} down={downSeriesMBs} />
          </Card>
        </section>

        {/* Linha inferior */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="min-h-[12rem]">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-sm uppercase tracking-widest text-slate-400">Índice de Carga do Sistema</p>
                <p className="mt-2 text-6xl font-black text-cyan-400/90">{pct((stats.cpu + stats.ram) / 2)}</p>
              </div>
            </div>
          </Card>

          <ProcessesTable rows={procRows} />
        </section>
      </main>
    </div>
  );
}
