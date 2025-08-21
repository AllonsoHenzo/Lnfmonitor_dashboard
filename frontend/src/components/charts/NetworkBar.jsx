import { useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { COLORS } from "../../utils/colors";

// base do gráfico
const buildData = (len) => ({
  labels: Array(len).fill(""),
  datasets: [
    { label: "Up", data: Array(len).fill(0), borderWidth: 0, backgroundColor: COLORS.up },
    { label: "Down", data: Array(len).fill(0), borderWidth: 0, backgroundColor: COLORS.down },
  ],
});

// opções
const options = {
  responsive: true,
  maintainAspectRatio: false,
  resizeDelay: 200,
  animation: { duration: 200 },
  scales: {
    x: { stacked: true, grid: { color: COLORS.grid }, ticks: { display: false, color: COLORS.tick } },
    y: { stacked: true, grid: { color: COLORS.grid }, beginAtZero: true, ticks: { color: COLORS.tick } },
  },
  plugins: { legend: { display: true, labels: { color: COLORS.tick } } },
};

// componente
export default function NetworkBar({ up = [], down = [], height = "h-64" }) {
  const ref = useRef(null);
  const dataRef = useRef(buildData(Math.max(up.length || 20, down.length || 20)));

  // atualiza dados
  useEffect(() => {
    if (!up.length || !down.length) return;
    const pushFixed = (arr, v) => { arr.push(v); arr.shift(); };
    pushFixed(dataRef.current.datasets[0].data, up.at(-1));
    pushFixed(dataRef.current.datasets[1].data, down.at(-1));
    ref.current?.update("none");
  }, [up, down]);

  return (
    <div className={height}>
      <Bar ref={ref} data={dataRef.current} options={options} datasetIdKey="id" />
    </div>
  );
}
