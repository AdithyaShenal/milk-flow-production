// tests/production/getProductionsByFarmerId.test.js
import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// Mock the service
jest.unstable_mockModule(
  "../../modules/production/poduction.service.js",
  () => ({
    getProductionsByFarmerId: jest.fn(),
  }),
);

// Import mocked service
const productionService =
  await import("../../modules/production/poduction.service.js");

const productionController =
  await import("../../modules/production/production.controller.js");

// Setup Express app with the route
const app = express();
app.use(express.json());
app.get(
  "/productions/farmer/:farmer_id",
  productionController.getProductionsByFarmerId,
);

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ message: err.message });
});

describe("GET /productions/farmer/:farmer_id", () => {
  const farmerId = "farmer123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return productions for a farmer", async () => {
    const mockProductions = [
      {
        _id: "prod1",
        farmer: { _id: farmerId, name: "Nimal" },
        volume: 10,
        status: "collected",
      },
      {
        _id: "prod2",
        farmer: { _id: farmerId, name: "Nimal" },
        volume: 15,
        status: "failed",
      },
    ];

    productionService.getProductionsByFarmerId.mockResolvedValue(
      mockProductions,
    );

    const res = await request(app).get(`/productions/farmer/${farmerId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0]._id).toBe("prod1");
    expect(productionService.getProductionsByFarmerId).toHaveBeenCalledWith(
      farmerId,
    );
  });

  test("should return 500 if service throws error", async () => {
    productionService.getProductionsByFarmerId.mockRejectedValue(
      new Error("No production records found for this farmer"),
    );

    const res = await request(app).get(`/productions/farmer/${farmerId}`);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe(
      "No production records found for this farmer",
    );
  });
});
