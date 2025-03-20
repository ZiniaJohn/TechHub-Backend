import { Teacher } from "../models/Teacher.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import cloudinary from "cloudinary";
import getDataUri from "../utils/dataUri.js";
import {
  sendTeacherverificationapp,
  sendTeacherverificationrej,
  sendVerificationEmail,
} from "../utils/sendEmail.js";
// Register Teacher
export const registerTeacher = catchAsyncErrors(async (req, res, next) => {
  const { universityEmail } = req.body;
  const { teacherCard, additionalDocument } = req.files;

  if (!universityEmail || !teacherCard || !additionalDocument) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const teacherCardUri = getDataUri(teacherCard[0]);
  const additionalDocumentUri = getDataUri(additionalDocument[0]);

  const uploadedTeacherCard = await cloudinary.v2.uploader.upload(
    teacherCardUri.content
  );
  const uploadedAdditionalDocument = await cloudinary.v2.uploader.upload(
    additionalDocumentUri.content
  );

  // Create a new Teacher document
  const teacher = await Teacher.create({
    user: req.user._id,
    universityEmail,
    teacherCard: {
      public_id: uploadedTeacherCard.public_id,
      url: uploadedTeacherCard.secure_url,
    },
    additionalProof: {
      public_id: uploadedAdditionalDocument.public_id,
      url: uploadedAdditionalDocument.secure_url,
    },
    status: "applied", // Set initial status to "applied"
  });

  // Update the User model to include teacher ID and set teacherVerified to false
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      teacherid: teacher._id,
      teacherVerified: false,
    },
    { new: true } // Return the updated user document
  );

  res.status(201).json({
    success: true,
    message:
      "Teacher registered successfully. Admin will review your application.",
    teacherId: teacher._id,
    user, // Return updated user document if needed
  });
});

// Get Teacher Details
export const getTeacherDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("teacherid");

  if (!user.teacherid) {
    return next(new ErrorHandler("Teacher profile not found", 404));
  }

  res.status(200).json({
    success: true,
    teacher: user.teacherid,
  });
});

// Get Teacher Status
export const getTeacherStatus = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("teacherid");

  if (!user.teacherid) {
    return next(new ErrorHandler("Teacher profile not found", 404));
  }

  res.status(200).json({
    success: true,
    status: user.teacherid.status, // Return only the status field
  });
});

export const getAllTeachers = catchAsyncErrors(async (req, res, next) => {
  const teachers = await Teacher.find().populate("user", "name email");
  console.log("tec", teachers);
  if (!teachers || teachers.length === 0) {
    return next(new ErrorHandler("No teachers found", 404));
  }

  res.status(200).json({
    success: true,
    teachers,
  });
});

// Update Teacher Status
// Update Teacher Status
export const updateTeacherStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;
  const { teacherId } = req.params;

  if (
    !status ||
    !["applied", "approved", "rejected", "none"].includes(status)
  ) {
    return next(new ErrorHandler("Invalid or missing status value", 400));
  }

  const teacher = await Teacher.findById(teacherId);

  if (!teacher) {
    return next(new ErrorHandler("Teacher not found", 404));
  }

  // Update teacher's status
  teacher.status = status;
  await teacher.save();

  // Update the corresponding user
  const user = await User.findById(teacher.user);

  if (!user) {
    return next(
      new ErrorHandler("User associated with this teacher not found", 404)
    );
  }

  if (status === "approved") {
    user.teacherVerified = true;

    // Send approval email
    await sendTeacherverificationapp(
      user.email,
      "TECHHUB TEACHER VERIFICATION RESPONSE"
    );
  } else if (status === "rejected") {
    user.teacherVerified = false;

    // Send rejection email
    await sendTeacherverificationrej(
      user.email,
      "TECHHUB TEACHER VERIFICATION RESPONSE"
    );
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: `Teacher status updated to ${status}`,
  });
});
