"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { UserPlus } from "lucide-react";
import { api } from "@/lib/api";

const PURPOSE_OPTIONS = [
  { value: "meeting", label: "Görüş (Meeting)" },
  { value: "proposal", label: "Təklif (Proposal)" },
  { value: "technical_support", label: "Texniki dəstək (Technical Support)" },
  { value: "sales", label: "Satış (Sales)" },
  { value: "other", label: "Digər (Other)" },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const faceImage = searchParams.get("face");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    company: "",
    purpose: "meeting",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.purpose) {
      setError("Please fill in required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const visitor = await api.registerVisitor({
        ...form,
        face_image: faceImage || undefined,
      });
      router.push(`/qr-code/${visitor.visitor_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="glass-strong rounded-3xl p-8 max-w-lg w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <UserPlus className="w-7 h-7 text-primary" />
        <h1 className="text-2xl font-bold">Visitor Registration</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1">Ad *</label>
            <input
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl"
              placeholder="First name"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Soyad *</label>
            <input
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl"
              placeholder="Last name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Telefon</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl"
            placeholder="+994 XX XXX XX XX"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl"
            placeholder="visitor@company.com"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Şirkət</label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl"
            placeholder="Company name"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">
            Gəliş məqsədi *
          </label>
          <select
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl appearance-none"
          >
            {PURPOSE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-danger text-sm bg-danger/10 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-lg transition-colors disabled:opacity-50 cursor-pointer mt-2"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {loading ? "Registering..." : "Submit"}
        </motion.button>
      </form>
    </motion.div>
  );
}

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Suspense
        fallback={
          <div className="glass-strong rounded-3xl p-8 max-w-lg w-full animate-pulse h-96" />
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
