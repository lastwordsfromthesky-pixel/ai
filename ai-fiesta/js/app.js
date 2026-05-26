// Models Database
const models = [
  { id: 1, name: 'GPT-4o', provider: 'openai', emoji: '🤖', description: 'Most capable GPT model', gradient: 'linear-gradient(135deg, #667eea, #764ba2)', apiModel: 'gpt-4o' },
  { id: 2, name: 'GPT-3.5 Turbo', provider: 'openai', emoji: '⚡', description: 'Fast & affordable option', gradient: 'linear-gradient(135deg, #11998e, #38ef7d)', apiModel: 'gpt-3.5-turbo' },
  { id: 3, name: 'Claude Sonnet 4', provider: 'anthropic', emoji: '🧠', description: 'Best for reasoning tasks', gradient: 'linear-gradient(135deg, #f7971e, #ffd200)', apiModel: 'claude-sonnet-4-5' },
  { id: 4, name: 'Claude 3 Opus', provider: 'anthropic', emoji: '👑', description: 'Most powerful Claude model', gradient: 'linear-gradient(135deg, #f953c6, #b91d73)', apiModel: 'claude-opus-4-5' },
  { id: 5, name: 'Gemini 1.5 Pro', provider: 'google', emoji: '🌟', description: 'Multimodal powerhouse from Google', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', apiModel: 'gemini-1.5-pro' },
  { id: 6, name: 'Gemini Flash', provider: 'google', emoji: '⚡', description: 'Ultra-fast responses', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)', apiModel: 'gemini-1.5-flash' },
  { id: 7, name: 'Mistral Large', provider: 'mistral', emoji: '🚀', description: 'Top European AI model', gradient: 'linear-gradient(135deg, #fa709a, #fee140)', apiModel: 'mistral-large-latest' },
  { id: 8, name: 'Mistral 7B', provider: 'mistral', emoji: '⚙️', description: 'Lightweight & efficient', gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', apiModel: 'open-mistral-7b' },
  { id: 9, name: 'Command R+', provider: 'cohere', emoji: '📊', description: 'Best for RAG tasks', gradient: 'linear-gradient(135deg, #fd746c, #ff9068)', apiModel: 'command-r-plus' },
  { id: 10, name: 'Command R', provider: 'cohere', emoji: '💡', description: 'Efficient & accurate', gradient: 'linear-gradient(135deg, #30cfd0, #330867)', apiModel: 'command-r' }
];

// Toast System
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Format Time
function formatTime(date = new Date()) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// Render Models Grid
function renderModels(filter = 'all', search = '') {
  const grid = document.getElementById('models-grid');
  grid.innerHTML = '';

  let filteredModels = models;

  if (filter !== 'all') {
    filteredModels = filteredModels.filter(m => m.provider === filter);
  }

  if (search) {
    filteredModels = filteredModels.filter(m =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  filteredModels.forEach(model => {
  const storageProvider = getStorageKeyForProvider(model.provider);
  const hasKey = !!localStorage.getItem(`aikey_${storageProvider}`);
    const card = document.createElement('div');
    card.className = 'model-card';
    card.style.setProperty('--gradient', model.gradient);
    
    card.innerHTML = `
      <div class="model-header">
        <span>${model.emoji}</span>
        <span class="model-provider">${model.provider.charAt(0).toUpperCase() + model.provider.slice(1)}</span>
      </div>
      <div class="model-name">${model.name}</div>
      <div class="model-description">${model.description}</div>
      <div class="model-footer">
        <div class="model-badge ${hasKey ? 'ready' : 'nokey'}">
          ${hasKey ? '🔑 Ready' : '🔴 No Key'}
        </div>
        <button class="model-card-btn" data-model-id="${model.id}">Chat Now →</button>
      </div>
    `;

    card.querySelector('.model-card-btn').addEventListener('click', () => openChatModal(model));
    grid.appendChild(card);
  });

  // Show empty state
  if (filteredModels.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: rgba(255,255,255,0.5);">No models found. Try adjusting your filters.</div>';
  }
}

// Update Stats
function updateStats() {
  const msgCount = parseInt(localStorage.getItem('msg_count')) || 0;
  document.getElementById('msg-count').textContent = msgCount;

  let keysCount = 0;
  ['openai', 'anthropic', 'gemini', 'mistral', 'cohere'].forEach(provider => {
    if (localStorage.getItem(`aikey_${provider}`)) keysCount++;
  });
  document.getElementById('keys-count').textContent = keysCount;
}

function getStorageKeyForProvider(provider) {
  return provider === 'google' ? 'gemini' : provider;
}

// Update User Info
function updateUserInfo(user) {
  const avatar = document.getElementById('user-avatar');
  const email = document.getElementById('user-email');
  
  const firstLetter = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
  avatar.textContent = firstLetter;
  email.textContent = user.email;
}

// Initialize Settings Modal
function initSettingsModal() {
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const modalOverlay = settingsModal.querySelector('.modal-overlay');
  const modalClose = settingsModal.querySelector('.modal-close');

  settingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
    loadKeyStatus();
  });

  modalClose.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
  });

  modalOverlay.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
  });

  // Tab switching
  document.querySelectorAll('.settings-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.settings-tab-content').forEach(c => c.classList.remove('active'));
      document.querySelector(`.settings-tab-content[data-tab="${tabName}"]`).classList.add('active');
    });
  });

  // Password toggles in settings
  document.querySelectorAll('#settings-modal .password-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.textContent = isPassword ? '👁️‍🗨️' : '👁️';
    });
  });

  // Save buttons
  document.querySelectorAll('#settings-modal .btn-gradient').forEach(btn => {
    btn.addEventListener('click', async () => {
      const provider = btn.dataset.provider;
      const inputId = `key-${provider === 'google' ? 'gemini' : provider}`;
      const key = document.getElementById(inputId).value.trim();

      if (!key) {
        showToast(`❌ Please enter your ${provider} API key`, 'error');
        return;
      }

      localStorage.setItem(`aikey_${provider === 'google' ? 'gemini' : provider}`, key);
      showToast(`✅ ${provider} key saved!`, 'success');
      loadKeyStatus();
      updateStats();
    });
  });

  loadKeyStatus();
}

// Load Key Status
function loadKeyStatus() {
  const providers = [
    { key: 'openai', status: 'status-openai', input: 'key-openai' },
    { key: 'anthropic', status: 'status-anthropic', input: 'key-anthropic' },
    { key: 'gemini', status: 'status-google', input: 'key-gemini' },
    { key: 'mistral', status: 'status-mistral', input: 'key-mistral' },
    { key: 'cohere', status: 'status-cohere', input: 'key-cohere' }
  ];

  providers.forEach(({ key, status, input }) => {
    const badge = document.getElementById(status);
    const inputEl = document.getElementById(input);
    const keyValue = localStorage.getItem(`aikey_${key}`);
    const hasKey = !!keyValue;
    
    // Update input display
    if (inputEl && hasKey) {
      inputEl.value = keyValue.substring(0, 8) + '***' + keyValue.substring(keyValue.length - 4);
      inputEl.style.color = 'rgba(255, 255, 255, 0.6)';
    }
    
    // Update badge
    if (badge) {
      if (hasKey) {
        badge.textContent = '✅ Key Active';
        badge.classList.add('active');
        badge.classList.remove('nokey');
      } else {
        badge.textContent = '🔴 No Key';
        badge.classList.remove('active');
        badge.classList.add('nokey');
      }
    }
  });
}

// Chat Modal
let currentModel = null;
let conversations = {};

function openChatModal(model) {
  currentModel = model;
  const chatModal = document.getElementById('chat-modal');
  const chatMessages = document.getElementById('chat-messages');
  
  document.getElementById('chat-model-name').textContent = model.name;
  document.getElementById('chat-provider-name').textContent = model.provider.toUpperCase();
  
  chatMessages.innerHTML = '';
  
  if (!conversations[model.id]) {
    conversations[model.id] = [];
  }
  
  conversations[model.id].forEach(msg => renderMessage(msg.role, msg.content));
  
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  chatModal.classList.remove('hidden');
  
  const storageProvider = getStorageKeyForProvider(model.provider);
  const hasKey = !!localStorage.getItem(`aikey_${storageProvider}`);
  const keyWarning = document.getElementById('key-warning');
  if (!hasKey) {
    keyWarning.classList.remove('hidden');
  } else {
    keyWarning.classList.add('hidden');
  }

  document.getElementById('chat-textarea').focus();
}

function closeChatModal() {
  document.getElementById('chat-modal').classList.add('hidden');
  currentModel = null;
}

function renderMessage(role, content, timestamp = null) {
  const chatMessages = document.getElementById('chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}`;
  
  if (!timestamp) timestamp = formatTime();
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.innerHTML = renderMarkdown(content);
  
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'message-bubble';
  bubbleDiv.appendChild(contentDiv);
  
  const timeDiv = document.createElement('div');
  timeDiv.className = 'message-time';
  timeDiv.textContent = timestamp;
  
  messageDiv.appendChild(bubbleDiv);
  messageDiv.appendChild(timeDiv);
  
  if (role === 'ai') {
    const copyBtn = document.createElement('button');
    copyBtn.className = 'message-copy-btn';
    copyBtn.textContent = '📋 Copy';
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(content);
      showToast('✅ Copied to clipboard!', 'success');
    });
    bubbleDiv.appendChild(copyBtn);
  }
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderTyping() {
  const chatMessages = document.getElementById('chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai';
  messageDiv.id = 'typing-indicator';
  
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'message-bubble';
  
  const typingDiv = document.createElement('div');
  typingDiv.className = 'typing-indicator';
  
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = 'typing-dot';
    typingDiv.appendChild(dot);
  }
  
  bubbleDiv.appendChild(typingDiv);
  messageDiv.appendChild(bubbleDiv);
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById('typing-indicator');
  if (typing) typing.remove();
}

// Markdown Rendering (Simple)
function renderMarkdown(text) {
  let html = text;
  
  // Code blocks
  html = html.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  
  // Remove extra <p> tags
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<pre>|<ul>|<table>)/g, '$1');
  html = html.replace(/(<\/pre>|<\/ul>|<\/table>)<\/p>/g, '$1');
  
  return html;
}

// API Calls
async function callAPI(model, messages) {
  const provider = model.provider;
  const apiKey = localStorage.getItem(`aikey_${provider === 'google' ? 'gemini' : provider}`);

  if (!apiKey) {
    throw new Error(`No API key for ${provider}`);
  }

  const lastMessage = messages[messages.length - 1].content;

  try {
    if (provider === 'openai') {
      return await callOpenAI(model.apiModel, messages, apiKey);
    } else if (provider === 'anthropic') {
      return await callAnthropic(model.apiModel, messages, apiKey);
    } else if (provider === 'google') {
      return await callGemini(model.apiModel, lastMessage, apiKey);
    } else if (provider === 'mistral') {
      return await callMistral(model.apiModel, messages, apiKey);
    } else if (provider === 'cohere') {
      return await callCohere(model.apiModel, lastMessage, apiKey);
    }
  } catch (error) {
    throw error;
  }
}

async function callOpenAI(model, messages, apiKey) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message || `OpenAI Error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callAnthropic(model, messages, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 1000,
      messages: messages
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message || `Anthropic Error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

async function callGemini(model, text, apiKey) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: text }]
          }
        ]
      })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message || `Gemini Error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function callMistral(model, messages, apiKey) {
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Mistral Error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callCohere(model, text, apiKey) {
  const response = await fetch('https://api.cohere.ai/v2/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: text }]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Cohere Error: ${response.status}`);
  }

  const data = await response.json();
  return data.message.content[0].text;
}

// Chat Input Handling
function initChatInput() {
  const textarea = document.getElementById('chat-textarea');
  const charCount = document.getElementById('char-count');
  const sendBtn = document.getElementById('chat-send');
  const clearBtn = document.getElementById('chat-clear');
  const chatModal = document.getElementById('chat-modal');
  const modalOverlay = chatModal.querySelector('.modal-overlay');
  const modalClose = chatModal.querySelector('.modal-close');

  // Auto-resize textarea
  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    
    const len = textarea.value.length;
    charCount.textContent = len;
  });

  // Send message
  sendBtn.addEventListener('click', sendMessage);

  // Send on Enter, new line on Shift+Enter
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Clear conversation
  clearBtn.addEventListener('click', () => {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    if (currentModel && conversations[currentModel.id]) {
      conversations[currentModel.id] = [];
    }
  });

  // Close modal
  modalClose.addEventListener('click', closeChatModal);
  modalOverlay.addEventListener('click', closeChatModal);
}

async function sendMessage() {
  if (!currentModel) return;

  const textarea = document.getElementById('chat-textarea');
  const message = textarea.value.trim();

  if (!message) {
    showToast('❌ Message cannot be empty', 'error');
    return;
  }

  const hasKey = !!localStorage.getItem(`aikey_${currentModel.provider}`);
  if (!hasKey) {
    showToast(`❌ Please add your ${currentModel.provider} API key in Settings`, 'error');
    return;
  }

  // Add user message to conversation
  if (!conversations[currentModel.id]) conversations[currentModel.id] = [];
  conversations[currentModel.id].push({
    role: 'user',
    content: message
  });

  renderMessage('user', message);
  textarea.value = '';
  textarea.style.height = 'auto';
  document.getElementById('char-count').textContent = '0';

  renderTyping();

  try {
    // Build messages array for API
    const messages = conversations[currentModel.id].map(msg => ({
      role: msg.role === 'ai' ? 'assistant' : 'user',
      content: msg.content
    }));

    const response = await callAPI(currentModel, messages);

    removeTyping();

    // Add AI response to conversation
    conversations[currentModel.id].push({
      role: 'ai',
      content: response
    });

    renderMessage('ai', response);

    // Increment message count
    const msgCount = parseInt(localStorage.getItem('msg_count')) || 0;
    localStorage.setItem('msg_count', msgCount + 1);
    updateStats();

  } catch (error) {
    removeTyping();
    const errorMessage = error.message || 'Unknown error occurred';
    renderMessage('ai', `❌ Error: ${errorMessage}`);
    console.error('API Error:', error);
  }
}

// Scroll to Top
function initScrollToTop() {
  const btn = document.getElementById('scroll-top-btn');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Search & Filter
function initSearchAndFilter() {
  const searchInput = document.getElementById('search-input');
  const pills = document.querySelectorAll('.pill');

  let currentFilter = 'all';

  searchInput.addEventListener('input', () => {
    renderModels(currentFilter, searchInput.value);
  });

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.provider;
      renderModels(currentFilter, searchInput.value);
    });
  });
}

// Initialize Dashboard
firebase.auth().onAuthStateChanged((user) => {
  if (user && window.location.pathname.includes('dashboard.html')) {
    updateUserInfo(user);
    renderModels();
    initSettingsModal();
    initChatInput();
    initScrollToTop();
    initSearchAndFilter();
    
    // Force load key status after a brief delay to ensure DOM is ready
    setTimeout(() => {
      loadKeyStatus();
      updateStats();
    }, 200);
  }
});
