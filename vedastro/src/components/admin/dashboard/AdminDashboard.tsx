/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import Button from "../../common/Button";

import adminService from "../../../services/admin.service";
import ProductService from "../../../services/product.service";

import type {
  AdminConversation,
  AdminUser,
} from "../../../types/admin";

import type { Product } from "../../../store/productStore";

import { formatDate } from "../../../utils/formatDate";
import { useAuthStore } from "@/src/store/authStore";

type DashboardState = {
  users: AdminUser[];
  astrologers: AdminUser[];
  pendingAstrologers: AdminUser[];
  chatUsers: AdminUser[];
  chats: AdminConversation[];
  products: Product[];
  loading: boolean;
  error: string | null;
};

const initialState: DashboardState = {
  users: [],
  astrologers: [],
  pendingAstrologers: [],
  chatUsers: [],
  chats: [],
  products: [],
  loading: true,
  error: null,
};

function formatLabel(value?: string) {
  if (!value) return "-";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function StatusBadge({
  status,
}: {
  status?: string;
}) {
  const normalized = status?.toUpperCase();

  if (normalized === "APPROVED") {
    return (
      <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
        Approved
      </span>
    );
  }

  if (normalized === "REJECTED") {
    return (
      <span className="rounded-full bg-red-400/15 px-3 py-1 text-xs font-semibold text-red-300">
        Rejected
      </span>
    );
  }

  return (
    <span className="rounded-full bg-yellow-400/15 px-3 py-1 text-xs font-semibold text-yellow-300">
      Pending
    </span>
  );
}

function MetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
        {label}
      </p>

      <div className="mt-3 text-3xl font-black text-white">
        {value}
      </div>

      <p className="mt-2 text-sm text-slate-400">
        {helper}
      </p>
    </div>
  );
}

function SectionTable({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white">
            {title}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {subtitle}
          </p>
        </div>

        {action}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/5">
        {children}
      </div>
    </section>
  );
}

export function AdminSidebar() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside>
      <button
        type="button"
        onClick={logout}
        className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-red-500 hover:bg-red-50"
      >
        <LogOut className="h-5 w-5" />
        Logout
      </button>
    </aside>
  );
}

export default function AdminDashboard() {
  const router = useRouter();

  const logout = useAuthStore((state) => state.logout);

  const [state, setState] =
    useState<DashboardState>(initialState);

  const [rejectingId, setRejectingId] =
    useState<string | null>(null);

  const [rejectionReason, setRejectionReason] =
    useState("");

  const [selectedAstrologer, setSelectedAstrologer] =
    useState<AdminUser | null>(null);

  const [actionLoading, setActionLoading] =
    useState<string | null>(null);

  const loadDashboard = async () => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const [
        users,
        astrologers,
        pendingAstrologers,
        chatUsers,
        chats,
        productsResponse,
      ] = await Promise.all([
        adminService.getUsers(),
        adminService.getAstrologers(),
        adminService.getPendingAstrologers(),
        adminService.getChatUsers(),
        adminService.getChats(),
        ProductService.getProducts({
          page: 1,
          limit: 6,
        }),
      ]);

      setState({
        users,
        astrologers,
        pendingAstrologers,
        chatUsers,
        chats,
        products: productsResponse.data || [],
        loading: false,
        error: null,
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load admin dashboard";

      setState((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }));
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const {
    users,
    astrologers,
    pendingAstrologers,
    chatUsers,
    chats,
    products,
    loading,
    error,
  } = state;

  const activeUsers = users.filter(
    (user) => user.isOnline
  ).length;

  const activeAstrologers = astrologers.filter(
    (user) => user.isOnline
  ).length;

  const onlineChatUsers = chatUsers.filter(
    (user) => user.isOnline
  ).length;

  const approvedAstrologers =
    astrologers.filter(
      (user) =>
        user.approvalStatus === "APPROVED"
    ).length;

  const rejectedAstrologers =
    astrologers.filter(
      (user) =>
        user.approvalStatus === "REJECTED"
    ).length;

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(id);

      await adminService.approveAstrologer(id);

      setSelectedAstrologer(null);

      await loadDashboard();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to approve astrologer";

      setState((prev) => ({
        ...prev,
        error: message,
      }));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectingId) return;

    if (!rejectionReason.trim()) {
      setState((prev) => ({
        ...prev,
        error: "Please enter rejection reason",
      }));

      return;
    }

    try {
      setActionLoading(rejectingId);

      await adminService.rejectAstrologer(
        rejectingId,
        rejectionReason.trim()
      );

      setRejectingId(null);
      setRejectionReason("");
      setSelectedAstrologer(null);

      await loadDashboard();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to reject astrologer";

      setState((prev) => ({
        ...prev,
        error: message,
      }));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER */}

      <section className="rounded-4xl border border-white/10 bg-slate-950/85 p-6 shadow-2xl shadow-black/30 backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300/80">
              Admin overview
            </p>

            <h1 className="mt-3 text-4xl font-black text-white md:text-5xl">
              Production control for VedAstro
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">
              Manage users, astrologers, approvals,
              conversations and products from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={loadDashboard}
              loading={loading}
              variant="secondary"
            >
              Refresh Data
            </Button>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* METRICS */}

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-7">
          <MetricCard
            label="Users"
            value={users.length}
            helper={`${activeUsers} online`}
          />

          <MetricCard
            label="Astrologers"
            value={astrologers.length}
            helper={`${activeAstrologers} online`}
          />

          <MetricCard
            label="Pending"
            value={pendingAstrologers.length}
            helper="Awaiting approval"
          />

          <MetricCard
            label="Approved"
            value={approvedAstrologers}
            helper="Active astrologers"
          />

          <MetricCard
            label="Rejected"
            value={rejectedAstrologers}
            helper="Rejected applications"
          />

          <MetricCard
            label="Chats"
            value={chats.length}
            helper="Conversations"
          />

          <MetricCard
            label="Products"
            value={products.length}
            helper="Shop products"
          />
        </div>
      </section>

      {/* PENDING ASTROLOGERS */}

      <SectionTable
        title="Astrologer Applications"
        subtitle="Review and manage pending astrologer registrations"
        action={
          <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-300">
            {pendingAstrologers.length} Pending
          </span>
        }
      >
        {pendingAstrologers.length === 0 ? (
          <div className="p-10 text-center">
            <div className="text-4xl">✓</div>

            <h3 className="mt-3 font-bold text-white">
              No pending applications
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              All astrologer applications have been
              reviewed.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-3">
                  Astrologer
                </th>

                <th className="px-4 py-3">
                  Phone
                </th>

                <th className="px-4 py-3">
                  Experience
                </th>

                <th className="px-4 py-3">
                  Language
                </th>

                <th className="px-4 py-3">
                  Status
                </th>

                <th className="px-4 py-3">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {pendingAstrologers.map(
                (astrologer) => (
                  <tr
                    key={astrologer._id}
                    className="border-t border-white/5 text-slate-200"
                  >
                    <td className="px-4 py-4">
                      <div className="font-semibold text-white">
                        {astrologer.name ||
                          "Unnamed astrologer"}
                      </div>

                      <div className="text-xs text-slate-500">
                        {astrologer.email || "-"}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      {astrologer.phone || "-"}
                    </td>

                    <td className="px-4 py-4">
                      {astrologer.experience ??
                        0}{" "}
                      years
                    </td>

                    <td className="px-4 py-4">
                      {astrologer.language || "-"}
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge
                        status={
                          astrologer.approvalStatus
                        }
                      />
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const details =
                                await adminService.getAstrologer(
                                  astrologer._id
                                );

                              setSelectedAstrologer(
                                details || astrologer
                              );
                            } catch {
                              setSelectedAstrologer(
                                astrologer
                              );
                            }
                          }}
                          className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          disabled={
                            actionLoading ===
                            astrologer._id
                          }
                          onClick={() =>
                            handleApprove(
                              astrologer._id
                            )
                          }
                          className="rounded-lg bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 disabled:opacity-50"
                        >
                          {actionLoading ===
                            astrologer._id
                            ? "..."
                            : "Approve"}
                        </button>

                        <button
                          type="button"
                          disabled={
                            actionLoading ===
                            astrologer._id
                          }
                          onClick={() => {
                            setRejectingId(
                              astrologer._id
                            );

                            setRejectionReason("");
                          }}
                          className="rounded-lg bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/25 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </SectionTable>

      {/* APPROVED / ALL ASTROLOGERS */}

      <SectionTable
        title="Astrologers"
        subtitle="All astrologer accounts"
        action={
          <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
            {astrologers.length} total
          </span>
        }
      >
        {astrologers.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            No astrologers available
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-3">
                  Name
                </th>

                <th className="px-4 py-3">
                  Experience
                </th>

                <th className="px-4 py-3">
                  Language
                </th>

                <th className="px-4 py-3">
                  Status
                </th>

                <th className="px-4 py-3">
                  Online
                </th>
              </tr>
            </thead>

            <tbody>
              {astrologers.map((astrologer) => (
                <tr
                  key={astrologer._id}
                  className="border-t border-white/5 text-slate-200"
                >
                  <td className="px-4 py-3 font-semibold text-white">
                    {astrologer.name ||
                      "Unnamed astrologer"}
                  </td>

                  <td className="px-4 py-3">
                    {astrologer.experience ?? 0} years
                  </td>

                  <td className="px-4 py-3">
                    {astrologer.language || "-"}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge
                      status={
                        astrologer.approvalStatus
                      }
                    />
                  </td>

                  <td className="px-4 py-3">
                    {astrologer.isOnline ? (
                      <span className="text-emerald-300">
                        Online
                      </span>
                    ) : (
                      <span className="text-slate-500">
                        Offline
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SectionTable>

      {/* USERS */}

      <SectionTable
        title="Users"
        subtitle="All registered users"
        action={
          <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
            {users.length} total
          </span>
        }
      >
        {users.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            No users available
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-3">
                  Name
                </th>

                <th className="px-4 py-3">
                  Phone
                </th>

                <th className="px-4 py-3">
                  Role
                </th>

                <th className="px-4 py-3">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {users.slice(0, 10).map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-white/5 text-slate-200"
                >
                  <td className="px-4 py-3 font-semibold text-white">
                    {user.name || "Unnamed user"}
                  </td>

                  <td className="px-4 py-3">
                    {user.phone || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {formatLabel(user.role)}
                  </td>

                  <td className="px-4 py-3">
                    {user.isOnline ? (
                      <span className="text-emerald-300">
                        Online
                      </span>
                    ) : (
                      <span className="text-slate-500">
                        Offline
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SectionTable>

      {/* CHAT USERS */}

      <SectionTable
        title="Chat Users"
        subtitle="Users currently using chat"
        action={
          <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
            {chatUsers.length} total
          </span>
        }
      >
        {chatUsers.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            No chat users available
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-3">
                  Name
                </th>

                <th className="px-4 py-3">
                  Role
                </th>

                <th className="px-4 py-3">
                  Online
                </th>

                <th className="px-4 py-3">
                  Last Seen
                </th>
              </tr>
            </thead>

            <tbody>
              {chatUsers.slice(0, 10).map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-white/5 text-slate-200"
                >
                  <td className="px-4 py-3 font-semibold text-white">
                    {user.name || "Unnamed user"}
                  </td>

                  <td className="px-4 py-3">
                    {formatLabel(user.role)}
                  </td>

                  <td className="px-4 py-3">
                    {user.isOnline ? "Yes" : "No"}
                  </td>

                  <td className="px-4 py-3 text-slate-400">
                    {user.lastSeen
                      ? formatDate.toReadable(
                        user.lastSeen,
                        true
                      )
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SectionTable>

      {/* CONVERSATIONS */}

      <SectionTable
        title="Conversations"
        subtitle="Latest conversation history"
        action={
          <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
            {chats.length} total
          </span>
        }
      >
        {chats.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            No conversations available
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-3">
                  Participants
                </th>

                <th className="px-4 py-3">
                  Last Message
                </th>

                <th className="px-4 py-3">
                  Updated
                </th>
              </tr>
            </thead>

            <tbody>
              {chats.slice(0, 10).map((chat) => (
                <tr
                  key={chat._id}
                  className="border-t border-white/5 text-slate-200"
                >
                  <td className="px-4 py-3 font-semibold text-white">
                    {chat.participants
                      ?.map(
                        (participant) =>
                          participant.name ||
                          participant.role ||
                          participant._id
                      )
                      .join(" · ")}
                  </td>

                  <td className="px-4 py-3 text-slate-300">
                    {chat.lastMessage || "-"}
                  </td>

                  <td className="px-4 py-3 text-slate-400">
                    {chat.updatedAt
                      ? formatDate.toReadable(
                        chat.updatedAt,
                        true
                      )
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SectionTable>

      {/* PRODUCTS */}

      <SectionTable
        title="Products"
        subtitle="Latest shop products"
        action={
          <button
            type="button"
            onClick={() =>
              router.push("/admin/products")
            }
            className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300 hover:text-amber-200"
          >
            Open shop admin
          </button>
        }
      >
        {products.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            No products available
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-3">
                  Name
                </th>

                <th className="px-4 py-3">
                  Category
                </th>

                <th className="px-4 py-3">
                  Price
                </th>

                <th className="px-4 py-3">
                  Stock
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-t border-white/5 text-slate-200"
                >
                  <td className="px-4 py-3 font-semibold text-white">
                    {product.name}
                  </td>

                  <td className="px-4 py-3">
                    {product.category}
                  </td>

                  <td className="px-4 py-3">
                    ₹
                    {product.salePrice ??
                      product.price}
                  </td>

                  <td className="px-4 py-3">
                    {product.stock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SectionTable>

      {/* ASTROLOGER DETAILS MODAL */}

      {selectedAstrologer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
                  Astrologer Application
                </p>

                <h2 className="mt-2 text-2xl font-black text-white">
                  {selectedAstrologer.name ||
                    "Unnamed astrologer"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedAstrologer(null)
                }
                className="rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Detail
                label="Phone"
                value={selectedAstrologer.phone}
              />

              <Detail
                label="Email"
                value={selectedAstrologer.email}
              />

              <Detail
                label="Date of Birth"
                value={selectedAstrologer.dob}
              />

              <Detail
                label="Gender"
                value={selectedAstrologer.gender}
              />

              <Detail
                label="Experience"
                value={
                  selectedAstrologer.experience !==
                    undefined
                    ? `${selectedAstrologer.experience} years`
                    : undefined
                }
              />

              <Detail
                label="Language"
                value={selectedAstrologer.language}
              />

              <Detail
                label="Specialization"
                value={
                  selectedAstrologer.specialization
                }
              />

              <Detail
                label="Consultation Fee"
                value={
                  selectedAstrologer.consultationFee !==
                    undefined
                    ? `₹${selectedAstrologer.consultationFee}`
                    : undefined
                }
              />

              <Detail
                label="Approval Status"
                value={
                  selectedAstrologer.approvalStatus
                }
              />

              <Detail
                label="Profile Completed"
                value={
                  selectedAstrologer.profileCompleted
                    ? "Yes"
                    : "No"
                }
              />
            </div>

            {selectedAstrologer.bio && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Bio
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {selectedAstrologer.bio}
                </p>
              </div>
            )}

            {selectedAstrologer.rejectionReason && (
              <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-red-300">
                  Rejection Reason
                </p>

                <p className="mt-2 text-sm text-red-200">
                  {
                    selectedAstrologer.rejectionReason
                  }
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setSelectedAstrologer(null)
                }
                className="rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15"
              >
                Close
              </button>

              {selectedAstrologer.approvalStatus !==
                "APPROVED" && (
                  <button
                    type="button"
                    disabled={
                      actionLoading ===
                      selectedAstrologer._id
                    }
                    onClick={() =>
                      handleApprove(
                        selectedAstrologer._id
                      )
                    }
                    className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-black hover:bg-emerald-400 disabled:opacity-50"
                  >
                    {actionLoading ===
                      selectedAstrologer._id
                      ? "Approving..."
                      : "Approve"}
                  </button>
                )}

              {selectedAstrologer.approvalStatus !==
                "REJECTED" && (
                  <button
                    type="button"
                    onClick={() => {
                      setRejectingId(
                        selectedAstrologer._id
                      );

                      setRejectionReason("");
                    }}
                    className="rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white hover:bg-red-400"
                  >
                    Reject
                  </button>
                )}
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}

      {rejectingId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <h2 className="text-2xl font-black text-white">
              Reject Astrologer
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Please provide a reason for rejecting
              this astrologer application.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(event) =>
                setRejectionReason(event.target.value)
              }
              placeholder="Enter rejection reason..."
              rows={5}
              className="mt-5 w-full resize-none rounded-2xl border border-white/10 bg-slate-950 p-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-red-400"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setRejectingId(null);
                  setRejectionReason("");
                }}
                className="rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  !rejectionReason.trim() ||
                  actionLoading === rejectingId
                }
                onClick={handleReject}
                className="rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading === rejectingId
                  ? "Rejecting..."
                  : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 wrap-break-word text-sm font-semibold text-white">
        {value || "-"}
      </p>
    </div>
  );
}