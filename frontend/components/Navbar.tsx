"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface NavbarProps {
  userEmail?: string;
  onLogout?: () => void;
  showAuth?: boolean;
}

export default function Navbar({
  userEmail,
  onLogout,
  showAuth = true,
}: NavbarProps) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 glass border-b border-jarvis-primary/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full border border-jarvis-primary/50 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow">
            <div className="w-3 h-3 rounded-full bg-jarvis-secondary animate-pulse shadow-arc" />
          </div>
          <span className="font-display text-xl tracking-[0.2em] text-jarvis-primary">
            JARVIS
          </span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          {showAuth && (
            <>
              <Link
                href="/docs"
                className="font-body text-jarvis-muted hover:text-jarvis-primary transition-colors hidden sm:block"
              >
                Docs
              </Link>
              {userEmail ? (
                <>
                  <span className="font-body text-sm text-jarvis-muted hidden md:block truncate max-w-[220px]">
                    {userEmail}
                  </span>
                  <button
                    onClick={onLogout}
                    className="btn-gold text-xs py-2 px-4"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="font-display text-sm uppercase tracking-wider text-jarvis-muted hover:text-jarvis-primary transition-colors"
                  >
                    Login
                  </Link>
                  <Link href="/signup" className="btn-jarvis text-xs py-2 px-4">
                    Get API Key
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <div className="nav-gradient-line" aria-hidden />
    </motion.nav>
  );
}
