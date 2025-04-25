import { Server } from "http";
import mongoose from "mongoose";
// import app from "./app";
import config from "./app/config";
import app from "./app";
// import { Server as SocketIOServer } from "socket.io";

// 1️⃣ Declare these outside the function
let server: Server;
// let io: SocketIOServer;



// 2️⃣ Main function to connect to the database and start the server
async function main() {
  try {
    // ✅ Connect to MongoDB (If MongoDB connection fails, it will throw an error)
    await mongoose.connect(config.DB_URL as string);
    // console.log("✅ Connected to MongoDB successfully!");
    // console.log("✅ running on port", config.port);

    // // ✅ Start the server and save the "server" instance in the variable
    server = app.listen(config.port, () => {});
    //    // 3️⃣ Initialize Socket.IO server
    //    io = new SocketIOServer(server, {
    //     cors: {
    //       origin: "*", // You can restrict this in production
    //     },
    //   });
  
    //   io.on("connection", (socket) => {
    //     // console.log("🟢 New client connected:", socket.id);
      
    //     socket.on("joinRoom", (userId: string) => {
    //       console.log(`👥 User ${userId} joined room`);
    //       socket.join(userId); // Room name = userId
    //     });
      
    //     socket.on("disconnect", () => {
    //       console.log("🔴 Client disconnected:", socket.id);
    //     });
    //   });
      
    //   // Make `io` available globally
    //   app.set("io", io);
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
