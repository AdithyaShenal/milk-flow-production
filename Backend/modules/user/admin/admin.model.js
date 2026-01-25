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

    role: {
      type: String,
      enum: ["admin", "super-admin"],
      default: "admin",
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

export default Admin;
