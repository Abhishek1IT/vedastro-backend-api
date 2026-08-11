import { z } from "zod";

// Register
export const registerSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),

  email: z.string().email("Invalid email format").toLowerCase().trim(),

  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),

  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "DOB must be in YYYY-MM-DD format"),
});

// Send OTP
export const sendOtpSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  role: z.enum(["USER", "ASTROLOGER", "ADMIN"]),
});

// Verify OTP
export const verifyOtpSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
  role: z.enum(["USER", "ASTROLOGER", "ADMIN"]),
});