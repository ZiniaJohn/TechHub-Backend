import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/User.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import Stripe from "stripe";
import { Course } from "../models/Course.js";
import { Earning, AdminEarning } from "../models/Earnings.js";
import { Cart } from "../models/Cart.js";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Checkout Route - Creates a Payment Intent
export const checkout = catchAsyncErrors(async (req, res, next) => {
  const { amount } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Stripe expects the amount in cents
    currency: "USD",
    payment_method_types: ["card"],
  });

  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret, // Send clientSecret to the frontend
  });
});

// Payment Verification for Single Purchase
export const paymentVerification = catchAsyncErrors(async (req, res, next) => {
  console.log(":reqqqq", req.body);
  const { paymentIntentId, courseId, userId } = req.body;
  console.log(courseId, userId);
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status === "succeeded") {
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    // Calculate earnings
    const totalCoursePrice = course.price;
    const adminEarn = totalCoursePrice * 0.2;
    const teacherEarn = totalCoursePrice * 0.8;

    // Enroll user in the course and update earnings
    user.enrolledCourses.push(courseId);
    course.enrolledStudents.push(userId);

    await Earning.create({
      teacher: course.instructor,
      course: courseId,
      earningsAmount: teacherEarn,
      transactionDate: Date.now(),
    });

    await AdminEarning.create({
      student: userId,
      course: courseId,
      earningsAmount: adminEarn,
      transactionDate: Date.now(),
    });

    await user.save();
    await course.save();
    console.log("Heyy2");
    // Clear the user's cart
    await Cart.findOneAndRemove({ user: userId });
    console.log("Heyy1");
    console.log(
      "Redirecting to:",
      `${process.env.FRONTEND_URL}/paymentsuccess?reference=${paymentIntentId}`
    );
    res.status(200).json({ success: true, id: paymentIntent });
    console.log("Heyy2");
  } else {
    console.log("haye");
    res.status(400).json({ success: false });
  }
});

// Payment Verification for Multiple Courses
export const multipleVerification = catchAsyncErrors(async (req, res, next) => {
  const { paymentIntentId, courseId, userId } = req.body;

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status === "succeeded") {
    const idsArr = courseId.split(",");
    const user = await User.findById(userId);

    await Course.updateMany(
      { _id: { $in: idsArr } },
      { $addToSet: { enrolledStudents: userId } }
    );

    for (const courseId of idsArr) {
      const course = await Course.findById(courseId);
      const totalCoursePrice = course.price;
      const teacherEarn = totalCoursePrice * 0.8;
      const adminEarn = totalCoursePrice * 0.2;

      await Earning.create({
        teacher: course.instructor,
        course: course._id,
        earningsAmount: teacherEarn,
        transactionDate: Date.now(),
      });

      await AdminEarning.create({
        student: userId,
        course: course._id,
        earningsAmount: adminEarn,
        transactionDate: Date.now(),
      });
    }

    // Enroll the user in all courses and clear cart
    user.enrolledCourses.push(...idsArr);
    await user.save();
    await Cart.findOneAndRemove({ user: userId });
    console.log("MHeyy1");
    res.status(200).json({ success: true, id: paymentIntent });
    console.log("MHeyy2");
  } else {
    console.log("MError");
    res.status(400).json({ success: false });
  }
});

// Optional: Get Stripe Publishable Key for Frontend
export const getKey = (req, res, next) => {
  res.status(200).json({
    success: true,
    apiKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
};
