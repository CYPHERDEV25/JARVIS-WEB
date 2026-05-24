"use client";

import React, { useRef } from 'react';
import { usePortal } from '../PortalContext';
import { Download, Upload, AlertTriangle } from 'lucide-react';

export default function GlobalSettingsPage() {
  const { settings, updateSettings, projects, resetAllData, showToast } = usePortal();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = {
      projects,
      settings
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "jarvis_portal_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showToast('Data exported successfully', 'success');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        if (data.projects && data.settings) {
          localStorage.setItem('jarvis-projects', JSON.stringify(data.projects));
          localStorage.setItem('jarvis-portal-settings', JSON.stringify(data.settings));
          showToast('Data imported! Reloading...', 'success');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          showToast('Invalid backup file', 'error');
        }
      } catch (err) {
        showToast('Failed to parse JSON file', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Are you absolutely sure you want to delete ALL projects, keys, and settings? This cannot be undone.')) {
      resetAllData();
      showToast('All data has been erased', 'success');
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-4xl mx-auto animate-[fadeIn_0.3s_ease-out]">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-[#0d0d0d] tracking-tight">Portal Settings</h1>
        <p className="text-[#6b6b6b] mt-1 text-[15px]">Manage your developer portal preferences and data</p>
      </div>

      <div className="space-y-12">
        
        {/* Organization */}
        <section>
          <h2 className="text-[14px] font-bold text-[#0d0d0d] mb-4 uppercase tracking-wide border-b border-[#e5e5e5] pb-2">Organization</h2>
          <div className="max-w-md">
            <label className="block text-[13px] font-semibold text-[#0d0d0d] mb-1.5">Portal Name</label>
            <input 
              type="text" 
              value={settings.portalName}
              onChange={e => updateSettings({ portalName: e.target.value })}
              className="w-full border border-[#e5e5e5] rounded-md px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#10a37f] transition-colors"
            />
            <p className="text-[12px] text-[#6b6b6b] mt-2">This name appears in the top left corner of the sidebar.</p>
          </div>
        </section>

        {/* Security & Preferences */}
        <section>
          <h2 className="text-[14px] font-bold text-[#0d0d0d] mb-4 uppercase tracking-wide border-b border-[#e5e5e5] pb-2">Security & Preferences</h2>
          <div className="space-y-4 max-w-md">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${settings.requireDeleteConfirm ? 'bg-[#10a37f]' : 'bg-[#e5e5e5]'}`}>
                <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform ${settings.requireDeleteConfirm ? 'translate-x-4.5' : 'translate-x-0'}`}></div>
              </div>
              <input 
                type="checkbox" 
                className="hidden"
                checked={settings.requireDeleteConfirm}
                onChange={e => updateSettings({ requireDeleteConfirm: e.target.checked })}
              />
              <span className="text-[14px] text-[#0d0d0d] font-medium">Require confirmation to delete projects</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${settings.autoMaskKeys ? 'bg-[#10a37f]' : 'bg-[#e5e5e5]'}`}>
                <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform ${settings.autoMaskKeys ? 'translate-x-4.5' : 'translate-x-0'}`}></div>
              </div>
              <input 
                type="checkbox" 
                className="hidden"
                checked={settings.autoMaskKeys}
                onChange={e => updateSettings({ autoMaskKeys: e.target.checked })}
              />
              <span className="text-[14px] text-[#0d0d0d] font-medium">Auto-mask keys after creation</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${settings.showUsage ? 'bg-[#10a37f]' : 'bg-[#e5e5e5]'}`}>
                <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform ${settings.showUsage ? 'translate-x-4.5' : 'translate-x-0'}`}></div>
              </div>
              <input 
                type="checkbox" 
                className="hidden"
                checked={settings.showUsage}
                onChange={e => updateSettings({ showUsage: e.target.checked })}
              />
              <span className="text-[14px] text-[#0d0d0d] font-medium">Show usage statistics</span>
            </label>
          </div>
        </section>

        {/* Data Management */}
        <section>
          <h2 className="text-[14px] font-bold text-[#0d0d0d] mb-4 uppercase tracking-wide border-b border-[#e5e5e5] pb-2">Data Management</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[#f0f0f0]">
              <div>
                <h3 className="text-[14px] font-semibold text-[#0d0d0d]">Export Data</h3>
                <p className="text-[13px] text-[#6b6b6b]">Download a JSON backup of all projects, keys, and settings.</p>
              </div>
              <button 
                onClick={handleExport}
                className="border border-[#e5e5e5] hover:bg-[#f7f7f8] text-[#0d0d0d] px-4 py-2 rounded-md text-[13px] font-medium transition-colors flex items-center gap-2"
              >
                <Download size={14} /> Export JSON
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-[#f0f0f0]">
              <div>
                <h3 className="text-[14px] font-semibold text-[#0d0d0d]">Import Data</h3>
                <p className="text-[13px] text-[#6b6b6b]">Restore data from a JSON backup file.</p>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".json"
                onChange={handleImport}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="border border-[#e5e5e5] hover:bg-[#f7f7f8] text-[#0d0d0d] px-4 py-2 rounded-md text-[13px] font-medium transition-colors flex items-center gap-2"
              >
                <Upload size={14} /> Import JSON
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="text-[14px] font-semibold text-red-600">Reset All Data</h3>
                <p className="text-[13px] text-[#6b6b6b]">Permanently delete all projects, keys, and settings.</p>
              </div>
              <button 
                onClick={handleReset}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-[13px] font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                <AlertTriangle size={14} /> Reset Data
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
