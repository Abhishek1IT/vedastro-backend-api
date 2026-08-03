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

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await authService.getCurrentUser();

        console.log("PROFILE RESPONSE:", response);

        const currentUser = response.user || response.data || response;

        setUser(currentUser);
      } catch (error) {
        console.log("Profile Error:", error);

        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.replace("/login");

      return;
    }

    loadProfile();
  }, [isHydrated, isAuthenticated, router, setUser]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading Profile...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto mt-10">
        <Card
          hoverEffect={false}
          className="border border-slate-800 bg-slate-900/40 p-8 rounded-2xl"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">My Profile</h1>

              <Badge variant="success">Active</Badge>
            </div>

            <Button variant="danger" onClick={logout}>
              Logout
            </Button>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-5">
            <Card hoverEffect={false}>
              <p>Name</p>
              <p>{user.name || "-"}</p>
            </Card>

            <Card hoverEffect={false}>
              <p>Phone</p>
              <p>+91 {user.phone}</p>
            </Card>

            <Card hoverEffect={false}>
              <p>Role</p>
              <p>{user.role || "USER"}</p>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  );
}
