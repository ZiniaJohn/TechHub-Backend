
import express from "express";
import {
  checkout,
  getKey,
  multipleVerification, // Corrected spelling
  paymentVerification, // Corrected spelling
} from "../controllers/paymentControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/").post(checkout).get(getKey);
router.route("/paymentVerification").post(paymentVerification); // Corrected spelling
router.route("/multipleVerification").post(multipleVerification); // Corrected spelling

export default router;
