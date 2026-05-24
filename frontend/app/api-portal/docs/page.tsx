"use client";

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { usePortal } from '../PortalContext';

export default function DocsPage() {
  return (
    <div className="p-8 lg:p-12 max-w-4xl mx-auto animate-[fadeIn_0.3s_ease-out]">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-[#0d0d0d] tracking-tight mb-2">API Reference</h1>
        <p className="text-[#6b6b6b] text-[16px]">Use your Jarvis API keys to authenticate requests and integrate AI into your apps.</p>
      </div>

      <div className="space-y-16">
        
        {/* Authentication */}
        <section id="authentication">
          <h2 className="text-xl font-bold text-[#0d0d0d] mb-4 pb-2 border-b border-[#e5e5e5]">Authentication</h2>
          <p className="text-[14px] text-[#6b6b6b] mb-4 leading-relaxed">
            The Jarvis API uses API keys for authentication. Visit your <a href="/api-portal/keys" className="text-[#10a37f] hover:underline">API Keys page</a> to retrieve the API key you'll use in your requests.
          </p>
          <p className="text-[14px] text-[#6b6b6b] mb-4 leading-relaxed">
            <strong>Remember that your API key is a secret!</strong> Do not share it with others or expose it in any client-side code (browsers, apps). Production requests must be routed through your own backend server.
          </p>
          <CodeBlock code="Authorization: Bearer sk-jar-xxxxxxxxxxxxx" />
        </section>

        {/* Base URL */}
        <section id="quickstart">
          <h2 className="text-xl font-bold text-[#0d0d0d] mb-4 pb-2 border-b border-[#e5e5e5]">Base URL</h2>
          <p className="text-[14px] text-[#6b6b6b] mb-4 leading-relaxed">
            All API endpoints are relative to the following base URL:
          </p>
          <CodeBlock code="http://localhost:3000/api/v1" />
        </section>

        {/* Endpoints */}
        <section>
          <h2 className="text-xl font-bold text-[#0d0d0d] mb-8 pb-2 border-b border-[#e5e5e5]">Endpoints</h2>

          {/* Create Chat Completion */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md text-[12px] font-bold tracking-wide">POST</span>
              <span className="font-mono text-[15px] font-semibold text-[#0d0d0d]">/chat/completions</span>
            </div>
            <p className="text-[14px] text-[#6b6b6b] mb-6">Creates a model response for the given chat conversation.</p>
            
            <h4 className="text-[13px] font-bold text-[#0d0d0d] mb-2 uppercase tracking-wide">Example Request</h4>
            <CodeBlock 
              language="bash"
              code={`curl http://localhost:3000/api/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $JARVIS_API_KEY" \\
  -d '{
    "model": "jarvis-1",
    "messages": [
      {
        "role": "user",
        "content": "Hello!"
      }
    ]
  }'`} 
            />

            <h4 className="text-[13px] font-bold text-[#0d0d0d] mb-2 mt-6 uppercase tracking-wide">Example Response</h4>
            <CodeBlock 
              language="json"
              code={`{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "jarvis-1",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "Hello there, how may I assist you today?"
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}`} 
            />
          </div>

          {/* List Models */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-[12px] font-bold tracking-wide">GET</span>
              <span className="font-mono text-[15px] font-semibold text-[#0d0d0d]">/models</span>
            </div>
            <p className="text-[14px] text-[#6b6b6b] mb-6">Lists the currently available models, and provides basic information about each one.</p>
            
            <h4 className="text-[13px] font-bold text-[#0d0d0d] mb-2 uppercase tracking-wide">Example Request</h4>
            <CodeBlock 
              language="bash"
              code={`curl http://localhost:3000/api/v1/models \\
  -H "Authorization: Bearer $JARVIS_API_KEY"`} 
            />
          </div>

        </section>

      </div>
    </div>
  );
}

function CodeBlock({ code, language = 'text' }: { code: string, language?: string }) {
  const { showToast } = usePortal();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast('Code copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden bg-[#0d0d0d] border border-[#2a2a2a] my-2">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handleCopy}
          className="bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-md backdrop-blur-sm transition-colors"
        >
          {copied ? <Check size={14} className="text-[#10a37f]" /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed text-[#e8e8f0] font-mono custom-scrollbar">
        <code>{code}</code>
      </pre>
    </div>
  );
}
