import Link from "next/link";
import { Book, Code, Settings, Mic, Globe, Server, Terminal } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#09090B]">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-[#09090B] border-b border-[#27272A]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-white">JARVIS</span>
            <span className="text-[#A1A1AA] text-sm hidden sm:inline ml-4 border-l border-[#27272A] pl-4">Documentation</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-sm font-medium text-[#A1A1AA] hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-[#A1A1AA] hover:text-white transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-[#27272A] hidden md:block py-8 px-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-3">Overview</h4>
              <ul className="space-y-2">
                <li><a href="#getting-started" className="flex items-center text-sm text-[#FAFAFA] hover:text-[#6366F1]"><Book className="w-4 h-4 mr-2" /> Getting Started</a></li>
                <li><a href="#installation" className="flex items-center text-sm text-[#FAFAFA] hover:text-[#6366F1]"><Terminal className="w-4 h-4 mr-2" /> Installation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-3">Core Concepts</h4>
              <ul className="space-y-2">
                <li><a href="#configuration" className="flex items-center text-sm text-[#FAFAFA] hover:text-[#6366F1]"><Settings className="w-4 h-4 mr-2" /> Configuration</a></li>
                <li><a href="#voice-commands" className="flex items-center text-sm text-[#FAFAFA] hover:text-[#6366F1]"><Mic className="w-4 h-4 mr-2" /> Voice Commands</a></li>
                <li><a href="#language-support" className="flex items-center text-sm text-[#FAFAFA] hover:text-[#6366F1]"><Globe className="w-4 h-4 mr-2" /> Language Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-3">Reference</h4>
              <ul className="space-y-2">
                <li><a href="#api-reference" className="flex items-center text-sm text-[#FAFAFA] hover:text-[#6366F1]"><Server className="w-4 h-4 mr-2" /> API Reference</a></li>
                <li><a href="#troubleshooting" className="flex items-center text-sm text-[#FAFAFA] hover:text-[#6366F1]"><Code className="w-4 h-4 mr-2" /> Troubleshooting</a></li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-10 px-6 md:px-12 max-w-4xl prose prose-invert">
          <h1 className="text-3xl font-bold text-white mb-4" id="getting-started">Documentation</h1>
          <p className="text-[#A1A1AA] text-lg mb-8">
            Learn how to integrate JARVIS Voice AI into your applications.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4" id="installation">Installation</h2>
          <p className="text-[#A1A1AA] mb-4">First, clone the agent repository and install dependencies.</p>
          <div className="bg-[#18181B] rounded-lg p-4 border border-[#27272A] mb-8 font-mono text-sm relative group">
            <pre className="text-[#FAFAFA] overflow-x-auto">
{`git clone https://github.com/your-org/jarvis.git
cd jarvis/agent
pip install -r requirements.txt`}
            </pre>
          </div>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4" id="configuration">Configuration</h2>
          <p className="text-[#A1A1AA] mb-4">Create a <code>.env</code> file in the agent directory with your API key.</p>
          <div className="bg-[#18181B] rounded-lg p-4 border border-[#27272A] mb-8 font-mono text-sm">
            <pre className="text-[#FAFAFA] overflow-x-auto">
{`JARVIS_API_KEY=jrv_sk_your_api_key_here
JARVIS_SERVER=wss://your-server.com/api/voice/ws`}
            </pre>
          </div>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4" id="voice-commands">Voice Commands</h2>
          <p className="text-[#A1A1AA] mb-4">JARVIS supports standard conversational AI, plus built-in commands:</p>
          <div className="border border-[#27272A] rounded-lg overflow-hidden mb-8">
            <table className="w-full text-left text-sm text-[#FAFAFA]">
              <thead className="bg-[#18181B] border-b border-[#27272A]">
                <tr>
                  <th className="px-4 py-3 font-medium">Command</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                <tr><td className="px-4 py-3 font-mono">"What time is it?"</td><td className="px-4 py-3">Triggers the get_time tool.</td></tr>
                <tr><td className="px-4 py-3 font-mono">"Calculate 25 times 4"</td><td className="px-4 py-3">Safe math evaluation.</td></tr>
                <tr><td className="px-4 py-3 font-mono">"Clear history"</td><td className="px-4 py-3">Resets the conversation buffer.</td></tr>
                <tr><td className="px-4 py-3 font-mono">"Shutdown"</td><td className="px-4 py-3">Terminates the local agent.</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4" id="api-reference">API Reference</h2>
          <p className="text-[#A1A1AA] mb-4">You can connect directly via WebSocket.</p>
          <div className="bg-[#18181B] rounded-lg p-4 border border-[#27272A] mb-8 font-mono text-sm">
            <pre className="text-[#FAFAFA] overflow-x-auto">
{`WS /api/voice/ws?key={API_KEY}

# Message Format
{
  "type": "audio",
  "audio": "<base64_encoded_wav>"
}`}
            </pre>
          </div>
        </main>
      </div>
    </div>
  );
}
