import app from "./app.js";
import { config } from "dotenv";
import { connectDB } from "./config/connectDb.js";
import cloudinary from "cloudinary";
import Stripe from "stripe";

// Uncaught Exception Handling
process.on("uncaughtException", (error) => {
  console.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

// Load environment variables
config({
  path: "./config/config.env",
});

// Database connection
connectDB();

// Stripe configuration
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

const PORT = process.env.PORT || 8000;

let server;
if (!server) {
  server = app.listen(PORT, () => {
    console.log(`✅ Server is running on PORT: ${PORT}`);
  });

  server.timeout = 300000;
}

// Unhandled Promise Rejections
process.on("unhandledRejection", (error) => {
  console.error(`Unhandled Promise Rejection: ${error.message}`);
  server.close(() => {
    process.exit(1);
  });
});
