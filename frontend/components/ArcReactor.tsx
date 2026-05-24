"use client";

import { motion } from "framer-motion";

interface ArcReactorProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-16 h-16",
  md: "w-32 h-32",
  lg: "w-48 h-48 sm:w-64 sm:h-64",
};

/** Pulsing arc reactor SVG for hero and dashboard. */
export default function ArcReactor({ size = "lg", className = "" }: ArcReactorProps) {
  return (
    <motion.div
      className={`relative mx-auto ${sizes[size]} ${className}`}
      animate={{ scale: [1, 1.04, 1] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-arc">
        <defs>
          <radialGradient id="arcGlowMain" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00FF88" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#00D4FF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
          </radialGradient>
          <filter id="arcBlur">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="100" cy="100" r="92" fill="none" stroke="#00D4FF" strokeWidth="1" opacity="0.25" />
        <motion.circle
          cx="100"
          cy="100"
          r="78"
          fill="none"
          stroke="#00D4FF"
          strokeWidth="2"
          strokeDasharray="10 6"
          opacity="0.55"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "100px 100px" }}
        />
        <motion.circle
          cx="100"
          cy="100"
          r="52"
          fill="url(#arcGlowMain)"
          filter="url(#arcBlur)"
          animate={{ opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <circle cx="100" cy="100" r="28" fill="#00FF88" opacity="0.85" />
        <motion.circle
          cx="100"
          cy="100"
          r="14"
          fill="#FFFFFF"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <line
            key={i}
            x1="100"
            y1="100"
            x2={100 + 88 * Math.cos((angle * Math.PI) / 180)}
            y2={100 + 88 * Math.sin((angle * Math.PI) / 180)}
            stroke="#00D4FF"
            strokeWidth="1"
            opacity="0.35"
          />
        ))}
      </svg>
    </motion.div>
  );
}
