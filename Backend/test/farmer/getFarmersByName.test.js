import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

jest.unstable_mockModule("../../modules/farmer/farmer.service.js", () => ({
  getFarmersByName: jest.fn(),
}));

const farmerService = await import("../../modules/farmer/farmer.service.js");
const router = (await import("../../modules/farmer/farmer.routes.js")).default;

const app = express();
app.use(express.json());
app.use("/farmers", router);

// error handler for tests
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});

describe("GET /farmers/name/:name", () => {
  const farmerName = "John";

  test("should return farmers by name", async () => {
    const mockFarmers = [
      {
        _id: "1",
        name: "John Silva",
        location: { lat: 6.9, lon: 79.8 },
        address: "Galle",
        phone: "0771234567",
        route: 1,
        shortName: "JS",
        pinNo: "1234",
      },
      {
        _id: "2",
        name: "John Perera",
        location: { lat: 7.0, lon: 80.0 },
        address: "Matara",
        phone: "0719876543",
        route: 2,
        shortName: "JP",
        pinNo: "5678",
      },
    ];

    farmerService.getFarmersByName.mockResolvedValue(mockFarmers);

    const res = await request(app).get(`/farmers/name/${farmerName}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].name).toContain("John");
  });

  test("should return error when no farmer found", async () => {
    farmerService.getFarmersByName.mockRejectedValue(
      new Error("No farmer found with this relevant name"),
    );

    const res = await request(app).get(`/farmers/name/${farmerName}`);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("No farmer found with this relevant name");
  });
});
