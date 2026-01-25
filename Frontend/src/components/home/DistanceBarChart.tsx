import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function DistanceBarChart() {
  const chartColors = {
    primary: "#3b82f6",
    success: "#22c55e",
    info: "#0ea5e9",
    warning: "#f97316",
    danger: "#ef4444",
    grid: "rgba(148,163,184,0.2)",
  };

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "This Week (km)",
        data: [120, 150, 110, 180, 160, 190, 200],
        backgroundColor: chartColors.success,
        borderRadius: 6,
        barThickness: 20,
      },
      {
        label: "Last Week (km)",
        data: [100, 130, 105, 160, 150, 170, 180],
        backgroundColor: chartColors.info,
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.parsed.y} km`,
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
          callback: (value: any) => `${value} km`,
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
