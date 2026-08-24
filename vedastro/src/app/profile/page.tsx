/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuthStore } from "../../store/authStore";
import { authService } from "../../services/auth.service";

import Card from "../../components/ui/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/ui/Badge";

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user, setUser, isAuthenticated, isHydrated } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");

  // User-Specific fields (Kundli / Astrology Data)
  const [gender, setGender] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [birthTime, setBirthTime] = useState("");

  // Astrologer fields
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [languages, setLanguages] = useState("");
  const [consultationPrice, setConsultationPrice] = useState("");

  const redirect = searchParams.get("redirect") || "/home";
  const isAstrologer = user?.role === "ASTROLOGER";
  const openLoginModal = useAuthStore((state) => state.openLoginModal);

  const astrologerId = searchParams.get("astrologerId");
  const profileUserId = searchParams.get("userId");

  const isViewingOtherProfile =
    Boolean(astrologerId || profileUserId);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    // Kisi doosre person ka profile hai
    if (isViewingOtherProfile) {
      setLoading(false);
      return;
    }

    // Apna profile
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
      setDob(user.dob ? user.dob.split("T")[0] : "");

      setGender(user.gender ?? "");
      setBirthPlace(user.birthPlace ?? "");
      setBirthTime(user.birthTime ?? "");

      setExperience(
        user.experience !== undefined &&
          user.experience !== null
          ? String(user.experience)
          : ""
      );

      setSkills(user.skills?.join(", ") ?? "");
      setLanguages(user.languages?.join(", ") ?? "");

      setConsultationPrice(
        user.consultationPrice !== undefined &&
          user.consultationPrice !== null
          ? String(user.consultationPrice)
          : ""
      );
    }

    setLoading(false);
  }, [
    user,
    isAuthenticated,
    isHydrated,
    openLoginModal,
    isViewingOtherProfile,
  ]);

  const handleSave = async () => {
    if (!name.trim()) return alert("Name is required");
    if (!email.trim()) return alert("Email is required");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return alert("Please enter a valid email address.");
    if (!dob) return alert("Date of birth is required");

    if (!isAstrologer) {
      if (!gender) return alert("Gender is required");
      if (!birthPlace.trim()) return alert("Birth place is required");
    }

    if (isAstrologer) {
      if (!experience) return alert("Experience is required");
      if (!skills.trim()) return alert("Skills are required");
      if (!languages.trim()) return alert("Languages are required");
      if (!consultationPrice) return alert("Consultation price is required");
    }

    try {
      setSaving(true);

      const payload: any = {
        name: name.trim(),
        email: email.trim(),
        dob,
        phone: user?.phone,
        ...(!isAstrologer
          ? {
            gender,
            birthPlace: birthPlace.trim(),
            birthTime: birthTime || null,
          }
          : {
            experience: Number(experience),
            skills: skills
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
            languages: languages
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
            consultationPrice: Number(consultationPrice),
          }),
      };

      const updatedUser = await authService.completeProfile(payload);
      setUser(updatedUser);

      alert(
        isAstrologer
          ? "Profile submitted for admin approval"
          : "Profile updated successfully"
      );

      if (isAstrologer) {
        if (updatedUser.approvalStatus === "APPROVED") {
          router.replace("/astrologer/dashboard");
        } else {
          router.replace("/astrologer/pending");
        }
        return;
      }

      router.replace(redirect);
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Unable to update profile. Please check all fields.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--background) text-(--text-primary) font-bold">
        Loading Profile...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-(--background) px-4 py-24 text-(--text-primary) transition-colors duration-200">
      <div className="mx-auto max-w-5xl">
        <Card className="p-6 sm:p-8 bg-(--surface-secondary) border border-(--border) rounded-2xl shadow-xl transition-all duration-200">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-(--border) pb-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-(--text-primary)">
                {isAstrologer ? "Astrologer Profile" : "My Profile"}
              </h1>
              <p className="mt-1 text-sm text-(--text-muted)">
                {isAstrologer
                  ? "Manage your professional details & consultation rates"
                  : "Manage your personal & astrological details"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="success">{user.role}</Badge>
              {isAstrologer && (
                <Badge variant={user.approvalStatus === "APPROVED" ? "success" : "warning"}>
                  {user.approvalStatus || "PENDING"}
                </Badge>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-bold tracking-tight text-(--text-secondary)">
              Personal Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="p-4 bg-(--surface-tertiary) border border-(--border) rounded-xl">
                <label className="mb-2 block text-sm font-semibold text-(--text-secondary)">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-(--border) bg-(--surface) p-2.5 text-(--text-primary) placeholder-(--text-muted) outline-none transition focus:border-(--accent)"
                  placeholder="Enter your name"
                />
              </div>

              <div className="p-4 bg-(--surface-tertiary) border border-(--border) rounded-xl">
                <label className="mb-2 block text-sm font-semibold text-(--text-secondary)">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-(--border) bg-(--surface) p-2.5 text-(--text-primary) placeholder-(--text-muted) outline-none transition focus:border-(--accent)"
                  placeholder="Enter your email"
                />
              </div>

              <div className="p-4 bg-(--surface-tertiary) border border-(--border) rounded-xl">
                <label className="mb-2 block text-sm font-semibold text-(--text-secondary)">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full rounded-lg border border-(--border) bg-(--surface) p-2.5 text-(--text-primary) outline-none transition focus:border-(--accent) scheme-dark"
                />
              </div>

              <div className="p-4 bg-(--surface-tertiary) border border-(--border) rounded-xl">
                <label className="mb-2 block text-sm font-semibold text-(--text-secondary)">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={user.phone ? `+91 ${user.phone}` : ""}
                  readOnly
                  className="w-full cursor-not-allowed rounded-lg border border-(--border) bg-(--surface-secondary) p-2.5 text-(--text-muted) outline-none"
                />
              </div>
            </div>
          </div>

          {/* USER SPECIFIC SECTION */}
          {!isAstrologer && (
            <div className="mt-8 border-t border-(--border) pt-6">
              <h2 className="mb-4 text-lg font-bold tracking-tight text-(--text-secondary)">
                Astrological & Birth Details
              </h2>

              <div className="grid gap-5 md:grid-cols-3">
                <div className="p-4 bg-(--surface-tertiary) border border-(--border) rounded-xl">
                  <label className="mb-2 block text-sm font-semibold text-(--text-secondary)">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full rounded-lg border border-(--border) bg-(--surface) p-2.5 text-(--text-primary) outline-none transition focus:border-(--accent)"
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="p-4 bg-(--surface-tertiary) border border-(--border) rounded-xl">
                  <label className="mb-2 block text-sm font-semibold text-(--text-secondary)">
                    Birth Place <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    className="w-full rounded-lg border border-(--border) bg-(--surface) p-2.5 text-(--text-primary) placeholder-(--text-muted) outline-none transition focus:border-(--accent)"
                    placeholder="City, State"
                  />
                </div>

                <div className="p-4 bg-(--surface-tertiary) border border-(--border) rounded-xl">
                  <label className="mb-2 block text-sm font-semibold text-(--text-secondary)">
                    Time of Birth (Optional)
                  </label>
                  <input
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full rounded-lg border border-(--border) bg-(--surface) p-2.5 text-(--text-primary) outline-none transition focus:border-(--accent) scheme-dark"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ASTROLOGER SPECIFIC SECTION */}
          {isAstrologer && (
            <div className="mt-8 border-t border-(--border) pt-6">
              <h2 className="mb-1 text-lg font-bold tracking-tight text-(--text-secondary)">
                Astrologer Professional Details
              </h2>
              <p className="mb-4 text-xs text-(--text-muted)">
                These details will be verified by the admin before your profile is approved.
              </p>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="p-4 bg-(--surface-tertiary) border border-(--border) rounded-xl">
                  <label className="mb-2 block text-sm font-semibold text-(--text-secondary)">
                    Experience (Years) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full rounded-lg border border-(--border) bg-(--surface) p-2.5 text-(--text-primary) outline-none transition focus:border-(--accent)"
                    placeholder="Years of experience"
                  />
                </div>

                <div className="p-4 bg-(--surface-tertiary) border border-(--border) rounded-xl">
                  <label className="mb-2 block text-sm font-semibold text-(--text-secondary)">
                    Consultation Price / Min (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={consultationPrice}
                    onChange={(e) => setConsultationPrice(e.target.value)}
                    className="w-full rounded-lg border border-(--border) bg-(--surface) p-2.5 text-(--text-primary) outline-none transition focus:border-(--accent)"
                    placeholder="Rate per minute"
                  />
                </div>

                <div className="p-4 bg-(--surface-tertiary) border border-(--border) rounded-xl">
                  <label className="mb-2 block text-sm font-semibold text-(--text-secondary)">
                    Skills <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full rounded-lg border border-(--border) bg-(--surface) p-2.5 text-(--text-primary) outline-none transition focus:border-(--accent)"
                    placeholder="Vedic Astrology, Palmistry, Tarot"
                  />
                  <p className="mt-1.5 text-xs text-(--text-muted)">
                    Separate multiple skills with commas.
                  </p>
                </div>

                <div className="p-4 bg-(--surface-tertiary) border border-(--border) rounded-xl">
                  <label className="mb-2 block text-sm font-semibold text-(--text-secondary)">
                    Languages <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    className="w-full rounded-lg border border-(--border) bg-(--surface) p-2.5 text-(--text-primary) outline-none transition focus:border-(--accent)"
                    placeholder="Hindi, English, Sanskrit"
                  />
                  <p className="mt-1.5 text-xs text-(--text-muted)">
                    Separate multiple languages with commas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SAVE BUTTON */}
          <div className="mt-8 flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="px-8 py-3 font-semibold">
              {saving
                ? "Saving..."
                : isAstrologer
                  ? "Submit for Approval"
                  : "Save Profile"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}