/**
 * ==========================================================
 * PROJECT: pyoniX.ai - Neural Interface Memory Node
 * MODULE: Persistent Cloud Storage & History Sync
 * VERSION: 5.0.0-PRO (Memory Node)
 * ==========================================================
 * PERSISTENCE POLICY: 
 * Ensures 10-year data retention for authenticated users.
 * Implements local-first caching for offline accessibility.
 * ==========================================================
 */

const NeuralMemory = {

    /* # memory internal state */
    // වර්තමාන චැට් එකේ මතකය තාවකාලිකව තබා ගැනීම
    state: {
        currentChatId: null,
        sessionHistory: [],
        isSyncing: false,
        maxLocalItems: 50
    },

    /* # memory initializer node */
    // මතක ඒකකය පණ ගැන්වීම
    init: function() {
        console.log("%c[pyoniX_MEMORY]: Activating Neural Archive...", Config.diagnostics.consoleBranding);
        this.loadLocalCache();
    },

    /* # cloud sync trigger */
    // Firebase එකත් එක්ක දත්ත සමකාලීන කිරීම
    syncToCloud: async function(chatData) {
        if (!NeuralAuth.state.isLoggedIn) return;

        const userId = NeuralAuth.state.user.uid;
        this.state.isSyncing = true;

        /* # firestore transaction node */
        try {
            const db = firebase.firestore();
            await db.collection("users").doc(userId).collection("chats").doc(this.state.currentChatId).set({
                messages: chatData,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                title: this.generateChatTitle(chatData)
            }, { merge: true });

            console.log("[pyoniX_MEMORY]: Cloud Sync Successful.");
        } catch (error) {
            console.error("[pyoniX_MEMORY_SYNC_ERROR]:", error);
        } finally {
            this.state.isSyncing = false;
        }
    },

    /* # history retrieval node */
    // පරණ චැට් හිස්ට්‍රිය ක්ලවුඩ් එකෙන් ලබා ගැනීම
    fetchHistory: async function() {
        if (!NeuralAuth.state.isLoggedIn) return [];

        const userId = NeuralAuth.state.user.uid;
        console.log("[pyoniX_MEMORY]: Accessing 10-year archives...");

        try {
            const db = firebase.firestore();
            const snapshot = await db.collection("users").doc(userId).collection("chats")
                .orderBy("lastUpdated", "desc")
                .get();

            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            this.handleMemoryError(error);
            return [];
        }
    },

    /* # local cache management */
    // ඉන්ටර්නෙට් නැති වෙලාවටත් පාවිච්චි කරන්න පෝන් එකේ සේව් කිරීම
    saveToLocal: function(prompt, response) {
        const entry = {
            id: Date.now(),
            prompt: prompt,
            response: response,
            timestamp: new Date().toISOString()
        };

        this.state.sessionHistory.push(entry);
        
        /* # persistence guard node */
        localStorage.setItem('PYONIX_LOCAL_MEMORY', JSON.stringify(this.state.sessionHistory));
        
        // ලොග් වෙලා ඉන්නවා නම් ඔටෝමැටිකව Cloud එකට යැවීම
        if (NeuralAuth.state.isLoggedIn) {
            this.syncToCloud(this.state.sessionHistory);
        }
    },

    /* # session identifier node */
    // අලුත් චැට් එකක් පටන් ගන්න කොට අයිඩී එකක් සෑදීම
    createNewSession: function() {
        this.state.currentChatId = `chat_${Date.now()}`;
        this.state.sessionHistory = [];
        console.log(`[pyoniX_MEMORY]: New Neural Stream: ${this.state.currentChatId}`);
    },

    /* # chat title generator */
    // චැට් එකේ තියෙන දේ අනුව ඒකට නමක් දීම
    generateChatTitle: function(messages) {
        if (messages.length === 0) return "New Void Stream";
        const firstPrompt = messages[0].prompt || "Untitled Stream";
        return firstPrompt.substring(0, 30) + "...";
    },

    /* # memory clear node */
    // මතකය මැකීම (යූසර්ට අවශ්‍ය නම් පමණක්)
    purgeMemory: async function(chatId) {
        if (NeuralAuth.state.isLoggedIn) {
            const userId = NeuralAuth.state.user.uid;
            await firebase.firestore().collection("users").doc(userId).collection("chats").doc(chatId).delete();
        }
        this.state.sessionHistory = [];
        localStorage.removeItem('PYONIX_LOCAL_MEMORY');
        console.log("[pyoniX_MEMORY]: Archive Purged.");
    },

    /* # local cache loader */
    loadLocalCache: function() {
        const cached = localStorage.getItem('PYONIX_LOCAL_MEMORY');
        if (cached) {
            this.state.sessionHistory = JSON.parse(cached);
        }
        if (!this.state.currentChatId) this.createNewSession();
    },

    /* # memory error handler */
    handleMemoryError: function(err) {
        NeuralShield.triggerAlert("Memory Node failure. Local cache active.");
        console.error(`[pyoniX_MEMORY_CRITICAL]: ${err.message}`);
    }
};

/* # activate memory node */
NeuralMemory.init();

/**
 * ==========================================================
 * DEVELOPER NOTICE:
 * Firestore security rules must be configured to only allow
 * users to read/write their own UID-specific documents.
 * ==========================================================
 */
