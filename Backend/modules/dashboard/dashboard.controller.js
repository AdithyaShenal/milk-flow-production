import * as services from "./dashboard.services.js";

export async function getDashboardData(req, res) {
  const data = await services.getDashboardData();
  res.status(200).json(data);
}
