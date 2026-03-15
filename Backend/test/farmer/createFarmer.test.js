import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

//  Mock the service
jest.unstable_mockModule("../../modules/farmer/farmer.service.js", () => ({
  createFarmer: jest.fn(),
}));

// Import mocked service
const farmerService = await import("../../modules/farmer/farmer.service.js");

const routerModule = await import("../../modules/farmer/farmer.routes.js");
const router = routerModule.default; // default export

const app = express();
app.use(express.json());
app.use("/farmers", router);

//  Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

//  Tests
describe("POST /farmers", () => {
  const validFarmer = {
    name: "John Doe",
    location: { lat: 6.9271, lon: 79.8612 },
    address: "Colombo",
    phone: "0771234567",
    route: 2,
    shortName: "JHN",
    pinNo: "1234", //required
  };

  test("should create a farmer successfully", async () => {
    const savedFarmer = { _id: "507f1f77bcf86cd799439011", ...validFarmer };
    farmerService.createFarmer.mockResolvedValue(savedFarmer);

    const res = await request(app).post("/farmers").send(validFarmer);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("John Doe");
    expect(res.body.pinNo).toBe("1234");
  });

  test("should return validation error for invalid phone", async () => {
    const invalidFarmer = { ...validFarmer, phone: "123" };

    const res = await request(app).post("/farmers").send(invalidFarmer);

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBeDefined();
  });

  test("should handle server errors", async () => {
    // valid input passes validation
    farmerService.createFarmer.mockRejectedValue(new Error("Database error"));

    const res = await request(app).post("/farmers").send(validFarmer);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Database error");
  });
});
