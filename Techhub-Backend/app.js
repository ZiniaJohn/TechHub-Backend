import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware, notFound } from "./middlewares/errorMiddleware.js";

// Routes Imports
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import sectionRoutes from "./routes/sectionRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";

const app = express();

// Content Security Policy
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline';"
  );
  next();
});

// Global Middlewares
console.log("Frontend URL:", process.env.FRONTEND_URL);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // Ensure CORS works even if FRONTEND_URL is missing
    credentials: true,
  })
);

app.use(
  express.json({
    verify: (req, res, buf) => {
      if (req.originalUrl === "/api/v1/payment/webhook") {
        req.rawBody = buf.toString(); // Capture raw body for Stripe webhook verification
      }
    },
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1gb",
  })
);
app.use(cookieParser());

// Root route
app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TechHub</title>
  </head>
  <body>
      <h1>Application is working fine.</h1>
      <p><a href="${process.env.FRONTEND_URL || "#"}">Click here to use.</a></p>
  </body>
  </html>
  `);
});

// API Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/section", sectionRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
console.log("Check1 - API routes initialized.");
app.use("/api/v1/teacher", teacherRoutes);

// Error Handlers
app.use(notFound);
app.use(errorMiddleware);

export default app;
