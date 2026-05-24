"use client";

import React, { useState } from 'react';
import { usePortal, ApiKey } from '../PortalContext';
import { Key, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function GlobalKeysPage() {
  const { projects, updateProject, showToast } = usePortal();
  
  // Flatten keys from all projects, attaching project name/id
  const allKeys = projects.flatMap(p => 
    p.keys.map(k => ({ ...k, projectId: p.id, projectName: p.name }))
  );
  
  const [revealedKeyIds, setRevealedKeyIds] = useState<string[]>([]);

  const revealKey = (keyId: string) => {
    setRevealedKeyIds(prev => [...prev, keyId]);
    setTimeout(() => {
      setRevealedKeyIds(prev => prev.filter(id => id !== keyId));
    }, 5000);
  };

  const handleDeleteKey = (projectId: string, keyId: string) => {
    if (confirm('Are you sure you want to delete this API key? This will immediately disable any applications using it.')) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        updateProject(projectId, { keys: project.keys.filter(k => k.id !== keyId) });
        showToast('API key deleted', 'success');
      }
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto animate-[fadeIn_0.3s_ease-out]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0d0d0d] tracking-tight">Global API Keys</h1>
        <p className="text-[#6b6b6b] mt-1 text-[15px]">View and manage all API keys across all your projects</p>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f7f7f8] border-b border-[#e5e5e5]">
              <th className="px-5 py-3 text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider">Name</th>
              <th className="px-5 py-3 text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider">Project</th>
              <th className="px-5 py-3 text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider">Secret Key</th>
              <th className="px-5 py-3 text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider">Created</th>
              <th className="px-5 py-3 text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider">Last Used</th>
              <th className="px-5 py-3 text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allKeys.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-[#6b6b6b] text-[14px]">
                  <div className="w-12 h-12 bg-[#f7f7f8] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Key size={20} className="text-[#e5e5e5]" />
                  </div>
                  No API keys found across any projects.
                </td>
              </tr>
            ) : (
              allKeys.map(k => (
                <tr key={k.id} className="border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors group">
                  <td className="px-5 py-3 text-[14px] font-medium text-[#0d0d0d]">{k.name}</td>
                  <td className="px-5 py-3 text-[13px]">
                    <Link href={`/api-portal/projects/${k.projectId}`} className="text-[#10a37f] hover:underline">
                      {k.projectName}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-[13px] font-mono text-[#0d0d0d]">
                    {revealedKeyIds.includes(k.id) ? k.fullKey : k.maskedKey}
                  </td>
                  <td className="px-5 py-3 text-[13px] text-[#6b6b6b]">{k.created}</td>
                  <td className="px-5 py-3 text-[13px] text-[#6b6b6b]">{k.lastUsed}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => revealKey(k.id)}
                        className="text-[#6b6b6b] hover:text-[#0d0d0d]"
                        title="Reveal for 5s"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteKey(k.projectId, k.id)}
                        className="text-[#6b6b6b] hover:text-red-500"
                        title="Delete Key"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
