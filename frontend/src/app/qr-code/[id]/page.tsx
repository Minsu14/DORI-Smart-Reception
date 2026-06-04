"use client";

import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Download, MessageSquare, Home } from "lucide-react";
import { api, type Visitor } from "@/lib/api";
import { DoriLogo } from "@/components/dori-logo";

export default function QRCodePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getVisitor(id)
      .then(setVisitor)
      .catch(() => setError("Visitor not found"));
  }, [id]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  if (!visitor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div
        className="glass-strong rounded-3xl p-8 max-w-md w-full flex flex-col items-center gap-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <DoriLogo size={60} />

        <div className="text-center">
          <h1 className="text-2xl font-bold mb-1">Registration Complete!</h1>
          <p className="text-muted">
            Welcome, {visitor.first_name} {visitor.last_name}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <QRCodeSVG
            value={`DORI-VISITOR:${visitor.visitor_id}`}
            size={200}
            fgColor="#0F172A"
            bgColor="#FFFFFF"
          />
        </div>

        <div className="text-center">
          <p className="font-mono text-primary text-lg font-bold">
            {visitor.visitor_id}
          </p>
          <p className="text-muted text-sm mt-1">Your visitor pass ID</p>
        </div>

        <div className="glass rounded-xl p-4 w-full text-sm">
          <div className="flex justify-between py-1">
            <span className="text-muted">Name</span>
            <span>
              {visitor.first_name} {visitor.last_name}
            </span>
          </div>
          {visitor.company && (
            <div className="flex justify-between py-1">
              <span className="text-muted">Company</span>
              <span>{visitor.company}</span>
            </div>
          )}
          <div className="flex justify-between py-1">
            <span className="text-muted">Purpose</span>
            <span className="capitalize">
              {visitor.purpose.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={() => {
              if (!visitor.qr_code) return;
              const link = document.createElement("a");
              link.href = `data:image/png;base64,${visitor.qr_code}`;
              link.download = `${visitor.visitor_id}.png`;
              link.click();
            }}
            className="flex-1 py-3 rounded-xl bg-surface hover:bg-surface-light text-foreground font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Save QR
          </button>
          <button
            onClick={() => router.push("/chat")}
            className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            AI Chat
          </button>
        </div>

        <button
          onClick={() => router.push("/")}
          className="text-muted hover:text-foreground text-sm flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </button>
      </motion.div>
    </div>
  );
}
