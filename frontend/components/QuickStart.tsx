"use client";

import { useState } from "react";
import { Terminal } from "lucide-react";

export default function QuickStart() {
  const [activeTab, setActiveTab] = useState<"installation" | "usage" | "examples">("installation");

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-white">Quick Start Guide</h3>
        <div className="flex bg-[#09090B] p-1 rounded-md border border-[#27272A]">
          <button
            onClick={() => setActiveTab("installation")}
            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
              activeTab === "installation" ? "bg-[#27272A] text-white" : "text-[#A1A1AA] hover:text-white"
            }`}
          >
            Installation
          </button>
          <button
            onClick={() => setActiveTab("usage")}
            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
              activeTab === "usage" ? "bg-[#27272A] text-white" : "text-[#A1A1AA] hover:text-white"
            }`}
          >
            Usage
          </button>
          <button
            onClick={() => setActiveTab("examples")}
            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
              activeTab === "examples" ? "bg-[#27272A] text-white" : "text-[#A1A1AA] hover:text-white"
            }`}
          >
            Examples
          </button>
        </div>
      </div>

      <div className="bg-[#09090B] border border-[#27272A] rounded-md p-4 min-h-[300px]">
        {activeTab === "installation" && (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-[#A1A1AA] mb-2 font-medium">Step 1: Download agent files</p>
              <div className="bg-[#18181B] p-3 rounded border border-[#27272A] font-mono text-sm text-[#FAFAFA]">
                <div><span className="text-[#A1A1AA]"># Clone or download agent folder</span></div>
                <div>cd agent</div>
                <div>pip install -r requirements.txt</div>
              </div>
            </div>
            <div>
              <p className="text-sm text-[#A1A1AA] mb-2 font-medium">Step 2: Configure API key</p>
              <div className="bg-[#18181B] p-3 rounded border border-[#27272A] font-mono text-sm text-[#FAFAFA]">
                <div>cp .env.example .env</div>
                <div><span className="text-[#A1A1AA]"># Edit .env and add your key:</span></div>
                <div>JARVIS_API_KEY=jrv_sk_your_key_here</div>
                <div>JARVIS_SERVER=wss://your-server.com</div>
              </div>
            </div>
            <div>
              <p className="text-sm text-[#A1A1AA] mb-2 font-medium">Step 3: Run Jarvis</p>
              <div className="bg-[#18181B] p-3 rounded border border-[#27272A] font-mono text-sm text-[#FAFAFA]">
                <div>python jarvis_agent.py</div>
                <div><span className="text-[#A1A1AA]"># Jarvis will start listening!</span></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "usage" && (
          <div>
            <p className="text-sm text-[#A1A1AA] mb-4 font-medium">Example Conversation Flow:</p>
            <div className="bg-[#18181B] p-4 rounded border border-[#27272A] font-mono text-sm leading-relaxed">
              <div className="text-[#22C55E]">&gt; JARVIS ONLINE</div>
              <div className="text-[#6366F1] mt-2">&gt; [LISTENING - Speak in any language...]</div>
              <div className="text-white mt-4">&gt; YOU: What time is it?</div>
              <div className="text-[#A1A1AA] mt-2">&gt; JARVIS: It is 3:45 PM, Sir.</div>
              <div className="text-[#6366F1] mt-4">&gt; [LISTENING - Speak in any language...]</div>
            </div>
          </div>
        )}

        {activeTab === "examples" && (
          <div>
            <p className="text-sm text-[#A1A1AA] mb-4 font-medium">Common voice commands and capabilities:</p>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-[#FAFAFA]">
                <Terminal className="w-4 h-4 text-[#6366F1] mr-3" />
                <span className="font-mono bg-[#18181B] px-2 py-1 rounded border border-[#27272A]">"What time is it?"</span>
              </li>
              <li className="flex items-center text-sm text-[#FAFAFA]">
                <Terminal className="w-4 h-4 text-[#6366F1] mr-3" />
                <span className="font-mono bg-[#18181B] px-2 py-1 rounded border border-[#27272A]">"What's the weather in Mumbai?"</span>
              </li>
              <li className="flex items-center text-sm text-[#FAFAFA]">
                <Terminal className="w-4 h-4 text-[#6366F1] mr-3" />
                <span className="font-mono bg-[#18181B] px-2 py-1 rounded border border-[#27272A]">"Calculate 25 times 48"</span>
              </li>
              <li className="flex items-center text-sm text-[#FAFAFA]">
                <Terminal className="w-4 h-4 text-[#6366F1] mr-3" />
                <span className="font-mono bg-[#18181B] px-2 py-1 rounded border border-[#27272A]">"Tell me a joke"</span>
              </li>
              <li className="flex items-center text-sm text-[#FAFAFA]">
                <Terminal className="w-4 h-4 text-[#6366F1] mr-3" />
                <span className="font-mono bg-[#18181B] px-2 py-1 rounded border border-[#27272A]">"What is Python programming?"</span>
              </li>
              <li className="flex items-center text-sm text-[#FAFAFA]">
                <Terminal className="w-4 h-4 text-[#6366F1] mr-3" />
                <span className="font-mono bg-[#18181B] px-2 py-1 rounded border border-[#27272A]">"Open calculator"</span>
              </li>
              <li className="flex items-center text-sm text-[#FAFAFA]">
                <Terminal className="w-4 h-4 text-[#6366F1] mr-3" />
                <span className="font-mono bg-[#18181B] px-2 py-1 rounded border border-[#27272A]">"Remind me in 10 minutes"</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
