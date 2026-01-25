import express from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";
import authFarmer from "../farmer/farmer.auth.js";
import * as errors from "../../../errors/errors.js";
import Driver from "../../driver/driver.model.js";

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

  const user = await Driver.findOne({
    pinNo,
    shortName: shortName.toLowerCase(),
  });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid PIN or name" });
  }

  const token = jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET || "Mysecret",
    { expiresIn: "1h" }
  );

  // Return token in response body only (no cookies)
  return res.status(200).json({
    success: true,
    message: "Successfully logged in",
    token,
  });
});

router.get("/me", authFarmer, async (req, res) => {
  const driver_id = req.user._id;

  const driver = await Driver.findById(driver_id);

  if (!driver) throw new errors.NotFoundError("User not found");

  res.status(200).json(driver);
});

// Validation
const validate = (data) => {
  const schema = Joi.object({
    pinNo: Joi.string().length(4).required(),
    shortName: Joi.string().trim().lowercase().required(),
  });

  return schema.validate(data);
};

export default router;
