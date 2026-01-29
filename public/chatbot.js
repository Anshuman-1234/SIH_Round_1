const chatbotResponses = {
    greeting: "Hello Traveler! I'm your AI Travel Assistant. How can I guide your journey today? ",
    help: "I can help with navigation:<br>• Type <b>'Dashboard'</b> to go home<br>• Type <b>'SOS'</b> for emergencies<br>• Type <b>'FIR'</b> to report incidents<br>• Type <b>'Bucket'</b> to see your list<br>• Type <b>'Theme'</b> to change colors",
    nav_home: "Switching to your mission dashboard center...",
    nav_fir: "Opening the security incident registry...",
    nav_sos: "Activating emergency signal hub...",
    nav_bucket: "Viewing your planned destinations...",
    nav_theme: "Opening the Palette Studio drawer...",
    safety_tip: "Pro Tip: Always stay within the green 'Safe Nodes' marked on your route maps.",
    unknown: "Analyzing request... I'm not sure about that. Try typing <b>'help'</b> for a module list!"
};

function toggleChat() {
    const widget = document.getElementById('chatbotWidget');
    if (widget.style.display === 'flex') {
        widget.classList.remove('active');
        setTimeout(() => widget.style.display = 'none', 300);
    } else {
        widget.style.display = 'flex';
        setTimeout(() => widget.classList.add('active'), 10);
    }
}

function handleInput() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim().toLowerCase();
    if (!text) return;

    appendMsg('user', input.value);
    input.value = '';

    // AI Simulation logic
    setTimeout(() => {
        let resp = chatbotResponses.unknown;
        if (text.includes('hi') || text.includes('hello')) resp = chatbotResponses.greeting;
        else if (text.includes('help')) resp = chatbotResponses.help;
        else if (text.includes('dash')) resp = chatbotResponses.nav_home;
        else if (text.includes('fir')) resp = chatbotResponses.nav_fir;
        else if (text.includes('sos')) resp = chatbotResponses.nav_sos;
        else if (text.includes('bucket')) resp = chatbotResponses.nav_bucket;
        else if (text.includes('theme')) {
            resp = chatbotResponses.nav_theme;
            if (typeof toggleThemeDrawer === 'function') toggleThemeDrawer();
        } else if (text.includes('safe')) resp = chatbotResponses.safety_tip;

        appendMsg('bot', resp);
    }, 600);
}

function appendMsg(role, text) {
    const area = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `msg msg-${role} animate-fade-in`;
    div.style.cssText = `
        max-width: 85%;
        padding: 0.875rem 1.125rem;
        border-radius: 1.25rem;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        line-height: 1.5;
        position: relative;
        ${role === 'user' ? 'align-self: flex-end; background: var(--primary); color: #000; border-bottom-right-radius: 0.25rem;' : 'align-self: flex-start; background: #2d323b; color: #fff; border-bottom-left-radius: 0.25rem;'}
    `;
    div.innerHTML = text;
    area.appendChild(div);
    area.scrollTop = area.scrollHeight;
}

window.addEventListener('load', () => {
    const chatHtml = `
    <style>
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        #chatbotWidget {
            position: fixed;
            bottom: 5rem;
            right: 1.5rem;
            width: 380px;
            max-width: calc(100vw - 3rem);
            height: 550px;
            max-height: calc(100vh - 8rem);
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 1.5rem;
            display: none;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
            z-index: 3000;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            transform: translateY(20px);
        }
        #chatbotWidget.active {
            opacity: 1;
            transform: translateY(0);
        }
        .animate-fade-in { animation: slideIn 0.3s ease forwards; }
        
        @media (max-width: 600px) {
            #chatbotWidget {
                bottom: 0;
                right: 0;
                width: 100vw;
                height: 100vh;
                max-height: 100vh;
                border-radius: 0;
            }
            .chatbot-fab { bottom: 1rem !important; right: 1rem !important; }
        }
    </style>
    <div id="chatbotWidget">
        <div style="background: var(--primary); color: #000; padding: 1.25rem 1.75rem; display: flex; align-items: center; justify-content: space-between; font-weight: 800;">
            <div style="display: flex; align-items: center; gap: 0.75rem;"><i class="ph ph-robot" style="font-size: 1.5rem;"></i> AI Assistant</div>
            <i class="ph ph-x" style="cursor: pointer; font-size: 1.25rem;" onclick="toggleChat()"></i>
        </div>
        <div id="chatMessages" style="flex: 1; padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; background: var(--bg-deep);">
            <div class="msg bot" style="align-self: flex-start; background: #2d323b; color: #fff; padding: 0.875rem 1.125rem; border-radius: 1.25rem; font-size: 0.9rem; margin-bottom: 1rem; border-bottom-left-radius: 0.25rem;">
                Authorized link established. How can I help you navigate the Travel Mate network?
            </div>
        </div>
        <div style="padding: 1.25rem; border-top: 1px solid var(--border-color); display: flex; gap: 0.75rem; background: var(--bg-sidebar);">
            <input type="text" id="chatInput" placeholder="Command AI..." style="flex:1; background: var(--bg-deep); border: 1px solid var(--border-color); border-radius: 1rem; padding: 0.75rem 1.25rem; color: #fff; outline:none; font-size: 0.9375rem;">
            <button onclick="handleInput()" style="background: var(--primary); border:none; border-radius: 1rem; width: 48px; height: 48px; cursor:pointer; display: flex; align-items: center; justify-content: center; transition: var(--transition);"><i class="ph ph-paper-plane-right" style="font-size: 1.25rem; color: #000;"></i></button>
        </div>
    </div>
    <div class="chatbot-fab" onclick="toggleChat()" style="position: fixed; bottom: 2rem; right: 2rem; width: 4rem; height: 4rem; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); cursor: pointer; z-index: 2999; transition: var(--transition);">
        <i class="ph ph-chat-centered-text" style="font-size: 2rem; color: #000;"></i>
    </div>
    `;
    const container = document.createElement('div');
    container.id = "chatbotWrapper";
    container.innerHTML = chatHtml;
    document.body.appendChild(container);

    document.getElementById('chatInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleInput();
    });
});
