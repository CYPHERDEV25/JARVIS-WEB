'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, Paperclip, X } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Need to set workerSrc for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ChatInputProps {
  onSend: (msg: string, images?: string[], document?: { name: string, content: string }) => void;
  onStop: () => void;
  isStreaming: boolean;
}

export default function ChatInput({ onSend, onStop, isStreaming }: ChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  
  const [docName, setDocName] = useState<string | null>(null);
  const [uploadedDoc, setUploadedDoc] = useState<File | null>(null);
  const [docText, setDocText] = useState<string | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Strip data prefix (e.g. data:image/jpeg;base64,)
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const extractPdfText = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ') + '\n';
    }
    return text;
  };

  const extractDocxText = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const handleSend = async () => {
    if ((!text.trim() && !uploadedImage && !uploadedDoc) || isStreaming) return;
    
    let base64Images: string[] | undefined = undefined;
    if (uploadedImage) {
      const b64 = await fileToBase64(uploadedImage);
      base64Images = [b64];
    }
    
    let documentObj: { name: string, content: string } | undefined = undefined;
    
    if (uploadedDoc) {
      try {
        let extracted = docText || '';
        if (!extracted) {
          if (uploadedDoc.type === 'application/pdf') {
            extracted = await extractPdfText(uploadedDoc);
          } else if (uploadedDoc.type.includes('word') || uploadedDoc.name.endsWith('.docx')) {
            extracted = await extractDocxText(uploadedDoc);
          }
        }
        documentObj = { name: docName || uploadedDoc.name, content: extracted };
      } catch (err) {
        console.error("Failed to extract text", err);
      }
    } else if (docName && docText) {
      documentObj = { name: docName, content: docText };
    }

    onSend(text.trim(), base64Images, documentObj);
    
    setText('');
    clearUpload();
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const fileType = file.type;
    
    if (fileType.startsWith('image/')) {
      setUploadedImage(file);
      setUploadPreview(URL.createObjectURL(file));
      setDocName(null);
      setUploadedDoc(null);
      setDocText(null);
    } else if (fileType === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDocText(e.target?.result as string);
        setDocName(file.name);
      };
      reader.readAsText(file);
      setUploadedDoc(file);
      setUploadPreview(null);
      setUploadedImage(null);
    } else if (fileType === 'application/pdf' || fileType.includes('word') || file.name.endsWith('.docx')) {
      setUploadedDoc(file);
      setDocName(file.name);
      setUploadPreview(null);
      setUploadedImage(null);
    }
  };

  const clearUpload = () => {
    setUploadPreview(null);
    setUploadedImage(null);
    setDocName(null);
    setUploadedDoc(null);
    setDocText(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Expose setters to parent if needed via props, but we can manage local state for UI 
  // and accept pre-processed doc content from parent
  
  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-8 pt-2 font-sans">
      {isStreaming && (
        <div className="flex justify-center mb-6">
          <button
            onClick={onStop}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a2e] hover:bg-[#2a2a4a] border border-[#2a2a4a] rounded-full text-sm text-[#e8e8f0] transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
          >
            <Square size={14} fill="currentColor" />
            Stop generating (Esc)
          </button>
        </div>
      )}

      {/* Previews */}
      {uploadPreview && (
        <div className="relative inline-block mb-3 ml-2 group animate-[fadeIn_0.2s_ease-out]">
          <img src={uploadPreview} className="h-20 rounded-lg object-cover border-2 border-[#2a2a4a]" alt="Upload preview" />
          <button 
            onClick={clearUpload} 
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {docName && (
        <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#2a2a4a] px-3 py-2 rounded-lg mb-3 ml-2 animate-[fadeIn_0.2s_ease-out]">
          <span className="text-xl">📄</span>
          <span className="text-[#e8e8f0] text-sm font-medium">{docName}</span>
          <button onClick={clearUpload} className="text-[#8888aa] hover:text-red-400 ml-1 transition-colors">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="relative bg-[#1a1a2e] rounded-[24px] border border-[#2a2a4a] shadow-[0_10px_30px_rgba(0,0,0,0.5)] focus-within:border-[#6c63ff]/50 focus-within:shadow-[0_0_0_2px_rgba(108,99,255,0.25)] transition-all">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={docName || uploadPreview ? "Add a message..." : "Message Jarvis..."}
          className="w-full max-h-[200px] bg-transparent text-[#e8e8f0] placeholder-[#8888aa] p-4 pl-5 pr-[90px] resize-none focus:outline-none rounded-[24px] overflow-y-auto custom-scrollbar"
          rows={1}
          disabled={isStreaming}
        />
        
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.txt,image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isStreaming}
            className={`p-2 rounded-full transition-colors ${isStreaming ? 'text-[#4a4a6a] cursor-not-allowed' : 'text-[#8888aa] hover:bg-[#2a2a4a] hover:text-[#e8e8f0]'}`}
            title="Attach file"
          >
            <Paperclip size={20} />
          </button>
          <button
            onClick={handleSend}
            disabled={(!text.trim() && !uploadedImage && !uploadedDoc) || isStreaming}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              (text.trim() || uploadedImage || uploadedDoc) && !isStreaming
                ? 'bg-[#6c63ff] hover:bg-[#5a52d5] hover:-rotate-12 text-white shadow-[0_0_15px_rgba(108,99,255,0.4)]'
                : 'bg-[#2a2a4a] text-[#8888aa] cursor-not-allowed'
            }`}
          >
            <Send size={18} className={(text.trim() || uploadedImage || uploadedDoc) && !isStreaming ? 'translate-x-0.5 -translate-y-0.5' : ''} />
          </button>
        </div>
      </div>
      
      <div className="flex justify-center items-center px-2 mt-4 text-[11px] text-[#8888aa]">
        <p>Jarvis can make mistakes. Verify important information.</p>
      </div>
    </div>
  );
}
