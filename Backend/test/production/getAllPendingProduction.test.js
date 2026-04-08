import { jest } from "@jest/globals";

// Mock the service
jest.unstable_mockModule(
  "../../modules/production/poduction.service.js",
  () => ({
    getAllPendingProductions: jest.fn(),
  }),
);

//  Import the mocked service
const productionService =
  await import("../../modules/production/poduction.service.js");

//  Import the controller AFTER mocking
const { getAllPendingProductions } =
  await import("../../modules/production/production.controller.js");

describe("getAllPendingProductions Controller", () => {
  test("should return all pending productions", async () => {
    const mockProductions = [
      {
        _id: "507f191e810c19729de860ea",
        volume: 25,
        status: "pending",
        blocked: false,
        farmer: {
          _id: "507f191e810c19729de860eb",
          name: "John",
          phone: "0712345678",
          address: "Colombo",
          route: 1,
          location: { lat: 6.9, lon: 79.8 },
        },
      },
    ];

    productionService.getAllPendingProductions.mockResolvedValue(
      mockProductions,
    );

    const req = {};
    const res = { json: jest.fn() };
    const next = jest.fn();

    await getAllPendingProductions(req, res, next);

    expect(productionService.getAllPendingProductions).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockProductions);
  });

  test("should call next if service throws error", async () => {
    const error = new Error("Database error");

    productionService.getAllPendingProductions.mockRejectedValue(error);

    const req = {};
    const res = { json: jest.fn() };
    const next = jest.fn();

    await getAllPendingProductions(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
