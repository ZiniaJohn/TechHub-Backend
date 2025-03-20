import mongoose from "mongoose";
import validator from "validator";

const teacherSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  universityEmail: {
    type: String,
    required: [true, "University Email is Required"],
    validate: [validator.isEmail, "Please enter a valid Email"],
  },
  teacherCard: {
    public_id: {
      type: String,
      required: [true, "Teacher Card Public ID is Required"],
    },
    url: {
      type: String,
      required: [true, "Teacher Card URL is Required"],
    },
  },
  additionalProof: {
    public_id: {
      type: String,
      required: [true, "Additional Proof Public ID is Required"],
    },
    url: {
      type: String,
      required: [true, "Additional Proof URL is Required"],
    },
  },
  status: {
    type: String,
    enum: ["none", "applied", "rejected", "approved"], // Allowed values
    default: "none", // Default value
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Teacher = mongoose.model("Teacher", teacherSchema);
