import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from "chart.js";
import { Droplets, TrendingUp, CalendarDays } from "lucide-react";
import { milkWeekly, milkWeeklyLastWeek } from "./../data/Data";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
);

type WeekMode = "this" | "last";

function formatNumber(n: number) {
  return n.toLocaleString();
}

export default function MilkLineChart() {
  const [mode, setMode] = useState<WeekMode>("this");
  const series = mode === "this" ? milkWeekly : milkWeeklyLastWeek;

  const labels = series.map((p) => p.day);
  const values = series.map((p) => p.value);

  const stats = useMemo(() => {
    const total = values.reduce((a, b) => a + b, 0);
    const avg = values.length ? Math.round(total / values.length) : 0;

    let peakValue = -Infinity;
    let peakIndex = 0;
    values.forEach((v, i) => {
      if (v > peakValue) {
        peakValue = v;
        peakIndex = i;
      }
    });

    return {
      total,
      avg,
      peakDay: labels[peakIndex],
      peakValue,
      peakIndex,
    };
  }, [labels, values]);

  const data = {
    labels,
    datasets: [
      {
        label: mode === "this" ? "This week (L)" : "Last week (L)",
        data: values,

        borderColor: "#4f46e5",
        borderWidth: 3,
        tension: 0.45,

        fill: true,
        backgroundColor: (context: any) => {
          const { chart } = context;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;

          const g = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );
          g.addColorStop(0, "rgba(79, 70, 229, 0.35)");
          g.addColorStop(1, "rgba(79, 70, 229, 0.04)");
          return g;
        },

        pointRadius: (ctx: any) => (ctx.dataIndex === stats.peakIndex ? 7 : 4),
        pointHoverRadius: 8,
        pointBackgroundColor: (ctx: any) =>
          ctx.dataIndex === stats.peakIndex ? "#22c55e" : "#4f46e5",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { usePointStyle: true, pointStyle: "line", padding: 18 },
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          title: (items) => `Day: ${items[0].label}`,
          label: (ctx) => `Milk: ${formatNumber(ctx.parsed.y ?? 5)} L`,
          afterLabel: (ctx) =>
            ctx.dataIndex === stats.peakIndex ? "Peak day ✅" : "",
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.06)" },
        ticks: { font: { size: 12 } },
      },
    },
  };

  return (
    <div
      className="
        bg-white border border-base-200 rounded-2xl overflow-hidden
        shadow-sm transition hover:shadow-md hover:-translate-y-px
      "
    >
      <div className="px-6 py-5 border-b border-base-200 bg-linear-to-r from-indigo-50 to-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Total milk collection per week
            </h2>
            <p className="text-sm text-base-content/60 mt-1">
              Weekly milk volume (Mon – Sun) with peak-day highlight
            </p>
          </div>

          <div className="flex rounded-full border border-base-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setMode("this")}
              className={`px-4 py-1.5 text-sm rounded-full transition ${
                mode === "this"
                  ? "bg-indigo-600 text-white"
                  : "text-base-content/70 hover:bg-base-100"
              }`}
            >
              This Week
            </button>
            <button
              type="button"
              onClick={() => setMode("last")}
              className={`px-4 py-1.5 text-sm rounded-full transition ${
                mode === "last"
                  ? "bg-indigo-600 text-white"
                  : "text-base-content/70 hover:bg-base-100"
              }`}
            >
              Last Week
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-base-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-base-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-2">
                <Droplets className="text-indigo-600" size={18} />
              </div>
              <div>
                <p className="text-xs text-base-content/60">Total (week)</p>
                <p className="text-xl font-semibold">
                  {formatNumber(stats.total)}{" "}
                  <span className="text-sm text-base-content/60">L</span>
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-base-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-2">
                <TrendingUp className="text-indigo-600" size={18} />
              </div>
              <div>
                <p className="text-xs text-base-content/60">Average / day</p>
                <p className="text-xl font-semibold">
                  {formatNumber(stats.avg)}{" "}
                  <span className="text-sm text-base-content/60">L</span>
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-base-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-2">
                <CalendarDays className="text-emerald-600" size={18} />
              </div>
              <div>
                <p className="text-xs text-base-content/60">Peak day</p>
                <p className="text-xl font-semibold">
                  {stats.peakDay}{" "}
                  <span className="text-sm text-base-content/60">
                    ({formatNumber(stats.peakValue)} L)
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mt-4 rounded-2xl border border-base-200 bg-linear-to-b from-white to-indigo-50/40 p-4">
          <div className="h-[340px]">
            <Line data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}
