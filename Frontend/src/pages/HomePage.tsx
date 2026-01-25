import StatCard from "../components/home/StatCard";
import DashboardCard from "../components/home/DashboardCard";

import LitersProductionsCombinedLine from "../components/home/LitersProductionsCombinedLine";
import DistanceBarChart from "../components/home/DistanceBarChart";
import AvgLitersFarmerBarChart from "../components/home/AvgLitersFarmerBarChart";
import RoundedDoughnut from "../components/home/RoundedDoughnut";

import { Droplets, Calendar, Truck, Milk } from "lucide-react";

const dashboardStats = {
  todayLiters: 1240,
  monthlyLiters: 28500,
  avgPickups: 6.2,
  pendingLiters: 420,
};

const HomePage = () => {
  return (
    /* ================= PAGE CONTAINER ================= */
    <div className="p-2 space-y-5">
      {/* ================= HEADER ROW ================= */}
      <div className="flex items-center justify-between">
        <p className="text-lg ml-1 text-gray-600 font-semibold">Dashboard</p>
      </div>

      {/* ================= KPI CARDS ROW ================= */}
      {/* 1 column on mobile → 2 on md → 4 on xl */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          loading={false}
          title="Total liters collected today"
          value={`${dashboardStats.todayLiters} L`}
          icon={<Droplets size={20} />}
          bgColor="bg-blue-100"
          trend="up"
          change="+12%"
        />

        <StatCard
          loading={false}
          title="Total liters collected this month"
          value={`${dashboardStats.monthlyLiters} L`}
          icon={<Calendar size={20} />}
          bgColor="bg-green-100"
        />

        <StatCard
          loading={false}
          title="Avg pickups per vehicle today"
          value={dashboardStats.avgPickups}
          icon={<Truck size={20} />}
          bgColor="bg-purple-100"
        />

        <StatCard
          loading={true}
          title="Total production recorded today"
          value={`${dashboardStats.pendingLiters} L`}
          icon={<Milk size={20} />}
          bgColor="bg-orange-100"
        />
      </div>

      {/* ================= MAIN DASHBOARD GRID ================= */}
      {/* 12-column SaaS layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* ========== LEFT SECTION (Analytics) ==========
            Full width on mobile
            9/12 columns on xl screens
        */}
        <div className="col-span-12 xl:col-span-9 space-y-6">
          {/* ----- ROW 1: Combined Line Chart ----- */}
          <DashboardCard
            title="Total Liters & Productions"
            subtitle="Last 7 days"
            className="min-h-[360px]"
          >
            <LitersProductionsCombinedLine />
          </DashboardCard>

          {/* ----- ROW 2: Average Liters per Farmer ----- */}
          <DashboardCard title="Average liters per farmer">
            <AvgLitersFarmerBarChart />
          </DashboardCard>

          {/* ----- ROW 3: (Reserved for future charts) ----- */}
          {/* Example: Farmer count, region stats, etc. */}
          {/*
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard title="Example Card" />
            <DashboardCard title="Example Card" />
            <DashboardCard title="Example Card" />
          </div>
          */}
        </div>

        {/* ========== RIGHT SECTION (Summary Panel) ==========
            Full width on mobile
            3/12 columns on xl screens
        */}
        <div className="col-span-12 xl:col-span-3 space-y-6">
          {/* ----- Production Status Doughnut ----- */}
          <DashboardCard title="Production status">
            <RoundedDoughnut
              items={[
                { label: "Completed", value: 85, color: "#3b82f6" },
                { label: "Failed", value: 15, color: "#ef4444" },
              ]}
            />
          </DashboardCard>

          {/* ----- Distance Covered Bar Chart ----- */}
          <DashboardCard title="Distance covered per day (km)">
            <DistanceBarChart />
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
