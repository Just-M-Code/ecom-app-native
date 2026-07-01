import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhook } from "./controllers/webhooks.js";
import { connect } from "node:http2";
import connectDB from "./config/db.js";

const app = express();

await connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Webhook route (must be before clerkMiddleware for raw body)
app.post("/api/clerk", express.raw({ type: "application/json" }), clerkWebhook);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is Live!");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
