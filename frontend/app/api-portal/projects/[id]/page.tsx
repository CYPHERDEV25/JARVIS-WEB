"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { usePortal, ApiKey, Project } from '../../PortalContext';
import { ArrowLeft, Folder, Eye, Trash2, Copy, Check, AlertTriangle } from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const { projects, updateProject, deleteProject, showToast } = usePortal();
  const project = projects.find(p => p.id === projectId);
  
  const [activeTab, setActiveTab] = useState<'keys' | 'usage' | 'settings'>('keys');

  // Modals & State
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showRevealModal, setShowRevealModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newPermission, setNewPermission] = useState('all');
  const [latestKey, setLatestKey] = useState<ApiKey | null>(null);
  
  const [copiedKey, setCopiedKey] = useState(false);
  
  // Settings Tab
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  // Revealed keys timer
  const [revealedKeyIds, setRevealedKeyIds] = useState<string[]>([]);

  useEffect(() => {
    if (project) {
      setEditName(project.name);
      setEditDesc(project.description);
    }
  }, [project]);

  if (!project) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold">Project not found</h2>
        <Link href="/api-portal/projects" className="text-[#10a37f] hover:underline mt-4 inline-block">Return to Projects</Link>
      </div>
    );
  }

  const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'sk-jar-';
    for (let i = 0; i < 24; i++) {
      key += chars[Math.floor(Math.random() * chars.length)];
    }
    return key;
  };

  const handleCreateKey = () => {
    const fullKey = generateApiKey();
    const newKey: ApiKey = {
      id: 'key_' + Math.random().toString(36).substr(2, 9),
      name: newKeyName.trim() || 'Secret key',
      fullKey,
      maskedKey: fullKey.substring(0, 10) + '...' + fullKey.slice(-4),
      permissions: newPermission,
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastUsed: 'Never'
    };
    
    updateProject(projectId, { keys: [...project.keys, newKey] });
    setLatestKey(newKey);
    setShowKeyModal(false);
    setShowRevealModal(true);
    setNewKeyName('');
    showToast('API key created', 'success');
  };

  const handleCopyKey = () => {
    if (latestKey) {
      navigator.clipboard.writeText(latestKey.fullKey);
      setCopiedKey(true);
      showToast('Key copied to clipboard', 'success');
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const revealKey = (keyId: string) => {
    setRevealedKeyIds(prev => [...prev, keyId]);
    setTimeout(() => {
      setRevealedKeyIds(prev => prev.filter(id => id !== keyId));
    }, 5000);
  };

  const handleDeleteKey = (keyId: string) => {
    if (confirm('Are you sure you want to delete this API key? This will immediately disable any applications using it.')) {
      updateProject(projectId, { keys: project.keys.filter(k => k.id !== keyId) });
      showToast('API key deleted', 'success');
    }
  };

  const handleSaveSettings = () => {
    updateProject(projectId, { name: editName, description: editDesc });
    showToast('Project updated successfully', 'success');
  };

  const handleDeleteProject = () => {
    if (deleteConfirmText === project.name) {
      deleteProject(projectId);
      showToast('Project deleted successfully', 'success');
      router.push('/api-portal/projects');
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto animate-[fadeIn_0.3s_ease-out]">
      <Link href="/api-portal/projects" className="inline-flex items-center gap-2 text-[#6b6b6b] hover:text-[#0d0d0d] text-[13px] font-medium mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Projects
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Folder size={24} className="text-[#6b6b6b]" />
          <h1 className="text-2xl font-bold text-[#0d0d0d] tracking-tight">{project.name}</h1>
        </div>
        <p className="text-[#6b6b6b] mt-2 text-[14px]">Created: {project.created}</p>
      </div>

      <div className="flex items-center gap-6 border-b border-[#e5e5e5] mb-8">
        {[
          { id: 'keys', label: '🔑 API Keys' },
          { id: 'usage', label: '📊 Usage' },
          { id: 'settings', label: '⚙️ Settings' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-[14px] font-medium transition-colors border-b-2 ${
              activeTab === tab.id 
                ? 'border-[#0d0d0d] text-[#0d0d0d]' 
                : 'border-transparent text-[#6b6b6b] hover:text-[#0d0d0d]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'keys' && (
        <div className="animate-[fadeIn_0.2s_ease-out]">
          <h2 className="text-lg font-bold text-[#0d0d0d] mb-1">API Keys</h2>
          <p className="text-[14px] text-[#6b6b6b] mb-6">Keys belong to this project. Usage is tracked separately per key.</p>

          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md text-[13px] mb-6 flex items-start gap-3">
            <span className="text-amber-500 mt-0.5">⚠️</span>
            <div>
              <strong>Never share your API keys publicly.</strong> Use environment variables or a secret management service to keep them safe.
            </div>
          </div>

          <div className="bg-white border border-[#e5e5e5] rounded-lg overflow-hidden mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f7f7f8] border-b border-[#e5e5e5]">
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider">Secret Key</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider">Created</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider">Last Used</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {project.keys.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-[#6b6b6b] text-[13px]">No API keys found.</td>
                  </tr>
                ) : (
                  project.keys.map(k => (
                    <tr key={k.id} className="border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors group">
                      <td className="px-5 py-3 text-[14px] font-medium text-[#0d0d0d]">{k.name}</td>
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
                            onClick={() => handleDeleteKey(k.id)}
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

          <button 
            onClick={() => setShowKeyModal(true)}
            className="border border-[#10a37f] text-[#10a37f] hover:bg-[#10a37f]/5 px-4 py-2 rounded-md text-[14px] font-medium transition-colors"
          >
            + Create new secret key
          </button>
        </div>
      )}

      {activeTab === 'usage' && (
        <div className="animate-[fadeIn_0.2s_ease-out]">
          <h2 className="text-lg font-bold text-[#0d0d0d] mb-6">Usage</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-[#e5e5e5] rounded-xl p-5 shadow-sm">
              <div className="text-[13px] text-[#6b6b6b] mb-1 font-medium uppercase tracking-wide">Total Calls</div>
              <div className="text-2xl font-bold text-[#0d0d0d] mb-2">{project.usageData.reduce((a,b)=>a+b,0).toLocaleString()}</div>
              <div className="text-[12px] text-[#10a37f] font-medium flex items-center gap-1">↑ 12% from last week</div>
            </div>
            <div className="bg-white border border-[#e5e5e5] rounded-xl p-5 shadow-sm">
              <div className="text-[13px] text-[#6b6b6b] mb-1 font-medium uppercase tracking-wide">Avg Daily</div>
              <div className="text-2xl font-bold text-[#0d0d0d] mb-2">{Math.floor(project.usageData.reduce((a,b)=>a+b,0)/7)}</div>
              <div className="text-[12px] text-[#10a37f] font-medium flex items-center gap-1">↑ 8% from last week</div>
            </div>
            <div className="bg-white border border-[#e5e5e5] rounded-xl p-5 shadow-sm">
              <div className="text-[13px] text-[#6b6b6b] mb-1 font-medium uppercase tracking-wide">Active Keys</div>
              <div className="text-2xl font-bold text-[#0d0d0d]">{project.keys.length}</div>
            </div>
          </div>

          <div className="bg-white border border-[#e5e5e5] rounded-xl p-6 shadow-sm">
            <h3 className="text-[14px] font-bold text-[#0d0d0d] mb-6">Last 7 Days Usage</h3>
            <div className="h-64 flex items-end justify-between gap-2 pt-4">
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => {
                const height = Math.max(10, (project.usageData[i] / 300) * 100);
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full relative flex justify-center bg-[#f7f7f8] rounded-t-md h-full items-end overflow-visible">
                      <div 
                        className="w-full bg-[#10a37f] hover:bg-[#0e906f] rounded-t-md transition-all duration-500 ease-out" 
                        style={{ height: `${height}%` }}
                      ></div>
                      {/* Tooltip */}
                      <div className="absolute -top-10 bg-[#0d0d0d] text-white text-[12px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {project.usageData[i]} calls
                      </div>
                    </div>
                    <div className="text-[12px] text-[#6b6b6b] font-medium">{day}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="animate-[fadeIn_0.2s_ease-out] max-w-2xl">
          <h2 className="text-lg font-bold text-[#0d0d0d] mb-6">Project Settings</h2>
          
          <div className="space-y-6 mb-12">
            <div>
              <label className="block text-[13px] font-semibold text-[#0d0d0d] mb-1.5">Project Name</label>
              <input 
                type="text" 
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full border border-[#e5e5e5] rounded-md px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#10a37f] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#0d0d0d] mb-1.5">Description</label>
              <textarea 
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                className="w-full border border-[#e5e5e5] rounded-md px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#10a37f] transition-colors resize-none h-20"
              />
            </div>
            <button 
              onClick={handleSaveSettings}
              className="bg-[#10a37f] hover:bg-[#0e906f] text-white px-4 py-2 rounded-md text-[14px] font-medium transition-colors"
            >
              Save changes
            </button>
          </div>

          <div className="border border-red-200 rounded-xl overflow-hidden">
            <div className="bg-red-50 px-5 py-4 border-b border-red-200">
              <h3 className="text-[15px] font-bold text-red-600 flex items-center gap-2">
                <AlertTriangle size={18} /> Danger Zone
              </h3>
            </div>
            <div className="p-5 bg-white">
              <h4 className="text-[14px] font-semibold text-[#0d0d0d] mb-1">Delete Project</h4>
              <p className="text-[13px] text-[#6b6b6b] mb-4">
                This will permanently delete the project and all its API keys. This action cannot be undone.
              </p>
              
              <div className="mb-4">
                <label className="block text-[12px] font-medium text-[#6b6b6b] mb-1.5">Type <strong>{project.name}</strong> to confirm</label>
                <input 
                  type="text" 
                  value={deleteConfirmText}
                  onChange={e => setDeleteConfirmText(e.target.value)}
                  className="w-full border border-[#e5e5e5] rounded-md px-3.5 py-2 text-[14px] focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <button 
                onClick={handleDeleteProject}
                disabled={deleteConfirmText !== project.name}
                className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-[14px] font-medium transition-colors"
              >
                Delete project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full max-w-[480px] p-8 scale-100 animate-[modalPop_0.15s_ease-out]">
            <h2 className="text-xl font-bold text-[#0d0d0d] mb-6">Create new secret key</h2>
            
            <div className="mb-6">
              <label className="block text-[13px] font-semibold text-[#0d0d0d] mb-1.5">Name <span className="text-[#6b6b6b] font-normal">(optional)</span></label>
              <input 
                type="text" 
                value={newKeyName}
                onChange={e => setNewKeyName(e.target.value)}
                placeholder="My Key"
                className="w-full border border-[#e5e5e5] rounded-md px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#10a37f] transition-colors"
                autoFocus
              />
            </div>

            <div className="mb-8">
              <label className="block text-[13px] font-semibold text-[#0d0d0d] mb-3">Permissions</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${newPermission === 'all' ? 'border-[#10a37f] bg-[#10a37f]' : 'border-[#e5e5e5] group-hover:border-[#10a37f]'}`}>
                    {newPermission === 'all' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                  </div>
                  <span className="text-[14px] text-[#0d0d0d]">All permissions</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${newPermission === 'read' ? 'border-[#10a37f] bg-[#10a37f]' : 'border-[#e5e5e5] group-hover:border-[#10a37f]'}`}>
                    {newPermission === 'read' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                  </div>
                  <span className="text-[14px] text-[#0d0d0d]">Read only</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowKeyModal(false)}
                className="border border-[#e5e5e5] hover:bg-[#f7f7f8] text-[#0d0d0d] px-4 py-2 rounded-md text-[14px] font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateKey}
                className="bg-[#10a37f] hover:bg-[#0e906f] text-white px-4 py-2 rounded-md text-[14px] font-medium transition-colors"
              >
                Create key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reveal Key Modal */}
      {showRevealModal && latestKey && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full max-w-[480px] p-8 scale-100 animate-[modalPop_0.15s_ease-out]">
            <h2 className="text-xl font-bold text-[#0d0d0d] mb-1 flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <Check size={14} strokeWidth={3} />
              </div>
              API key created
            </h2>
            <p className="text-[14px] text-[#6b6b6b] mb-6">
              Please copy your key now. For security reasons, we won't show it again after you close this.
            </p>
            
            <div className="relative mb-8">
              <input 
                type="text" 
                value={latestKey.fullKey}
                readOnly
                className="w-full border border-[#e5e5e5] bg-[#f7f7f8] rounded-md pl-3.5 pr-24 py-3 text-[13px] font-mono text-[#0d0d0d]"
              />
              <button 
                onClick={handleCopyKey}
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-white border border-[#e5e5e5] hover:bg-[#f7f7f8] px-3 rounded-md text-[13px] font-medium transition-colors flex items-center gap-1.5 shadow-sm"
              >
                {copiedKey ? <><Check size={14} className="text-[#10a37f]" /> Copied!</> : <><Copy size={14} /> Copy key</>}
              </button>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setShowRevealModal(false)}
                className="bg-[#10a37f] hover:bg-[#0e906f] text-white px-6 py-2 rounded-md text-[14px] font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
