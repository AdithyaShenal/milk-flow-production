import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  TrendingDown,
  Droplets,
  Clock,
  CheckCircle,
  Navigation,
  Truck,
  Users,
  AlertCircle,
  MapPin,
  UserCheck,
  PackageOpen,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { api } from "../services/apiClient";

interface DashboardData {
  milkCollectedToday: number;
  pendingRequestsToday: number;
  completedRequestsToday: number;
  totalRouteDistanceToday: number;
  milkCollectionTrend: Array<{ date: string; volume: number }>;
  routeStatusBreakdown: Array<{ status: string; count: number }>;
  fleetStatus: {
    available: number;
    inService: number;
    unavailable: number;
  };
  driverStatus: {
    available: number;
    onDuty: number;
    unavailable: number;
  };
  farmersByRoute: Array<{ route: string; farmers: number }>;
  vehicleVolumeAllocation: Array<{
    vehicle: string;
    volume: number;
    stops: number;
  }>;
  systemMetrics: {
    totalFarmers: number;
    totalDrivers: number;
    totalTrucks: number;
    activeRoutes: number;
  };
  weeklyDistanceTrend: Array<{ date: string; distance: number }>;
}

const CHART_COLORS = {
  primary: "oklch(52% 0.22 250)",
  secondary: "oklch(60% 0.12 220)",
  accent: "oklch(68% 0.18 50)",
  success: "oklch(60% 0.14 140)",
  warning: "oklch(75% 0.18 80)",
  error: "oklch(58% 0.22 30)",
  info: "oklch(65% 0.15 230)",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-base-100 text-base-content px-4 py-3 rounded-lg shadow-xl border border-base-300">
        <p className="font-semibold text-sm mb-1.5">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="opacity-70">{entry.name}:</span>
            <span className="font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Empty state component
const EmptyChartState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center h-full py-12 text-base-content/40">
    <PackageOpen className="size-12 mb-3 opacity-30" />
    <p className="text-sm">{message}</p>
  </div>
);

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await api.get("/dashboard");
      return res.data;
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
          <p className="text-sm text-base-content/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100">
        <div className="alert alert-error max-w-md">
          <AlertCircle className="size-5" />
          <div>
            <h3 className="font-bold">Failed to load dashboard</h3>
            <p className="text-sm">
              {error?.message || "Unknown error occurred"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100">
        <div className="alert alert-warning max-w-md">
          <AlertCircle className="size-5" />
          <span>No dashboard data available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            Real-time system overview
          </p>
        </div>
        <div className="text-right text-xs md:text-sm text-base-content/60">
          <div>Last updated</div>
          <div className="font-medium">{new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Milk Collected Today"
          value={`${data.milkCollectedToday.toLocaleString()} L`}
          icon={<Droplets className="size-5" />}
          trend={12.5}
          color="text-primary"
          bgColor="bg-primary/10"
        />
        <MetricCard
          title="Pending Requests"
          value={data.pendingRequestsToday}
          icon={<Clock className="size-5" />}
          trend={-8.2}
          color="text-warning"
          bgColor="bg-warning/10"
        />
        <MetricCard
          title="Completed Requests"
          value={data.completedRequestsToday}
          icon={<CheckCircle className="size-5" />}
          trend={15.3}
          color="text-success"
          bgColor="bg-success/10"
        />
        <MetricCard
          title="Total Distance Today"
          value={`${(data.totalRouteDistanceToday / 1000).toFixed(1)} km`}
          icon={<Navigation className="size-5" />}
          trend={5.7}
          color="text-info"
          bgColor="bg-info/10"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Milk Collection Trend */}
        <ChartCard
          title="7-Day Collection Trend"
          subtitle="Volume collected over the week"
        >
          {!data.milkCollectionTrend ||
          data.milkCollectionTrend.length === 0 ? (
            <EmptyChartState message="No collection data available" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.milkCollectionTrend}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={CHART_COLORS.primary}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={CHART_COLORS.primary}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-base-content/10"
                />
                <XAxis
                  dataKey="date"
                  className="text-[5px] fill-base-content/70"
                  stroke="currentColor"
                />
                <YAxis
                  className="text-xs fill-base-content/70"
                  stroke="currentColor"
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="volume"
                  name="Volume (L)"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVolume)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Farmers per Route */}
        <ChartCard
          title="Farmers Distribution"
          subtitle="Number of farmers per route"
        >
          {!data.farmersByRoute || data.farmersByRoute.length === 0 ? (
            <EmptyChartState message="No route farmer data available" />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={data.farmersByRoute}>
                <PolarGrid className="stroke-base-content/10" />
                <PolarAngleAxis
                  dataKey="route"
                  className="text-xs fill-base-content/10"
                  stroke="currentColor"
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, "auto"]}
                  className="text-xs fill-base-content/50"
                  stroke="currentColor"
                />
                <Radar
                  name="Farmers"
                  dataKey="farmers"
                  stroke={CHART_COLORS.success}
                  fill={CHART_COLORS.success}
                  fillOpacity={0.9}
                  strokeWidth={1}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Volume Allocation */}
        <ChartCard
          title="Vehicle Volume Allocation"
          subtitle="Milk collected per vehicle today"
        >
          {!data.vehicleVolumeAllocation ||
          data.vehicleVolumeAllocation.length === 0 ? (
            <EmptyChartState message="No vehicle allocation data available" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.vehicleVolumeAllocation}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-base-content/10"
                />
                <XAxis
                  dataKey="vehicle"
                  className="text-[10px] fill-base-content/70"
                  stroke="currentColor"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  className="text-xs fill-base-content/70"
                  stroke="currentColor"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="volume"
                  name="Volume (L)"
                  fill={CHART_COLORS.info}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Route Status */}
        <ChartCard title="Route Status" subtitle="Current route distribution">
          {!data.routeStatusBreakdown ||
          data.routeStatusBreakdown.length === 0 ? (
            <EmptyChartState message="No route status data available" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.routeStatusBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                  }
                  outerRadius={100}
                  innerRadius={50}
                  fill={CHART_COLORS.primary}
                  dataKey="count"
                  nameKey="status"
                  className="text-xs fill-base-content"
                >
                  {data.routeStatusBreakdown.map((entry, index) => {
                    const colors = [
                      CHART_COLORS.success,
                      CHART_COLORS.warning,
                      CHART_COLORS.info,
                      CHART_COLORS.error,
                    ];
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    );
                  })}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resources Panel */}
        <ChartCard title="Resources" subtitle="Fleet & driver availability">
          <div className="space-y-6 pt-4">
            {/* Fleet Status */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Truck className="size-4 text-base-content/60" />
                  <span className="text-sm font-medium">Fleet Status</span>
                </div>
                <span className="text-xs text-base-content/50">
                  {(data.fleetStatus?.available || 0) +
                    (data.fleetStatus?.inService || 0) +
                    (data.fleetStatus?.unavailable || 0)}{" "}
                  total
                </span>
              </div>
              <StatusBar
                data={[
                  {
                    label: "Available",
                    value: data.fleetStatus?.available || 0,
                    color: "bg-success",
                  },
                  {
                    label: "In Service",
                    value: data.fleetStatus?.inService || 0,
                    color: "bg-warning",
                  },
                  {
                    label: "Unavailable",
                    value: data.fleetStatus?.unavailable || 0,
                    color: "bg-error",
                  },
                ]}
              />
            </div>

            {/* Driver Status */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-base-content/60" />
                  <span className="text-sm font-medium">Driver Status</span>
                </div>
                <span className="text-xs text-base-content/50">
                  {(data.driverStatus?.available || 0) +
                    (data.driverStatus?.onDuty || 0) +
                    (data.driverStatus?.unavailable || 0)}{" "}
                  total
                </span>
              </div>
              <StatusBar
                data={[
                  {
                    label: "Available",
                    value: data.driverStatus?.available || 0,
                    color: "bg-success",
                  },
                  {
                    label: "On Duty",
                    value: data.driverStatus?.onDuty || 0,
                    color: "bg-info",
                  },
                  {
                    label: "Unavailable",
                    value: data.driverStatus?.unavailable || 0,
                    color: "bg-error",
                  },
                ]}
              />
            </div>

            {/* System Metrics */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="size-4 text-base-content/60" />
                <span className="text-sm font-medium">System Overview</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <SystemMetricBadge
                  label="Farmers"
                  value={data.systemMetrics?.totalFarmers || 0}
                  icon={<Users className="size-4" />}
                />
                <SystemMetricBadge
                  label="Drivers"
                  value={data.systemMetrics?.totalDrivers || 0}
                  icon={<UserCheck className="size-4" />}
                />
                <SystemMetricBadge
                  label="Trucks"
                  value={data.systemMetrics?.totalTrucks || 0}
                  icon={<Truck className="size-4" />}
                />
                <SystemMetricBadge
                  label="Routes"
                  value={data.systemMetrics?.activeRoutes || 0}
                  icon={<Navigation className="size-4" />}
                />
              </div>
            </div>
          </div>
        </ChartCard>

        {/* Weekly Distance */}
        <ChartCard
          title="Weekly Distance"
          subtitle="Total distance per day (km)"
        >
          {!data.weeklyDistanceTrend ||
          data.weeklyDistanceTrend.length === 0 ? (
            <EmptyChartState message="No distance data available" />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data.weeklyDistanceTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-base-content/10"
                />
                <XAxis
                  dataKey="date"
                  className="text-xs fill-base-content/70"
                  stroke="currentColor"
                />
                <YAxis
                  className="text-xs fill-base-content/70"
                  stroke="currentColor"
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="distance"
                  name="Distance (km)"
                  stroke={CHART_COLORS.info}
                  strokeWidth={3}
                  dot={{ fill: CHART_COLORS.info, r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  color: string;
  bgColor: string;
}

function MetricCard({
  title,
  value,
  icon,
  trend,
  color,
  bgColor,
}: MetricCardProps) {
  return (
    <div className="bg-base-200 rounded-lg p-4 md:p-5 border border-base-300 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 md:p-3 rounded-2xl ${bgColor} shadow-sm`}>
            {icon}
          </div>
          <span className="text-xs md:text-sm text-base-content/60 font-medium">
            {title}
          </span>
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
              trend >= 0
                ? "bg-success/10 text-success"
                : "bg-error/10 text-error"
            }`}
          >
            {trend >= 0 ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      <div className={`text-xl md:text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-base-200 rounded-lg p-4 md:p-5 border border-base-300">
      <div className="mb-4">
        <h3 className="text-sm md:text-base font-semibold">{title}</h3>
        {subtitle && (
          <p className="text-xs text-base-content/50 mt-0.5">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function StatusBar({
  data,
}: {
  data: Array<{ label: string; value: number; color: string }>;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="text-center py-4 text-sm text-base-content/40">
        No data available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex h-2 rounded-full overflow-hidden bg-base-300">
        {data.map((item, idx) => (
          <div
            key={idx}
            className={`${item.color} transition-all`}
            style={{ width: `${(item.value / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="flex items-center gap-3 text-xs flex-wrap">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <div className={`size-2.5 rounded-full ${item.color}`} />
            <span className="text-base-content/60">{item.label}</span>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SystemMetricBadge({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-base-300 rounded-lg p-3 flex items-center gap-2 hover:bg-base-300/80 transition-colors">
      <div className="text-base-content/50">{icon}</div>
      <div>
        <div className="text-base md:text-lg font-bold text-base-content">
          {value}
        </div>
        <div className="text-[10px] text-base-content/50 uppercase tracking-wide">
          {label}
        </div>
      </div>
    </div>
  );
}
