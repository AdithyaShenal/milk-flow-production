// tests/production/getProductionsByRoute.test.js

import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// Mock the service module
jest.unstable_mockModule(
  "../../modules/production/poduction.service.js",
  () => ({
    getProductionsByRoute: jest.fn(),
  }),
);

// Import mocked service
const productionService =
  await import("../../modules/production/poduction.service.js");

// Import controller AFTER mocking
const productionController =
  await import("../../modules/production/production.controller.js");

describe("GET /productions/route/:route", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Test route
    app.get(
      "/productions/route/:route",
      productionController.getProductionsByRoute,
    );

    // Error handler
    app.use((err, req, res, next) => {
      res.status(500).json({ message: err.message });
    });

    jest.clearAllMocks();
  });

  test("should return productions for a route", async () => {
    const mockProductions = [
      {
        _id: "prod1",
        route: 3,
        volume: 10,
        status: "pending",
      },
      {
        _id: "prod2",
        route: 3,
        volume: 15,
        status: "collected",
      },
    ];

    productionService.getProductionsByRoute.mockResolvedValue(mockProductions);

    const res = await request(app).get("/productions/route/3");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0]._id).toBe("prod1");

    expect(productionService.getProductionsByRoute).toHaveBeenCalledWith(3);
  });

  test("should return empty array if no productions", async () => {
    productionService.getProductionsByRoute.mockResolvedValue([]);

    const res = await request(app).get("/productions/route/3");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);

    expect(productionService.getProductionsByRoute).toHaveBeenCalledWith(3);
  });

  test("should handle service errors", async () => {
    productionService.getProductionsByRoute.mockRejectedValue(
      new Error("No production records found for this route"),
    );

    const res = await request(app).get("/productions/route/3");

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("No production records found for this route");
  });
});
