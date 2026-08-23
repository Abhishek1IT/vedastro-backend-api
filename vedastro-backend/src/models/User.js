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

    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
    },

    birthPlace: {
      type: String,
    },

    birthTime: {
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
    skills: {
      type: [String],
      default: [],
    },

    languages: {
      type: [String],
      default: ["English/Hindi"],
    },

    rating: {
      type: Number,
      default: 5,
    },

    totalOrders: {
      type: Number,
      default: 0,
    },

    consultationPrice: {
      type: Number,
      default: 0,
    },

    badge: {
      type: String,
      enum: ["TOP CHOICE", "CELEBRITY", null],
      default: null,
    },

    approvalStatus: {
      type: String,
      enum: ["NOT_REQUIRED", "PENDING", "APPROVED", "REJECTED"],
      default: "NOT_REQUIRED",
    },

    expertise: {
      type: [
        {
          type: String,
          enum: [
            "Love",
            "Marriage",
            "Career",
            "Finance",
            "Business",
            "Education",
            "Vastu",
            "Numerology",
            "Kundli",
          ],
        },
      ],
      default: [],
    },

    rejectionReason: {
      type: String,
      default: null,
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