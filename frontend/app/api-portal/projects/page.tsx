"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePortal, Project } from '../PortalContext';
import { Folder, Plus } from 'lucide-react';

export default function ProjectsPage() {
  const { projects, addProject, showToast } = usePortal();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    
    const newProject: Project = {
      id: 'proj_' + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      description: description.trim(),
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      keys: [],
      usageData: Array.from({length: 7}, () => Math.floor(Math.random() * 200) + 50)
    };
    
    addProject(newProject);
    showToast('Project created successfully', 'success');
    setShowModal(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto animate-[fadeIn_0.3s_ease-out]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0d0d0d] tracking-tight">Projects</h1>
          <p className="text-[#6b6b6b] mt-1 text-[15px]">Organize your API keys and usage by project</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#10a37f] hover:bg-[#0e906f] text-white px-4 py-2 rounded-md text-[14px] font-medium transition-colors"
        >
          + Create project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-24">
          <div className="w-16 h-16 bg-[#f7f7f8] rounded-full flex items-center justify-center mb-4">
            <Folder size={32} className="text-[#e5e5e5]" />
          </div>
          <h3 className="text-[16px] font-semibold text-[#0d0d0d] mb-1">No projects yet</h3>
          <p className="text-[#6b6b6b] text-[14px] mb-6">Create a project to organize your API keys</p>
          <button 
            onClick={() => setShowModal(true)}
            className="border border-[#e5e5e5] hover:bg-[#f7f7f8] text-[#0d0d0d] px-4 py-2 rounded-md text-[14px] font-medium transition-colors shadow-sm"
          >
            + Create your first project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(p => (
            <div key={p.id} className="bg-white border border-[#e5e5e5] rounded-xl p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all flex flex-col group">
              <div className="flex items-center gap-2 mb-4">
                <Folder size={18} className="text-[#6b6b6b]" />
                <h3 className="font-semibold text-[#0d0d0d] text-[15px]">{p.name}</h3>
              </div>
              <div className="text-[13px] text-[#6b6b6b] mb-4 flex-1">
                <div className="mb-1">Created: {p.created}</div>
                <div>Keys: {p.keys.length}  |  Requests: {p.usageData.reduce((a,b)=>a+b, 0).toLocaleString()}</div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-[#f0f0f0]">
                <Link 
                  href={`/api-portal/projects/${p.id}`}
                  className="bg-[#f7f7f8] hover:bg-[#ececec] text-[#0d0d0d] px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors"
                >
                  Open
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full max-w-[480px] p-8 scale-100 animate-[modalPop_0.15s_ease-out]">
            <h2 className="text-xl font-bold text-[#0d0d0d] mb-1">Create a new project</h2>
            <p className="text-[14px] text-[#6b6b6b] mb-6">Projects help you organize API keys by app or team</p>
            
            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-[#0d0d0d] mb-1.5">Project name *</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="My App"
                className="w-full border border-[#e5e5e5] rounded-md px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#10a37f] transition-colors"
                autoFocus
              />
            </div>

            <div className="mb-8">
              <label className="block text-[13px] font-semibold text-[#0d0d0d] mb-1.5">Description <span className="text-[#6b6b6b] font-normal">(optional)</span></label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Main application backend"
                className="w-full border border-[#e5e5e5] rounded-md px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#10a37f] transition-colors resize-none h-20"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="border border-[#e5e5e5] hover:bg-[#f7f7f8] text-[#0d0d0d] px-4 py-2 rounded-md text-[14px] font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreate}
                disabled={!name.trim()}
                className="bg-[#10a37f] hover:bg-[#0e906f] disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-[14px] font-medium transition-colors"
              >
                Create project
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes modalPop {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
}
