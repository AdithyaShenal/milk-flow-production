import mongoose from "mongoose";
import Joi from "joi";

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 20,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    email: {
      type: String,
      required: true,
      minlength: 5,
    },

    phone: {
      type: String,
      minlength: 10,
    },

    dob: {
      type: Date,
      required: false,
    },

    role: {
      type: String,
      enum: ["admin", "super-admin"],
      default: "admin",
    },

    requirePasswordChange: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Admin = mongoose.model("Admin", adminSchema);

export function validate(body) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(20).required(),
    password: Joi.string().min(8).required(),
  });

  return schema.validate(body);
}

export function validateCreateAdmin(body) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(20).required(),
    name: Joi.string().required(),
    email: Joi.string().email().min(5).required(),
    phone: Joi.string().min(10).optional(),
    dob: Joi.date().optional(),
  });

  return schema.validate(body);
}

export function validateUpdateAdmin(body) {
  const schema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().min(5).optional(),
    phone: Joi.string().min(10).optional(),
    dob: Joi.date().optional(),
    password: Joi.string().min(8).optional(),
  });

  return schema.validate(body);
}

export function validateChangePassword(body) {
  const schema = Joi.object({
    currentPassword: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required(),
    confirmPassword: Joi.string()
      .valid(Joi.ref("newPassword"))
      .required()
      .messages({ "any.only": "Passwords do not match" }),
  });

  return schema.validate(body);
}

export default Admin;
