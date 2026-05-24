"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PortalProvider } from './PortalContext';
import { Zap, ArrowLeft, Folder, Key, Activity, Settings, Book, Rocket } from 'lucide-react';

export default function ApiPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalProvider>
      <div className="flex h-screen bg-[#ffffff] text-[#0d0d0d] font-sans overflow-hidden">
        
        {/* Left Sidebar */}
        <div className="w-[240px] bg-[#f7f7f8] border-r border-[#e5e5e5] flex flex-col flex-shrink-0 z-10">
          
          {/* Logo Area matches navbar height */}
          <div className="h-[56px] px-5 flex items-center gap-2 flex-shrink-0 border-b border-transparent">
            <div className="w-7 h-7 bg-[#10a37f] rounded-md flex items-center justify-center text-white">
              <Zap size={14} fill="currentColor" />
            </div>
            <span className="font-semibold tracking-tight text-[15px]">Jarvis Portal</span>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
            
            <SidebarSection title="ORGANIZATION">
              <SidebarLink href="/api-portal/projects" icon={<Folder size={16} />} label="Projects" />
            </SidebarSection>

            <SidebarSection title="ACCOUNT">
              <SidebarLink href="/api-portal/keys" icon={<Key size={16} />} label="API Keys" />
              <SidebarLink href="/api-portal/usage" icon={<Activity size={16} />} label="Usage" />
              <SidebarLink href="/api-portal/settings" icon={<Settings size={16} />} label="Settings" />
            </SidebarSection>

            <SidebarSection title="DOCS">
              <SidebarLink href="/api-portal/docs" icon={<Book size={16} />} label="API Reference" />
              <SidebarLink href="/api-portal/docs#quickstart" icon={<Rocket size={16} />} label="Quickstart" />
            </SidebarSection>
            
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          
          {/* Top Navbar */}
          <header className="h-[56px] border-b border-[#e5e5e5] bg-white flex items-center justify-end px-6 flex-shrink-0 z-10 sticky top-0">
            <Link href="/" className="flex items-center gap-2 text-[14px] font-medium text-[#6b6b6b] hover:text-[#0d0d0d] transition-colors">
              <ArrowLeft size={16} />
              Back to Chat
            </Link>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-white">
            {children}
          </main>
        </div>
      </div>
      
      {/* Global Slide-in animation for toasts */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}} />
    </PortalProvider>
  );
}

function SidebarSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-[#6b6b6b] mb-1 px-3 tracking-wider">{title}</div>
      <div className="space-y-0.5">
        {children}
      </div>
    </div>
  );
}

function SidebarLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href === '/api-portal/projects' && pathname.startsWith('/api-portal/projects'));

  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-[14px] transition-colors ${
        isActive 
          ? 'bg-[#ececec] text-[#0d0d0d] font-semibold' 
          : 'text-[#6b6b6b] hover:bg-[#f0f0f0] hover:text-[#0d0d0d]'
      }`}
    >
      <div className={isActive ? 'text-[#0d0d0d]' : 'text-[#6b6b6b]'}>{icon}</div>
      {label}
    </Link>
  );
}
