import request from "supertest";
import express from "express";

const app = express();
app.use(express.json());

// mock endpoint
app.get("/production", (req, res) => {
  const productions = [
    { id: 1, name: "Production A", status: "active" },
    { id: 2, name: "Production B", status: "inactive" },
  ];

  res.status(200).json(productions);
});

describe("GET /production", () => {
  test("should return all productions", async () => {
    const response = await request(app).get("/production");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("should return production list", async () => {
    const response = await request(app).get("/production");

    expect(response.body.length).toBeGreaterThan(0);
  });

  test("production should contain required fields", async () => {
    const response = await request(app).get("/production");

    const production = response.body[0];

    expect(production).toHaveProperty("id");
    expect(production).toHaveProperty("name");
    expect(production).toHaveProperty("status");
  });
});
