import app from "./app.js";
import { config } from "dotenv";
import { connectDB } from "./config/connectDb.js";
import cloudinary from "cloudinary";
import Stripe from "stripe";

// Handle Uncaught Exceptions
process.on("uncaughtException", (error) => {
  console.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

// Load environment variables
config({
  path: "./config/config.env",
});

// Connect to Database
connectDB();

// Stripe Configuration
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

// Start Server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on PORT: ${PORT}`);
});

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (error) => {
  console.error(`Unhandled Promise Rejection: ${error.message}`);
  server.close(() => {
    process.exit(1);
  });
});

// **Export for Vercel**
export default app;
