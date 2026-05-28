"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Monitor, Trash2, Key, ChevronRight, Download, Upload, Cpu, FileText } from 'lucide-react';
import { ChatApi } from '../../lib/chat-api';

export default function SettingsPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [ollamaStatus, setOllamaStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [apiKeyCount, setApiKeyCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem('jarvis-app-theme') || 'dark';
    setTheme(savedTheme as 'dark' | 'light');
    
    // Load font size
    const savedFont = localStorage.getItem('jarvis-font-size') || 'medium';
    setFontSize(savedFont as 'small' | 'medium' | 'large');
    
    // Load API Keys count
    try {
      const keys = JSON.parse(localStorage.getItem('jarvis-api-keys') || '[]');
      setApiKeyCount(keys.length);
    } catch(e) {}

    // Check Ollama status
    checkOllamaStatus();
  }, []);

  const checkOllamaStatus = async () => {
    setOllamaStatus('checking');
    try {
      const res = await fetch('https://romeoraj-ollama.hf.space/api/tags');
      if (res.ok) {
        setOllamaStatus('online');
      } else {
        setOllamaStatus('offline');
      }
    } catch (e) {
      setOllamaStatus('offline');
    }
  };

  const handleClearHistory = async () => {
    if (confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
      await ChatApi.clearAllHistory();
      localStorage.removeItem('jarvis-conversations');
      alert('Chat history cleared.');
    }
  };

  const handleExport = () => {
    const convos = localStorage.getItem('jarvis-conversations') || '[]';
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(convos);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "jarvis_conversations.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        JSON.parse(content); // validate JSON
        localStorage.setItem('jarvis-conversations', content);
        alert('Conversations imported successfully!');
      } catch (err) {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    localStorage.setItem('jarvis-app-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vals: Record<string, 'small'|'medium'|'large'> = { '1': 'small', '2': 'medium', '3': 'large' };
    const newSize = vals[e.target.value];
    setFontSize(newSize);
    localStorage.setItem('jarvis-font-size', newSize);
    document.documentElement.setAttribute('data-font-size', newSize);
  };

  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-[#0a0a0f]' : 'bg-gray-50';
  const bgPanel = isDark ? 'bg-[#1a1a2e]' : 'bg-white';
  const textMain = isDark ? 'text-[#e8e8f0]' : 'text-gray-900';
  const textMuted = isDark ? 'text-[#8888aa]' : 'text-gray-500';
  const borderCol = isDark ? 'border-[#2a2a4a]' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bgMain} ${textMain} font-sans p-6 md:p-12 transition-colors`}>
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[#6c63ff] hover:underline mb-8 font-medium">
          <ArrowLeft size={18} />
          Back to Chat
        </Link>

        <h1 className="text-3xl font-bold mb-10 tracking-tight">Settings</h1>

        <div className="space-y-12">
          
          {/* General Section */}
          <section>
            <h2 className={`text-sm font-bold uppercase tracking-wider mb-4 ${textMuted}`}>General</h2>
            <div className={`rounded-2xl border ${bgPanel} ${borderCol} overflow-hidden shadow-sm flex flex-col divide-y ${borderCol}`}>
              
              <div className="flex items-center justify-between p-5">
                <div>
                  <h3 className="font-semibold text-[15px]">Export Conversations</h3>
                  <p className={`text-sm mt-1 ${textMuted}`}>Download a backup of all your chats.</p>
                </div>
                <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 border border-[#2a2a4a] rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-[#2a2a4a] transition-colors">
                  <Download size={16} /> Export JSON
                </button>
              </div>

              <div className="flex items-center justify-between p-5">
                <div>
                  <h3 className="font-semibold text-[15px]">Import Conversations</h3>
                  <p className={`text-sm mt-1 ${textMuted}`}>Restore chats from a backup file.</p>
                </div>
                <input type="file" accept=".json" ref={fileInputRef} className="hidden" onChange={handleImport} />
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 border border-[#2a2a4a] rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-[#2a2a4a] transition-colors">
                  <Upload size={16} /> Import JSON
                </button>
              </div>

              <div className="flex items-center justify-between p-5">
                <div>
                  <h3 className="font-semibold text-[15px]">Clear Chat History</h3>
                  <p className={`text-sm mt-1 ${textMuted}`}>Delete all your conversations from this device.</p>
                </div>
                <button 
                  onClick={handleClearHistory}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-sm font-medium transition-colors"
                >
                  <Trash2 size={16} /> Clear History
                </button>
              </div>

            </div>
          </section>

          {/* Appearance Section */}
          <section>
            <h2 className={`text-sm font-bold uppercase tracking-wider mb-4 ${textMuted}`}>Appearance</h2>
            <div className={`rounded-2xl border ${bgPanel} ${borderCol} overflow-hidden shadow-sm flex flex-col divide-y ${borderCol}`}>
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-[#2a2a4a]' : 'bg-gray-100'}`}>
                    <Monitor size={20} className={isDark ? 'text-[#e8e8f0]' : 'text-gray-600'} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[15px]">Theme</h3>
                    <p className={`text-sm mt-1 ${textMuted}`}>Toggle between light and dark mode.</p>
                  </div>
                </div>
                <div className={`flex p-1 rounded-lg border ${isDark ? 'bg-black/20 border-[#2a2a4a]' : 'bg-gray-200 border-gray-300'}`}>
                  <button 
                    onClick={() => handleThemeChange('light')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${!isDark ? 'bg-white text-black shadow-sm' : 'text-[#8888aa] hover:text-white'}`}
                  >
                    Light
                  </button>
                  <button 
                    onClick={() => handleThemeChange('dark')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${isDark ? 'bg-[#2a2a4a] text-white shadow-sm' : 'text-gray-500 hover:text-black'}`}
                  >
                    Dark
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-5">
                <div>
                  <h3 className="font-semibold text-[15px]">Font Size</h3>
                  <p className={`text-sm mt-1 ${textMuted}`}>Adjust the text size for readability.</p>
                </div>
                <div className="flex items-center gap-4 w-48">
                  <span className="text-xs">A</span>
                  <input 
                    type="range" min="1" max="3" step="1" 
                    value={fontSize === 'small' ? '1' : fontSize === 'medium' ? '2' : '3'}
                    onChange={handleFontSizeChange}
                    className="flex-1 accent-[#6c63ff]"
                  />
                  <span className="text-lg font-bold">A</span>
                </div>
              </div>

            </div>
          </section>

          {/* Model Section */}
          <section>
            <h2 className={`text-sm font-bold uppercase tracking-wider mb-4 ${textMuted}`}>Model</h2>
            <div className={`rounded-2xl border ${bgPanel} ${borderCol} overflow-hidden shadow-sm p-5`}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-[#6c63ff]/20 text-[#6c63ff]' : 'bg-indigo-100 text-indigo-600'}`}>
                    <Cpu size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[15px]">Connected to local AI</h3>
                    <p className={`text-sm mt-1 ${textMuted}`}>Your conversations are processed locally and securely.</p>
                  </div>
                </div>

                <div className={`flex items-center gap-2 p-3 rounded-lg border ${isDark ? 'bg-[#0a0a0f] border-[#2a2a4a]' : 'bg-gray-50 border-gray-200'}`}>
                  {ollamaStatus === 'checking' && <span className="text-yellow-500 animate-pulse text-sm">● Checking connection...</span>}
                  {ollamaStatus === 'online' && <span className="text-green-500 font-medium text-sm flex items-center gap-2">● Online</span>}
                  {ollamaStatus === 'offline' && <span className="text-red-500 font-medium text-sm flex items-center gap-2">● Offline - Start Ollama to use Jarvis</span>}
                  <button onClick={checkOllamaStatus} className="ml-auto text-xs text-[#6c63ff] hover:underline">Refresh</button>
                </div>
              </div>
            </div>
          </section>

          {/* Developer Section */}
          <section>
            <h2 className={`text-sm font-bold uppercase tracking-wider mb-4 ${textMuted}`}>Developer</h2>
            <div className={`rounded-2xl border ${bgPanel} ${borderCol} overflow-hidden shadow-sm flex flex-col divide-y ${borderCol}`}>
              <Link href="/api-portal" target="_blank" className={`flex items-center justify-between p-5 w-full block group ${isDark ? 'hover:bg-[#2a2a4a]' : 'hover:bg-gray-50'} transition-colors`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-[#6c63ff]/20 text-[#6c63ff]' : 'bg-indigo-100 text-indigo-600'}`}>
                    <Key size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[15px]">Developer Portal</h3>
                    <p className={`text-sm mt-1 ${textMuted}`}>Manage your {apiKeyCount} API keys and view usage statistics.</p>
                  </div>
                </div>
                <div className="text-[#6c63ff] group-hover:translate-x-1 transition-transform">
                  <ChevronRight size={20} />
                </div>
              </Link>
              <Link href="/api-docs" target="_blank" className={`flex items-center justify-between p-5 w-full block group ${isDark ? 'hover:bg-[#2a2a4a]' : 'hover:bg-gray-50'} transition-colors`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-[#6c63ff]/20 text-[#6c63ff]' : 'bg-indigo-100 text-indigo-600'}`}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[15px]">API Documentation</h3>
                    <p className={`text-sm mt-1 ${textMuted}`}>Learn how to integrate Jarvis into your applications.</p>
                  </div>
                </div>
                <div className="text-[#6c63ff] group-hover:translate-x-1 transition-transform">
                  <ChevronRight size={20} />
                </div>
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
