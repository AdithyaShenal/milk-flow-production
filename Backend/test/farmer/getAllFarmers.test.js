import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

//  Mock the service

jest.unstable_mockModule("../../modules/farmer/farmer.service.js", () => ({
  createFarmer: jest.fn(),
  getAllFarmers: jest.fn(), // Added this to fix the failing suite
}));

//  Import mocked service and router
const farmerService = await import("../../modules/farmer/farmer.service.js");
const routerModule = await import("../../modules/farmer/farmer.routes.js");
const router = routerModule.default;

const app = express();
app.use(express.json());
app.use("/farmers", router);

//  Standardized Error Handler

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: "error",
    message: err.message,
  });
});

// 4. Tests
describe("Farmer Controller Tests", () => {
  const validFarmer = {
    name: "John Doe",
    location: { lat: 6.9271, lon: 79.8612 },
    address: "Colombo",
    phone: "0771234567",
    route: 2,
    shortName: "JHN",
    pinNo: "1234",
  };

  describe("POST /farmers", () => {
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
  });

  // This section addresses your specific failure in getAllFarmers.test.js
  describe("GET /farmers/all", () => {
    test("should handle database errors", async () => {
      // Setup the mock to reject
      farmerService.getAllFarmers.mockRejectedValue(
        new Error("Database error"),
      );

      const res = await request(app).get("/farmers/all");

      expect(res.statusCode).toBe(500);

      // FIX: Changed .error to .message to match the error handler above
      expect(res.body.message).toBe("Database error");
      expect(res.body.status).toBe("error");
    });
  });
});
