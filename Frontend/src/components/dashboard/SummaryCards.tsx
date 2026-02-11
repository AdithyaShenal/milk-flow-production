import { TrendingUp, ClipboardList, Users, Truck } from "lucide-react";
import { summaryData } from "./../data/Data";

type CardTone = "blue" | "pink" | "indigo" | "purple";

function toneClasses(tone: CardTone) {
  switch (tone) {
    case "blue":
      return {
        card: "bg-gradient-to-br from-sky-700 to-slate-900 border-sky-800/30 hover:shadow-sky-500/20",
        iconWrap: "bg-white/10 border-white/15",
        badge: "bg-sky-500/20 text-sky-200",
      };
    case "pink":
      return {
        card: "bg-gradient-to-br from-fuchsia-700 to-slate-900 border-fuchsia-800/30 hover:shadow-fuchsia-500/20",
        iconWrap: "bg-white/10 border-white/15",
        badge: "bg-fuchsia-500/20 text-fuchsia-200",
      };
    case "indigo":
      return {
        card: "bg-gradient-to-br from-indigo-700 to-slate-900 border-indigo-800/30 hover:shadow-indigo-500/20",
        iconWrap: "bg-white/10 border-white/15",
        badge: "bg-indigo-500/20 text-indigo-200",
      };
    case "purple":
      return {
        card: "bg-gradient-to-br from-violet-700 to-slate-900 border-violet-800/30 hover:shadow-violet-500/20",
        iconWrap: "bg-white/10 border-white/15",
        badge: "bg-violet-500/20 text-violet-200",
      };
  }
}

function SummaryCard({
  label,
  value,
  subText,
  icon,
  tone,
}: {
  label: string;
  value: string;
  subText: string;
  icon: React.ReactNode;
  tone: CardTone;
}) {
  const t = toneClasses(tone);

  return (
    <div
      className={`relative rounded-2xl border ${t.card}
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-lg`}
    >
      <div
        className={`absolute top-3 right-3 rounded-full px-2 py-0.5 text-[10px] font-semibold ${t.badge}`}
      >
        Today
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-wide uppercase text-white/70">
              {label}
            </p>

            <p className="mt-2 text-3xl font-bold text-white leading-none">
              {value}
            </p>

            <p className="mt-2 text-xs text-white/70">{subText}</p>
          </div>

          <div className={`rounded-xl border p-2 ${t.iconWrap}`}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <SummaryCard
        tone="blue"
        label="Milk Collected Today"
        value={`${summaryData.milkCollectedTodayLiters.toLocaleString()} L`}
        subText={`+${summaryData.milkVsYesterdayPercent}% vs yesterday`}
        icon={<TrendingUp size={18} className="text-white/90" />}
      />

      <SummaryCard
        tone="pink"
        label="Pending Requests Today"
        value={`${summaryData.pendingRequestsToday}`}
        subText={summaryData.pendingRequestsNote}
        icon={<ClipboardList size={18} className="text-white/90" />}
      />

      <SummaryCard
        tone="indigo"
        label="Drivers Available Today"
        value={`${summaryData.driversAvailableToday}`}
        subText={`${summaryData.driversOnRoute} on route`}
        icon={<Users size={18} className="text-white/90" />}
      />

      <SummaryCard
        tone="purple"
        label="Trucks Available Today"
        value={`${summaryData.trucksAvailableToday}`}
        subText={`${summaryData.trucksInMaintenance} in maintenance`}
        icon={<Truck size={18} className="text-white/90" />}
      />
    </div>
  );
}
