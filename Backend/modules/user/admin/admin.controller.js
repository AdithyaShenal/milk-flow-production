import bcryptjs from "bcryptjs";
import _ from "lodash";
import * as errors from "../../../errors/errors.js";
import { validate } from "./admin.model.js";
import Admin from "./admin.model.js";
import jwt from "jsonwebtoken";
import { successResponse } from "../../../util/response.js";

const JWT_SECRET = "MilkFlow_Secret_KEY";

// Signup Controller
export const signup = async (req, res) => {
  if (!req.body) throw new errors.BadRequestError("Request body is Required");

  const { name, username, password } = req.body;

  const adminUser = await Admin.findOne({ username });
  if (adminUser)
    return res.status(400).json({ message: "User already exists." });

  // Hash Password
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  const newAdminUser = new Admin({
    name,
    username,
    password: hashedPassword,
    isActive: true,
  });

  if (!newAdminUser)
    throw new errors.BadRequestError("Error while creating user");

  await newAdminUser.save();

  const token = jwt.sign(
    { adminId: newAdminUser._id, role: newAdminUser.role },
    JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  res.cookie("authToken", token, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    sameSite: "strict",
    secure: false,
  });

  successResponse(
    res,
    _.pick(newAdminUser, ["_id", "name", "username", "role", "createdAt"]),
  );
};

// Login Controller
export const login = async (req, res) => {
  const { error } = validate(req.body);
  if (error) throw new errors.ValidationError(error.details[0].message);

  const { username, password } = req.body;

  const adminUser = await Admin.findOne({ username });
  if (!adminUser)
    throw new errors.BadRequestError("Invalid username or password");

  const isValid = await bcryptjs.compare(password, adminUser.password);
  if (!isValid) throw new errors.BadRequestError("Invalid email or password");

  const token = jwt.sign({ adminId: adminUser._id }, JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("authToken", token, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    sameSite: "strict",
    secure: false,
  });

  successResponse(
    res,
    _.pick(adminUser, ["_id", "name", "username", "role", "createdAt"]),
  );
};

// Logout Controller
export const logout = (req, res) => {
  res.cookie("authToken", "", { maxAge: 0 });

  successResponse(res, null, "Logged out successfully");
};
