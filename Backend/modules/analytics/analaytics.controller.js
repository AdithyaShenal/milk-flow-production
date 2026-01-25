import * as services from "./analytics.service.js";
import { successResponse } from "../../util/response.js";

export async function miniDashboardController(req, res) {
  const result = await services.miniDashboardService();

  successResponse(res, result, 200);
}
