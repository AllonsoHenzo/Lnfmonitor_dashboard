import { useEffect, useMemo, useRef } from "react";
import { Line } from "react-chartjs-2";
import { COLORS } from "../../utils/colors";

// base do gráfico
const makeData = (len) => ({
  labels: Array(len).fill(""),
  datasets: [
    {
      label: "CPU (%)",
      data: Array(len).fill(0),
      tension: 0.35, borderWidth: 2, fill: true,
      borderColor: COLORS.cpu, backgroundColor: COLORS.cpuFill,
      pointRadius: 0,
      yAxisID: "yPct",
    },
    {
      label: "RAM (GB)",
      data: Array(len).fill(0),
      tension: 0.35, borderWidth: 2, fill: true,
      borderColor: COLORS.ram, backgroundColor: COLORS.ramFill,
      pointRadius: 0,
      yAxisID: "yGB",
    },
  ],
});

// opções do chart
function buildOptions(maxGB = 8) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 200 },
    scales: {
      x: { grid: { color: COLORS.grid }, ticks: { display: false, color: COLORS.tick } },
      yPct: {
        position: "left",
        grid: { color: COLORS.grid },
        beginAtZero: true, max: 100,
        ticks: { color: COLORS.tick, callback: (v) => `${v}%` },
      },
      yGB: {
        position: "right",
        grid: { drawOnChartArea: false },
        beginAtZero: true, suggestedMax: maxGB,
        ticks: { color: COLORS.tick, callback: (v) => `${v} GB` },
      },
    },
    plugins: {
      legend: { display: true, labels: { color: COLORS.tick } },
      tooltip: {
        callbacks: {
          label(ctx) {
            return ctx.dataset.yAxisID === "yGB"
              ? `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)} GB`
              : `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(0)}%`;
          },
        },
      },
    },
    interaction: { mode: "nearest", intersect: false },
  };
}

// componente
export default function CpuMemTrend({
  cpuSeries = [], ramGBSeries = [], ramTotalGB = 0, height = "h-64",
}) {
  const ref = useRef(null);
  const len = Math.max(cpuSeries.length || 40, ramGBSeries.length || 40);
  const dataRef = useRef(makeData(len));

  const options = useMemo(
    () => buildOptions(Math.max(ramTotalGB || 0, Math.ceil(Math.max(0, ...ramGBSeries)))),
    [ramTotalGB, ramGBSeries]
  );

  // atualiza dados
  useEffect(() => {
    if (!cpuSeries.length && !ramGBSeries.length) return;
    const pushFixed = (arr, v) => { arr.push(v); arr.shift(); };

    if (cpuSeries.length)   pushFixed(dataRef.current.datasets[0].data, cpuSeries.at(-1));
    if (ramGBSeries.length) pushFixed(dataRef.current.datasets[1].data, ramGBSeries.at(-1));

    ref.current?.update("none");
  }, [cpuSeries, ramGBSeries]);

  return (
    <div className={height}>
      <Line ref={ref} data={dataRef.current} options={options} datasetIdKey="id" />
    </div>
  );
}
