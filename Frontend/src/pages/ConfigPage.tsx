import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import LocationFetchMap from "../components/map/LocationFetch";
import useGetConfigurations from "../hooks/useGetConfigurations";
import useGetDashboardData from "../hooks/useGetDashboardData";
import FullLoadingPage from "../components/Loading/FullLoadingPage";
import useUpdateDepotLocation from "../hooks/useUpdateDepotLocation";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number;
    };
  }
}

interface Location {
  lat: number;
  lon: number;
}

interface ReportSection {
  id: string;
  label: string;
  enabled: boolean;
}

const ConfigPage = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [pdfNotes, setPdfNotes] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [reportSections, setReportSections] = useState<ReportSection[]>([
    { id: "daily_metrics", label: "Daily Metrics", enabled: true },
    {
      id: "system_summary",
      label: "System Performance Summary",
      enabled: true,
    },
  ]);

  const { data: configs, isLoading, isError, error } = useGetConfigurations();
  const { data: dashboardData } = useGetDashboardData();
  const { mutate: updateLocation, isPending } = useUpdateDepotLocation();

  useEffect(() => {
    if (configs && !location) {
      setLocation(configs.depot_location);
    }
  }, [configs, location]);

  if (isLoading) return <FullLoadingPage />;

  const submitHandler = () => {
    if (!location) return;

    updateLocation({
      depotCoords: {
        lat: location.lat,
        lon: location.lon,
      },
    });
  };

  const toggleSection = (id: string) => {
    setReportSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    );
  };

  const generatePDF = async () => {
    if (!dashboardData) {
      alert("Dashboard data not loaded");
      return;
    }

    setIsGeneratingPDF(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;

      const today = new Date().toLocaleDateString();

      const data = {
        milk: dashboardData.milkCollectedToday,
        pending: dashboardData.pendingRequestsToday,
        completed: dashboardData.completedRequestsToday,
        distance: dashboardData.totalRouteDistanceToday,
        farmers: dashboardData.systemMetrics.totalFarmers,
        drivers: dashboardData.systemMetrics.totalDrivers,
        trucks: dashboardData.systemMetrics.totalTrucks,
        routes: dashboardData.systemMetrics.activeRoutes,
      };

      // ================= TITLE =================
      doc.setFontSize(18);
      doc.text("Milk Collection & Logistics System", pageWidth / 2, y, {
        align: "center",
      });
      y += 8;

      doc.setFontSize(14);
      doc.text("Operational Performance Report", pageWidth / 2, y, {
        align: "center",
      });
      y += 10;

      doc.setFontSize(10);
      doc.text(`Report Date: ${today}`, pageWidth / 2, y, { align: "center" });
      y += 10;

      // ================= DAILY METRICS =================
      doc.setFontSize(14);
      doc.text("Daily Operational Metrics", 14, y);
      y += 5;

      autoTable(doc, {
        startY: y,
        head: [["Metric", "Value"]],
        body: [
          ["Milk Collected Today", `${data.milk} L`],
          ["Pending Requests", data.pending],
          ["Completed Requests", data.completed],
          ["Distance Covered", `${(data.distance / 1000).toFixed(1)} km`],
        ],
      });

      y = (doc.lastAutoTable?.finalY ?? y) + 10;

      // ================= SYSTEM SUMMARY =================
      doc.setFontSize(14);
      doc.text("System Performance Summary", 14, y);
      y += 5;

      autoTable(doc, {
        startY: y,
        head: [["System Aspect", "Value"]],
        body: [
          ["Total Farmers", data.farmers],
          ["Total Drivers", data.drivers],
          ["Total Trucks", data.trucks],
          ["Active Routes", data.routes],
        ],
      });

      y = (doc.lastAutoTable?.finalY ?? y) + 10;

      // ================= NOTES =================
      if (pdfNotes.trim()) {
        doc.setFontSize(12);
        doc.text("Additional Notes", 14, y);
        y += 5;

        doc.setFontSize(10);
        doc.text(pdfNotes, 14, y);
      }

      // ================= FOOTER =================
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `MCLROS Report | Page ${i} of ${totalPages} | ${today}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" },
        );
      }

      doc.save(`mclros-report-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (err) {
      console.error(err);
      alert("PDF generation failed");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="w-full mx-auto space-y-6">
      {isError && <div className="alert alert-error">{error?.message}</div>}

      <div>
        <h1 className="text-2xl font-bold">System Dashboard</h1>
        <p className="text-sm">
          Monitor operations and generate performance reports
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* LEFT (UNCHANGED) */}
        <div className="lg:col-span-2 flex">
          <div className="card bg-base-100 border border-base-300 w-full h-full">
            <div className="card-body">
              <h2 className="card-title text-lg font-semibold">
                Operational Control Center
              </h2>
              <p className="text-sm">
                Depot location management and system monitoring
              </p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-80 rounded-lg border overflow-hidden">
                  {configs && (
                    <LocationFetchMap
                      initialLocation={configs.depot_location}
                      onLocationChange={(loc: Location) => setLocation(loc)}
                    />
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Depot Coordinates
                    </label>
                    {configs && (
                      <input
                        readOnly
                        className="input input-bordered w-full mt-1"
                        value={`${configs.depot_location.lat}, ${configs.depot_location.lon}`}
                      />
                    )}
                    <p className="text-xs mt-1">
                      Current GPS coordinates of the main depot
                    </p>
                  </div>

                  <button
                    onClick={submitHandler}
                    className="btn btn-primary w-full"
                    disabled={isPending}
                  >
                    {isPending ? "Updating..." : "Update Depot Location"}
                  </button>

                  {location && (
                    <p className="text-xs">
                      New coordinates will be saved: {location.lat},{" "}
                      {location.lon}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT (MATCH IMAGE EXACTLY) */}
        <div className="flex">
          <div className="card bg-base-100 border border-base-300 w-full h-full">
            <div className="card-body">
              {/* TITLE */}
              <h2 className="card-title text-lg font-semibold">
                Performance Report Generator
              </h2>
              <p className="text-sm">Generate operational reports</p>

              {/* CHECKBOX SECTION */}
              <div className="bg-base-200 rounded-lg p-4 mt-4 space-y-2">
                {reportSections.map((section) => (
                  <label key={section.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={section.enabled}
                      onChange={() => toggleSection(section.id)}
                    />
                    {section.label}
                  </label>
                ))}
              </div>

              {/* TEXTAREA */}
              <textarea
                className="textarea textarea-bordered w-full mt-4 min-h-[180px] resize-none"
                placeholder="Add notes..."
                value={pdfNotes}
                onChange={(e) => setPdfNotes(e.target.value)}
              />

              {/* BUTTON */}
              <button
                onClick={generatePDF}
                className="btn btn-primary w-full mt-4"
                disabled={isGeneratingPDF}
              >
                {isGeneratingPDF ? "Generating..." : "Generate Report"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigPage;
