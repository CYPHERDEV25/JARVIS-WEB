"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate login
    setTimeout(() => {
      if (email && password) {
        router.push("/dashboard");
      } else {
        setError("Invalid email or password");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090B] px-4">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-6">
            <span className="text-xl font-bold tracking-tight text-white">JARVIS</span>
            <div className="w-2 h-2 rounded-full bg-[#6366F1]"></div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-[#A1A1AA]">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#FAFAFA] mb-1">Email Address</label>
            <input
              type="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#FAFAFA] mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="input-field pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#A1A1AA] hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <div className="text-sm text-[#EF4444] mt-2">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6 flex justify-center items-center h-10"
          >
            {loading ? <span className="spinner"></span> : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#A1A1AA]">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#FAFAFA] hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
