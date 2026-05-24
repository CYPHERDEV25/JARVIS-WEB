"use client";

import React, { useState, useEffect, useRef } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import { ChatApi, Conversation, ChatMessage as IChatMessage } from '../lib/chat-api';
import { Zap, Code, Globe, Menu } from 'lucide-react';

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  useEffect(() => {
    loadConversations();
    // Default to a new chat on load if none selected
    if (!activeId) {
      handleNewChat();
    }
  }, []);

  const loadConversations = async () => {
    try {
      const convs = await ChatApi.listConversations();
      setConversations(convs);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSelectConversation = async (id: string) => {
    if (isStreaming) return;
    setActiveId(id);
    setError(null);
    try {
      const history = await ChatApi.getHistory(id);
      setMessages(history);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleNewChat = () => {
    if (isStreaming) return;
    setActiveId(null);
    setMessages([]);
    setStreamingText('');
    setError(null);
  };

  const handleDeleteConversation = async (id: string) => {
    if (confirm('Are you sure you want to delete this chat?')) {
      try {
        await ChatApi.deleteConversation(id);
        if (activeId === id) handleNewChat();
        await loadConversations();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSendMessage = async (text: string, images?: string[], document?: { name: string, content: string }) => {
    if ((!text.trim() && (!images || images.length === 0) && !document) || isStreaming) return;

    setError(null);
    setIsStreaming(true);
    setStreamingText('');

    let currentConversationId = activeId;
    
    const userMsg: IChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      images: images,
      document: document,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      if (!currentConversationId) {
        currentConversationId = await ChatApi.createConversation();
        setActiveId(currentConversationId);
      }

      await ChatApi.sendMessage(
        text, 
        currentConversationId, 
        (token) => setStreamingText(prev => prev + token),
        images,
        document
      );

      const history = await ChatApi.getHistory(currentConversationId);
      setMessages(history);
      setStreamingText('');
      await loadConversations();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      // remove the user message if it failed completely or just show error
    } finally {
      setIsStreaming(false);
    }
  };

  const handleStopGenerating = () => {
    setIsStreaming(false);
    if (activeId) {
      ChatApi.getHistory(activeId).then(setMessages);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        handleNewChat();
      }
      if (e.key === 'Escape' && isStreaming) {
        handleStopGenerating();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStreaming, activeId]);

  const activeTitle = activeId ? conversations.find(c => c.id === activeId)?.title : 'New Chat';

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-[#e8e8f0] overflow-hidden font-sans">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'flex' : 'hidden'} md:flex flex-shrink-0 z-20`}>
        <ChatSidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSelectConversation}
          onNew={handleNewChat}
          onDelete={handleDeleteConversation}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Header */}
        <header className="h-[60px] border-b border-[#1a1a2e] bg-[#0a0a0f]/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 text-[#8888aa] hover:text-white rounded-md hover:bg-[#1a1a2e]"
            >
              <Menu size={20} />
            </button>
            <h1 className="font-semibold text-lg text-[#e8e8f0] truncate">
              {activeTitle || 'New Chat'}
            </h1>
          </div>
        </header>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 text-red-400 px-5 py-3 mx-4 mt-4 rounded-r-md text-sm shadow-md flex items-center gap-3 flex-shrink-0">
            <span className="text-xl">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative w-full h-full">
          {messages.length === 0 && !isStreaming ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 bg-[#6c63ff] rounded-full blur-[20px] opacity-40 animate-pulse"></div>
                <div className="w-16 h-16 bg-[#6c63ff] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(108,99,255,0.6)] relative z-10">
                  <Zap size={32} className="text-white" fill="currentColor" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-10 tracking-tight">How can I help you today?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl px-4">
                {[
                  { icon: <Code size={22}/>, text: "Write a Python function to parse JSON" },
                  { icon: <Zap size={22}/>, text: "Explain quantum computing simply" },
                  { icon: <Globe size={22}/>, text: "Tell me a joke in Hindi" }
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(suggestion.text)}
                    className="flex flex-col items-start p-5 bg-[#1a1a2e] hover:bg-[#2a2a4a] border border-[#2a2a4a] hover:border-[#6c63ff]/50 rounded-[16px] transition-all text-left group hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)] shadow-lg"
                  >
                    <div className="text-[#6c63ff] mb-4 group-hover:scale-110 transition-transform">
                      {suggestion.icon}
                    </div>
                    <span className="text-[15px] font-medium text-[#e8e8f0] leading-snug">{suggestion.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="pb-10 pt-4">
              {messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isStreaming && (
                <ChatMessage 
                  message={{
                    id: 'streaming',
                    role: 'assistant',
                    content: streamingText,
                    created_at: new Date().toISOString()
                  }} 
                  isStreaming={true} 
                />
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f] to-transparent flex-shrink-0">
          <ChatInput
            onSend={handleSendMessage}
            onStop={handleStopGenerating}
            isStreaming={isStreaming}
          />
        </div>
      </main>
    </div>
  );
}
