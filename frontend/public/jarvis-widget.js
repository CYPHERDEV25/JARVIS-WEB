(function() {
  const currentScript = document.currentScript;
  if (!currentScript) return;

  const theme = currentScript.getAttribute('data-theme') || 'dark';
  const position = currentScript.getAttribute('data-position') || 'bottom-right';
  const title = currentScript.getAttribute('data-title') || 'Jarvis';
  const placeholder = currentScript.getAttribute('data-placeholder') || 'Message Jarvis...';
  const primaryColor = currentScript.getAttribute('data-color') || '#6c63ff'; // default to new purple

  const OLLAMA_URL = 'http://localhost:11434/api/chat';
  const OLLAMA_MODEL = 'llama3.1:8b';

  // Inject CSS
  const style = document.createElement('style');
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    
    #jarvis-widget-container {
      position: fixed;
      z-index: 999999;
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    }
    #jarvis-widget-container.bottom-right { bottom: 20px; right: 20px; }
    #jarvis-widget-container.bottom-left { bottom: 20px; left: 20px; }
    
    #jarvis-widget-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: ${primaryColor};
      color: white;
      border: none;
      box-shadow: 0 4px 12px rgba(108, 99, 255, 0.4);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #jarvis-widget-button:hover { 
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(108, 99, 255, 0.6);
    }
    #jarvis-widget-button svg { width: 30px; height: 30px; fill: none; stroke: currentColor; stroke-width: 2; }
    
    #jarvis-widget-window {
      position: absolute;
      bottom: 80px;
      ${position === 'bottom-right' ? 'right: 0;' : 'left: 0;'}
      width: 350px;
      height: 500px;
      max-height: calc(100vh - 100px);
      background: #0a0a0f;
      border: 1px solid #1a1a2e;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      display: none;
      flex-direction: column;
      overflow: hidden;
      color: #e8e8f0;
    }
    
    #jarvis-widget-header {
      background: #111118;
      color: white;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      border-bottom: 1px solid #1a1a2e;
    }
    
    #jarvis-widget-header-actions button {
      background: none;
      border: none;
      color: #8888aa;
      cursor: pointer;
      padding: 4px;
      transition: color 0.2s;
    }
    #jarvis-widget-header-actions button:hover { color: white; }
    
    #jarvis-widget-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .jarvis-msg {
      max-width: 85%;
      padding: 12px 16px;
      border-radius: 20px;
      font-size: 14px;
      line-height: 1.5;
      word-break: break-word;
      animation: fadeIn 0.3s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .jarvis-msg.user {
      align-self: flex-end;
      background: ${primaryColor};
      color: white;
      border-bottom-right-radius: 4px;
    }
    .jarvis-msg-wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      max-width: 85%;
    }
    .jarvis-msg-label {
      font-size: 11px;
      color: #8888aa;
      margin-bottom: 4px;
      margin-left: 12px;
    }
    .jarvis-msg.assistant {
      align-self: flex-start;
      background: #1a1a2e;
      color: #e8e8f0;
      border-bottom-left-radius: 4px;
      max-width: 100%;
    }
    
    #jarvis-widget-input-container {
      padding: 16px;
      background: #0a0a0f;
    }
    
    #jarvis-widget-form {
      display: flex;
      background: #1a1a2e;
      border-radius: 999px;
      border: 1px solid #2a2a4a;
      padding: 6px;
      transition: box-shadow 0.2s;
    }
    #jarvis-widget-form:focus-within {
      box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.25);
    }
    
    #jarvis-widget-input {
      flex: 1;
      padding: 8px 16px;
      background: transparent;
      border: none;
      color: #e8e8f0;
      outline: none;
      font-family: inherit;
      font-size: 14px;
    }
    #jarvis-widget-input::placeholder { color: #8888aa; }
    
    #jarvis-widget-submit {
      background: ${primaryColor};
      color: white;
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, opacity 0.2s;
    }
    #jarvis-widget-submit:hover:not(:disabled) {
      transform: rotate(-10deg);
    }
    #jarvis-widget-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    #jarvis-widget-submit svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2; }
    
    .jarvis-typing {
      display: flex;
      gap: 4px;
      padding: 4px 0;
    }
    .jarvis-typing span {
      width: 6px;
      height: 6px;
      background: #8888aa;
      border-radius: 50%;
      animation: bounce 1.4s infinite ease-in-out both;
    }
    .jarvis-typing span:nth-child(1) { animation-delay: -0.32s; }
    .jarvis-typing span:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }

    @media (max-width: 480px) {
      #jarvis-widget-window {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100vh;
        max-height: 100vh;
        border-radius: 0;
      }
      #jarvis-widget-button { display: none; }
    }
  `;
  document.head.appendChild(style);

  // Inject HTML
  const container = document.createElement('div');
  container.id = 'jarvis-widget-container';
  container.className = position;
  container.innerHTML = `
    <div id="jarvis-widget-window">
      <div id="jarvis-widget-header">
        <div style="display: flex; items-center; gap: 8px;">
          <div style="width: 24px; height: 24px; border-radius: 50%; background: ${primaryColor}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px ${primaryColor};">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          ${title}
        </div>
        <div id="jarvis-widget-header-actions">
          <button id="jarvis-widget-clear" title="Clear chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
          <button id="jarvis-widget-close" title="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>
      <div id="jarvis-widget-messages"></div>
      <div id="jarvis-widget-input-container">
        <form id="jarvis-widget-form">
          <input type="text" id="jarvis-widget-input" placeholder="${placeholder}" autocomplete="off" />
          <button type="submit" id="jarvis-widget-submit">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
        <div style="text-align: center; font-size: 10px; color: #8888aa; margin-top: 8px;">
          Jarvis can make mistakes. Verify important information.
        </div>
      </div>
    </div>
    <button id="jarvis-widget-button">
      <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </button>
  `;
  document.body.appendChild(container);

  // Logic
  const button = document.getElementById('jarvis-widget-button');
  const win = document.getElementById('jarvis-widget-window');
  const closeBtn = document.getElementById('jarvis-widget-close');
  const clearBtn = document.getElementById('jarvis-widget-clear');
  const form = document.getElementById('jarvis-widget-form');
  const input = document.getElementById('jarvis-widget-input');
  const messagesEl = document.getElementById('jarvis-widget-messages');
  const submitBtn = document.getElementById('jarvis-widget-submit');

  let messages = JSON.parse(localStorage.getItem('jarvis_widget_messages') || '[]');
  
  function toggleWindow() {
    if (win.style.display === 'flex') {
      win.style.display = 'none';
    } else {
      win.style.display = 'flex';
      input.focus();
      scrollToBottom();
      if (messages.length === 0) {
        appendMessage('assistant', 'How can I help you today?');
      }
    }
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function renderMessages() {
    messagesEl.innerHTML = '';
    messages.forEach(msg => {
      if (msg.role === 'assistant') {
        const wrapper = document.createElement('div');
        wrapper.className = 'jarvis-msg-wrapper';
        wrapper.innerHTML = \`<div class="jarvis-msg-label">Jarvis</div><div class="jarvis-msg assistant">\${msg.content}</div>\`;
        messagesEl.appendChild(wrapper);
      } else {
        const div = document.createElement('div');
        div.className = \`jarvis-msg \${msg.role}\`;
        div.innerText = msg.content;
        messagesEl.appendChild(div);
      }
    });
    scrollToBottom();
  }

  function appendMessage(role, content) {
    messages.push({ role, content });
    saveMessages();
    renderMessages();
  }
  
  function saveMessages() {
    localStorage.setItem('jarvis_widget_messages', JSON.stringify(messages));
  }

  button.addEventListener('click', toggleWindow);
  closeBtn.addEventListener('click', () => { win.style.display = 'none'; });
  
  clearBtn.addEventListener('click', () => {
    if (confirm('Clear conversation?')) {
      messages = [];
      saveMessages();
      renderMessages();
      appendMessage('assistant', 'How can I help you today?');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    input.disabled = true;
    submitBtn.disabled = true;

    appendMessage('user', text);

    // Typing indicator
    const currentMsgIndex = messages.length;
    messages.push({ role: 'assistant', content: '' });
    
    const wrapper = document.createElement('div');
    wrapper.className = 'jarvis-msg-wrapper';
    wrapper.id = 'jarvis-typing-indicator';
    wrapper.innerHTML = \`
      <div class="jarvis-msg-label">Jarvis</div>
      <div class="jarvis-msg assistant">
        <div class="jarvis-typing"><span></span><span></span><span></span></div>
      </div>
    \`;
    messagesEl.appendChild(wrapper);
    scrollToBottom();

    try {
      const ollamaMessages = messages.slice(0, -1).map(m => ({ role: m.role, content: m.content }));
      
      const res = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          messages: ollamaMessages,
          stream: true
        })
      });

      if (!res.ok) throw new Error('Jarvis is offline');

      const indicator = document.getElementById('jarvis-typing-indicator');
      if (indicator) indicator.remove();

      // Create new empty message div
      const newWrapper = document.createElement('div');
      newWrapper.className = 'jarvis-msg-wrapper';
      const msgDiv = document.createElement('div');
      msgDiv.className = 'jarvis-msg assistant';
      
      newWrapper.innerHTML = '<div class="jarvis-msg-label">Jarvis</div>';
      newWrapper.appendChild(msgDiv);
      messagesEl.appendChild(newWrapper);

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let fullResponse = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; 

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.message && data.message.content) {
              fullResponse += data.message.content;
              msgDiv.innerText = fullResponse;
              scrollToBottom();
            }
          } catch (e) {}
        }
      }

      messages[currentMsgIndex].content = fullResponse;
      saveMessages();

    } catch (err) {
      const indicator = document.getElementById('jarvis-typing-indicator');
      if (indicator) indicator.remove();
      
      messages[currentMsgIndex].content = '⚠️ Jarvis is offline. Make sure Ollama is running on port 11434.';
      saveMessages();
      renderMessages();
    } finally {
      input.disabled = false;
      submitBtn.disabled = false;
      input.focus();
    }
  });

  // Initial render
  if (messages.length > 0) renderMessages();
})();
