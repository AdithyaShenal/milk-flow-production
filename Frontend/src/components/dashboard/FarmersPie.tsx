import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { farmersPieData } from "./../data/Data";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FarmersPie() {
  const remaining =
    farmersPieData.totalRegisteredFarmers -
    farmersPieData.farmersSentRequestToday;

  const data = {
    labels: ["Requests today", "Registered (remaining)"],
    datasets: [
      {
        data: [farmersPieData.farmersSentRequestToday, remaining],
        backgroundColor: ["#22c55e", "#e5e7eb"],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 14,
          boxHeight: 14,
          padding: 14,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const label = ctx.label ?? "";
            const value = ctx.raw as number;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white border border-base-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-base-200">
        <h2 className="text-lg font-semibold">Farmers Overview</h2>
        <p className="text-sm text-base-content/60 mt-1">
          Total registered vs farmers who sent request today
        </p>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-[520px] h-[260px]">
            <Pie data={data} options={options} />
          </div>
        </div>

        <div className="mt-6 border-t border-base-200 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-base-content/70">Total registered</span>
            <span className="font-semibold">
              {farmersPieData.totalRegisteredFarmers}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-base-content/70">Requests today</span>
            <span className="font-semibold">
              {farmersPieData.farmersSentRequestToday}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
