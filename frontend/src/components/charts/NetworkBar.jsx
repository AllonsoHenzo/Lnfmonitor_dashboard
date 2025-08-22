import { useEffect, useMemo, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { COLORS } from "../../utils/colors";

const makeData = (len) => ({
  labels: Array(len).fill(""),
  datasets: [
    {
      label: "Download (MB/s)",
      data: Array(len).fill(0),
      backgroundColor: COLORS.down,
      borderWidth: 0,
      barPercentage: 0.9,
      categoryPercentage: 0.9,
    },
    {
      label: "Upload (MB/s)",
      data: Array(len).fill(0),
      backgroundColor: COLORS.up,
      borderWidth: 0,
      barPercentage: 0.9,
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

export default function NetworkBar({ up = [], down = [], height = "h-64" }) {
  const ref = useRef(null);
  const len = Math.max(up.length || 20, down.length || 20);
  const dataRef = useRef(makeData(len));
  const yMax = useMemo(() => {
    const max = Math.max(...up, ...down, 0);
    return niceMax((max || 0.1) * 1.2);
  }, [up, down]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 200 },
      scales: {
        x: {
          stacked: false,
          grid: { color: COLORS.grid },
          ticks: { display: false, color: COLORS.tick },
        },
        y: {
          stacked: false,
          grid: { color: COLORS.grid },
          beginAtZero: true,
          max: yMax,
          ticks: { color: COLORS.tick, callback: (v) => fmtMB(v) },
        },
      },
      plugins: {
        legend: { display: true, labels: { color: COLORS.tick } },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${fmtMB(ctx.parsed.y)}`,
          },
        },
      },
    }),
    [yMax]
  );

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
