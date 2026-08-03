/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../common/Button";
import adminService from "../../../services/admin.service";
import ProductService from "../../../services/product.service";
import type { AdminConversation, AdminUser } from "../../../types/admin";
import type { Product } from "../../../store/productStore";
import { formatDate } from "../../../utils/formatDate";

type DashboardState = {
  users: AdminUser[];
  astrologers: AdminUser[];
  chatUsers: AdminUser[];
  chats: AdminConversation[];
  products: Product[];
  loading: boolean;
  error: string | null;
};

const initialState: DashboardState = {
  users: [],
  astrologers: [],
  chatUsers: [],
  chats: [],
  products: [],
  loading: true,
  error: null,
};

const metricCard = (label: string, value: string | number, helper: string) => (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20 backdrop-blur">
    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
    <div className="mt-3 text-3xl font-black text-white">{value}</div>
    <p className="mt-2 text-sm text-slate-400">{helper}</p>
  </div>
);

function SectionTable({
  title,
  subtitle,
  emptyLabel,
  children,
  action,
}: {
  title: string;
  subtitle: string;
  emptyLabel: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white">{title}</h2>
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        </div>
        {action}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/5">
        {children || (
          <div className="p-8 text-center text-sm text-slate-400">
            {emptyLabel}
          </div>
        )}
      </div>
    </section>
  );
}

function formatLabel(value?: string) {
  if (!value) return "-";

  return value
    .toString()
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function AdminDashboard() {
  const router = useRouter();
  const [state, setState] = useState<DashboardState>(initialState);

  const loadDashboard = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [users, astrologers, chatUsers, chats, productsResponse] =
        await Promise.all([
          adminService.getUsers(),
          adminService.getAstrologers(),
          adminService.getChatUsers(),
          adminService.getChats(),
          ProductService.getProducts({ page: 1, limit: 6 }),
        ]);

      setState((prev) => ({
        ...prev,
        users,
        astrologers,
        chatUsers,
        chats,
        products: productsResponse.data || [],
        loading: false,
        error: null,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load admin dashboard";

      setState((prev) => ({ ...prev, loading: false, error: message }));
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const { users, astrologers, chatUsers, chats, products, loading, error } = state;
  const activeUsers = users.filter((user) => user.isOnline).length;
  const activeAstrologers = astrologers.filter((user) => user.isOnline).length;
  const onlineChatUsers = chatUsers.filter((user) => user.isOnline).length;

  return (
    <div className="space-y-6 pb-10">
      <section className="rounded-4xl border border-white/10 bg-slate-950/85 p-6 shadow-2xl shadow-black/30 backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300/80">
              Admin overview
            </p>
            <h1 className="mt-3 text-4xl font-black text-white md:text-5xl">
              Production control for VedAstro
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">
              One dashboard for backend admin APIs, product management, astrologer visibility, and conversation monitoring.
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={loadDashboard} loading={loading} variant="secondary">
              Refresh Data
            </Button>
            <Button onClick={() => router.push("/admin/products")}>Manage Products</Button>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {metricCard("Users", users.length, `${activeUsers} online right now`)}
          {metricCard("Astrologers", astrologers.length, `${activeAstrologers} online specialists`)}
          {metricCard("Chat users", chatUsers.length, `${onlineChatUsers} active in chat`)}
          {metricCard("Conversations", chats.length, "Latest conversation history from backend")}
          {metricCard("Products", products.length, "Latest shop items from product API")}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionTable
          title="Users"
          subtitle="Fetched from /admin/users"
          emptyLabel="No users available"
          action={<span className="text-xs uppercase tracking-[0.3em] text-slate-500">{users.length} total</span>}
        >
          {users.length > 0 && (
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.3em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 6).map((user) => (
                  <tr key={user._id} className="border-t border-white/5 text-slate-200">
                    <td className="px-4 py-3 font-semibold text-white">{user.name || "Unnamed user"}</td>
                    <td className="px-4 py-3 text-slate-300">{user.phone || "-"}</td>
                    <td className="px-4 py-3">{formatLabel(user.role)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.isOnline
                            ? "bg-emerald-400/15 text-emerald-300"
                            : "bg-slate-500/15 text-slate-400"
                        }`}
                      >
                        {user.isOnline ? "Online" : "Offline"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SectionTable>

        <SectionTable
          title="Astrologers"
          subtitle="Fetched from /admin/astrologers"
          emptyLabel="No astrologers available"
          action={<span className="text-xs uppercase tracking-[0.3em] text-slate-500">{astrologers.length} total</span>}
        >
          {astrologers.length > 0 && (
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.3em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Experience</th>
                  <th className="px-4 py-3">Language</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {astrologers.slice(0, 6).map((astrologer) => (
                  <tr key={astrologer._id} className="border-t border-white/5 text-slate-200">
                    <td className="px-4 py-3 font-semibold text-white">{astrologer.name || "Unnamed astrologer"}</td>
                    <td className="px-4 py-3">{astrologer.experience ?? 0} years</td>
                    <td className="px-4 py-3">{astrologer.language || "-"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          astrologer.isOnline
                            ? "bg-emerald-400/15 text-emerald-300"
                            : "bg-slate-500/15 text-slate-400"
                        }`}
                      >
                        {astrologer.isOnline ? "Online" : "Offline"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SectionTable>

        <SectionTable
          title="Chat Users"
          subtitle="Fetched from /admin/chat-users"
          emptyLabel="No chat users available"
          action={<span className="text-xs uppercase tracking-[0.3em] text-slate-500">{chatUsers.length} total</span>}
        >
          {chatUsers.length > 0 && (
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.3em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Online</th>
                  <th className="px-4 py-3">Last Seen</th>
                </tr>
              </thead>
              <tbody>
                {chatUsers.slice(0, 6).map((user) => (
                  <tr key={user._id} className="border-t border-white/5 text-slate-200">
                    <td className="px-4 py-3 font-semibold text-white">{user.name || "Unnamed user"}</td>
                    <td className="px-4 py-3">{formatLabel(user.role)}</td>
                    <td className="px-4 py-3">{user.isOnline ? "Yes" : "No"}</td>
                    <td className="px-4 py-3 text-slate-400">
                      {user.lastSeen ? formatDate.toReadable(user.lastSeen, true) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SectionTable>

        <SectionTable
          title="Conversations"
          subtitle="Fetched from /admin/chats"
          emptyLabel="No conversations available"
          action={<span className="text-xs uppercase tracking-[0.3em] text-slate-500">{chats.length} total</span>}
        >
          {chats.length > 0 && (
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.3em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">Participants</th>
                  <th className="px-4 py-3">Last Message</th>
                  <th className="px-4 py-3">Updated</th>
                </tr>
              </thead>
              <tbody>
                {chats.slice(0, 6).map((chat) => (
                  <tr key={chat._id} className="border-t border-white/5 text-slate-200">
                    <td className="px-4 py-3 font-semibold text-white">
                      {chat.participants?.map((participant) => participant.name || participant.role || participant._id).join(" · ")}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{chat.lastMessage || "-"}</td>
                    <td className="px-4 py-3 text-slate-400">
                      {chat.updatedAt ? formatDate.toReadable(chat.updatedAt, true) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SectionTable>

        <SectionTable
          title="Products"
          subtitle="Fetched from product API"
          emptyLabel="No products available"
          action={<button type="button" onClick={() => router.push("/admin/products")} className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300 hover:text-amber-200">Open shop admin</button>}
        >
          {products.length > 0 && (
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.3em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-t border-white/5 text-slate-200">
                    <td className="px-4 py-3 font-semibold text-white">{product.name}</td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">₹{product.salePrice ?? product.price}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                        {product.stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SectionTable>
      </div>
    </div>
  );
}