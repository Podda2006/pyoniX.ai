/**
 * ui-engine.js - Advanced Visual and Interactive Controller
 * Features: Typewriter Effect, Dynamic Status, Animated Messages
 */

const UIEngine = {
    viewport: document.getElementById('chat-viewport'),
    statusDisplay: document.getElementById('api-status'),
    loaderStatus: document.getElementById('loader-status'),
    logList: document.getElementById('log-list'), // Log stream සඳහා

    renderMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `msg-wrapper ${type}-wrapper`;
        
        const tag = type === 'ai' ? '[PYONIX_CORE]' : type === 'error' ? '[SYS_ALARM]' : '[USER_AUTH]';
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });

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
        if (!el) return;

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
        this.statusDisplay.innerText = isLoading ? Config.statusCodes.BUSY : Config.statusCodes.READY;
        this.statusDisplay.className = isLoading ? "neon-purple-text" : "neon-blue-text";
        this.loaderStatus.innerText = isLoading ? "PROCESSING_NEURAL_NODES..." : "CONNECTION_OPTIMIZED.";
    },

    updateLog(message) {
        const logItem = document.createElement('li');
        logItem.innerText = `[${new Date().toLocaleTimeString()}] ${message}`;
        this.logList.appendChild(logItem);
        if (this.logList.children.length > 5) { // Show only last 5 logs
            this.logList.removeChild(this.logList.firstChild);
        }
    },

    scrollToBottom() {
        this.viewport.scrollTop = this.viewport.scrollHeight;
    }
};
