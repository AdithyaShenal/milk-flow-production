import bcryptjs from "bcryptjs";
import _ from "lodash";
import * as errors from "../../../errors/errors.js";
import {
  validate,
  validateCreateAdmin,
  validateUpdateAdmin,
  validateChangePassword,
} from "./admin.model.js";
import Admin from "./admin.model.js";
import jwt from "jsonwebtoken";
import { successResponse } from "../../../util/response.js";
import { sendEmail } from "../../../util/sendEmail.js";
import crypto from "crypto";

export const signup = async (req, res) => {
  if (!req.body) {
    throw new errors.BadRequestError("Request body is required");
  }

  console.log(req.body);

  const { name, username, password, email, phone, dob } = req.body;

  // Prevent duplicate usernames
  const existingUser = await Admin.findOne({ username });
  if (existingUser) {
    throw new errors.BadRequestError("User already exists");
  }

  // Hash password
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  // Create SUPER ADMIN
  const newAdminUser = new Admin({
    name,
    username,
    password: hashedPassword,
    email,
    phone,
    dob,
    role: "super-admin",
    isActive: true,
  });

  await newAdminUser.save();

  // JWT
  const token = jwt.sign(
    {
      adminId: newAdminUser._id,
      role: newAdminUser.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
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

  const token = jwt.sign(
    {
      adminId: adminUser._id,
      role: adminUser.role,
      requirePasswordChange: adminUser.requirePasswordChange,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  res.cookie("authToken", token, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  successResponse(
    res,
    _.pick(adminUser, [
      "_id",
      "name",
      "username",
      "role",
      "email",
      "dob",
      "phone",
      "createdAt",
      "requirePasswordChange",
      "isActive",
    ]),
  );
};

// Logout Controller
export const logout = (req, res) => {
  res.cookie("authToken", "", { maxAge: 0 });

  successResponse(res, "Logout Successfully");
};

// Get admin profile details
export const getAdmin = async (req, res) => {
  const adminId = req.user.adminId;

  const adminUser = await Admin.findById(adminId);
  if (!adminUser)
    throw errors.UnauthorizedError("No admin found with given ID");

  successResponse(
    res,
    _.pick(adminUser, [
      "_id",
      "name",
      "username",
      "role",
      "email",
      "dob",
      "phone",
      "createdAt",
      "requirePasswordChange",
      "isActive",
    ]),
  );
};

// Create Admin Controller
export const createAdmin = async (req, res) => {
  if (req.user.role !== "super-admin") {
    throw new errors.ForbiddenError("Only super-admin can create admins");
  }

  const { error } = validateCreateAdmin(req.body);
  if (error) throw new errors.ValidationError(error.details[0].message);

  const { username, name, email, phone, dob } = req.body;

  const existingAdmin = await Admin.findOne({ username });
  if (existingAdmin) {
    throw new errors.BadRequestError("Username already exists");
  }

  // Generate a temporary random password
  const temporaryPassword = crypto.randomBytes(12).toString("hex"); // Random 24-char password

  // Hash password
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(temporaryPassword, salt);

  // Create new admin
  const newAdmin = new Admin({
    username,
    name,
    password: hashedPassword,
    email,
    phone,
    dob,
    role: "admin",
    isActive: true,
    requirePasswordChange: true,
  });

  await newAdmin.save();

  await sendEmail({
    to: email,
    subject: "Your Admin Account Created",
    text: `
          Hello ${name},

          Your admin account has been created.

          Username: ${username}
          Temporary Password: ${temporaryPassword}

          Please log in and change your password immediately.
        `,
  });
  successResponse(
    res,
    _.pick(newAdmin, ["_id", "name", "username", "email", "role"]),
  );
};

// Update Admin Controller
export const updateAdmin = async (req, res) => {
  const adminId = req.user.adminId;

  const { error } = validateUpdateAdmin(req.body);
  if (error) throw new errors.ValidationError(error.details[0].message);

  const updateData = {};
  const { name, email, phone, dob, password } = req.body;

  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (phone) updateData.phone = phone;
  if (dob) updateData.dob = dob;

  // Hash password if provided
  if (password) {
    const salt = await bcryptjs.genSalt(10);
    updateData.password = await bcryptjs.hash(password, salt);
  }

  const updatedAdmin = await Admin.findByIdAndUpdate(
    adminId,
    { $set: updateData },
    { new: true, runValidators: true },
  );

  if (!updatedAdmin) {
    throw new errors.NotFoundError("Admin not found");
  }

  successResponse(res, _.pick(updatedAdmin, ["_id", "name", "username"]));
};

// Delete Admin Controller
export const deleteAdmin = async (req, res) => {
  if (req.user.role !== "super-admin") {
    throw new errors.ForbiddenError("Only super-admin can delete admins");
  }

  const { adminId } = req.params;

  if (!adminId) {
    throw new errors.BadRequestError("Admin ID is required");
  }

  // Prevent super-admin from deleting themselves
  if (req.user.adminId === adminId) {
    throw new errors.BadRequestError("You cannot delete your own account");
  }

  const adminToDelete = await Admin.findById(adminId);
  if (!adminToDelete) {
    throw new errors.NotFoundError("Admin not found");
  }

  await Admin.findByIdAndDelete(adminId);

  successResponse(res, "Admin deleted successfully");
};

// Promote Admin Controller
export const promoteAdmin = async (req, res) => {
  if (req.user.role !== "super-admin") {
    throw new errors.ForbiddenError("Only super-admin can promote admins");
  }

  const { adminId } = req.params;

  if (!adminId) {
    throw new errors.BadRequestError("Admin ID is required");
  }

  const adminToPromote = await Admin.findById(adminId);
  if (!adminToPromote) {
    throw new errors.NotFoundError("Admin not found");
  }

  // Check if already a super-admin
  if (adminToPromote.role === "super-admin") {
    throw new errors.BadRequestError("Admin is already a super-admin");
  }

  // Promote to super-admin
  adminToPromote.role = "super-admin";
  await adminToPromote.save();

  successResponse(
    res,
    _.pick(adminToPromote, ["_id", "name", "username", "role", "createdAt"]),
  );
};

// Change Password Controller (for first-time and regular password changes)
export const changePassword = async (req, res) => {
  const adminId = req.user.adminId;

  const { error } = validateChangePassword(req.body);
  if (error) throw new errors.ValidationError(error.details[0].message);

  const { currentPassword, newPassword } = req.body;

  const adminUser = await Admin.findById(adminId);
  if (!adminUser) {
    throw new errors.NotFoundError("Admin not found");
  }

  // Verify current password
  const isValid = await bcryptjs.compare(currentPassword, adminUser.password);
  if (!isValid) {
    throw new errors.BadRequestError("Current password is incorrect");
  }

  // Check if new password is same as old password
  const isSameAsOld = await bcryptjs.compare(newPassword, adminUser.password);
  if (isSameAsOld) {
    throw new errors.BadRequestError(
      "New password must be different from current password",
    );
  }

  // Hash new password
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(newPassword, salt);

  // Update password and remove requirePasswordChange flag
  adminUser.password = hashedPassword;
  adminUser.requirePasswordChange = false;
  await adminUser.save();

  const token = jwt.sign(
    {
      adminId: adminUser._id,
      role: adminUser.role,
      requirePasswordChange: false,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  res.cookie("authToken", token, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  successResponse(res, null, 201);
};

// Get All Admins Controller (Simple)
export const getAllAdmins = async (req, res) => {
  const admins = await Admin.find().select("-password").sort({ createdAt: -1 });

  successResponse(
    res,
    admins.map((admin) =>
      _.pick(admin, [
        "_id",
        "name",
        "username",
        "email",
        "phone",
        "role",
        "isActive",
        "createdAt",
      ]),
    ),
  );
};
