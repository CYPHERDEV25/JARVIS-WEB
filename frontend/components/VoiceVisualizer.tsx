"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export type VoiceStatus = "STANDBY" | "LISTENING..." | "PROCESSING..." | "SPEAKING...";

interface VoiceVisualizerProps {
  active?: boolean;
  status?: VoiceStatus;
  barCount?: number;
}

export default function VoiceVisualizer({
  active = false,
  status = "STANDBY",
  barCount = 28,
}: VoiceVisualizerProps) {
  const [heights, setHeights] = useState<number[]>(Array(barCount).fill(0.12));
  const isListening = status === "LISTENING...";
  const isSpeaking = status === "SPEAKING...";
  const isProcessing = status === "PROCESSING...";
  const pulseFast = isListening || isSpeaking;

  useEffect(() => {
    if (!active && !isSpeaking && !isListening) {
      setHeights(Array(barCount).fill(0.1));
      return;
    }
    const speed = pulseFast ? 80 : 200;
    const interval = setInterval(() => {
      setHeights(
        Array(barCount)
          .fill(0)
          .map(() => 0.15 + Math.random() * (pulseFast ? 0.85 : 0.35))
      );
    }, speed);
    return () => clearInterval(interval);
  }, [active, barCount, pulseFast, isListening, isSpeaking]);

  const statusColor =
    status === "STANDBY"
      ? "text-jarvis-muted"
      : isListening
        ? "text-jarvis-secondary"
        : isSpeaking
          ? "text-jarvis-warning"
          : "text-jarvis-primary";

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-6">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-jarvis-primary/30"
          animate={{
            scale: pulseFast ? [1, 1.08, 1] : [1, 1.03, 1],
            opacity: pulseFast ? [0.5, 1, 0.5] : [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: pulseFast ? 0.8 : 2.5,
            repeat: Infinity,
          }}
        />
        {isListening && (
          <motion.div
            className="absolute inset-2 rounded-full border border-dashed border-jarvis-secondary/60"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${
              isListening
                ? "bg-jarvis-secondary/20 shadow-arc"
                : isSpeaking
                  ? "bg-jarvis-warning/20"
                  : "bg-jarvis-primary/10"
            }`}
          >
            <svg
              className={`w-10 h-10 ${statusColor}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </div>
        </div>
      </div>

      <p className={`font-display text-sm tracking-[0.25em] uppercase mb-4 ${statusColor}`}>
        {status}
      </p>

      <div className="flex items-end justify-center gap-0.5 sm:gap-1 h-20 w-full max-w-md">
        {heights.map((h, i) => (
          <motion.div
            key={i}
            className="w-1 sm:w-1.5 rounded-full bg-gradient-to-t from-jarvis-primary via-jarvis-primary to-jarvis-secondary"
            animate={{ height: `${Math.max(8, h * 80)}px` }}
            transition={{ duration: 0.08 }}
            style={{
              boxShadow: active ? "0 0 8px rgba(0, 212, 255, 0.4)" : "none",
            }}
          />
        ))}
      </div>

      {isProcessing && (
        <motion.p
          className="text-jarvis-primary font-mono text-xs mt-3"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          Analyzing audio stream...
        </motion.p>
      )}
    </div>
  );
}
