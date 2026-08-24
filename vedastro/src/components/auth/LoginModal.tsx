/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { authService } from "../../services/auth.service";
import {
    X,
    User as UserIcon,
    Sparkles,
    Calendar,
    Clock,
    Briefcase,
    Languages,
    IndianRupee,
    Award,
    ChevronLeft
} from "lucide-react";

interface LoginModalProps {
    open: boolean;
    onClose: () => void;
}

type Role = "USER" | "ASTROLOGER";
type Step = "ROLE" | "PHONE" | "OTP" | "PROFILE";

export default function LoginModal({ open, onClose }: LoginModalProps) {
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);

    const [step, setStep] = useState<Step>("ROLE");
    const [role, setRole] = useState<Role>("USER");

    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");

    // Shared Profile State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");

    // User-Specific Profile State
    const [gender, setGender] = useState("");
    const [birthPlace, setBirthPlace] = useState("");
    const [birthTime, setBirthTime] = useState("");

    // Astrologer-Specific Profile State
    const [experience, setExperience] = useState("");
    const [skills, setSkills] = useState("");
    const [languages, setLanguages] = useState("");
    const [consultationPrice, setConsultationPrice] = useState("");

    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const resetModal = () => {
        setStep("ROLE");
        setRole("USER");

        setPhone("");
        setOtp("");

        setName("");
        setEmail("");
        setDob("");

        setGender("");
        setBirthPlace("");
        setBirthTime("");

        setExperience("");
        setSkills("");
        setLanguages("");
        setConsultationPrice("");
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    const handleRoleRedirect = (currentUser: any) => {
        handleClose();

        if (currentUser.role === "ADMIN") {
            router.push("/admin");
            return;
        }

        if (currentUser.role === "ASTROLOGER") {
            if (currentUser.approvalStatus === "APPROVED") {
                router.push("/astrologer/dashboard");
            } else {
                router.push("/astrologer/pending");
            }
            return;
        }

        router.push("/home");
    };

    const handleSendOtp = async () => {
        const cleanPhone = phone.replace(/\D/g, "");

        if (cleanPhone.length > 0 && parseInt(cleanPhone.charAt(0)) < 5) {
            alert("Invalid mobile number format. Number cannot start with a digit less than 5.");
            return;
        }

        if (!/^[5-9]\d{9}$/.test(cleanPhone)) {
            alert("Enter valid 10 digit mobile number");
            return;
        }

        try {
            setLoading(true);
            await authService.sendOtp(cleanPhone, role);
            setPhone(cleanPhone);
            setOtp("");
            setStep("OTP");
        } catch (error) {
            console.error("SEND OTP ERROR:", error);
            alert("Unable to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            alert("Enter 6 digit OTP");
            return;
        }

        try {
            setLoading(true);
            const user = await authService.verifyOtp(phone, otp, role);

            if (!user) {
                alert("User data not received");
                return;
            }

            setUser(user);

            if (user.role) {
                setRole(user.role as Role);
            }

            if (!user.profileCompleted) {
                if (user.name) setName(user.name);
                if (user.email) setEmail(user.email);
                if (user.phone) setPhone(user.phone);
                setStep("PROFILE");
                return;
            }

            handleRoleRedirect(user);
        } catch (error) {
            console.error("VERIFY OTP ERROR:", error);
            alert("Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteProfile = async () => {
        if (!name.trim()) return alert("Full Name is required");
        if (!email.trim()) return alert("Email is required");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) return alert("Please enter a valid email address.");
        if (!dob) return alert("Date of Birth is required");

        if (role === "USER") {
            if (!gender) return alert("Gender is required");
            if (!birthPlace.trim()) return alert("Birth place is required");
        }

        if (role === "ASTROLOGER") {
            if (!experience) return alert("Experience is required");
            if (!skills.trim()) return alert("Skills are required");
            if (!languages.trim()) return alert("Languages are required");
            if (!consultationPrice) return alert("Consultation price is required");
        }

        try {
            setLoading(true);

            const payload = {
                name: name.trim(),
                email: email.trim(),
                dob,
                phone,
                ...(role === "USER"
                    ? {
                        gender,
                        birthPlace: birthPlace.trim(),
                        birthTime: birthTime || null,
                    }
                    : {
                        experience: Number(experience),
                        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
                        languages: languages.split(",").map((l) => l.trim()).filter(Boolean),
                        consultationPrice: Number(consultationPrice),
                    }),
            };

            const updatedUser = await authService.completeProfile(payload);
            setUser(updatedUser);

            handleRoleRedirect(updatedUser);
        } catch (error) {
            console.error("COMPLETE PROFILE ERROR:", error);
            alert("Unable to complete profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div
                className={`relative max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-[#14120c] border border-yellow-600/30 p-7 text-white shadow-2xl transition-all duration-300 ${step === "PROFILE" ? "max-w-xl" : "max-w-md"
                    }`}
            >
                {/* 1. ROLE SELECTION */}
                {step === "ROLE" && (
                    <>
                        <h2 className="text-2xl font-bold tracking-wide">Welcome</h2>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setRole("USER");
                                    setStep("PHONE");
                                }}
                                className="group flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-[#1c1a14] p-5 transition hover:border-yellow-500/60 hover:bg-[#837025]/10"
                            >
                                <span className="text-3xl">👤</span>
                                <span className="mt-2 font-semibold text-zinc-200 group-hover:text-yellow-400">User</span>
                                <span className="mt-1 text-xs text-zinc-500">Get consultation</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setRole("ASTROLOGER");
                                    setStep("PHONE");
                                }}
                                className="group flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-[#1c1a14] p-5 transition hover:border-yellow-500/60 hover:bg-[#837025]/10"
                            >
                                <span className="text-3xl">🔮</span>
                                <span className="mt-2 font-semibold text-zinc-200 group-hover:text-yellow-400">Astrologer</span>
                                <span className="mt-1 text-xs text-zinc-500">Offer services</span>
                            </button>
                        </div>
                    </>
                )}

                {/* 2. PHONE INPUT */}
                {step === "PHONE" && (
                    <>
                        <h2 className="text-2xl font-bold tracking-wide">Sign In</h2>
                        <p className="mt-1 text-sm text-zinc-400">
                            Enter mobile number for <span className="font-semibold text-yellow-400">{role === "ASTROLOGER" ? "Astrologer" : "User"}</span>
                        </p>

                        <div className="mt-6 flex gap-2">
                            <div className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-[#1c1a14] px-3.5 py-3 text-sm font-medium text-zinc-300">
                                <span>IN</span>
                                <span className="text-zinc-400">+91</span>
                            </div>
                            <input
                                type="tel"
                                value={phone}
                                maxLength={10}
                                inputMode="numeric"
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                placeholder="Phone number"
                                className="w-full rounded-xl border border-yellow-500/40 bg-[#1c1a14] p-3 text-white placeholder-zinc-500 outline-none transition focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={loading}
                            className="mt-5 w-full rounded-xl bg-[#837025] hover:bg-[#96812b] p-3.5 font-semibold text-white shadow-lg transition active:scale-[0.99] disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep("ROLE")}
                            className="mt-4 flex items-center justify-center gap-1 w-full text-sm text-zinc-400 hover:text-white transition"
                        >
                            <ChevronLeft className="w-4 h-4" /> Switch Role
                        </button>
                    </>
                )}

                {/* 3. OTP VERIFICATION */}
                {step === "OTP" && (
                    <>
                        <h2 className="text-2xl font-bold tracking-wide">Verify OTP</h2>
                        <p className="mt-1 text-sm text-zinc-400">OTP sent to +91 {phone}</p>

                        <div className="mt-2 inline-block rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400 border border-yellow-500/20">
                            Role: {role === "ASTROLOGER" ? "Astrologer" : "User"}
                        </div>

                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            inputMode="numeric"
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            placeholder="Enter 6-digit OTP"
                            className="mt-6 w-full rounded-xl border border-yellow-500/40 bg-[#1c1a14] p-3.5 text-center text-lg tracking-[0.5em] text-white placeholder:text-sm placeholder:tracking-normal placeholder:text-zinc-500 outline-none transition focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                        />

                        <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={loading}
                            className="mt-5 w-full rounded-xl bg-[#837025] hover:bg-[#96812b] p-3.5 font-semibold text-white transition active:scale-[0.99] disabled:opacity-50"
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setOtp("");
                                setStep("PHONE");
                            }}
                            className="mt-4 flex items-center justify-center gap-1 w-full text-sm text-zinc-400 hover:text-white transition"
                        >
                            <ChevronLeft className="w-4 h-4" /> Change mobile number
                        </button>
                    </>
                )}

                {/* 4. PROFILE FORM (IN MODAL) */}
                {step === "PROFILE" && (
                    <div className="w-full">
                        <div className="flex items-center gap-4 border-b border-zinc-800 pb-5">
                            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-yellow-500/40 bg-[#1c1a14] text-yellow-400 shadow-md">
                                {role === "ASTROLOGER" ? <Sparkles className="h-7 w-7" /> : <UserIcon className="h-7 w-7" />}
                                <span className="absolute -bottom-1 -right-1 rounded bg-[#837025] px-1 py-0.5 text-[9px] font-bold text-white uppercase">
                                    {role === "ASTROLOGER" ? "Astro" : "User"}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {role === "ASTROLOGER" ? "Astrologer Onboarding" : "Complete Profile"}
                                </h2>
                                <p className="text-xs text-zinc-400">
                                    {role === "ASTROLOGER"
                                        ? "Enter consultation and expertise details"
                                        : "Enter birth details for accurate Kundli insights"}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 space-y-4">
                            <div className="text-[11px] font-semibold uppercase tracking-wider text-yellow-500/80">
                                Personal Information
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Full Name *"
                                    className="w-full rounded-xl border border-zinc-800 bg-[#1c1a14] p-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-yellow-500"
                                />

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address *"
                                    className="w-full rounded-xl border border-zinc-800 bg-[#1c1a14] p-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-yellow-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 flex items-center gap-1 text-[11px] text-zinc-400">
                                        <Calendar className="h-3.5 w-3.5 text-yellow-500/70" /> Date of Birth *
                                    </label>
                                    <input
                                        type="date"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                        className="w-full rounded-xl border border-zinc-800 bg-[#1c1a14] p-3 text-sm text-white outline-none focus:border-yellow-500 scheme-dark"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-[11px] text-zinc-400">Registered Phone</label>
                                    <input
                                        type="tel"
                                        value={`+91 ${phone}`}
                                        readOnly
                                        className="w-full rounded-xl border border-zinc-800/60 bg-[#171510] p-3 text-sm text-zinc-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* USER ONLY */}
                            {role === "USER" && (
                                <div className="space-y-3 pt-2 border-t border-zinc-800/60">
                                    <div className="text-[11px] font-semibold uppercase tracking-wider text-yellow-500/80">
                                        Kundli Information
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <select
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            className="w-full rounded-xl border border-zinc-800 bg-[#1c1a14] p-3 text-sm text-white outline-none focus:border-yellow-500"
                                        >
                                            <option value="" disabled className="text-zinc-500">Select Gender *</option>
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="OTHER">Other</option>
                                        </select>

                                        <input
                                            type="text"
                                            value={birthPlace}
                                            onChange={(e) => setBirthPlace(e.target.value)}
                                            placeholder="Birth Place (e.g., Delhi) *"
                                            className="w-full rounded-xl border border-zinc-800 bg-[#1c1a14] p-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-yellow-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 flex items-center gap-1 text-[11px] text-zinc-400">
                                            <Clock className="h-3.5 w-3.5 text-yellow-500/70" /> Time of Birth (Optional)
                                        </label>
                                        <input
                                            type="time"
                                            value={birthTime}
                                            onChange={(e) => setBirthTime(e.target.value)}
                                            className="w-full rounded-xl border border-zinc-800 bg-[#1c1a14] p-3 text-sm text-white outline-none focus:border-yellow-500 scheme-dark"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* ASTROLOGER ONLY */}
                            {role === "ASTROLOGER" && (
                                <div className="space-y-3 pt-2 border-t border-zinc-800/60">
                                    <div className="text-[11px] font-semibold uppercase tracking-wider text-yellow-500/80">
                                        Professional Information
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 flex items-center gap-1 text-[11px] text-zinc-400">
                                                <Briefcase className="h-3.5 w-3.5 text-yellow-500/70" /> Experience (Years) *
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={experience}
                                                onChange={(e) => setExperience(e.target.value)}
                                                placeholder="e.g., 5"
                                                className="w-full rounded-xl border border-zinc-800 bg-[#1c1a14] p-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-yellow-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 flex items-center gap-1 text-[11px] text-zinc-400">
                                                <IndianRupee className="h-3.5 w-3.5 text-yellow-500/70" /> Rate / Minute (₹) *
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={consultationPrice}
                                                onChange={(e) => setConsultationPrice(e.target.value)}
                                                placeholder="e.g., 25"
                                                className="w-full rounded-xl border border-zinc-800 bg-[#1c1a14] p-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-yellow-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1 flex items-center gap-1 text-[11px] text-zinc-400">
                                            <Award className="h-3.5 w-3.5 text-yellow-500/70" /> Skills (Comma separated) *
                                        </label>
                                        <input
                                            type="text"
                                            value={skills}
                                            onChange={(e) => setSkills(e.target.value)}
                                            placeholder="Vedic Astrology, Palmistry, Tarot"
                                            className="w-full rounded-xl border border-zinc-800 bg-[#1c1a14] p-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-yellow-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 flex items-center gap-1 text-[11px] text-zinc-400">
                                            <Languages className="h-3.5 w-3.5 text-yellow-500/70" /> Languages (Comma separated) *
                                        </label>
                                        <input
                                            type="text"
                                            value={languages}
                                            onChange={(e) => setLanguages(e.target.value)}
                                            placeholder="Hindi, English"
                                            className="w-full rounded-xl border border-zinc-800 bg-[#1c1a14] p-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-yellow-500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleCompleteProfile}
                            disabled={loading}
                            className="mt-6 w-full rounded-xl bg-[#837025] hover:bg-[#96812b] p-3.5 font-semibold text-white transition active:scale-[0.99] disabled:opacity-50 shadow-lg"
                        >
                            {loading ? "Saving..." : role === "ASTROLOGER" ? "Submit Application" : "Complete Profile & Start"}
                        </button>
                    </div>
                )}

                {/* CLOSE BUTTON */}
                <button
                    type="button"
                    onClick={handleClose}
                    className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/10 hover:text-white"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}