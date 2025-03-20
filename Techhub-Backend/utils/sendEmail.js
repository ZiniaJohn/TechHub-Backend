import { createTransport } from "nodemailer";
import { emailTemplate } from "./emailTemplate.js";
import { verificationTemplate } from "./verificationTemplate.js";
import { teacherApprovalTemplate } from "./teacherverification.js";
import { teacherRejectionTemplate } from "./teacherrejection.js";
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });
console.log(process.env.SMTP_USER, process.env.SMTP_PASS);
export const sendEmail = async (to, subject, text) => {
  console.log("hey in gmaa", process.env.SMTP_USER, process.env.SMTP_PASS);
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    to,
    subject,
    from: process.env.SMTP_USER,
    html: emailTemplate(text),
  });
};
export const sendTeacherverificationapp = async (to, subject, text) => {
  console.log("hey in gmaa", process.env.SMTP_USER, process.env.SMTP_PASS);
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    to,
    subject,
    from: process.env.SMTP_USER,
    html: teacherApprovalTemplate(text),
  });
};
export const sendTeacherverificationrej = async (to, subject, text) => {
  console.log("hey in gmaa", process.env.SMTP_USER, process.env.SMTP_PASS);
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    to,
    subject,
    from: process.env.SMTP_USER,
    html: teacherRejectionTemplate(text),
  });
};
export const sendVerificationEmail = async (to, subject, text) => {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    to,
    subject,
    from: process.env.SMTP_USER,
    html: verificationTemplate(text),
  });
};
