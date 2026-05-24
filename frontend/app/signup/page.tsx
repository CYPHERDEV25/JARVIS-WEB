"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Copy, Check } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [success, setSuccess] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Simulate signup
    setTimeout(() => {
      setApiKey("jrv_sk_1a2b3c4d5e6f7g8h9i0j");
      setSuccess(true);
      setLoading(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090B] px-4">
        <div className="card w-full max-w-lg border-[#22C55E]/50">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
            <p className="text-[#A1A1AA]">Your API key has been generated.</p>
          </div>
          
          <div className="bg-[#09090B] p-4 rounded-md border border-[#27272A] mb-6">
            <div className="flex items-center justify-between">
              <code className="text-[#FAFAFA] font-mono break-all pr-4">{apiKey}</code>
              <button 
                onClick={copyToClipboard}
                className="p-2 bg-[#18181B] hover:bg-[#27272A] rounded-md transition-colors text-[#A1A1AA] hover:text-white shrink-0"
              >
                {copied ? <Check size={18} className="text-[#22C55E]" /> : <Copy size={18} />}
              </button>
            </div>
          </div>
          
          <div className="text-sm text-[#EAB308] bg-[#EAB308]/10 p-3 rounded-md mb-6 border border-[#EAB308]/20 text-center">
            Copy this key now. It will be hidden after you leave this page.
          </div>
          
          <button
            onClick={() => router.push("/dashboard")}
            className="btn-primary w-full"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090B] px-4 py-12">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-6">
            <span className="text-xl font-bold tracking-tight text-white">JARVIS</span>
            <div className="w-2 h-2 rounded-full bg-[#6366F1]"></div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-[#A1A1AA]">Start building voice AI today</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#FAFAFA] mb-1">Full Name</label>
            <input
              type="text"
              required
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

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
                minLength={8}
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

          <div>
            <label className="block text-sm font-medium text-[#FAFAFA] mb-1">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              className="input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
            />
          </div>

          {error && <div className="text-sm text-[#EF4444] mt-2">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6 flex justify-center items-center h-10"
          >
            {loading ? <span className="spinner"></span> : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#A1A1AA]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#FAFAFA] hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
