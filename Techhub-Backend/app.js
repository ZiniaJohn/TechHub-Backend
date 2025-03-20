
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
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: blob:;"
  );
  next();
});

// Global Middlewares
/*app.use(cors());*/
console.log("inapps", process.env.FRONTEND_URL);
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Allow only your frontend origin
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
  <h1>
  Application is working fine.
  <a href="${process.env.FRONTEND_URL}">
  Click here to use.
  </a>
  </h1>
  `);
});

// API Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/section", sectionRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
console.log("check1");
app.use("/api/v1/teacher", teacherRoutes);

// Error Handlers
app.use(notFound);
app.use(errorMiddleware);

export default app;
