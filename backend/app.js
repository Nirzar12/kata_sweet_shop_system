const express = require("express");
const cors = require("cors");
const sweetsRouter = require("./routes/sweetRoute");

const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON
app.use(cors()); // Enable CORS

// Routes
app.use("/api/sweets", sweetsRouter); // API route for sweets
app.get("/", (req, res) => {
  res.send("Sweet shop is up and running...");
});

module.exports = app;
