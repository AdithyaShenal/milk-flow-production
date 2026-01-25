import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
const chartColors = {
  primary: "#3b82f6",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#f97316",
  danger: "#ef4444",
  grid: "rgba(148,163,184,0.2)",
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AvgLitersFarmerBarChart() {
  const data = {
    labels: ["Farmer A", "Farmer B", "Farmer C", "Farmer D"],
    datasets: [
      {
        label: "This Week (L)",
        data: [120, 150, 90, 170],
        backgroundColor: chartColors.primary,
        borderRadius: 6,
        barThickness: 22,
      },
      {
        label: "Last Week (L)",
        data: [110, 140, 100, 160],
        backgroundColor: chartColors.warning,
        borderRadius: 6,
        barThickness: 22,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.parsed.y} L`,
        },
      },
      legend: {
        position: "bottom" as const,
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: chartColors.grid },
        ticks: {
          callback: (value: any) => `${value} L`,
        },
      },
    },
  };

  return (
    <div className="h-56">
      <Bar data={data} options={options} />
    </div>
  );
}
