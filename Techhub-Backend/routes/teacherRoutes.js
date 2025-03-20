import express from "express";
import {
  registerTeacher,
  getTeacherDetails,
  updateTeacherStatus,
  getTeacherStatus, // Import the new function
  getAllTeachers,
} from "../controllers/teacherController.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";
import multer from "multer"; // Import multer directly

// Configure multer for multiple file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
});

// Initialize multer for specific fields
const uploadFields = upload.fields([
  { name: "teacherCard", maxCount: 1 },
  { name: "additionalDocument", maxCount: 1 },
]);

const router = express.Router();

// Teacher registration route (only for logged-in users)
router.post("/register", isAuthenticated, uploadFields, registerTeacher);

router.get("/details", isAuthenticated, getTeacherDetails);

router.get("/status", isAuthenticated, getTeacherStatus);

router.put("/status/:teacherId", isAuthenticated, isAdmin, updateTeacherStatus);

router.get("/all", isAuthenticated, isAdmin, getAllTeachers);

export default router;
