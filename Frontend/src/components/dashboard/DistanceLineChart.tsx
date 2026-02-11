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
import { MapPin, Truck, TrendingUp } from "lucide-react";
import { distanceByRouteWeekly, type RouteId } from "./../data/Data";
import RouteFilter from "./RouteFilter";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
);

type Filter = RouteId | "ALL";

function formatNumber(n: number) {
  return n.toLocaleString();
}

export default function DistanceLineChart() {
  const [active, setActive] = useState<Filter>("ALL");

  const { labels, values, title, activeLabel } = useMemo(() => {
    const baseLabels = distanceByRouteWeekly[0].weekly.map((p) => p.day);

    if (active === "ALL") {
      const summed = baseLabels.map((day) => {
        let total = 0;
        for (const r of distanceByRouteWeekly) {
          const point = r.weekly.find((x) => x.day === day);
          total += point ? point.value : 0;
        }
        return total;
      });

      return {
        labels: baseLabels,
        values: summed,
        title: "Total distance covered per week (All routes)",
        activeLabel: "All routes",
      };
    }

    const routeData = distanceByRouteWeekly.find((r) => r.route === active);
    return {
      labels: baseLabels,
      values: routeData ? routeData.weekly.map((p) => p.value) : [],
      title: `Total distance covered per week (Route ${active.replace("R", "")})`,
      activeLabel: `Route ${active.replace("R", "")}`,
    };
  }, [active]);

  const stats = useMemo(() => {
    const total = values.reduce((a, b) => a + b, 0);
    const avg = values.length ? Math.round(total / values.length) : 0;
    const max = values.length ? Math.max(...values) : 0;
    return { total, avg, max };
  }, [values]);

  const data = {
    labels,
    datasets: [
      {
        label: "Distance (km)",
        data: values,
        borderColor: "#6366f1",
        borderWidth: 3,
        tension: 0.45,
        fill: true,
        backgroundColor: (ctx: any) => {
          const { chart } = ctx;
          const { ctx: canvas, chartArea } = chart;
          if (!chartArea) return null;

          const g = canvas.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );
          g.addColorStop(0, "rgba(99,102,241,0.30)");
          g.addColorStop(1, "rgba(99,102,241,0.04)");
          return g;
        },
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: "#6366f1",
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
        callbacks: {
          label: (ctx) => `${formatNumber(ctx.parsed.y ?? 5)} km`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.06)" } },
    },
  };

  return (
    <div className="bg-white border border-base-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-base-200 bg-linear-to-r from-indigo-50 to-white">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-base-content/60 mt-1">
          Click buttons below to filter distance by route
        </p>
      </div>

      <div className="px-6 py-4 border-b border-base-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-base-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-2">
                <Truck className="text-indigo-600" size={18} />
              </div>
              <div>
                <p className="text-xs text-base-content/60">Selected</p>
                <p className="text-xl font-semibold">{activeLabel}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-base-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-2">
                <MapPin className="text-indigo-600" size={18} />
              </div>
              <div>
                <p className="text-xs text-base-content/60">Total (week)</p>
                <p className="text-xl font-semibold">
                  {formatNumber(stats.total)}{" "}
                  <span className="text-sm text-base-content/60">km</span>
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
                  <span className="text-sm text-base-content/60">km</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="rounded-2xl border border-base-200 bg-linear-to-b from-white to-indigo-50/40 p-4">
          <div className="mb-3">
            <RouteFilter active={active} onChange={setActive} />
          </div>

          <div className="h-[340px]">
            <Line data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}
