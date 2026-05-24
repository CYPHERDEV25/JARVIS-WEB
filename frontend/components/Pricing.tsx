"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    features: [
      "100 requests/day",
      "Whisper STT (medium)",
      "LLaMA 3.1 8B",
      "Coqui XTTS-v2 + Kokoro fallback",
      "14 voice tools",
      "1 API key",
    ],
    cta: "Get Started",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    features: [
      "Unlimited requests",
      "Priority Ollama queue",
      "Custom speaker WAV",
      "Usage analytics",
      "Multilingual TTS",
      "Email support",
    ],
    cta: "Coming Soon",
    href: "/signup",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: [
      "Dedicated GPU cluster",
      "SLA & SSO",
      "Custom Jarvis personality",
      "On-premise deployment",
      "White-label dashboard",
      "24/7 support",
    ],
    cta: "Contact Sales",
    href: "/signup",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 relative bg-jarvis-bg">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          className="font-display text-3xl sm:text-4xl text-center text-white mb-4 tracking-wider glow-text"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Pricing
        </motion.h2>
        <motion.p
          className="text-center text-jarvis-muted font-body mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Start free. Scale when your arc reactor demands it.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              className={`glass rounded-2xl p-8 relative card-glow ${
                tier.highlighted ? "gradient-border shadow-glow-lg" : ""
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-jarvis-warning/20 text-jarvis-warning font-display text-xs uppercase tracking-widest rounded-full border border-jarvis-warning/40">
                  Popular
                </span>
              )}
              <h3 className="font-display text-2xl text-jarvis-primary mb-2 tracking-wider">
                {tier.name}
              </h3>
              <div className="mb-6">
                <span className="font-display text-4xl text-white">{tier.price}</span>
                <span className="text-jarvis-muted font-body">{tier.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((f) => (
                  <li
                    key={f}
                    className="font-body text-jarvis-muted flex items-start gap-2 text-sm"
                  >
                    <span className="text-jarvis-secondary mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={tier.href}
                className={`block text-center py-3 rounded-lg font-display uppercase tracking-wider text-sm transition-all active:scale-95 ${
                  tier.highlighted
                    ? "btn-jarvis"
                    : tier.name === "Enterprise"
                      ? "btn-gold"
                      : "border border-jarvis-primary/30 text-jarvis-primary hover:border-jarvis-primary/60"
                }`}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
