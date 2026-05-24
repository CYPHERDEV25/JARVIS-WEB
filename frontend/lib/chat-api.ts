import { v4 as uuidv4 } from 'uuid';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  images?: string[];
  document?: { name: string, content: string };
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

const STORAGE_KEY_CONVS = 'jarvis_conversations';
const STORAGE_KEY_MSGS = 'jarvis_messages_';
const OLLAMA_URL = 'http://localhost:11434/api/chat';
const OLLAMA_MODEL = 'llama3.1:8b';

export class ChatApi {
  static async listConversations(): Promise<Conversation[]> {
    const data = localStorage.getItem(STORAGE_KEY_CONVS);
    if (!data) return [];
    try {
      const convs = JSON.parse(data) as Conversation[];
      return convs.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    } catch {
      return [];
    }
  }

  static async createConversation(): Promise<string> {
    const convs = await this.listConversations();
    const newConv: Conversation = {
      id: uuidv4(),
      title: 'New Chat',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      message_count: 0
    };
    convs.push(newConv);
    localStorage.setItem(STORAGE_KEY_CONVS, JSON.stringify(convs));
    localStorage.setItem(STORAGE_KEY_MSGS + newConv.id, JSON.stringify([]));
    return newConv.id;
  }

  static async getHistory(conversationId: string): Promise<ChatMessage[]> {
    const data = localStorage.getItem(STORAGE_KEY_MSGS + conversationId);
    if (!data) return [];
    try {
      return JSON.parse(data) as ChatMessage[];
    } catch {
      return [];
    }
  }

  static async deleteConversation(conversationId: string): Promise<void> {
    const convs = await this.listConversations();
    const updated = convs.filter(c => c.id !== conversationId);
    localStorage.setItem(STORAGE_KEY_CONVS, JSON.stringify(updated));
    localStorage.removeItem(STORAGE_KEY_MSGS + conversationId);
  }

  static async clearAllHistory(): Promise<void> {
    const convs = await this.listConversations();
    convs.forEach(c => localStorage.removeItem(STORAGE_KEY_MSGS + c.id));
    localStorage.removeItem(STORAGE_KEY_CONVS);
  }

  static async saveMessage(conversationId: string, role: 'user' | 'assistant', content: string, images?: string[], document?: { name: string, content: string }): Promise<void> {
    const history = await this.getHistory(conversationId);
    history.push({
      id: uuidv4(),
      role,
      content,
      images,
      document,
      created_at: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEY_MSGS + conversationId, JSON.stringify(history));

    // Update conversation metadata
    const convs = await this.listConversations();
    const convIndex = convs.findIndex(c => c.id === conversationId);
    if (convIndex !== -1) {
      convs[convIndex].updated_at = new Date().toISOString();
      convs[convIndex].message_count = history.length;
      
      // Auto-title on first user message
      if (role === 'user' && history.length === 1) {
        convs[convIndex].title = content.substring(0, 40) + (content.length > 40 ? '...' : '');
      }
      
      localStorage.setItem(STORAGE_KEY_CONVS, JSON.stringify(convs));
    }
  }

  static async sendMessage(
    message: string,
    conversationId: string,
    onToken: (token: string) => void,
    images?: string[],
    document?: { name: string, content: string }
  ): Promise<void> {
    // Save user message locally first
    await this.saveMessage(conversationId, 'user', message, images, document);

    // Get context
    const history = await this.getHistory(conversationId);
    
    // Inject system prompt at the very beginning of the history context sent to Ollama
    const systemPrompt = {
      role: 'user',
      content: `You are Jarvis, an advanced AI assistant. 
Be helpful, clear, and concise.
For code: always use proper formatting with code blocks.
For lists: use bullet points.
For math: show step by step.
Never say you are an AI model or mention Ollama or LLaMA.
You are Jarvis. That is all you know about yourself.
Keep responses focused and avoid unnecessary padding.
If asked who made you, say: "I am Jarvis, your personal AI assistant."`
    };

    const ollamaMessages = [systemPrompt, ...history.map(m => {
      let finalContent = m.content;
      if (m.document) {
        finalContent = `I have uploaded a document called ${m.document.name}. Here is its content:\n\n${m.document.content}\n\nUser question: ${m.content || 'Summarize this document'}`;
      }
      const msg: any = { role: m.role, content: finalContent };
      if (m.images && m.images.length > 0) {
        msg.images = m.images;
      }
      return msg;
    })];

    // Auto-switch to llava if an image is provided
    const modelToUse = (images && images.length > 0) ? 'llava' : OLLAMA_MODEL;

    try {
      const res = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: modelToUse,
          messages: ollamaMessages,
          stream: true,
          options: {
            num_predict: 2048,
            temperature: 0.7,
            top_p: 0.9,
            repeat_penalty: 1.1
          }
        })
      });

      if (!res.ok) {
        throw new Error('Jarvis is offline. Make sure Ollama is running on port 11434.');
      }

      if (!res.body) throw new Error('ReadableStream not supported');

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let fullResponse = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        // NDJSON parsing
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep the incomplete line in buffer

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.message && data.message.content) {
              fullResponse += data.message.content;
              onToken(data.message.content);
            }
          } catch (e) {
            console.error('Error parsing NDJSON line:', line);
          }
        }
      }

      // Process any remaining buffer
      if (buffer.trim()) {
        try {
          const data = JSON.parse(buffer);
          if (data.message && data.message.content) {
            fullResponse += data.message.content;
            onToken(data.message.content);
          }
        } catch (e) {
          // ignore
        }
      }

      // Save assistant response
      await this.saveMessage(conversationId, 'assistant', fullResponse);
      
    } catch (error) {
      console.error(error);
      throw new Error('⚠️ Jarvis is offline. Make sure Ollama is running on port 11434.');
    }
  }
}
