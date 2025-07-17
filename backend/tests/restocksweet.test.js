const request = require("supertest");
const Sweet = require("../models/sweet");
const app = require("../app");

describe("Restock Sweet API", () => {
  const testSweet = {
    id: 2001,
    name: "Kaju Katli",
    category: "Milk-Based",
    price: 50,
    quantity: 10,
  };

  beforeEach(async () => {
    // Add the sweet before each test
    await Sweet.create(testSweet);
  });

  it("should restock a sweet successfully", async () => {
    const restockPayload = {
      id: 2001,
      quantity: 15,
    };

    const res = await request(app)
      .post("/api/sweets/restock")
      .send(restockPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Sweet restocked successfully",
        sweet: expect.objectContaining({
          id: 2001,
          name: "Kaju Katli",
          quantity: 25, // 10 + 15
        }),
      })
    );
  });

  it("should return 400 if ID is missing", async () => {
    const res = await request(app).post("/api/sweets/restock").send({
      quantity: 10,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "ID and quantity are required");
  });

  it("should return 400 if quantity is missing", async () => {
    const res = await request(app).post("/api/sweets/restock").send({
      id: 2001,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "ID and quantity are required");
  });

  it("should return 400 for negative quantity", async () => {
    const res = await request(app).post("/api/sweets/restock").send({
      id: 2001,
      quantity: -10,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "Quantity must be a positive number"
    );
  });

  it("should return 404 if sweet does not exist", async () => {
    // First delete the sweet so it doesn't exist
    await Sweet.deleteMany({ id: 9999 });

    const res = await request(app).post("/api/sweets/restock").send({
      id: 9999,
      quantity: 10,
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Sweet not found");
  });
});
