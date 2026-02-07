import express from "express";
import * as controller from "./admin.controller.js";
import auth from "../../../middleware/auth.js";

const router = express.Router();

router.get("/", auth, controller.getAdmin);

router.get("/all", auth, controller.getAllAdmins);

router.post("/signup", controller.signup);

router.post("/login", controller.login);

router.post("/logout", auth, controller.logout);

// Password change route (accessible even with requirePasswordChange flag)
router.post("/change-password", auth, controller.changePassword);

// Get all admins

// Create a Admin
router.post("/", auth, controller.createAdmin);

// Update a Admin
router.put("/", auth, controller.updateAdmin);

// Delete a Admin
router.delete("/:adminId", auth, controller.deleteAdmin);

// Promote a Admin
router.patch("/:adminId/promote", auth, controller.promoteAdmin);

export default router;
