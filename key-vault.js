/**
 * ==========================================================
 * PROJECT: pyoniX.ai - Neural Interface Security Node
 * MODULE: API Key Vault & Dynamic Rotation Logic
 * VERSION: 5.0.0-PRO (Vault Edition)
 * ==========================================================
 * VAULT POLICY: 
 * Secure management of public nodes and private user-keys.
 * Implements round-robin rotation for load balancing.
 * ==========================================================
 */

const KeyVault = {

    /* # vault internal state */
    // කී වල තත්වය සහ දැනට පාවිච්චි වන කී එකේ අංකය
    state: {
        currentIndices: {
            groq: 0,
            gemini: 0,
            huggingface: 0
        },
        failures: {},
        isUserKeyActive: false
    },

    /* # vault initialization node */
    init: function() {
        console.log("%c[pyoniX_VAULT]: Shielding API Clusters...", Config.diagnostics.consoleBranding);
        this.verifyUserKeys();
    },

    /* # user key verification */
    // යූසර් තමන්ගේම කී එකක් දීලා තියෙනවද කියලා පරීක්ෂා කිරීම
    verifyUserKeys: function() {
        const storedKey = localStorage.getItem('PYONIX_USER_KEYS');
        if (storedKey) {
            this.state.isUserKeyActive = true;
            console.log("[pyoniX_VAULT]: Personal Neural Node Detected.");
        }
    },

    /* # dynamic key retriever */
    // වැඩ කරන කී එකක් නිවැරදිව ලබා දීම
    getActiveKey: function(provider) {
        /* # user key priority node */
        // යූසර්ගේ කී එකක් තියෙනවා නම් ඒකට මුල් තැන දීම
        if (this.state.isUserKeyActive) {
            const rawKey = localStorage.getItem('PYONIX_USER_KEYS');
            return NeuralShield.decryptData(rawKey);
        }

        /* # system key rotation node */
        // අපේ පොදු කී ටික මාරුවෙන් මාරුවට ලබා දීම
        const keys = Config.vault.nodes[provider.toLowerCase()];
        const index = this.state.currentIndices[provider.toLowerCase()];
        
        if (!keys || keys.length === 0) {
            return null;
        }

        return keys[index];
    },

    /* # node rotation logic */
    // කී එකක් වැඩ නැති වුණොත් ඊළඟ එකට මාරු වීම
    rotateKey: function(provider) {
        const p = provider.toLowerCase();
        const keys = Config.vault.nodes[p];
        
        console.warn(`[pyoniX_VAULT]: Rotating node for ${provider}...`);
        
        // ඊළඟ කී එකට මාරු වීම (Round Robin)
        this.state.currentIndices[p] = (this.state.currentIndices[p] + 1) % keys.length;
        
        // යම් හෙයකින් සියලුම කී ලිමිට් පැනලා නම්
        if (this.state.currentIndices[p] === 0) {
            this.handleAllNodesDown(provider);
        }
    },

    /* # private key injection */
    // යූසර්ගේ කී එක ආරක්ෂිතව ගබඩා කිරීම
    injectUserKey: function(key) {
        if (!key || key.length < 15) return false;
        
        const encryptedKey = NeuralShield.encryptData(key);
        localStorage.setItem('PYONIX_USER_KEYS', encryptedKey);
        this.state.isUserKeyActive = true;
        
        console.log("[pyoniX_VAULT]: Custom Key Injected Successfully.");
        return true;
    },

    /* # key removal node */
    // සේව් කරපු කී එක ඉවත් කිරීම
    purgeUserKey: function() {
        localStorage.removeItem('PYONIX_USER_KEYS');
        this.state.isUserKeyActive = false;
        location.reload();
    },

    /* # usage failure tracking */
    // කී එකක් වැඩ කරන්නේ නැති වාර ගණන සටහන් කිරීම
    reportFailure: function(provider, key) {
        const failureId = `${provider}_${key.substring(0, 10)}`;
        this.state.failures[failureId] = (this.state.failures[failureId] || 0) + 1;

        if (this.state.failures[failureId] >= Config.vault.maxFailuresPerNode) {
            this.rotateKey(provider);
        }
    },

    /* # critical failure handler */
    // සියලුම කී වැඩ නැති වුණොත් පණිවිඩයක් දීම
    handleAllNodesDown: function(provider) {
        NeuralShield.triggerAlert(`All ${provider} nodes are exhausted. Try later.`);
        console.error(`[pyoniX_VAULT]: Total outage for provider: ${provider}`);
    },

    /* # secure export node */
    // කී වල තත්වය පරීක්ෂා කිරීම (Diagnostics සඳහා)
    getVaultStatus: function() {
        return {
            usingPersonal: this.state.isUserKeyActive,
            activeIndices: this.state.currentIndices,
            totalPublicKeys: Config.vault.nodes.groq.length + Config.vault.nodes.gemini.length
        };
    }
};

/* # activate vault node */
KeyVault.init();

/**
 * ==========================================================
 * DEVELOPER NOTICE:
 * Key vault is frozen at runtime to prevent injection of
 * malicious proxy keys.
 * ==========================================================
 */
Object.freeze(KeyVault.state.currentIndices);
