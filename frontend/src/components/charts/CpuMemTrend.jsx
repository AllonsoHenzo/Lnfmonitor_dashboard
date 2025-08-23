import { useEffect, useMemo, useRef } from "react";
import { Line } from "react-chartjs-2";
import { COLORS } from "../../utils/colors";

const CHART_COLORS = {
  cpu: {
    border: "#06b6d4",
    fill: "rgba(6, 182, 212, 0.15)",
  },
  ram: {
    border: "#10b981",
    fill: "rgba(16, 185, 129, 0.15)",
  },
  grid: "rgba(148, 163, 184, 0.15)",
  text: "#94a3b8",
};

const makeData = (len) => ({
  labels: Array(len).fill(""),
  datasets: [
    {
      label: "CPU (%)",
      data: Array(len).fill(0),
      tension: 0.1,
      borderWidth: 1.5,
      fill: true,
      borderColor: CHART_COLORS.cpu.border,
      backgroundColor: CHART_COLORS.cpu.fill,
      pointRadius: 0,
      yAxisID: "yPct",
    },
    {
      label: "RAM (GB)",
      data: Array(len).fill(0),
      tension: 0.1,
      borderWidth: 1.5,
      fill: true,
      borderColor: CHART_COLORS.ram.border,
      backgroundColor: CHART_COLORS.ram.fill,
      pointRadius: 0,
      yAxisID: "yGB",
    },
  ],
});

// Opções
function buildOptions(maxGB = 8) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 150 },
    interaction: { mode: "nearest", intersect: false },
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "start",
        labels: {
          color: CHART_COLORS.text,
          font: { size: 11, weight: "500" },
          padding: 15,
          usePointStyle: true,
          pointStyle: "rect",
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#f8fafc",
        bodyColor: "#e2e8f0",
        borderColor: "rgba(148, 163, 184, 0.3)",
        borderWidth: 1,
        cornerRadius: 4,
        displayColors: true,
        padding: 8,
        titleFont: { size: 11 },
        bodyFont: { size: 11 },
        callbacks: {
          label(ctx) {
            const value = ctx.parsed.y;
            const unit = ctx.dataset.yAxisID === "yGB" ? " GB" : "%";
            return `${ctx.dataset.label}: ${value.toFixed(1)}${unit}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: CHART_COLORS.grid,
          lineWidth: 0.5,
        },
        ticks: { display: false },
        border: { display: false },
      },
      yPct: {
        position: "left",
        beginAtZero: true,
        max: 100,
        grid: {
          color: CHART_COLORS.grid,
          lineWidth: 0.5,
          drawBorder: false,
        },
        border: { display: false },
        ticks: {
          color: CHART_COLORS.text,
          font: { size: 10, family: "'JetBrains Mono', monospace" },
          padding: 6,
          maxTicksLimit: 6,
          callback: (v) => `${v}%`,
        },
      },
      yGB: {
        position: "right",
        beginAtZero: true,
        suggestedMax: maxGB,
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: CHART_COLORS.text,
          font: { size: 10, family: "'JetBrains Mono', monospace" },
          padding: 6,
          maxTicksLimit: 6,
          callback: (v) => `${v} GB`,
        },
      },
    },
  };
}

export default function CpuMemTrend({
  cpuSeries = [],
  ramGBSeries = [],
  ramTotalGB = 0,
  height = "h-64",
}) {
  const ref = useRef(null);
  const len = Math.max(cpuSeries.length || 40, ramGBSeries.length || 40);
  const dataRef = useRef(makeData(len));

  const options = useMemo(
    () =>
      buildOptions(
        Math.max(ramTotalGB || 0, Math.ceil(Math.max(0, ...ramGBSeries)))
      ),
    [ramTotalGB, ramGBSeries]
  );

  useEffect(() => {
    if (!cpuSeries.length && !ramGBSeries.length) return;

    const pushFixed = (arr, v) => {
      arr.push(v);
      arr.shift();
    };

    if (cpuSeries.length)
      pushFixed(dataRef.current.datasets[0].data, cpuSeries.at(-1));
    if (ramGBSeries.length)
      pushFixed(dataRef.current.datasets[1].data, ramGBSeries.at(-1));

    ref.current?.update("none");
  }, [cpuSeries, ramGBSeries]);

  return (
    <div className={height}>
      <Line
        ref={ref}
        data={dataRef.current}
        options={options}
        datasetIdKey="id"
      />
    </div>
  );
}
