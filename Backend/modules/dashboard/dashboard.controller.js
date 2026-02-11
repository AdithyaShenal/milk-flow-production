import * as dashboardService from "./dashboard.services.js";

export async function getDashboardData(req, res, next) {
  try {
    const today = new Date();
    const dashboardData = await dashboardService.compileDashboardData(today);

    return res.json({
      success: true,
      data: dashboardData,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}
