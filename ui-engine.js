const UIEngine = {
    viewport: document.getElementById('chat-viewport'),
    status: document.getElementById('api-status'),

    renderMessage(text, type) {
        const div = document.createElement('div');
        div.className = `msg-wrapper ${type}-wrapper`;
        const tag = type === 'ai' ? '[pyoniX_CORE]' : type === 'error' ? '[SYS_ALARM]' : '[USER_AUTH]';
        
        div.innerHTML = `
            <div class="msg-meta"><span class="msg-tag">${tag}</span></div>
            <div class="msg-content">${text}</div>
        `;
        this.viewport.appendChild(div);
        this.viewport.scrollTop = this.viewport.scrollHeight;
    },

    toggleLoading(isLoading) {
        this.status.innerText = isLoading ? "SYNCING..." : "ACTIVE";
        this.status.style.color = isLoading ? "var(--neon-red)" : "var(--neon-cyan)";
    }
};
