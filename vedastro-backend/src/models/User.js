import mongoose from "mongoose";
import { ROLES } from "../common/roles.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      default: undefined,
    },

    dob: {
      type: String,
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },

    avatar: {
      type: String,
      default: "",
    },

    language: {
      type: String,
      default: "en",
    },

    experience: {
      type: Number,
      default: 0,
    },

    otp: {
      type: String,
      default: null,
      select: false,
    },

    otpExpiry: {
      type: Date,
      default: null,
      select: false,
    },

    refreshToken: {
      type: String,
      default: null,
      select: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "BLOCKED"],
      default: "ACTIVE",
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },

    sessionVersion: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index(
  { email: 1 },
  {
    unique: true,
    sparse: true,
  }
);

export default mongoose.model("User", userSchema);