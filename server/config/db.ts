import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return; // Already connected
  }

  try {
    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("❌ MongoDB disconnected");
    });

    await mongoose.connect(process.env.MONGODB_URI as string, {
      // Optional but recommended
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("MongoDB connection established");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error; // Important: don't silently fail
  }
};

export default connectDB;
