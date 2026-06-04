"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle, AlertCircle } from "lucide-react";

export default function FaceDetectionPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"loading" | "scanning" | "detected" | "error">("loading");
  const [faceImage, setFaceImage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const video = videoRef.current;

    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
        });
        if (cancelled || !video) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        video.srcObject = stream;
        await video.play();
        if (cancelled) return;
        setStatus("scanning");

        setTimeout(() => {
          if (cancelled) return;
          const canvas = canvasRef.current;
          if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(video, 0, 0);
              setFaceImage(canvas.toDataURL("image/jpeg", 0.8));
            }
          }
          setStatus("detected");
        }, 3000);
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    init();

    return () => {
      cancelled = true;
      if (video?.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
    }
  };

  const handleContinue = () => {
    stopCamera();
    const params = faceImage ? `?face=${encodeURIComponent(faceImage)}` : "";
    router.push(`/register${params}`);
  };

  const handleSkip = () => {
    stopCamera();
    router.push("/register");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <motion.div
        className="glass-strong rounded-3xl p-8 max-w-xl w-full flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <Camera className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">Face Detection</h1>
        </div>

        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-surface">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            playsInline
          />
          <canvas ref={canvasRef} className="hidden" />

          {status === "scanning" && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="w-48 h-48 border-4 border-primary rounded-3xl"
                animate={{ scale: [1, 1.05, 1], borderColor: ["#3B82F6", "#60A5FA", "#3B82F6"] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            {status === "loading" && (
              <span className="glass px-4 py-2 rounded-full text-sm text-muted">
                Starting camera...
              </span>
            )}
            {status === "scanning" && (
              <motion.span
                className="glass px-4 py-2 rounded-full text-sm text-primary flex items-center gap-2"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="w-2 h-2 bg-primary rounded-full" />
                Scanning for face...
              </motion.span>
            )}
            {status === "detected" && (
              <motion.span
                className="glass px-4 py-2 rounded-full text-sm text-success flex items-center gap-2"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                <CheckCircle className="w-4 h-4" />
                Face Detected
              </motion.span>
            )}
            {status === "error" && (
              <span className="glass px-4 py-2 rounded-full text-sm text-danger flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Camera unavailable
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={handleSkip}
            className="flex-1 py-3 rounded-xl bg-surface hover:bg-surface-light text-muted font-medium transition-colors cursor-pointer"
          >
            Skip
          </button>
          <button
            onClick={handleContinue}
            disabled={status === "loading"}
            className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            {status === "detected" ? "Continue" : "Continue without face"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
