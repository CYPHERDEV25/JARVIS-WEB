import React from 'react';
import { Plus, MessageSquare, Trash2, Settings, Zap } from 'lucide-react';
import { Conversation } from '../lib/chat-api';
import Link from 'next/link';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export default function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  searchQuery,
  setSearchQuery
}: ChatSidebarProps) {
  
  const filtered = conversations.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-[280px] bg-[#111118] border-r border-[#1a1a2e] flex flex-col h-screen text-[#e8e8f0] font-sans">
      <div className="p-4 border-b border-[#1a1a2e] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#6c63ff] flex items-center justify-center shadow-[0_0_12px_rgba(108,99,255,0.4)]">
          <Zap size={16} className="text-white" fill="currentColor" />
        </div>
        <span className="font-bold text-lg tracking-wide">Jarvis</span>
      </div>

      <div className="p-4">
        <button
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 bg-[#6c63ff] hover:bg-[#5a52d5] text-white rounded-xl px-4 py-3 transition-colors font-semibold shadow-[0_4px_14px_rgba(108,99,255,0.25)] hover:shadow-[0_6px_20px_rgba(108,99,255,0.35)]"
        >
          <Plus size={18} />
          <span>New Chat</span>
        </button>
      </div>

      <div className="px-4 pb-2">
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-[#1a1a2e] border border-[#2a2a4a] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6c63ff] transition-all text-[#e8e8f0] placeholder-[#8888aa]"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 custom-scrollbar">
        {filtered.map(conv => (
          <div
            key={conv.id}
            className={`group flex items-center gap-3 w-full rounded-lg px-3 py-3 cursor-pointer transition-colors relative
              ${activeId === conv.id ? 'bg-[#1a1a2e] text-white' : 'hover:bg-[#1a1a2e]/60 text-[#8888aa] hover:text-[#e8e8f0]'}`}
            onClick={() => onSelect(conv.id)}
          >
            <MessageSquare size={16} className="flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm font-medium">{conv.title || 'New Chat'}</div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conv.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-red-400 transition-all absolute right-2 bg-[#1a1a2e] rounded-md"
              title="Delete chat"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-sm text-[#8888aa] mt-8">
            No conversations found.
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[#1a1a2e] flex flex-col gap-1">
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1a1a2e] rounded-lg transition-colors text-sm text-[#8888aa] hover:text-[#e8e8f0]">
          <Settings size={18} />
          <span className="flex-1 font-medium">Settings</span>
        </Link>
      </div>
    </div>
  );
}
