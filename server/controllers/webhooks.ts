import { verifyWebhook } from "@clerk/express/webhooks";
import { Request, Response } from "express";
import connectDB from "../config/db"; // ← Import this
import User from "../models/User.js";

export const clerkWebhook = async (req: Request, res: Response) => {
  try {
    // IMPORTANT: Connect to DB first
    await connectDB();

    const evt = await verifyWebhook(req);

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const userData = {
        clerkId: evt.data.id,
        email: evt.data?.email_addresses?.[0]?.email_address,
        name: `${evt.data?.first_name || ""} ${evt.data?.last_name || ""}`.trim(),
        image: evt.data?.image_url,
      };

      console.log("🔄 Processing user:", userData); // Add this for debugging

      const user = await User.findOne({ clerkId: evt.data.id });

      if (user) {
        await User.findOneAndUpdate({ clerkId: evt.data.id }, userData, {
          new: true,
        });
        console.log("✅ User updated in MongoDB");
      } else {
        await User.create(userData);
        console.log("✅ New user created in MongoDB");
      }
    }

    return res.json({ success: true, message: "Webhook received" });
  } catch (err: any) {
    console.error("❌ Webhook error:", err);
    return res.status(400).json({ error: err.message });
  }
};
