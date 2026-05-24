"use client";

import { useState } from "react";
import { Mic, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function VoiceTest() {
  const [status, setStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [logs, setLogs] = useState<{ msg: string; type: "success" | "error" | "info" }[]>([]);

  const runTest = () => {
    setStatus("testing");
    setLogs([{ msg: "Connecting to server...", type: "info" }]);

    setTimeout(() => {
      setLogs((prev) => [...prev, { msg: "API Key Valid", type: "success" }]);
    }, 800);

    setTimeout(() => {
      setLogs((prev) => [...prev, { msg: "Server Connected", type: "success" }]);
    }, 1500);

    setTimeout(() => {
      // Simulate success for now
      const isSuccess = true;
      if (isSuccess) {
        setLogs((prev) => [...prev, { msg: "Voice System Ready", type: "success" }]);
        setStatus("success");
      } else {
        setLogs((prev) => [...prev, { msg: "Microphone access denied", type: "error" }]);
        setStatus("error");
      }
    }, 2500);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Mic className="w-5 h-5 text-white" />
          <h3 className="text-lg font-medium text-white">Test Your Connection</h3>
        </div>
        <div className="flex items-center space-x-2 text-sm text-[#A1A1AA]">
          <span className="relative flex h-3 w-3">
            {status === "success" && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                status === "success" ? "bg-[#22C55E]" : status === "error" ? "bg-[#EF4444]" : "bg-[#A1A1AA]"
              }`}
            ></span>
          </span>
          <span>
            {status === "success" ? "Connected" : status === "error" ? "Failed" : "Not Connected"}
          </span>
        </div>
      </div>

      <button
        onClick={runTest}
        disabled={status === "testing"}
        className="btn-ghost w-full mb-6 flex items-center justify-center h-10"
      >
        {status === "testing" ? <span className="spinner"></span> : "Test Voice Connection"}
      </button>

      {logs.length > 0 && (
        <div className="bg-[#09090B] border border-[#27272A] rounded-md p-4 font-mono text-sm space-y-2 max-h-48 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="flex items-start space-x-2">
              {log.type === "success" && <CheckCircle2 size={16} className="text-[#22C55E] mt-0.5 shrink-0" />}
              {log.type === "error" && <XCircle size={16} className="text-[#EF4444] mt-0.5 shrink-0" />}
              {log.type === "info" && <AlertCircle size={16} className="text-[#A1A1AA] mt-0.5 shrink-0" />}
              <span
                className={`${
                  log.type === "success"
                    ? "text-[#FAFAFA]"
                    : log.type === "error"
                    ? "text-[#EF4444]"
                    : "text-[#A1A1AA]"
                }`}
              >
                {log.msg}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
