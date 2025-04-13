import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";

// 1️⃣ Declare a variable for the server
let server: Server;

// 2️⃣ Main function to connect to the database and start the server
async function main() {
  try {
    // ✅ Connect to MongoDB (If MongoDB connection fails, it will throw an error)
    await mongoose.connect(config.DB_URL as string);
    console.log("✅ Connected to MongoDB successfully!");
    console.log("✅ running on port", config.port);

    // ✅ Start the server and save the "server" instance in the variable
    server = app.listen(config.port, () => {});
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
  }
}

main(); // Call the main function to start the app

process.on("unhandledRejection", (error) => {
  console.log(`😈 Oops! Unhandled Promise Rejection occurred:`, error);

  // If the server is running, close it safely
  if (server) {
    server.close(() => {
      console.log("🔴 Server is shutting down due to an unhandled rejection.");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("uncaughtException", (error) => {
  console.log(`😈 Oops! Uncaught Exception occurred:`, error);

  process.exit(1);
});
