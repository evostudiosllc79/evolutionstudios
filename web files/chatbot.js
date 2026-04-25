// Inject styles
const style = document.createElement('style');
style.textContent = `
  #chat-bubble {
    position: fixed;
    bottom: 28px;
    left: 28px;
    width: 56px;
    height: 56px;
    background: #0db4c4;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(13,180,196,0.4);
    z-index: 9999;
    transition: all 0.3s ease;
  }
  #chat-bubble:hover {
    background: #0a95a3;
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(13,180,196,0.5);
  }
  #chat-bubble svg {
    width: 26px;
    height: 26px;
    color: white;
  }
  #chat-widget {
    position: fixed;
    bottom: 100px;
    left: 28px;
    width: 360px;
    height: 500px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(26,43,48,0.15);
    display: none;
    flex-direction: column;
    z-index: 9998;
    overflow: hidden;
    border: 1px solid #e2eff2;
  }
  #chat-widget.open {
    display: flex;
  }
  #chat-header {
    background: #0db4c4;
    color: white;
    padding: 16px 20px;
    font-weight: 700;
    font-size: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  #chat-close {
    cursor: pointer;
    font-size: 20px;
    line-height: 1;
    opacity: 0.8;
  }
  #chat-close:hover { opacity: 1; }
  #chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    background: #f6fbfc;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .chat-msg {
    max-width: 85%;
    padding: 10px 14px;
    border-radius: 14px;
    font-size: 14px;
    line-height: 1.5;
  }
  .chat-msg.user {
    background: #0db4c4;
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  }
  .chat-msg.ai {
    background: white;
    color: #1a2b30;
    align-self: flex-start;
    border-bottom-left-radius: 4px;
    box-shadow: 0 2px 8px rgba(26,43,48,0.08);
  }
  #chat-input-row {
    display: flex;
    padding: 12px;
    gap: 8px;
    border-top: 1px solid #e2eff2;
    background: white;
  }
  #widget-input {
    flex: 1;
    padding: 10px 14px;
    border: 1px solid #e2eff2;
    border-radius: 50px;
    font-size: 14px;
    outline: none;
    font-family: inherit;
  }
  #widget-input:focus { border-color: #0db4c4; }
  #widget-send {
    padding: 10px 18px;
    background: #0db4c4;
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
  }
  #widget-send:hover { background: #0a95a3; }
`;
document.head.appendChild(style);

// Inject HTML
const bubble = document.createElement('div');
bubble.id = 'chat-bubble';
bubble.innerHTML = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#fff"/><path d="M8 22V10h10.5a4.5 4.5 0 010 9H12.5" stroke="#0db4c4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.5 16h7a4 4 0 010 8H8" stroke="#0db4c4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/></svg>`;
document.body.appendChild(bubble);

const widget = document.createElement('div');
widget.id = 'chat-widget';
widget.innerHTML = `
  <div id="chat-header">
    <span>💬 Chat with AI</span>
    <span id="chat-close">✕</span>
  </div>
  <div id="chat-messages">
    <div class="chat-msg ai">Hi! this is a test...</div>
  </div>
  <div id="chat-input-row">
    <input id="widget-input" type="text" placeholder="Type a message...">
    <button id="widget-send">Send</button>
  </div>
`;
document.body.appendChild(widget);

// Toggle
bubble.addEventListener('click', () => widget.classList.toggle('open'));
document.getElementById('chat-close').addEventListener('click', () => widget.classList.remove('open'));

// Send message
async function widgetSend() {
  const input = document.getElementById('widget-input');
  const messages = document.getElementById('chat-messages');
  const message = input.value.trim();
  if (!message) return;

  input.value = '';

  const userMsg = document.createElement('div');
  userMsg.className = 'chat-msg user';
  userMsg.textContent = message;
  messages.appendChild(userMsg);

  const aiMsg = document.createElement('div');
  aiMsg.className = 'chat-msg ai';
  aiMsg.textContent = 'Thinking...';
  messages.appendChild(aiMsg);
  messages.scrollTop = messages.scrollHeight;

  try {
    const response = await fetch('https://college-enabling-ment-dot.trycloudflare.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2',
        messages: [
  {
    role: 'system',
    content: 'You are a helpful assistant for Evolution Studios, a web design and development company in Mesa, Arizona. Keep answers short and direct. When asked about timelines, give specific estimates like "3-5 days for a basic site" or "1-2 weeks for a custom build". When asked about pricing, say to visit the Get Started page. Always be friendly and professional.'
  },
  { role: 'user', content: message }
],
        stream: false
      })
    });
    const data = await response.json();
    aiMsg.textContent = data.message.content;
  } catch {
    aiMsg.textContent = 'Our AI assistant is currently offline. Check back soon or contact us at evostudiosllc@gmail.com!';
  }
  messages.scrollTop = messages.scrollHeight;
}

document.getElementById('widget-send').addEventListener('click', widgetSend);
document.getElementById('widget-input').addEventListener('keypress', e => {
  if (e.key === 'Enter') widgetSend();
});