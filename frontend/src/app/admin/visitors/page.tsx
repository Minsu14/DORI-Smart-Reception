"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, Trash2, Eye, X } from "lucide-react";
import { api, type Visitor } from "@/lib/api";
import { AdminSidebar } from "@/components/admin-sidebar";

export default function VisitorsPage() {
  const router = useRouter();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Visitor | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("dori_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    let cancelled = false;
    async function load() {
      try {
        const data = await api.getVisitors({ search: search || undefined });
        if (!cancelled) setVisitors(data);
      } catch (err) {
        if (!cancelled && err instanceof Error && err.message.includes("credentials")) {
          router.push("/admin/login");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [search, router]);

  async function refreshVisitors() {
    const data = await api.getVisitors({ search: search || undefined });
    setVisitors(data);
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this visitor?")) return;
    await api.deleteVisitor(id);
    refreshVisitors();
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Visitor Management</h1>
            <p className="text-muted mt-1">View and manage all visitors</p>
          </div>
        </div>

        <div className="glass rounded-xl p-4 mb-6 flex items-center gap-3">
          <Search className="w-5 h-5 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search visitors by name, ID, or company..."
            className="flex-1 bg-transparent border-none focus:ring-0 focus:shadow-none"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : visitors.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-muted">No visitors found</p>
          </div>
        ) : (
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-4 text-muted font-medium">
                    Visitor ID
                  </th>
                  <th className="text-left px-6 py-4 text-muted font-medium">
                    Name
                  </th>
                  <th className="text-left px-6 py-4 text-muted font-medium">
                    Company
                  </th>
                  <th className="text-left px-6 py-4 text-muted font-medium">
                    Purpose
                  </th>
                  <th className="text-left px-6 py-4 text-muted font-medium">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-muted font-medium">
                    Date
                  </th>
                  <th className="text-right px-6 py-4 text-muted font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((v) => (
                  <motion.tr
                    key={v.id}
                    className="border-b border-border/50 hover:bg-surface-light/30 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td className="px-6 py-4 font-mono text-primary text-xs">
                      {v.visitor_id}
                    </td>
                    <td className="px-6 py-4">
                      {v.first_name} {v.last_name}
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {v.company || "—"}
                    </td>
                    <td className="px-6 py-4 capitalize">
                      {v.purpose.replace(/_/g, " ")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          v.status === "active"
                            ? "bg-success/20 text-success"
                            : "bg-muted/20 text-muted"
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted text-xs">
                      {new Date(v.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelected(v)}
                          className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(v.visitor_id)}
                          className="p-2 rounded-lg hover:bg-danger/10 text-danger transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            >
              <motion.div
                className="glass-strong rounded-2xl p-6 max-w-md w-full"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Visitor Details</h2>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-1 rounded-lg hover:bg-surface-light transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">ID</span>
                    <span className="font-mono text-primary">
                      {selected.visitor_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Name</span>
                    <span>
                      {selected.first_name} {selected.last_name}
                    </span>
                  </div>
                  {selected.email && (
                    <div className="flex justify-between">
                      <span className="text-muted">Email</span>
                      <span>{selected.email}</span>
                    </div>
                  )}
                  {selected.phone && (
                    <div className="flex justify-between">
                      <span className="text-muted">Phone</span>
                      <span>{selected.phone}</span>
                    </div>
                  )}
                  {selected.company && (
                    <div className="flex justify-between">
                      <span className="text-muted">Company</span>
                      <span>{selected.company}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted">Purpose</span>
                    <span className="capitalize">
                      {selected.purpose.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Registered</span>
                    <span>
                      {new Date(selected.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
