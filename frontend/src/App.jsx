import Header from "./components/Header";
import Card from "./components/Card";
import KpiCard from "./components/KpiCard";
import Donut from "./components/Donut";
import CpuMemTrend from "./components/charts/CpuMemTrend";
import NetworkBar from "./components/charts/NetworkBar";
import ProcessesTable from "./components/ProcessesTable";
import useProcesses from "./hooks/useProcesses";
import useSysMetrics from "./hooks/useSysMetrics";
import { rateMBs } from "./utils/format";
import Gauge from "./components/Gauge";
import TemperaturePanel from "./components/TemperaturePanel";

// app principal
export default function App() {
  console.log("API_BASE =>", import.meta.env.VITE_API_URL);
  const { stats, cpuSeries, ramGBSeries, upSeriesMBs, downSeriesMBs } =
    useSysMetrics();
  const { rows: procRows } = useProcesses({
    by: "cpu",
    limit: 10,
    pollMs: 5000,
  });

  return (
    <div className="min-h-screen bg-[#0b0f14] text-slate-200">
      <Header />

      <main className="mx-auto max-w-7xl p-6 space-y-6">
        {/* KPIs */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            title="Uso de CPU"
            value={`${Math.round(stats.cpu)}%`}
            subtitle="Carga atual"
            accent="from-cyan-400/25 to-blue-500/20"
            left={<Gauge value={stats.cpu} color="rgb(56 189 248)" />}
          />
          <KpiCard
            title="Uso de RAM"
            value={`${Math.round(stats.ram)}%`}
            subtitle="Em uso / Total"
            accent="from-emerald-400/25 to-lime-500/20"
            left={<Gauge value={stats.ram} color="rgb(34 197 94)" />}
          />

          <KpiCard
            title="Uso de Disco"
            value={`${Math.round(stats.disk)}%`}
            subtitle="Sistema de arquivos raiz"
            accent="from-amber-400/25 to-orange-500/20"
            left={<Gauge value={stats.disk} color="rgb(251 191 36)" />}
          />

          <KpiCard
            title="Rede"
            value={`${rateMBs(stats.net.downMBs)} ↓ / ${rateMBs(
              stats.net.upMBs
            )} ↑`}
            subtitle="Taxa (MB/s)"
            accent="from-fuchsia-400/25 to-pink-500/20"
            left={
              <Gauge
                value={Math.min(100, (stats.net.downMBs + stats.net.upMBs) * 5)}
                color="rgb(217 70 239)"
              />
            }
          />
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
            <div
              className="h-64 grid grid-cols-3 gap-6 px-4 place-items-center"
              style={{ marginLeft: "-7%" }}
            >
              <Donut value={stats.cpu} label="CPU" color="rgba(56,189,248,1)" />
              <Donut value={stats.ram} label="RAM" color="rgba(34,197,94,1)" />
              <Donut
                value={stats.disk}
                label="Disco"
                color="rgba(251,191,36,1)"
              />
            </div>
          </Card>

          <Card title="Rede (MB/s)">
            <NetworkBar up={upSeriesMBs} down={downSeriesMBs} />
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card title="Temperaturas">
            <TemperaturePanel />
          </Card>
          <ProcessesTable rows={procRows} />
        </section>
      </main>
    </div>
  );
}
