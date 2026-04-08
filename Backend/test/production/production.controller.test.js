import { jest } from "@jest/globals";

// MOCK SERVICE FIRST
jest.unstable_mockModule(
  "../../modules/production/poduction.service.js",
  () => ({
    updateProductionService: jest.fn(),
  }),
);

// IMPORT AFTER MOCK
const productionService =
  await import("../../modules/production/poduction.service.js");

const { updateProductionController } =
  await import("../../modules/production/production.controller.js");

describe("updateProductionController", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      user: { _id: "farmer123" },
      params: { production_id: "prod123" },
      body: { volume: 50 },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update production and return 200", async () => {
    const mockProduction = {
      _id: "prod123",
      volume: 50,
      status: "pending",
    };

    productionService.updateProductionService.mockResolvedValue(mockProduction);

    await updateProductionController(req, res);

    expect(productionService.updateProductionService).toHaveBeenCalledWith(
      "farmer123",
      "prod123",
      50,
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockProduction);
  });

  it("should throw error when service fails", async () => {
    const error = new Error("Production not found");

    productionService.updateProductionService.mockRejectedValue(error);

    await expect(updateProductionController(req, res)).rejects.toThrow(
      "Production not found",
    );
  });
});
