"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Clock } from "lucide-react";
import { api, type Notification } from "@/lib/api";
import { AdminSidebar } from "@/components/admin-sidebar";

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("dori_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    api
      .getNotifications()
      .then(setNotifications)
      .catch((err) => {
        if (err instanceof Error && err.message.includes("credentials")) {
          router.push("/admin/login");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleMarkAllRead = async () => {
    await api.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const handleMarkRead = async (id: number) => {
    await api.markRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              Notifications
              {unreadCount > 0 && (
                <span className="text-sm bg-primary px-3 py-1 rounded-full text-white">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-muted mt-1">System notifications and alerts</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-surface-light text-sm transition-colors cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Bell className="w-12 h-12 text-muted mx-auto mb-3" />
            <p className="text-muted">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n, i) => (
              <motion.div
                key={n.id}
                className={`glass rounded-xl p-5 cursor-pointer transition-colors ${
                  !n.is_read
                    ? "border-l-4 border-l-primary"
                    : "opacity-70"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => !n.is_read && handleMarkRead(n.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{n.title}</h3>
                    <p className="text-muted text-sm mt-1">{n.message}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted">
                      <Clock className="w-3 h-3" />
                      {new Date(n.created_at).toLocaleString()}
                    </div>
                  </div>
                  {!n.is_read && (
                    <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
