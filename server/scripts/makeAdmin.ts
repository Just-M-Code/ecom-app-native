import { clerkClient } from "@clerk/express";
import User from "../models/User.js";

const makeAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    if (!email) throw new Error("ADMIN_EMAIL is not set");

    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true },
    );

    if (!user?.clerkId) {
      console.error("❌ User not found or missing clerkId");
      return;
    }

    console.log(`🔄 Updating metadata for clerkId: ${user.clerkId}`);

    // Call and capture the result
    const updated = await clerkClient.users.updateUserMetadata(user.clerkId, {
      publicMetadata: { role: "admin" },
    });

    console.log("✅ Clerk update succeeded!");
    console.log("Public Metadata now:", updated.publicMetadata);
    console.log("Full user ID:", updated.id);
  } catch (error: any) {
    console.error("❌ Admin promotion failed:");
    console.error("Message:", error.message);
    console.error("Status:", error.status || error.statusCode);
    console.error("Full error:", error);
  }
};

export default makeAdmin;
