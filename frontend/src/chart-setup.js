// src/chart-setup.js
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// registra os módulos que vou usar
ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

// defaults
ChartJS.defaults.color = "rgba(253, 253, 253, 0.9)";
ChartJS.defaults.borderColor = "rgba(2, 99, 26, 0.14)";

export default ChartJS;
