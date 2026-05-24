"use client";

import { useState } from "react";
import { Key, Eye, EyeOff, Copy, AlertTriangle, Check } from "lucide-react";

export default function ApiKeyCard() {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const actualKey = "jrv_sk_1a2b3c4d5e6f7g8h9i0j";
  const maskedKey = "jrv_sk_" + "•".repeat(20);

  const handleCopy = () => {
    navigator.clipboard.writeText(actualKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="card">
        <div className="flex items-center space-x-2 mb-2">
          <Key className="w-5 h-5 text-white" />
          <h3 className="text-lg font-medium text-white">Your API Key</h3>
        </div>
        <p className="text-sm text-[#A1A1AA] mb-6">
          Use this key in your <code className="text-[#FAFAFA] bg-[#27272A] px-1 rounded">jarvis_agent.py</code> file
        </p>

        <div className="flex items-center space-x-2 mb-4">
          <div className="flex-1 bg-[#09090B] border border-[#27272A] rounded-md px-4 py-2 font-mono text-sm text-[#FAFAFA] flex items-center justify-between">
            <span>{showKey ? actualKey : maskedKey}</span>
            <div className="flex items-center space-x-3 text-[#A1A1AA]">
              <button onClick={() => setShowKey(!showKey)} className="hover:text-white transition-colors" title={showKey ? "Hide" : "Show"}>
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button onClick={handleCopy} className="hover:text-white transition-colors" title="Copy">
                {copied ? <Check size={16} className="text-[#22C55E]" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-[#EAB308] bg-[#EAB308]/10 p-3 rounded-md mb-6 border border-[#EAB308]/20">
          <AlertTriangle size={14} />
          <span>Keep this key secret. Don&apos;t share publicly.</span>
        </div>

        <div className="flex space-x-4">
          <button 
            onClick={() => setShowKey(!showKey)} 
            className="btn-ghost text-sm"
          >
            {showKey ? "Hide Key" : "Show Key"}
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-danger text-sm"
          >
            Regenerate Key
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="card w-full max-w-sm">
            <h3 className="text-xl font-bold text-white mb-2">Regenerate API Key</h3>
            <p className="text-sm text-[#A1A1AA] mb-6">
              Are you sure? Your old key will stop working immediately and any agents using it will be disconnected.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowModal(false)}
                className="btn-ghost text-sm px-4 py-2"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="btn-danger text-sm px-4 py-2 bg-[#EF4444] text-white hover:bg-red-600"
              >
                Yes, Regenerate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
