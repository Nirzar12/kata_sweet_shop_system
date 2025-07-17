const mongoose = require("mongoose");
const app = require("./app");

// Start the server only if this file is run directly
if (require.main === module) {
  startServer();
}
// Connect to DB and start the app
async function startServer() {
  try {
    await mongoose.connect("mongodb://localhost:27017/sweetshop");
    console.log("Connected to MongoDB");

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1); // Exit on failure
  }
}
