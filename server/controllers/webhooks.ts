import { verifyWebhook } from "@clerk/express/webhooks";
import { Request, Response } from "express";
import User from "../models/User.js";

export const clerkWebhook = async (req: Request, res: Response) => {
  console.log("Webhook endpoint hit");
  try {
    const evt = await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SECRET,
    });

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const userData = {
        clerkId: evt.data.id,
        email: evt.data.email_addresses?.[0]?.email_address,
        name: `${evt.data.first_name ?? ""} ${evt.data.last_name ?? ""}`.trim(),
        image: evt.data.image_url,
        role: "user",
      };

      console.log("===== USER DATA =====");
      console.dir(userData, { depth: null });
      console.log("Role:", userData.role);
      console.log("Role type:", typeof userData.role);

      console.log("===== SCHEMA ROLE =====");
      console.log(User.schema.path("role").options);
      console.log("Allowed values:", User.schema.path("role").enumValues);

      try {
        const existingUser = await User.findOne({
          clerkId: userData.clerkId,
        });

        if (existingUser) {
          await User.findOneAndUpdate({ clerkId: userData.clerkId }, userData, {
            new: true,
            runValidators: true, // validate on update
          });

          console.log("User updated.");
        } else {
          const newUser = new User(userData);

          console.log("===== VALIDATING DOCUMENT =====");
          await newUser.validate();

          console.log("Validation passed.");

          await newUser.save();

          console.log("User created.");
        }
      } catch (dbErr: any) {
        console.error("===== DATABASE ERROR =====");
        console.dir(dbErr, { depth: null });

        if (dbErr.errors) {
          for (const [field, error] of Object.entries(dbErr.errors)) {
            console.error(`Field: ${field}`);
            console.dir(error, { depth: null });
          }
        }

        throw dbErr;
      }
    }

    return res.json({
      success: true,
      message: "Webhook received",
    });
  } catch (err: any) {
    console.error("===== WEBHOOK ERROR =====");
    console.dir(err, { depth: null });

    return res.status(400).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};
