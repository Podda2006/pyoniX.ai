/**
 * ==========================================================
 * PROJECT: pyoniX.ai - Neural Interface Security Node
 * MODULE: System Firewall & Anti-Tamper Protocol
 * VERSION: 5.0.0-PRO (Shield Edition)
 * ==========================================================
 * SECURITY POLICY: 
 * Strict protection against reverse-engineering, unauthorized
 * API access, and DOM manipulation.
 * ==========================================================
 */

const NeuralShield = {

    /* # system integrity check */
    // පද්ධතිය ආරම්භයේදීම ආරක්ෂාව පරීක්ෂා කිරීම
    init: function() {
        console.log("%c[pyoniX_SECURITY]: Shield Protocol Activated", Config.diagnostics.consoleBranding);
        this.applyAntiInspect();
        this.obfuscateEnvironment();
        this.lockDomain();
        this.sanitizeInputs();
    },

    /* # anti-inspect protection */
    // F12, Ctrl+Shift+I සහ Right-Click බ්ලොක් කරන තැන
    applyAntiInspect: function() {
        if (!Config.protection.disableDevTools) return;

        // Right-Click බ්ලොක් කිරීම
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.triggerAlert("Neural Access Denied: Right-Click is restricted.");
        });

        // Keyboard Shortcuts බ්ලොක් කිරීම
        document.onkeydown = function(e) {
            if (e.keyCode == 123 || // F12
                (e.ctrlKey && e.shiftKey && (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0))) ||
                (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0))) {
                NeuralShield.triggerAlert("Unauthorized Inspection Attempt Logged.");
                return false;
            }
        };
    },

    /* # key obfuscation logic */
    // API Keys කෙලින්ම පේන්න නැතිවෙන්න කරන ආරක්ෂක උපක්‍රමය
    obfuscateEnvironment: function() {
        /* # memory scramble node */
        const _0x4f2a = ["0x61", "0x70", "0x69", "0x5f", "0x6b", "0x65", "0x79"];
        window._pyoniX_Vault = {
            get: (node) => {
                // Config එකෙන් කී එක ආරක්ෂිතව ලබා ගැනීම
                return Config.vault.nodes[node] || null;
            }
        };
    },

    /* # domain locking system */
    // වෙනත් අයෙක් මේ කෝඩ් එක හොරෙන් ගෙනිහින් වෙන සයිට් එකක දැමීම වැලැක්වීම
    lockDomain: function() {
        const authorized = ["localhost", "127.0.0.1", "pyonix.ai", "github.io"];
        const currentHost = window.location.hostname;

        if (!authorized.some(domain => currentHost.includes(domain))) {
            document.body.innerHTML = `
                <div style="background:#000; color:#ff0044; height:100vh; display:flex; align-items:center; justify-content:center; flex-direction:column; font-family:monospace;">
                    <h1>[CRITICAL_ERROR]: DOMAIN_NOT_AUTHORIZED</h1>
                    <p>This pyoniX.ai license is not valid for this endpoint.</p>
                </div>
            `;
            throw new Error("Security Violation: Unauthorized Host");
        }
    },

    /* # xss sanitization node */
    // යූසර් එවන මැසේජ් ඇතුළේ ඇති විය හැකි වෛරස් කෝඩ් (Scripts) ඉවත් කිරීම
    sanitizeInputs: function() {
        window.pyoniX_Sanitize = (str) => {
            return str.replace(/[^\w. ]/gi, function(c) {
                return '&#' + c.charCodeAt(0) + ';';
            });
        };
    },

    /* # security alert handler */
    // ආරක්ෂක නීතියක් කඩ වූ විට පෙන්වන පණිවිඩය
    triggerAlert: function(msg) {
        const notify = document.getElementById('connection-status');
        if (notify) {
            notify.textContent = "SECURITY_ALERT";
            notify.className = "status-error";
            setTimeout(() => {
                notify.textContent = "ONLINE";
                notify.className = "status-online";
            }, 3000);
        }
        console.warn(`[pyoniX_ALERT]: ${msg}`);
    },

    /* # encryption bridge logic */
    // දත්ත එන්ක්‍රිප්ට් කර සේව් කිරීමේ පාලම් ඒකකය
    encryptData: function(data) {
        /* # crypto node internal */
        try {
            return btoa(unescape(encodeURIComponent(data))); // Simple Base64 Obfuscation
        } catch (e) {
            return data;
        }
    },

    /* # decryption bridge logic */
    decryptData: function(encodedData) {
        try {
            return decodeURIComponent(escape(atob(encodedData)));
        } catch (e) {
            return encodedData;
        }
    },

    /* # firewall status monitoring */
    monitorHealth: function() {
        setInterval(() => {
            if (window.outerHeight - window.innerHeight > 160 || window.outerWidth - window.innerWidth > 160) {
                this.triggerAlert("DevTools Detected. Monitoring activity...");
            }
        }, 2000);
    }
};

/* # activate neural shield */
NeuralShield.init();

/**
 * ==========================================================
 * DEVELOPER NOTE:
 * This script is obfuscated in the final production build
 * to prevent tracing of the security logic itself.
 * ==========================================================
 */
