import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

jest.unstable_mockModule("../../modules/farmer/farmer.service.js", () => ({
  getFarmersById: jest.fn(),
}));

const farmerService = await import("../../modules/farmer/farmer.service.js");
const router = (await import("../../modules/farmer/farmer.routes.js")).default;

const app = express();
app.use(express.json());
app.use("/farmers", router);

// error handler for test environment
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});

describe("GET /farmers/:id", () => {
  const farmerId = "507f1f77bcf86cd799439011";

  test("should return farmer by id", async () => {
    const mockFarmer = {
      _id: farmerId,
      name: "Farmer One",
      location: { lat: 6.9, lon: 79.8 },
      address: "Galle",
      phone: "0771234567",
      route: 2,
      shortName: "F1",
      pinNo: "1234",
    };

    farmerService.getFarmersById.mockResolvedValue(mockFarmer);

    const res = await request(app).get(`/farmers/${farmerId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Farmer One");
    expect(res.body.pinNo).toBe("1234");
  });

  test("should return error when farmer not found", async () => {
    farmerService.getFarmersById.mockRejectedValue(
      new Error("Farmer not found!"),
    );

    const res = await request(app).get(`/farmers/${farmerId}`);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Farmer not found!");
  });
});
