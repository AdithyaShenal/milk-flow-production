import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// MOCKS

jest.unstable_mockModule(
  "../../modules/production/production.controller.js",
  () => ({
    submitProduction: jest.fn(),
    updateProductionController: jest.fn(),
    deleteProductionController: jest.fn(),
    getMyProductionToday: jest.fn(),
    getMyProductions: jest.fn(),
    getProductions: jest.fn(),
    getAllPendingProductions: jest.fn(),
    blockProduction: jest.fn(),
    getProductionsByFarmerId: jest.fn(),
    getProductionsByRoute: jest.fn(),
  }),
);

jest.unstable_mockModule("../../modules/user/farmer/farmer.auth.js", () => ({
  default: (req, res, next) => next(),
}));

jest.unstable_mockModule("../../modules/middleware/validate.js", () => ({
  default: () => (req, res, next) => next(),
}));

jest.unstable_mockModule(
  "../../modules/production/production.validator.js",
  () => ({
    submitProductionSchema: {},
    farmerIdSchema: {},
    productionRouteSchema: {},
  }),
);

// IMPORT AFTER MOCK

const productionController =
  await import("../../modules/production/production.controller.js");

const router = (await import("../../modules/production/poduction.routes.js"))
  .default;

// EXPRESS APP

const app = express();
app.use(express.json());
app.use("/production", router);

app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});

// TESTS

describe("Production Routes", () => {
  test("POST /production - submit production", async () => {
    productionController.submitProduction.mockImplementation((req, res) => {
      res.status(201).json({ message: "Production submitted" });
    });

    const res = await request(app).post("/production").send({ quantity: 100 });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Production submitted");
  });

  test("PUT /production/:id - update production", async () => {
    productionController.updateProductionController.mockImplementation(
      (req, res) => {
        res.status(200).json({ message: "Production updated" });
      },
    );

    const res = await request(app)
      .put("/production/123")
      .send({ quantity: 200 });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Production updated");
  });

  test("DELETE /production/:id - delete production", async () => {
    productionController.deleteProductionController.mockImplementation(
      (req, res) => {
        res.status(200).json({ message: "Production deleted" });
      },
    );

    const res = await request(app).delete("/production/123");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Production deleted");
  });

  test("GET /production/today - get today production", async () => {
    productionController.getMyProductionToday.mockImplementation((req, res) => {
      res.status(200).json([{ quantity: 100 }]);
    });

    const res = await request(app).get("/production/today");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  test("GET /production/me - get farmer productions", async () => {
    productionController.getMyProductions.mockImplementation((req, res) => {
      res.status(200).json([{ quantity: 50 }]);
    });

    const res = await request(app).get("/production/me");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  test("GET /production - get all productions", async () => {
    productionController.getProductions.mockImplementation((req, res) => {
      res.status(200).json([{ quantity: 300 }]);
    });

    const res = await request(app).get("/production");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  test("GET /production/pending/all - get pending productions", async () => {
    productionController.getAllPendingProductions.mockImplementation(
      (req, res) => {
        res.status(200).json([{ status: "pending" }]);
      },
    );

    const res = await request(app).get("/production/pending/all");

    expect(res.statusCode).toBe(200);
    expect(res.body[0].status).toBe("pending");
  });

  test("PATCH /production/block/:id - block production", async () => {
    productionController.blockProduction.mockImplementation((req, res) => {
      res.status(200).json({ message: "Production blocked" });
    });

    const res = await request(app).patch("/production/block/123");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Production blocked");
  });

  test("GET /production/farmer/:id - get productions by farmer id", async () => {
    productionController.getProductionsByFarmerId.mockImplementation(
      (req, res) => {
        res.status(200).json([{ farmer: "123" }]);
      },
    );

    const res = await request(app).get("/production/farmer/123");

    expect(res.statusCode).toBe(200);
    expect(res.body[0].farmer).toBe("123");
  });

  test("GET /production/route/:route - get productions by route", async () => {
    productionController.getProductionsByRoute.mockImplementation(
      (req, res) => {
        res.status(200).json([{ route: 2 }]);
      },
    );

    const res = await request(app).get("/production/route/2");

    expect(res.statusCode).toBe(200);
    expect(res.body[0].route).toBe(2);
  });
});
