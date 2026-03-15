import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

jest.unstable_mockModule("../../modules/farmer/farmer.service.js", () => ({
  deleteFarmer: jest.fn(),
}));

// import AFTER mocking
const farmerService = await import("../../modules/farmer/farmer.service.js");
const router = (await import("../../modules/farmer/farmer.routes.js")).default;

const app = express();
app.use(express.json());
app.use("/farmers", router);

// test error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});

describe("DELETE /farmers/:id", () => {
  const farmerId = "507f1f77bcf86cd799439011";

  test("should delete farmer successfully", async () => {
    farmerService.deleteFarmer.mockResolvedValue();

    const res = await request(app).delete(`/farmers/${farmerId}`);

    expect(res.statusCode).toBe(204);
  });

  test("should return error if farmer not found", async () => {
    farmerService.deleteFarmer.mockRejectedValue(new Error("Farmer not found"));

    const res = await request(app).delete(`/farmers/${farmerId}`);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Farmer not found");
  });
});
