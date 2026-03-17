import { jest } from "@jest/globals";

// MOCK SERVICE
jest.unstable_mockModule(
  "../../modules/production/poduction.service.js",
  () => ({
    getMyProductions: jest.fn(),
  }),
);

// IMPORT AFTER MOCK
const productionService =
  await import("../../modules/production/poduction.service.js");

const { getMyProductions } =
  await import("../../modules/production/production.controller.js");

describe("getMyProductions Controller", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      user: { _id: "farmer123" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return farmer productions", async () => {
    const mockProductions = [
      {
        _id: "prod1",
        volume: 30,
        status: "collected",
      },
      {
        _id: "prod2",
        volume: 20,
        status: "failed",
      },
    ];

    productionService.getMyProductions.mockResolvedValue(mockProductions);

    await getMyProductions(req, res);

    expect(productionService.getMyProductions).toHaveBeenCalledWith(
      "farmer123",
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockProductions);
  });

  it("should throw error if service fails", async () => {
    const error = new Error("Database error");

    productionService.getMyProductions.mockRejectedValue(error);

    await expect(getMyProductions(req, res)).rejects.toThrow("Database error");

    expect(productionService.getMyProductions).toHaveBeenCalledWith(
      "farmer123",
    );
  });
});
