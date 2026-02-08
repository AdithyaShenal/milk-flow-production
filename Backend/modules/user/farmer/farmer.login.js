import express from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";
import Farmer from "../../farmer/farmer.model.js";
import authFarmer from "./farmer.auth.js";
import * as errors from "../../../errors/errors.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { error, value } = validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const { pinNo, shortName } = value;

  const user = await Farmer.findOne({
    pinNo,
    shortName: shortName,
  });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid PIN or name" });
  }

  const token = jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET || "Mysecret",
    { expiresIn: "1h" },
  );

  // Return token in response body only (no cookies)
  return res.status(200).json({
    success: true,
    message: "Successfully logged in",
    token,
  });
});

router.get("/me", authFarmer, async (req, res) => {
  const farmer_id = req.user._id;

  const farmer = await Farmer.findById(farmer_id);

  if (!farmer) throw new errors.NotFoundError("User not found");

  res.status(200).json(farmer);
});

// Validation
const validate = (data) => {
  const schema = Joi.object({
    pinNo: Joi.string().required(),
    shortName: Joi.string().trim().lowercase().required(),
  });

  return schema.validate(data);
};

export default router;
