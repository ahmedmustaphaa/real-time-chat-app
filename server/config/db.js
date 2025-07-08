import mongoose from "mongoose";

const connectedDb = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_ATLAS);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

export default connectedDb;
