import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import Admin from "./admin.model.js";

const SUPER_ADMIN_PASSWORD = 12345678;
const SUPER_ADMIN_USERNAME = "admin123";

async function createSuperAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await Admin.findOne({ role: "super-admin" });
  if (existing) {
    console.log("Super admin already exists");
    process.exit(0);
  }

  const hashedPassword = await bcryptjs.hash(SUPER_ADMIN_PASSWORD, 10);

  await Admin.create({
    username: SUPER_ADMIN_USERNAME,
    name: "System Administrator",
    password: hashedPassword,
    role: "super-admin",
  });

  console.log("Super admin created successfully");
  process.exit(0);
}

createSuperAdmin().catch(console.error);
