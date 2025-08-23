import { useEffect, useMemo, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { COLORS } from "../../utils/colors";

const CHART_COLORS = {
  download: {
    border: "#3b82f6",
    fill: "rgba(59, 130, 246, 0.85)",
  },
  upload: {
    border: "#f59e0b",
    fill: "rgba(245, 158, 11, 0.85)",
  },
  grid: "rgba(148, 163, 184, 0.15)",
  text: "#94a3b8",
};

const makeData = (len) => ({
  labels: Array(len).fill(""),
  datasets: [
    {
      label: "Download (MB/s)",
      data: Array(len).fill(0),
      backgroundColor: CHART_COLORS.download.fill,
      borderColor: CHART_COLORS.download.border,
      borderWidth: 0,
      barPercentage: 0.8,
      categoryPercentage: 0.9,
    },
    {
      label: "Upload (MB/s)",
      data: Array(len).fill(0),
      backgroundColor: CHART_COLORS.upload.fill,
      borderColor: CHART_COLORS.upload.border,
      borderWidth: 0,
      barPercentage: 0.8,
      categoryPercentage: 0.9,
    },
  ],
});

const niceMax = (v) => {
  const steps = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100];
  for (const s of steps) if (v <= s) return s;
  return Math.ceil(v / 50) * 50;
};

const fmtMB = (v) => `${Number(v).toFixed(v < 1 ? 2 : 1)} MB/s`;

// Opções
function buildOptions(yMax) {
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
          label: (ctx) => `${ctx.dataset.label}: ${fmtMB(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        stacked: false,
        grid: {
          color: CHART_COLORS.grid,
          lineWidth: 0.5,
        },
        ticks: { display: false },
        border: { display: false },
      },
      y: {
        stacked: false,
        beginAtZero: true,
        max: yMax,
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
          callback: (v) => fmtMB(v),
        },
      },
    },
  };
}

export default function NetworkBar({ up = [], down = [], height = "h-64" }) {
  const ref = useRef(null);
  const len = Math.max(up.length || 20, down.length || 20);
  const dataRef = useRef(makeData(len));

  const yMax = useMemo(() => {
    const max = Math.max(...up, ...down, 0);
    return niceMax((max || 0.1) * 1.2);
  }, [up, down]);

  const options = useMemo(() => buildOptions(yMax), [yMax]);

  useEffect(() => {
    if (!up.length && !down.length) return;

    const pushFixed = (arr, v) => {
      arr.push(v || 0);
      arr.shift();
    };

    pushFixed(dataRef.current.datasets[0].data, down.at(-1));
    pushFixed(dataRef.current.datasets[1].data, up.at(-1));

    ref.current?.update("none");
  }, [up, down]);

  return (
    <div className={height}>
      <Bar
        ref={ref}
        data={dataRef.current}
        options={options}
        datasetIdKey="id"
      />
    </div>
  );
}
