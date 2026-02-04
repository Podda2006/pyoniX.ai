/**
 * ==========================================================
 * PROJECT: pyoniX.ai - Neural Interface Identity Node
 * MODULE: Firebase Authentication & Access Control
 * VERSION: 5.0.0-PRO (Auth Shield)
 * ==========================================================
 * AUTH POLICY: 
 * Mandatory Google SSO for public API usage. 
 * Standalone bypass for private user-provided keys.
 * ==========================================================
 */

const NeuralAuth = {

    /* # identity node state */
    // යූසර්ගේ වර්තමාන තත්වය ගබඩා කිරීම
    state: {
        isLoggedIn: false,
        user: null,
        accessLevel: "GUEST",
        usePrivateKeys: false
    },

    /* # firebase initializer node */
    // Firebase පද්ධතිය පණ ගැන්වීම
    init: function() {
        console.log("%c[pyoniX_AUTH]: Initializing Identity Gate...", Config.diagnostics.consoleBranding);
        
        // Firebase config එක පරීක්ෂා කිරීම
        if (typeof firebase === 'undefined') {
            this.handleAuthError("Firebase SDK not detected. Access restricted.");
            return;
        }

        firebase.initializeApp(Config.authentication.firebaseProvider);
        this.observeAuthState();
        this.bindEvents();
    },

    /* # auth state observer */
    // යූසර් ලොග් වෙලාද නැද්ද කියලා නිරන්තරයෙන් පරීක්ෂා කිරීම
    observeAuthState: function() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                /* # user session active */
                this.state.isLoggedIn = true;
                this.state.user = user;
                this.state.accessLevel = "AUTHORIZED_NODE";
                this.updateUI(true);
                // අවුරුදු 10ක හිස්ට්‍රිය ලෝඩ් කිරීමට පණිවිඩයක් යැවීම
                console.log(`[pyoniX_AUTH]: Welcome back, ${user.displayName}`);
            } else {
                /* # user session dormant */
                this.state.isLoggedIn = false;
                this.state.user = null;
                this.state.accessLevel = "GUEST";
                this.checkAccessRequirement();
                this.updateUI(false);
            }
        });
    },

    /* # access requirement logic */
    // අපේ API එක පාවිච්චි කරන්න ලොගින් ඕනෙද කියලා බලන තීරණාත්මක කොටස
    checkAccessRequirement: function() {
        const hasPrivateKeys = localStorage.getItem('PYONIX_USER_KEYS') !== null;
        
        if (Config.authentication.enforceGoogleAuth && !this.state.isLoggedIn && !hasPrivateKeys) {
            /* # lockdown active node */
            this.showLockOverlay();
        } else {
            this.hideLockOverlay();
        }
    },

    /* # google login trigger */
    // ගූගල් ලොගින් බටන් එක එබූ විට ක්‍රියාත්මක වන කොටස
    signIn: async function() {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            const result = await firebase.auth().signInWithPopup(provider);
            this.state.user = result.user;
            this.triggerAuthSuccess();
        } catch (error) {
            this.handleAuthError(error.message);
        }
    },

    /* # session termination node */
    // ලොග් අවුට් වීමේ ක්‍රියාවලිය
    signOut: function() {
        firebase.auth().signOut().then(() => {
            location.reload(); // ආරක්ෂාව සඳහා පේජ් එක රීලෝඩ් කිරීම
        });
    },

    /* # private key bypass */
    // ලොග් නොවී තමන්ගේම කී එකක් පාවිච්චි කරන අයට ඉඩ දීම
    enablePrivateKeyMode: function(key) {
        if (key && key.length > 10) {
            this.state.usePrivateKeys = true;
            localStorage.setItem('PYONIX_USER_KEYS', NeuralShield.encryptData(key));
            this.hideLockOverlay();
            console.log("[pyoniX_AUTH]: Private Key Mode Enabled. Bypass Active.");
        }
    },

    /* # ui synchronization logic */
    // ලොගින් තත්වය අනුව සයිට් එකේ පෙනුම වෙනස් කිරීම
    updateUI: function(isAuth) {
        const authBtn = document.getElementById('google-auth-btn');
        const userLabel = document.getElementById('user-display-name');
        
        if (isAuth && this.state.user) {
            authBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Disconnect';
            authBtn.onclick = () => this.signOut();
            userLabel.textContent = this.state.user.displayName;
            document.getElementById('user-profile-anchor').classList.add('profile-active');
        } else {
            authBtn.innerHTML = '<i class="fab fa-google"></i> Connect Identity';
            authBtn.onclick = () => this.signIn();
            userLabel.textContent = "Guest Node";
            document.getElementById('user-profile-anchor').classList.remove('profile-active');
        }
    },

    /* # lock overlay handler */
    // ලොග් නොවී සයිට් එක පාවිච්චි කරන්න බැරි වෙන්න දාන වැට (Overlay)
    showLockOverlay: function() {
        if (!document.getElementById('auth-lock')) {
            const lock = document.createElement('div');
            lock.id = 'auth-lock';
            lock.className = 'glass-modal-bg';
            lock.innerHTML = `
                <div class="glass-panel" style="padding:40px; text-align:center; max-width:400px;">
                    <h2 style="color:var(--neon-blue);">[ACCESS_RESTRICTED]</h2>
                    <p style="margin:20px 0; color:var(--text-dim);">To use pyoniX Neural Node with public API, you must sync your identity.</p>
                    <button onclick="NeuralAuth.signIn()" class="btn-primary-neon">Connect Google Identity</button>
                    <p style="margin-top:20px; font-size:0.8rem;">- OR -</p>
                    <input type="password" id="bypass-key" placeholder="Enter Private API Key" style="margin-top:10px; width:100%; padding:10px; background:rgba(255,255,255,0.05); border:1px solid var(--neon-blue); color:#fff; border-radius:8px;">
                    <button onclick="NeuralAuth.handleBypass()" class="btn-glass" style="margin-top:10px; width:100%;">Use Private Key</button>
                </div>
            `;
            document.body.appendChild(lock);
        }
    },

    hideLockOverlay: function() {
        const lock = document.getElementById('auth-lock');
        if (lock) lock.remove();
    },

    /* # bypass handler event */
    handleBypass: function() {
        const key = document.getElementById('bypass-key').value;
        if (key) this.enablePrivateKeyMode(key);
    },

    /* # event binding node */
    bindEvents: function() {
        // අනාගතයේදී අවශ්‍ය වන Event listeners මෙතනට
    },

    /* # error management node */
    handleAuthError: function(msg) {
        console.error(`[pyoniX_AUTH_ERROR]: ${msg}`);
        NeuralShield.triggerAlert(`Identity Sync Failed: ${msg}`);
    }
};

/* # initialize gatekeeper */
NeuralAuth.init();

/**
 * ==========================================================
 * DEVELOPER NOTICE:
 * Authentication state is mirrored to Firebase Firestore
 * to ensure 10-year persistent chat history nodes.
 * ==========================================================
 */
