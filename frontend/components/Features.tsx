"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "98 Languages",
    description:
      "Speak in Hindi, English, Arabic, French, Spanish, or any of 98 supported languages. Jarvis responds in your language automatically.",
    icon: "🌍",
  },
  {
    title: "Voice AI Stack",
    description:
      "Whisper medium STT, LLaMA 3.1 brain, and Coqui XTTS-v2 multilingual TTS — with Kokoro fallback for reliability.",
    icon: "🎙️",
  },
  {
    title: "Jarvis Tools",
    description:
      "Weather, time, math, Wikipedia, news, jokes, reminders, system diagnostics, screenshots, and more — all by voice.",
    icon: "🛠️",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative bg-jarvis-bg">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          className="font-display text-3xl sm:text-4xl text-center text-white mb-2 tracking-wider glow-text"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Platform Features
        </motion.h2>
        <motion.p
          className="text-center text-jarvis-muted font-body text-lg mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Iron Man-grade interface. Production-grade voice intelligence.
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="glass card-glow rounded-xl p-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-display text-lg text-jarvis-primary mb-3 tracking-[0.15em] uppercase">
                {f.title}
              </h3>
              <p className="font-body text-jarvis-muted text-sm leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
