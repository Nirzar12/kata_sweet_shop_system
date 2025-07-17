const request = require("supertest");
const Sweet = require("../models/sweet");
const app = require("../app");

describe("Purchase Sweet API", () => {
  beforeEach(async () => {
    // 🔄 Reset: Ensure clean DB and insert test sweet
    await Sweet.deleteMany();
    await Sweet.create({
      id: 2001,
      name: "Kaju Katli",
      category: "Milk-Based",
      price: 30,
      quantity: 20,
    });
  });

  /**
   * ✅ Test: Successful purchase decreases quantity
   */
  it("should purchase sweet and decrease quantity", async () => {
    const res = await request(app)
      .post("/api/sweets/purchase")
      .send({ id: 2001, quantity: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Purchase successful",
        remainingQuantity: 15,
      })
    );

    const updatedSweet = await Sweet.findOne({ id: 2001 });
    expect(updatedSweet.quantity).toBe(15);
  });

  /**
   * ❌ Test: Purchase more than available stock
   */
  it("should return error if not enough stock", async () => {
    const res = await request(app)
      .post("/api/sweets/purchase")
      .send({ id: 2001, quantity: 50 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Not enough stock available");
  });

  /**
   * ❌ Test: Purchase non-existent sweet
   */
  it("should return error if sweet does not exist", async () => {
    const res = await request(app)
      .post("/api/sweets/purchase")
      .send({ id: 9999, quantity: 1 });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Sweet not found");
  });

  /**
   * ❌ Test: Missing quantity
   */
  it("should return 400 if purchase quantity is not provided", async () => {
    const res = await request(app)
      .post("/api/sweets/purchase")
      .send({ id: 2001 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  // ------------------- Additional Edge Cases -------------------

  /**
   * ❌ Test: Negative quantity
   */
  it("should return 400 for negative purchase quantity", async () => {
    const res = await request(app)
      .post("/api/sweets/purchase")
      .send({ id: 2001, quantity: -5 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Quantity must be a positive number");
  });

  /**
   * ❌ Test: Zero quantity
   */
  it("should return 400 for zero quantity", async () => {
    const res = await request(app)
      .post("/api/sweets/purchase")
      .send({ id: 2001, quantity: 0 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Quantity must be a positive number");
  });

  /**
   * ❌ Test: Missing ID
   */
  it("should return 400 if sweet ID is not provided", async () => {
    const res = await request(app)
      .post("/api/sweets/purchase")
      .send({ quantity: 3 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Sweet ID and quantity are required");
  });
});
