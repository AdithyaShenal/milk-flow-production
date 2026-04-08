import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

jest.unstable_mockModule("../../modules/farmer/farmer.service.js", () => ({
  getFarmersByRoute: jest.fn(),
}));

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

describe("GET /farmers/route/:route", () => {
  const routeNumber = 2;

  test("should return farmers by route", async () => {
    const mockFarmers = [
      {
        _id: "1",
        name: "Farmer Silva",
        location: { lat: 6.9, lon: 79.8 },
        address: "Galle",
        phone: "0771234567",
        route: 2,
        shortName: "FS",
        pinNo: "1234",
      },
      {
        _id: "2",
        name: "Farmer Perera",
        location: { lat: 7.0, lon: 80.0 },
        address: "Matara",
        phone: "0719876543",
        route: 2,
        shortName: "FP",
        pinNo: "5678",
      },
    ];

    farmerService.getFarmersByRoute.mockResolvedValue(mockFarmers);

    const res = await request(app).get(`/farmers/route/${routeNumber}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].route).toBe(2);
  });

  test("should return error when no farmers in route", async () => {
    farmerService.getFarmersByRoute.mockRejectedValue(
      new Error("No farmers found in this route"),
    );

    const res = await request(app).get(`/farmers/route/${routeNumber}`);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("No farmers found in this route");
  });
});
