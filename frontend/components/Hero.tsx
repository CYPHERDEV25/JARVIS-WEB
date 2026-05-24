"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ArcReactor from "@/components/ArcReactor";
import ParticleBackground from "@/components/ParticleBackground";

const SUBTITLE = "Just A Rather Very Intelligent System";

export default function Hero() {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= SUBTITLE.length) {
        setDisplayText(SUBTITLE.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 55);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const blink = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(blink);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-jarvis-bg">
      <ParticleBackground className="opacity-50" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center page-fade-in">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <ArcReactor size="lg" />
        </motion.div>

        <motion.h1
          className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-[0.2em] glow-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          J.A.R.V.I.S
          <span
            className={`inline-block w-[3px] h-[0.85em] bg-jarvis-primary ml-1 align-middle ${
              showCursor ? "opacity-100" : "opacity-0"
            }`}
          />
        </motion.h1>

        <motion.p
          className="font-body text-lg sm:text-2xl text-jarvis-muted mb-12 min-h-[2rem]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {displayText}
          <span className="text-jarvis-primary">{showCursor ? "|" : ""}</span>
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {["98 Languages", "Voice AI", "Self-hosted", "Iron Man UX"].map((tag, i) => (
            <motion.div
              key={tag}
              className="glass card-glow rounded-lg px-5 py-2 font-display text-xs uppercase tracking-widest text-jarvis-primary"
              whileHover={{ scale: 1.06, boxShadow: "0 0 28px rgba(0,212,255,0.35)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
            >
              {tag}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Link href="/signup" className="btn-jarvis inline-block text-base px-10 py-4">
            Initialize System
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
