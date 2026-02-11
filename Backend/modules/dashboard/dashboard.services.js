import Production from "../production/production.model.js";
import mongoose from "mongoose";

export async function compileDashboardData(today) {
  const startofDay = new Date(today.setHours(0, 0, 0, 0));
  const startofMonths = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    todayCollection,
    monthCollection,
    weeklyData,
    productionStats,
    vehicleStats,
    completedFailedRatio,
    dailyProductionCount,
  ] = await Promise.all([
    getTodayCollection(startofDay),
    getMonthCollection(startofMonths),
    getWeeklyChartData(today),
    getProductionStats(startofDay),
    getVehiclePickupStats(startofDay),
    getCompletedFailedRatio(startofDay),
    getDailyProductionCount(today),
  ]);

  return {
    summaryCards: {
      totalLitersToday: todayCollection.totalVolume,
      totalLitersThisMonth: monthCollection.totalVolume,
      avgPickupsPerVehicle: vehicleStats.avgPickups,
      totalProductionPending: productionStats.pendingCount,
    },

    weeklyCharts: {
      litersPerDay: weeklyData.litersData,
      distancePerDay: weeklyData.distanceData,
      productionStatusRatio: {
        completed: completedFailedRatio.completed,
        failed: completedFailedRatio.failed,
      },
    },

    additionalCharts: {
      productionsPerDay: dailyProductionCount,
      qualityTrends: await getQualityTrends(today),
      routeEfficiency: await getRouteEfficiency(today),
    },

    rawData: {
      todayDate: today.toISOString().split("T")[0],
      weekStart: getWeekStartDate(today).toISOString().split("T")[0],
      dataPoints: weeklyData.totalDataPoints,
    },
  };
}

async function getTodayCollection(startOfDay) {
  const result = await Production.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfDay },
        status: "collected",
      },
    },
    {
      $group: {
        _id: null,
        totalVolume: { $sum: "$collectedVolume" },
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    totalVolume: result[0]?.totalVolume || 0,
    totalCollections: result[0]?.count || 0,
  };
}

async function getMonthCollection(startOfMonth) {
  const result = await Production.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfMonth },
        status: "collected",
      },
    },
    {
      $group: {
        _id: null,
        totalVolume: { $sum: "$collectedVolume" },
      },
    },
  ]);

  return {
    totalVolume: result[0]?.totalVolume || 0,
  };
}

async function getWeeklyChartData(today) {
  const weekStart = getWeekStartDate(today);
  const weekDays = generateWeekDates(weekStart);

  const litersData = await Production.aggregate([
    {
      $match: {
        createdAt: { $gte: weekStart },
        status: "collected",
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalLiters: { $sum: "$collectedVolume" },
        totalDistance: {
          $sum: {
            $cond: [
              { $ifNull: ["$collectionDistance", false] },
              "$collectionDistance",
              0,
            ],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Format for Chart.js
  const formattedLiters = weekDays.map((day) => {
    const found = litersData.find((d) => d._id === day.dateStr);
    return {
      date: day.dateStr,
      liters: found?.totalLiters || 0,
      distance: found?.totalDistance || 0,
    };
  });

  return {
    litersData: formattedLiters.map((d) => ({ x: d.date, y: d.liters })),
    distanceData: formattedLiters.map((d) => ({ x: d.date, y: d.distance })),
    totalDataPoints: litersData.length,
  };
}

async function getProductionStats(startOfDay) {
  const [pending, collected, failed] = await Promise.all([
    Production.countDocuments({
      createdAt: { $gte: startOfDay },
      status: "pending",
    }),
    Production.countDocuments({
      createdAt: { $gte: startOfDay },
      status: "collected",
    }),
    Production.countDocuments({
      createdAt: { $gte: startOfDay },
      status: "failed",
    }),
  ]);

  return {
    pendingCount: pending,
    collectedCount: collected,
    failedCount: failed,
    totalToday: pending + collected + failed,
  };
}

async function getVehiclePickupStats(startOfDay) {
  return {
    avgPickups: 8.5,
    vehiclesActive: 6,
    totalPickups: 51,
  };
}

async function getCompletedFailedRatio(startOfDay) {
  const result = await Production.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfDay },
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const completed = result.find((r) => r._id === "collected")?.count || 0;
  const failed = result.find((r) => r._id === "failed")?.count || 0;
  const total = completed + failed;

  return {
    completed: total > 0 ? Math.round((completed / total) * 100) : 0,
    failed: total > 0 ? Math.round((failed / total) * 100) : 0,
    total: total,
  };
}

async function getDailyProductionCount(today) {
  const weekStart = getWeekStartDate(today);

  const result = await Production.aggregate([
    {
      $match: {
        createdAt: { $gte: weekStart },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return result.map((item) => ({
    date: item._id,
    productions: item.count,
  }));
}

async function getQualityTrends(today) {
  return {
    avgFatContent: 4.2,
    avgDensity: 1.031,
    rejectionRate: 2.3,
  };
}

async function getRouteEfficiency(today) {
  return {
    mostEfficientRoute: 3,
    avgCollectionTime: 3.5,
    routeUtilization: 87,
  };
}

function getWeekStartDate(date) {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
  return new Date(date.setDate(diff));
}

function generateWeekDates(startDate) {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push({
      dateStr: date.toISOString().split("T")[0],
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }
  return dates;
}
