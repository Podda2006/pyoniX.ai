/**
 * ==========================================================
 * PROJECT: pyoniX.ai - Neural Interface UI Controller
 * MODULE: Interface Orchestration & Event Handling
 * VERSION: 5.0.0-PRO (Nexus UI)
 * ==========================================================
 * UI POLICY: 
 * Manages DOM interactions, sidebar transitions, and 
 * responsive layout adjustments. Optimized for mobile-first.
 * ==========================================================
 */

const UIEngine = {

    /* # UI internal state */
    state: {
        isSidebarOpen: false,
        isSettingsOpen: false,
        isTyping: false,
        activeTheme: "dark-matter"
    },

    /* # system interface initializer */
    init: function() {
        console.log("%c[pyoniX_UI]: Initializing Neural Visuals...", Config.diagnostics.consoleBranding);
        this.cacheElements();
        this.bindEvents();
        this.setupMobileGestures();
        this.renderInitialState();
    },

    /* # DOM element caching */
    // නිතර පාවිච්චි වන HTML කොටස් මතක තබා ගැනීම (Performance සඳහා)
    cacheElements: function() {
        this.sidebar = document.getElementById('main-sidebar');
        this.chatViewport = document.getElementById('chat-viewport');
        this.userInput = document.getElementById('userInput');
        this.sendBtn = document.getElementById('send-btn');
        this.sidebarToggle = document.getElementById('sidebar-toggle');
    },

    /* # event listener binding */
    // බටන්ස් එබූ විට සිදුවන දේ ලියාපදිංචි කිරීම
    bindEvents: function() {
        // සයිඩ්බාර් එක ඇරීම/වැසීම
        this.sidebarToggle.addEventListener('click', () => this.toggleSidebar());

        // මැසේජ් එකක් යැවීම (Enter key එක එබූ විට)
        this.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleUserAction();
            }
        });

        // සෙන්ඩ් බටන් එක එබූ විට
        this.sendBtn.addEventListener('click', () => this.handleUserAction());

        /* # input auto-resize */
        // ටයිප් කරන කොට චැට් බොක්ස් එක ලොකු වීම
        this.userInput.addEventListener('input', () => {
            this.userInput.style.height = 'auto';
            this.userInput.style.height = (this.userInput.scrollHeight) + 'px';
        });
    },

    /* # sidebar navigation logic */
    toggleSidebar: function() {
        this.state.isSidebarOpen = !this.state.isSidebarOpen;
        if (this.state.isSidebarOpen) {
            this.sidebar.classList.add('active');
            this.sidebar.style.left = '0';
        } else {
            this.sidebar.classList.remove('active');
            this.sidebar.style.left = '-100%';
        }
    },

    /* # mobile gesture management */
    // පෝන් එකේ ස්ක්‍රීන් එක අයිනේ ඉඳන් ඇද්දම සයිඩ්බාර් එක එන විදිය (Swipe)
    setupMobileGestures: function() {
        let touchStartX = 0;
        document.addEventListener('touchstart', (e) => touchStartX = e.touches[0].clientX);
        
        document.addEventListener('touchend', (e) => {
            let touchEndX = e.changedTouches[0].clientX;
            // දකුණට ඇද්දම සයිඩ්බාර් එක ඇරීම
            if (touchEndX - touchStartX > 100) this.toggleSidebar();
            // වමට ඇද්දම වැසීම
            if (touchStartX - touchEndX > 100 && this.state.isSidebarOpen) this.toggleSidebar();
        });
    },

    /* # user interaction flow */
    // යූසර් ප්‍රොම්ප්ට් එකක් ගැහුවම සිදුවන සම්පූර්ණ ක්‍රියාවලිය
    handleUserAction: async function() {
        const text = this.userInput.value.trim();
        if (!text || this.state.isTyping) return;

        this.state.isTyping = true;
        this.userInput.value = "";
        this.userInput.style.height = 'auto';

        /* # local message rendering */
        this.appendUserMessage(text);
        
        // AI එකෙන් පිළිතුර ලබා ගැනීම (Bridge එක හරහා)
        const response = await ApiNexus.fetchResponse(text, NeuralMemory.getRecentContext());
        
        if (response) {
            await StreamEngine.processStream(response, this.chatViewport);
        } else {
            NeuralShield.triggerAlert("Neural link failed. Check connectivity.");
        }

        this.state.isTyping = false;
    },

    /* # user message factory */
    appendUserMessage: function(text) {
        const div = document.createElement('div');
        div.className = 'msg-container msg-user msg-entrance';
        div.innerHTML = `
            <div class="msg-content-body">${pyoniX_Sanitize(text)}</div>
            <div class="user-avatar"><i class="fas fa-user-circle"></i></div>
        `;
        this.chatViewport.appendChild(div);
        this.chatViewport.scrollTop = this.chatViewport.scrollHeight;
    },

    /* # visual diagnostics update */
    // සයිට් එකේ පල්ලෙහා තියෙන තත්ව පුවරුව යාවත්කාලීන කිරීම
    updateStatus: function(status, color) {
        const indicator = document.getElementById('connection-status');
        if (indicator) {
            indicator.textContent = status.toUpperCase();
            indicator.style.color = color;
        }
    },

    /* # theme switching node */
    switchTheme: function(themeName) {
        document.body.className = `theme-${themeName}`;
        this.state.activeTheme = themeName;
        localStorage.setItem('PYONIX_THEME', themeName);
    },

    renderInitialState: function() {
        this.updateStatus("Online", "#00ff88");
        console.log("[pyoniX_UI]: Interface Ready. Welcome Node.");
    }
};

/* # activate UI control node */
UIEngine.init();

/**
 * ==========================================================
 * DEVELOPER NOTE:
 * The UI Engine enforces a 60fps interaction model through 
 * CSS-hardware acceleration and efficient DOM batching.
 * ==========================================================
 */
