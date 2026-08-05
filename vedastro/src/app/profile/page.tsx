/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "../../store/authStore";
import { authService } from "../../services/auth.service";

import Card from "../../components/ui/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/ui/Badge";

export default function ProfilePage() {
  const router = useRouter();

  const { user, setUser, logout, isAuthenticated, isHydrated } = useAuthStore();

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.replace("/login?redirect=/profile");
      return;
    }

    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setDob(user.dob || "");
    }

    setLoading(false);
  }, [user, isAuthenticated, isHydrated, router]);

  const handleSave = async () => {
    try {
      const updatedUser = await authService.completeProfile({
        name,
        email,
        dob,
      });

      setUser(updatedUser);

      alert("Profile updated successfully");

      router.push("/home");
    } catch (err) {
      console.error(err);
      alert("Unable to update profile");
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.log(err);
    }

    logout();

    router.replace("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading Profile...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto mt-10 max-w-4xl">
        <Card
          hoverEffect={false}
          className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">My Profile</h1>

              <Badge variant="success">Active</Badge>
            </div>

            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Card hoverEffect={false}>
              <p className="mb-2">Name</p>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-800 p-2"
              />
            </Card>

            <Card hoverEffect={false}>
              <p className="mb-2">Email</p>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-800 p-2"
              />
            </Card>

            <Card hoverEffect={false}>
              <p className="mb-2">Date of Birth</p>

              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-800 p-2"
              />
            </Card>

            <Card hoverEffect={false}>
              <p className="mb-2">Phone</p>

              <p>+91 {user.phone}</p>
            </Card>

            <Card hoverEffect={false}>
              <p className="mb-2">Role</p>

              <p>{user.role}</p>
            </Card>
          </div>

          <div className="mt-6">
            <Button onClick={handleSave}>Save Profile</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
