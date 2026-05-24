'use client'
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Copy, Check } from 'lucide-react';
import { ChatMessage as IChatMessage } from '../lib/chat-api';

interface ChatMessageProps {
  message: IChatMessage;
  isStreaming?: boolean;
}

export default function ChatMessage({ message, isStreaming = false }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="py-6 w-full animate-[fadeIn_0.4s_ease-out] font-sans">
      <div className={`max-w-4xl mx-auto flex px-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
        
        {/* Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%]`}>
          {!isUser && (
            <div className="text-[12px] font-semibold text-[#8888aa] mb-1.5 ml-1">
              Jarvis
            </div>
          )}

          <div className="relative group">
            <div className={`prose prose-invert max-w-none text-[15px] leading-relaxed
              ${isUser 
                ? 'bg-[#6c63ff] text-white rounded-[20px] rounded-tr-[4px] px-5 py-3 shadow-[0_4px_15px_rgba(108,99,255,0.2)]' 
                : 'bg-[#1a1a2e] text-[#e8e8f0] rounded-[20px] rounded-tl-[4px] px-5 py-4 border border-[#2a2a4a] shadow-lg'
              }`}
            >
              {message.images && message.images.map((img, i) => (
                <img key={i} src={`data:image/jpeg;base64,${img}`} alt="Uploaded content" style={{maxWidth: '300px', borderRadius: '8px', marginBottom: '8px'}} />
              ))}
              
              {message.document && (
                <div className="flex items-center gap-2 bg-black/20 px-3 py-2 rounded-lg mb-3">
                  <span className="text-xl">📄</span>
                  <span className="text-sm font-medium">{message.document.name} uploaded</span>
                </div>
              )}
              {message.content === '' && isStreaming && !isUser ? (
                <div className="flex items-center gap-1.5 h-6 px-1">
                  <span className="w-1.5 h-1.5 bg-[#8888aa] rounded-full animate-[bounce_1.4s_infinite_ease-in-out_both] delay-[-0.32s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#8888aa] rounded-full animate-[bounce_1.4s_infinite_ease-in-out_both] delay-[-0.16s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#8888aa] rounded-full animate-[bounce_1.4s_infinite_ease-in-out_both]"></span>
                </div>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      const codeString = String(children).replace(/\n$/, '');
                      return !inline && match ? (
                        <div className="relative mt-5 mb-5 rounded-xl overflow-hidden bg-[#0a0a0f] border border-[#2a2a4a] shadow-xl">
                          <div className="flex items-center justify-between px-4 py-2.5 bg-[#111118] text-xs font-mono text-[#8888aa] border-b border-[#2a2a4a]">
                            <span>{match[1]}</span>
                            <button
                              onClick={() => handleCopy(codeString)}
                              className="hover:text-white flex items-center gap-1.5 transition-colors"
                            >
                              {copiedText === codeString ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                              {copiedText === codeString ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                          <SyntaxHighlighter
                            style={vscDarkPlus as any}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{ margin: 0, padding: '1.25rem', background: 'transparent', fontSize: '13px' }}
                            {...props}
                          >
                            {codeString}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className="bg-[#0a0a0f] px-1.5 py-0.5 rounded-md text-[#6c63ff] font-mono text-[13px] border border-[#2a2a4a]" {...props}>
                          {children}
                        </code>
                      );
                    },
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-5">
                        <table className="min-w-full divide-y divide-[#2a2a4a] border border-[#2a2a4a] rounded-xl overflow-hidden">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => <th className="px-4 py-3 bg-[#111118] text-left text-sm font-semibold text-[#e8e8f0]">{children}</th>,
                    td: ({ children }) => <td className="px-4 py-3 border-t border-[#2a2a4a] text-sm text-[#8888aa]">{children}</td>,
                    a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#6c63ff] hover:underline">{children}</a>
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </div>

            {!isUser && !isStreaming && (
              <div className="absolute top-2 -right-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleCopy(message.content)}
                  className="p-1.5 text-[#8888aa] hover:text-white bg-[#1a1a2e] border border-[#2a2a4a] rounded-lg shadow-sm"
                  title="Copy message"
                >
                  {copiedText === message.content ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
