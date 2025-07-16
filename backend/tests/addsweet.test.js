const fs = require("fs/promises");
const request = require("supertest");
const path = require("path");
const app = require("../app");

const SWEETS_PATH = path.join(__dirname, "../data/sweets_data.json");

let originalData = [];

beforeAll(async () => {
  // 🟡 Backup original content
  const data = await fs.readFile(SWEETS_PATH, "utf-8");
  originalData = JSON.parse(data);
});

beforeEach(async () => {
  // 🧪 Start fresh with only originalData
  await fs.writeFile(SWEETS_PATH, JSON.stringify(originalData, null, 2));
});

describe("Add Sweets API", () => {
  it("should add a new sweet successfully", async () => {
    const newSweet = {
      id: 1004,
      name: "Rasgulla",
      category: "Milk-Based",
      price: 20,
      quantity: 25,
    };

    const res = await request(app).post("/api/sweets").send(newSweet);

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Sweet added successfully",
        sweet: expect.objectContaining(newSweet),
      })
    );
  });

  it("should return 400 if required fields are missing", async () => {
    const incompleteSweet = {
      name: "Barfi",
      price: 15,
    };

    const res = await request(app).post("/api/sweets").send(incompleteSweet);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should not add duplicate sweet ID", async () => {
    const originalSweet = {
      id: 1004,
      name: "Rasgulla",
      category: "Milk-Based",
      price: 20,
      quantity: 25,
    };

    await request(app).post("/api/sweets").send(originalSweet);

    const duplicateSweet = {
      id: 1004,
      name: "Rasgulla Duplicate",
      category: "Milk-Based",
      price: 25,
      quantity: 10,
    };

    const res = await request(app).post("/api/sweets").send(duplicateSweet);

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("error", "Sweet with this ID already exists");
  });
});

afterAll(async () => {
  // 🔁 Restore original content after all tests
  await fs.writeFile(SWEETS_PATH, JSON.stringify(originalData, null, 2));
});
