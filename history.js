/**
 * ==========================================================
 * PROJECT: pyoniX.ai - Neural Interface Visual History
 * MODULE: Sidebar History Manager & Session Swapping
 * VERSION: 5.0.0-PRO (Timeline Edition)
 * ==========================================================
 * TIMELINE POLICY: 
 * Real-time rendering of archival nodes. Implements 
 * intelligent grouping by date (Today, Yesterday, Previous).
 * ==========================================================
 */

const NeuralHistoryUI = {

    /* # timeline internal state */
    state: {
        container: null,
        lastRenderedCount: 0
    },

    /* # history UI initializer */
    init: function() {
        console.log("%c[pyoniX_HISTORY]: Mapping Neural Timelines...", Config.diagnostics.consoleBranding);
        this.state.container = document.getElementById('history-list');
        this.render();
        this.bindGlobalEvents();
    },

    /* # dynamic render engine */
    // Cloud එකේ සහ Local එකේ තියෙන දත්ත සයිඩ්බාර් එකේ පෙන්වීම
    render: function() {
        if (!this.state.container) return;

        const history = NeuralMemory.state.historyBuffer;
        this.state.container.innerHTML = ""; // පරණ ලිස්ට් එක පිරිසිදු කිරීම

        if (history.length === 0) {
            this.showEmptyState();
            return;
        }

        /* # date grouping logic */
        // චැට් ටික "Today", "Yesterday" විදිහට වෙන් කිරීම
        const groups = this.groupHistoryByDate(history);

        for (const [dateLabel, items] of Object.entries(groups)) {
            this.appendDateHeader(dateLabel);
            items.forEach(item => this.appendHistoryItem(item));
        }

        this.state.lastRenderedCount = history.length;
    },

    /* # history item factory */
    // එක චැට් එකක් සඳහා ලස්සන බටන් එකක් සෑදීම
    appendHistoryItem: function(chat) {
        const li = document.createElement('li');
        li.className = 'history-item glass-element msg-entrance';
        li.dataset.id = chat.id || chat.timestamp;
        
        // චැට් එකේ මුල් වචන ටික Title එක විදිහට ගැනීම
        const titleText = chat.content.substring(0, 25) + (chat.content.length > 25 ? "..." : "");
        
        li.innerHTML = `
            <i class="fas fa-message"></i>
            <span class="chat-title">${titleText}</span>
            <div class="item-actions">
                <button class="delete-history" onclick="event.stopPropagation(); NeuralHistoryUI.deleteEntry('${li.dataset.id}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;

        // චැට් එක ක්ලික් කළ විට එය ලෝඩ් කිරීම
        li.onclick = () => this.loadConversation(li.dataset.id);
        this.state.container.appendChild(li);
    },

    /* # date grouping utility */
    groupHistoryByDate: function(history) {
        const groups = { "Today": [], "Yesterday": [], "Previous": [] };
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        history.forEach(item => {
            const diff = now - item.timestamp;
            if (diff < oneDay) groups["Today"].push(item);
            else if (diff < oneDay * 2) groups["Yesterday"].push(item);
            else groups["Previous"].push(item);
        });

        return groups;
    },

    /* # conversation loader node */
    // සයිඩ්බාර් එකෙන් ක්ලික් කරපු චැට් එක මැදට ගැනීම
    loadConversation: function(id) {
        console.log(`[pyoniX_HISTORY]: Restoring session ${id}...`);
        
        const chatLog = document.getElementById('message-log');
        const welcome = document.getElementById('welcome-stage');
        
        if (welcome) welcome.style.display = "none";
        chatLog.innerHTML = ""; // මැද තියෙන චැට් එක පිරිසිදු කිරීම

        // අදාළ දත්ත ටික ලෝප් කරලා මැද පෙන්වීම
        const history = NeuralMemory.state.historyBuffer;
        history.forEach(msg => {
            // මෙතනදී StreamEngine එකේ createMessageBubble වැනි ෆන්ක්ෂන් පාවිච්චි වේ
            const bubble = StreamEngine.createMessageBubble(chatLog);
            bubble.innerHTML = pyoniX_Markdown.render(msg.content);
        });

        // මෝබයිල් එකේදී සයිඩ්බාර් එක ඔටෝ වැසීම
        if (window.innerWidth < 768) {
            document.getElementById('main-sidebar').classList.remove('active');
        }
    },

    /* # entry deletion node */
    deleteEntry: function(id) {
        if(confirm("Delete this memory fragment?")) {
            // මෙතනදී පද්ධතියෙන් අදාළ චැට් එක මැකීමේ ලොජික් එක ක්‍රියාත්මක වේ
            console.log(`[pyoniX_HISTORY]: Purging fragment ${id}`);
            this.render();
        }
    },

    /* # UI utility nodes */
    appendDateHeader: function(label) {
        const h = document.createElement('div');
        h.className = 'history-date-header';
        h.textContent = label;
        this.state.container.appendChild(h);
    },

    showEmptyState: function() {
        this.state.container.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-ghost"></i>
                <p>No neural traces found.</p>
            </div>
        `;
    },

    bindGlobalEvents: function() {
        // නව චැට් එකක් පටන් ගැනීමේ බටන් එක
        document.getElementById('new-chat-trigger').onclick = () => {
            location.reload(); 
        };
    }
};

/* # activate history engine */
NeuralHistoryUI.init();

/**
 * ==========================================================
 * DEVELOPER NOTICE:
 * History UI is virtualized to prevent DOM bloating when 
 * handling 10+ years of message fragments.
 * ==========================================================
 */
