"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ApiKey {
  id: string;
  name: string;
  fullKey: string;
  maskedKey: string;
  permissions: string;
  created: string;
  lastUsed: string | null;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  created: string;
  keys: ApiKey[];
  usageData: number[];
}

export interface PortalSettings {
  requireDeleteConfirm: boolean;
  autoMaskKeys: boolean;
  showUsage: boolean;
  portalName: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface PortalContextType {
  projects: Project[];
  settings: PortalSettings;
  addProject: (p: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  updateSettings: (updates: Partial<PortalSettings>) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  resetAllData: () => void;
}

const defaultSettings: PortalSettings = {
  requireDeleteConfirm: true,
  autoMaskKeys: true,
  showUsage: true,
  portalName: 'Jarvis Developer Portal'
};

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export function PortalProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<PortalSettings>(defaultSettings);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem('jarvis-projects');
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      } else {
        // Initialize default empty projects
        setProjects([]);
      }

      const storedSettings = localStorage.getItem('jarvis-portal-settings');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (err) {}
  }, []);

  const saveProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    localStorage.setItem('jarvis-projects', JSON.stringify(newProjects));
  };

  const saveSettings = (newSettings: PortalSettings) => {
    setSettings(newSettings);
    localStorage.setItem('jarvis-portal-settings', JSON.stringify(newSettings));
  };

  const addProject = (p: Project) => saveProjects([...projects, p]);

  const updateProject = (id: string, updates: Partial<Project>) => {
    saveProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProject = (id: string) => saveProjects(projects.filter(p => p.id !== id));

  const updateSettings = (updates: Partial<PortalSettings>) => {
    saveSettings({ ...settings, ...updates });
  };

  const resetAllData = () => {
    setProjects([]);
    setSettings(defaultSettings);
    localStorage.removeItem('jarvis-projects');
    localStorage.removeItem('jarvis-portal-settings');
    showToast('All data has been reset', 'success');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <PortalContext.Provider value={{ projects, settings, addProject, updateProject, deleteProject, updateSettings, showToast, resetAllData }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className="bg-[#1e1e20] text-white px-4 py-3 rounded-md shadow-lg flex items-center gap-3 animate-[slideInRight_0.3s_ease-out] text-sm">
            {t.type === 'success' && <span className="text-[#10a37f]">✅</span>}
            {t.message}
          </div>
        ))}
      </div>
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) throw new Error('usePortal must be used within PortalProvider');
  return context;
}
