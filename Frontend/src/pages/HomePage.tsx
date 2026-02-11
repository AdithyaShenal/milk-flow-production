import SummaryCards from "../components/dashboard/SummaryCards";
import RoutesTable from "../components/dashboard//RoutesTable";
import FarmersPie from "../components/dashboard//FarmersPie";
import MilkLineChart from "../components/dashboard//MilkLineChart";
import DistanceLineChart from "../components/dashboard//DistanceLineChart";

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        <div className="mb-5">
          <p className="font-semibold text-sm mb-4">Dashboard</p>
        </div>

        <SummaryCards />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-10">
          <div className="lg:col-span-2">
            <RoutesTable />
          </div>
          <div className="lg:col-span-1">
            <FarmersPie />
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <MilkLineChart />
          <DistanceLineChart />
        </div>
      </div>
    </div>
  );
}
