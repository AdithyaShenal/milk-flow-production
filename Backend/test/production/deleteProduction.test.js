import { jest } from "@jest/globals";

// MOCK SERVICE
jest.unstable_mockModule(
  "../../modules/production/poduction.service.js",
  () => ({
    deleteProductionService: jest.fn(),
  }),
);

// IMPORT AFTER MOCK
const productionService =
  await import("../../modules/production/poduction.service.js");

const { deleteProductionController } =
  await import("../../modules/production/production.controller.js");

describe("deleteProductionController", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      user: { _id: "farmer123" },
      params: { production_id: "prod123" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should delete production and return success message", async () => {
    productionService.deleteProductionService.mockResolvedValue();

    await deleteProductionController(req, res);

    expect(productionService.deleteProductionService).toHaveBeenCalledWith(
      "farmer123",
      "prod123",
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith("Successfully deleted production");
  });

  it("should throw error if service fails", async () => {
    const error = new Error("Production not found");

    productionService.deleteProductionService.mockRejectedValue(error);

    await expect(deleteProductionController(req, res)).rejects.toThrow(
      "Production not found",
    );

    expect(productionService.deleteProductionService).toHaveBeenCalledWith(
      "farmer123",
      "prod123",
    );
  });
});
