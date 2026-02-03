/**
 * ui-engine.js - Visual Output & Interaction Controller
 */

const UIEngine = {
    viewport: document.getElementById('chat-viewport'),
    status: document.getElementById('api-status'),

    renderMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `msg-wrapper ${type}-wrapper`;
        
        const tag = type === 'ai' ? '[pyoniX_CORE]' : '[USER_AUTH]';
        const timestamp = new Date().toLocaleTimeString();

        messageDiv.innerHTML = `
            <div class="msg-meta">
                <span class="msg-tag">${tag}</span>
                <span class="msg-time">${timestamp}</span>
            </div>
            <div class="msg-content" id="msg-${Date.now()}"></div>
        `;

        this.viewport.appendChild(messageDiv);
        this.typeWriter(text, `msg-${Date.now()}`);
        this.scrollToBottom();
    },

    typeWriter(text, elementId) {
        let i = 0;
        const el = document.getElementById(elementId);
        const interval = setInterval(() => {
            if (i < text.length) {
                el.innerHTML += text.charAt(i);
                i++;
                this.scrollToBottom();
            } else {
                clearInterval(interval);
            }
        }, Config.ui.typingSpeed);
    },

    toggleLoading(isLoading) {
        this.status.innerHTML = isLoading ? "PROCESSING..." : "ONLINE";
        this.status.className = isLoading ? "neon-red-text" : "cyan-text";
    },

    scrollToBottom() {
        this.viewport.scrollTop = this.viewport.scrollHeight;
    }
};
