import express from "express";
import * as analyticsController from "./analaytics.controller.js";
import * as analyticsValidator from "./analytics.validator.js";
import validate from "../middleware/validate.js";

const router = express.Router();

// Get data for mini dashboard
router.get("/mini_dashboard", analyticsController.miniDashboardController);

export default router;
