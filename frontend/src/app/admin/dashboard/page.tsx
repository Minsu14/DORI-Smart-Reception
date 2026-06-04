"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Users, UserCheck, Briefcase, Wrench, TrendingUp, Calendar } from "lucide-react";
import { api, type DashboardStats } from "@/lib/api";
import { AdminSidebar } from "@/components/admin-sidebar";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("dori_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    api
      .getStats()
      .then(setStats)
      .catch((err) => {
        if (err.message.includes("credentials")) {
          router.push("/admin/login");
        } else {
          setError(err.message);
        }
      });
  }, [router]);

  const cards = stats
    ? [
        {
          label: "Total Visitors",
          value: stats.total_visitors,
          icon: Users,
          color: "text-primary",
          bg: "bg-primary/10",
        },
        {
          label: "Active Today",
          value: stats.active_today,
          icon: UserCheck,
          color: "text-success",
          bg: "bg-success/10",
        },
        {
          label: "Meetings",
          value: stats.meetings,
          icon: Briefcase,
          color: "text-warning",
          bg: "bg-warning/10",
        },
        {
          label: "Technical Requests",
          value: stats.technical_requests,
          icon: Wrench,
          color: "text-danger",
          bg: "bg-danger/10",
        },
        {
          label: "Weekly Visitors",
          value: stats.weekly_visitors,
          icon: TrendingUp,
          color: "text-primary",
          bg: "bg-primary/10",
        },
        {
          label: "Monthly Visitors",
          value: stats.monthly_visitors,
          icon: Calendar,
          color: "text-success",
          bg: "bg-success/10",
        },
      ]
    : [];

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted mt-1">Overview of visitor statistics</p>
        </div>

        {error && <p className="text-danger mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              className="glass rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted">{card.label}</span>
                <div className={`p-2 rounded-xl ${card.bg}`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
              <p className="text-4xl font-bold">{card.value}</p>
            </motion.div>
          ))}
        </div>

        {!stats && !error && (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </main>
    </div>
  );
}
