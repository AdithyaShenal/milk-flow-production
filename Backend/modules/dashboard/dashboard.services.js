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

      Route.find({
        createdAt: { $gte: startOfToday, $lt: endOfToday },
      }).lean(),

      Production.find({
        registration_time: { $gte: sevenDaysAgo },
      })
        .sort({ registration_time: 1 })
        .lean(),

      Route.find({
        createdAt: { $gte: sevenDaysAgo },
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
      Route.distinct("route"),
      Farmer.find().select("route").lean(),
    ]);

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

    const totalRouteDistanceToday = todayRoutes.reduce(
      (sum, r) => sum + (r.distance || 0),
      0,
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
    // ROUTE STATUS BREAKDOWN
    // ──────────────────────────────────────────────────────────────────────

    const routeStatusMap = new Map();
    todayRoutes.forEach((r) => {
      const status = r.status || "unknown";
      routeStatusMap.set(status, (routeStatusMap.get(status) || 0) + 1);
    });

    const routeStatusBreakdown = Array.from(routeStatusMap.entries()).map(
      ([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count,
      }),
    );

    // ──────────────────────────────────────────────────────────────────────
    // FLEET STATUS
    // ──────────────────────────────────────────────────────────────────────

    const fleet = {
      available: 0,
      inService: 0,
      unavailable: 0,
    };

    fleetStatus.forEach((item) => {
      if (item._id === "available") fleet.available = item.count;
      if (item._id === "inService") fleet.inService = item.count;
      if (item._id === "unavailable") fleet.unavailable = item.count;
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
      if (item._id === "available") drivers.available = item.count;
      if (item._id === "onDuty") drivers.onDuty = item.count;
      if (item._id === "unavailable") drivers.unavailable = item.count;
    });

    // ──────────────────────────────────────────────────────────────────────
    // FARMERS BY ROUTE - For radar chart
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
    // VEHICLE-WISE VOLUME ALLOCATION - For today
    // ──────────────────────────────────────────────────────────────────────

    const vehicleVolumeMap = new Map();

    todayRoutes.forEach((route) => {
      const vehicle = route.license_no || "Unknown";

      if (!vehicleVolumeMap.has(vehicle)) {
        vehicleVolumeMap.set(vehicle, { volume: 0, stops: 0 });
      }

      const vehicleData = vehicleVolumeMap.get(vehicle);

      // Calculate total volume from route stops
      const routeVolume = (route.stops || [])
        .filter(
          (stop) =>
            stop.production &&
            (stop.production.status === "collected" ||
              stop.production.status === "success"),
        )
        .reduce((sum, stop) => {
          return (
            sum +
            (stop.production.collectedVolume || stop.production.volume || 0)
          );
        }, 0);

      vehicleData.volume += routeVolume;
      vehicleData.stops += (route.stops || []).filter(
        (s) => s.production !== null,
      ).length;
    });

    const vehicleVolumeAllocation = Array.from(vehicleVolumeMap.entries())
      .map(([vehicle, data]) => ({
        vehicle,
        volume: Math.round(data.volume),
        stops: data.stops,
      }))
      .sort((a, b) => b.volume - a.volume);

    // ──────────────────────────────────────────────────────────────────────
    // SYSTEM METRICS
    // ──────────────────────────────────────────────────────────────────────

    const systemMetrics = {
      totalFarmers,
      totalDrivers,
      totalTrucks,
      activeRoutes: activeRoutesCount.length,
    };

    // ──────────────────────────────────────────────────────────────────────
    // WEEKLY DISTANCE TREND
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

    last7DaysRoutes.forEach((route) => {
      const dateStr = new Date(route.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (dailyDistanceMap.has(dateStr)) {
        dailyDistanceMap.set(
          dateStr,
          dailyDistanceMap.get(dateStr) + (route.distance || 0),
        );
      }
    });

    const weeklyDistanceTrend = Array.from(dailyDistanceMap.entries()).map(
      ([date, distance]) => ({
        date,
        distance: Math.round(distance / 1000), // Convert to km
      }),
    );

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
    console.error("Dashboard service error:", error);
    throw error;
  }
}
