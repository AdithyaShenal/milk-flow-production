import { type ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  bgColor: string;

  /** OPTIONAL (industry features) */
  trend?: "up" | "down";
  change?: string;
  loading?: boolean;
};

export default function StatCard({
  title,
  value,
  icon,
  bgColor,
  trend,
  change,
  loading = false,
}: StatCardProps) {
  return (
    <div className="rounded-xl bg-base-100 border border-base-300/60 p-5 hover:border-base-300 transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            {title}
          </p>

          {loading ? (
            <div className="mt-3 h-6 w-24 rounded bg-base-300 animate-pulse" />
          ) : (
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          )}

          {trend && change && !loading && (
            <div className="mt-2 flex items-center gap-1 text-xs">
              {trend === "up" ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`font-medium ${
                  trend === "up" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {change}
              </span>
              <span className="text-gray-400">vs yesterday</span>
            </div>
          )}
        </div>

        <div className={`p-3 rounded-lg text-gray-600 ${bgColor}`}>{icon}</div>
      </div>
    </div>
  );
}
