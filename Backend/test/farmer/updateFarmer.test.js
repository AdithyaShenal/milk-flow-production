import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

jest.unstable_mockModule("../../modules/farmer/farmer.service.js", () => ({
  updateFarmer: jest.fn(),
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

describe("PUT /farmers/:id", () => {
  const farmerId = "507f1f77bcf86cd799439011";

  test("should update farmer successfully", async () => {
    const updateData = {
      name: "Updated Farmer",
      address: "Colombo",
      phone: "0771234567",
      route: 3,
    };

    const updatedFarmer = {
      _id: farmerId,
      ...updateData,
      location: { lat: 6.9, lon: 79.8 },
      shortName: "UF",
      pinNo: "1234",
    };

    farmerService.updateFarmer.mockResolvedValue(updatedFarmer);

    const res = await request(app).put(`/farmers/${farmerId}`).send(updateData);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated Farmer");
    expect(res.body.route).toBe(3);
  });

  test("should return error if farmer not found", async () => {
    farmerService.updateFarmer.mockRejectedValue(new Error("Farmer not found"));

    const res = await request(app).put(`/farmers/${farmerId}`).send({
      name: "Updated Farmer",
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Farmer not found");
  });
});
