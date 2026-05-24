"use client";

import Sidebar from "@/components/Sidebar";
import { Copy, Trash2, Plus } from "lucide-react";

export default function KeysPage() {
  const keys = [
    {
      id: 1,
      name: "Default Key",
      key: "jrv_sk_••••••••••••••••••••••",
      created: "May 23, 2026",
      lastUsed: "2 minutes ago",
      status: "ACTIVE"
    }
  ];

  return (
    <div className="flex h-screen bg-[#09090B] overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">API Keys</h1>
              <p className="text-[#A1A1AA]">Manage your API keys for authentication</p>
            </div>
            <button className="btn-primary flex items-center gap-2">
              <Plus size={18} />
              Create New Key
            </button>
          </div>

          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#FAFAFA]">
                <thead className="bg-[#09090B] text-[#A1A1AA] uppercase border-b border-[#27272A]">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Key</th>
                    <th className="px-6 py-4 font-medium">Created</th>
                    <th className="px-6 py-4 font-medium">Last Used</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272A]">
                  {keys.map((k) => (
                    <tr key={k.id} className="hover:bg-[#27272A]/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{k.name}</td>
                      <td className="px-6 py-4 font-mono text-[#A1A1AA]">{k.key}</td>
                      <td className="px-6 py-4">{k.created}</td>
                      <td className="px-6 py-4">{k.lastUsed}</td>
                      <td className="px-6 py-4">
                        <span className={k.status === "ACTIVE" ? "badge-active" : "badge-inactive"}>
                          {k.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end space-x-2">
                        <button className="p-2 text-[#A1A1AA] hover:text-white transition-colors" title="Copy">
                          <Copy size={16} />
                        </button>
                        <button className="p-2 text-[#A1A1AA] hover:text-[#EF4444] transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
