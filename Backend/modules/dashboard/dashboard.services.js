import Driver from "../driver/driver.model.js";
import Farmer from "../farmer/farmer.model.js";
import Production from "../production/production.model.js";
import Route from "../routing/routing.model.js";
import Trucks from "../fleet/fleet.model.js";

export async function getDashboardData() {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  try {
    // Parallel queries for optimal performance
    const [
      todayProduction,
      todayRoutes,
      last7DaysProduction,
      last7DaysRoutes,
      fleetStatus,
      driverStatus,
      totalFarmers,
      totalDrivers,
      totalTrucks,
      activeRoutesCount,
      allFarmers,
    ] = await Promise.all([
      Production.find({
        registration_time: { $gte: startOfToday, $lt: endOfToday },
      }).lean(),

      // FIX: Get today's routes that are completed or in progress
      Route.find({
        createdAt: { $gte: startOfToday, $lt: endOfToday },
        status: { $in: ["completed", "inProgress"] },
      }).lean(),

      Production.find({
        registration_time: { $gte: sevenDaysAgo },
      })
        .sort({ registration_time: 1 })
        .lean(),

      // FIX: Get last 7 days completed routes for distance trends
      Route.find({
        createdAt: { $gte: sevenDaysAgo },
        status: "completed",
      })
        .sort({ createdAt: 1 })
        .lean(),

      Trucks.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      Driver.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      Farmer.countDocuments(),
      Driver.countDocuments(),
      Trucks.countDocuments(),
      // FIX: Active routes are dispatched or inProgress
      Route.countDocuments({
        status: { $in: ["dispatched", "inProgress"] },
      }),
      Farmer.find().select("route").lean(),
    ]);

    console.log("📊 Dashboard Debug:");
    console.log("Today Production:", todayProduction.length);
    console.log("Today Routes (completed/inProgress):", todayRoutes.length);
    console.log("Last 7 Days Production:", last7DaysProduction.length);
    console.log("Last 7 Days Routes (completed):", last7DaysRoutes.length);

    // ──────────────────────────────────────────────────────────────────────
    // TOP 4 METRICS
    // ──────────────────────────────────────────────────────────────────────

    const milkCollectedToday = todayProduction
      .filter((p) => p.status === "collected")
      .reduce((sum, p) => sum + (p.collectedVolume || p.volume || 0), 0);

    const pendingRequestsToday = todayProduction.filter(
      (p) => p.status === "pending" || p.status === "awaiting pickup",
    ).length;

    const completedRequestsToday = todayProduction.filter(
      (p) => p.status === "collected",
    ).length;

    // FIX: Calculate distance from routes
    const totalRouteDistanceToday = todayRoutes.reduce(
      (sum, r) => sum + (r.distance || 0),
      0,
    );

    console.log(
      "Total Route Distance Today:",
      totalRouteDistanceToday,
      "meters",
    );

    // ──────────────────────────────────────────────────────────────────────
    // MILK COLLECTION TREND (7 days)
    // ──────────────────────────────────────────────────────────────────────

    const dailyData = new Map();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      dailyData.set(dateStr, { date: dateStr, volume: 0 });
    }

    last7DaysProduction
      .filter((p) => p.status === "collected")
      .forEach((p) => {
        const dateStr = new Date(p.registration_time).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
          },
        );

        const day = dailyData.get(dateStr);
        if (day) {
          day.volume += p.collectedVolume || p.volume || 0;
        }
      });

    const milkCollectionTrend = Array.from(dailyData.values()).map((day) => ({
      date: day.date,
      volume: Math.round(day.volume),
    }));

    // ──────────────────────────────────────────────────────────────────────
    // ROUTE STATUS BREAKDOWN - FIX: Use correct enum values
    // ──────────────────────────────────────────────────────────────────────

    // Get ALL routes from today (not just completed/inProgress)
    const allTodayRoutes = await Route.find({
      createdAt: { $gte: startOfToday, $lt: endOfToday },
    }).lean();

    const routeStatusMap = new Map([
      ["dispatched", 0],
      ["inProgress", 0],
      ["completed", 0],
      ["canceled", 0],
    ]);

    allTodayRoutes.forEach((r) => {
      const status = r.status || "dispatched";
      routeStatusMap.set(status, (routeStatusMap.get(status) || 0) + 1);
    });

    // Only include statuses with count > 0
    const routeStatusBreakdown = Array.from(routeStatusMap.entries())
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        status:
          status === "inProgress"
            ? "In Progress"
            : status.charAt(0).toUpperCase() + status.slice(1),
        count,
      }));

    console.log("Route Status Breakdown:", routeStatusBreakdown);

    // ──────────────────────────────────────────────────────────────────────
    // FLEET STATUS
    // ──────────────────────────────────────────────────────────────────────

    const fleet = {
      available: 0,
      inService: 0,
      unavailable: 0,
    };

    fleetStatus.forEach((item) => {
      const status = (item._id || "").toLowerCase();
      if (status === "available") fleet.available = item.count;
      if (status === "inservice" || status === "in service")
        fleet.inService = item.count;
      if (status === "unavailable") fleet.unavailable = item.count;
    });

    // ──────────────────────────────────────────────────────────────────────
    // DRIVER STATUS
    // ──────────────────────────────────────────────────────────────────────

    const drivers = {
      available: 0,
      onDuty: 0,
      unavailable: 0,
    };

    driverStatus.forEach((item) => {
      const status = (item._id || "").toLowerCase();
      if (status === "available") drivers.available = item.count;
      if (status === "onduty" || status === "on duty")
        drivers.onDuty = item.count;
      if (status === "unavailable") drivers.unavailable = item.count;
    });

    // ──────────────────────────────────────────────────────────────────────
    // FARMERS BY ROUTE
    // ──────────────────────────────────────────────────────────────────────

    const farmersPerRouteMap = new Map();

    allFarmers.forEach((farmer) => {
      const route = farmer.route || 0;
      farmersPerRouteMap.set(route, (farmersPerRouteMap.get(route) || 0) + 1);
    });

    const farmersByRoute = Array.from(farmersPerRouteMap.entries())
      .map(([route, farmers]) => ({
        route: `Route ${route}`,
        farmers,
      }))
      .sort((a, b) => {
        const aNum = parseInt(a.route.replace("Route ", ""));
        const bNum = parseInt(b.route.replace("Route ", ""));
        return aNum - bNum;
      });

    // ──────────────────────────────────────────────────────────────────────
    // VEHICLE-WISE VOLUME ALLOCATION - FIX: Use today's routes
    // ──────────────────────────────────────────────────────────────────────

    const vehicleVolumeMap = new Map();

    console.log(
      "Processing",
      todayRoutes.length,
      "routes for vehicle allocation...",
    );

    todayRoutes.forEach((route) => {
      const vehicle = route.license_no || "Unknown";

      if (!vehicleVolumeMap.has(vehicle)) {
        vehicleVolumeMap.set(vehicle, { volume: 0, stops: 0 });
      }

      const vehicleData = vehicleVolumeMap.get(vehicle);

      // Calculate total volume from collected stops
      const collectedStops = (route.stops || []).filter((stop) => {
        return stop.production && stop.production.status === "collected";
      });

      console.log(`Route ${vehicle}: ${collectedStops.length} collected stops`);

      const routeVolume = collectedStops.reduce((sum, stop) => {
        const vol =
          stop.production.collectedVolume || stop.production.volume || 0;
        return sum + vol;
      }, 0);

      vehicleData.volume += routeVolume;
      vehicleData.stops += (route.stops || []).filter(
        (s) => s.production !== null,
      ).length;

      console.log(
        `  ${vehicle}: ${vehicleData.volume}L from ${vehicleData.stops} stops`,
      );
    });

    const vehicleVolumeAllocation = Array.from(vehicleVolumeMap.entries())
      .map(([vehicle, data]) => ({
        vehicle,
        volume: Math.round(data.volume),
        stops: data.stops,
      }))
      .sort((a, b) => b.volume - a.volume);

    console.log("Vehicle Volume Allocation:", vehicleVolumeAllocation);

    // ──────────────────────────────────────────────────────────────────────
    // SYSTEM METRICS
    // ──────────────────────────────────────────────────────────────────────

    const systemMetrics = {
      totalFarmers,
      totalDrivers,
      totalTrucks,
      activeRoutes: activeRoutesCount,
    };

    // ──────────────────────────────────────────────────────────────────────
    // WEEKLY DISTANCE TREND - FIX: Use completed routes from last 7 days
    // ──────────────────────────────────────────────────────────────────────

    const dailyDistanceMap = new Map();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      dailyDistanceMap.set(dateStr, 0);
    }

    console.log(
      "Processing",
      last7DaysRoutes.length,
      "completed routes for weekly distance...",
    );

    last7DaysRoutes.forEach((route) => {
      const dateStr = new Date(route.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (dailyDistanceMap.has(dateStr)) {
        const distanceMeters = route.distance || 0;
        console.log(`  Route on ${dateStr}: ${distanceMeters}m`);
        dailyDistanceMap.set(
          dateStr,
          dailyDistanceMap.get(dateStr) + distanceMeters,
        );
      }
    });

    const weeklyDistanceTrend = Array.from(dailyDistanceMap.entries()).map(
      ([date, distance]) => ({
        date,
        distance: Math.round(distance / 1000), // Convert meters to km
      }),
    );

    console.log("Weekly Distance Trend:", weeklyDistanceTrend);

    // ──────────────────────────────────────────────────────────────────────
    // RETURN DASHBOARD DATA
    // ──────────────────────────────────────────────────────────────────────

    return {
      milkCollectedToday: Math.round(milkCollectedToday),
      pendingRequestsToday,
      completedRequestsToday,
      totalRouteDistanceToday: Math.round(totalRouteDistanceToday),
      milkCollectionTrend,
      routeStatusBreakdown,
      fleetStatus: fleet,
      driverStatus: drivers,
      farmersByRoute,
      vehicleVolumeAllocation,
      systemMetrics,
      weeklyDistanceTrend,
    };
  } catch (error) {
    console.error("❌ Dashboard service error:", error);
    throw error;
  }
}
