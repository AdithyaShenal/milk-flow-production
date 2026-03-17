import { jest } from "@jest/globals";

// MOCK SERVICE
jest.unstable_mockModule(
  "../../modules/production/poduction.service.js",
  () => ({
    getMyProductionToday: jest.fn(),
  }),
);

//  IMPORT AFTER MOCK
const productionService =
  await import("../../modules/production/poduction.service.js");

const { getMyProductionToday } =
  await import("../../modules/production/production.controller.js");

describe("getMyProductionToday Controller", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      user: { _id: "farmer123" },
    };

    res = {
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return registered true if production exists today", async () => {
    const mockProduction = {
      _id: "prod123",
      volume: 25,
      status: "pending",
      registration_time: new Date(),
      failure_reason: "-",
      collectedVolume: 0,
      blocked: false,
    };

    productionService.getMyProductionToday.mockResolvedValue(mockProduction);

    await getMyProductionToday(req, res);

    expect(productionService.getMyProductionToday).toHaveBeenCalledWith(
      "farmer123",
    );

    expect(res.json).toHaveBeenCalledWith({
      registered: true,
      message: "Milk already submitted today",
      production: mockProduction,
    });
  });

  it("should return registered false if no production today", async () => {
    productionService.getMyProductionToday.mockResolvedValue(null);

    await getMyProductionToday(req, res);

    expect(productionService.getMyProductionToday).toHaveBeenCalledWith(
      "farmer123",
    );

    expect(res.json).toHaveBeenCalledWith({
      registered: false,
      message: "No milk submitted today",
      production: null,
    });
  });

  it("should throw error if service fails", async () => {
    const error = new Error("Database error");

    productionService.getMyProductionToday.mockRejectedValue(error);

    await expect(getMyProductionToday(req, res)).rejects.toThrow(
      "Database error",
    );

    expect(productionService.getMyProductionToday).toHaveBeenCalledWith(
      "farmer123",
    );
  });
});
