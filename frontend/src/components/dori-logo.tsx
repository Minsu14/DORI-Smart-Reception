"use client";

import { motion } from "framer-motion";

export function DoriLogo({ size = 80 }: { size?: number }) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex items-center justify-center"
    >
      <div
        className="relative rounded-2xl bg-primary flex items-center justify-center font-bold text-white"
        style={{ width: size, height: size, fontSize: size * 0.35 }}
      >
        <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl" />
        <span className="relative z-10 tracking-wider">DORI</span>
      </div>
    </motion.div>
  );
}
