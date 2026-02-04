/**
 * ==========================================================
 * PROJECT: pyoniX.ai - Neural Interface Core
 * MODULE: System Bootloader & Master Integration
 * VERSION: 5.0.0-PRO (Master Brain)
 * ==========================================================
 * BOOT POLICY: 
 * Orchestrates the sequential initialization of all sub-systems.
 * Handles global error boundaries and resource cleanup.
 * ==========================================================
 */

const PyonixMaster = {

    /* # system kernel state */
    // මුළු පද්ධතියේම ක්‍රියාකාරීත්වය මනින දර්ශක
    kernel: {
        version: "5.0.0-PRO",
        isReady: false,
        bootTime: 0,
        subsystems: ["Shield", "Auth", "Nexus", "Vault", "Memory", "Flux", "UI"]
    },

    /* # master boot sequence */
    // සියලුම ෆයිල්ස් එකින් එක පණ ගැන්වීමේ ක්‍රියාවලිය
    boot: async function() {
        const start = performance.now();
        console.log(`%c[pyoniX_SYSTEM]: Initiating Boot Sequence v${this.kernel.version}`, "color: #00d4ff; font-weight: bold;");

        try {
            /* # 01. security handshake */
            // මුලින්ම ආරක්ෂක පවුර පරීක්ෂා කිරීම
            if (typeof NeuralShield !== 'undefined') {
                NeuralShield.init();
            }

            /* # 02. data vault activation */
            // API Keys සහ අනෙකුත් රහස්‍ය දත්ත ලෝඩ් කිරීම
            if (typeof KeyVault !== 'undefined') {
                KeyVault.init();
            }

            /* # 03. identity sync */
            // යූසර් ලොග් වී ඇත්දැයි බැලීම
            if (typeof NeuralAuth !== 'undefined') {
                NeuralAuth.init();
            }

            /* # 04. memory recall */
            // අවුරුදු 10ක චැට් හිස්ට්‍රිය ලෝඩ් කිරීම
            if (typeof NeuralMemory !== 'undefined') {
                NeuralMemory.init();
            }

            /* # 05. visual interface mount */
            // සයිට් එකේ පෙනුම සහ බටන්ස් වැඩ කරන්න පටන් ගැනීම
            if (typeof UIEngine !== 'undefined') {
                UIEngine.init();
            }

            /* # 06. history ui rendering */
            // සයිඩ්බාර් එකේ පරණ චැට් පෙන්වීම
            if (typeof NeuralHistoryUI !== 'undefined') {
                NeuralHistoryUI.init();
            }

            this.kernel.isReady = true;
            this.kernel.bootTime = (performance.now() - start).toFixed(2);
            this.finalizeBoot();

        } catch (criticalError) {
            this.handleCatastrophicFailure(criticalError);
        }
    },

    /* # system finalization */
    // බූට් එක ඉවර වුණු පසු සයිට් එකේ පෙන්වන මැසේජ්
    finalizeBoot: function() {
        console.log(`%c[pyoniX_SYSTEM]: Core Stabilized in ${this.kernel.bootTime}ms.`, "color: #00ff88;");
        
        // පෝන් එකේ ස්ක්‍රීන් එකට ලස්සන 'Ready' ඇලර්ට් එකක්
        UIEngine.updateStatus("Ready", "#00ff88");
        
        // ඩ්‍රැගන් ලෝගෝ එකට මුලින්ම පොඩි 'Glitch' එකක් දීම
        const logo = document.querySelector('.brand-logo');
        if (logo) logo.classList.add('glitch-logo');
    },

    /* # global error boundary */
    // පද්ධතියේ කොහේ හරි ලොකු අවුලක් වුණොත් ක්‍රියාත්මක වන කොටස
    handleCatastrophicFailure: function(err) {
        console.error("[pyoniX_CORE_COLLAPSE]:", err);
        document.body.innerHTML = `
            <div style="background:#000; color:#ff0044; height:100vh; display:flex; align-items:center; justify-content:center; flex-direction:column; font-family:monospace; padding: 20px; text-align:center;">
                <h1 style="font-size: 1.5rem;">[CRITICAL_SYSTEM_FAILURE]</h1>
                <p style="margin:20px 0;">Neural link collapsed. Reboot required.</p>
                <button onclick="location.reload()" style="background:#ff0044; color:#fff; border:none; padding:10px 20px; border-radius:5px; cursor:pointer;">REBOOT_CORE</button>
            </div>
        `;
    },

    /* # global resource cleanup */
    // සයිට් එක වහද්දී හෝ රීලෝඩ් වෙද්දී දත්ත ආරක්ෂා කිරීම
    cleanup: function() {
        window.onbeforeunload = () => {
            if (UIEngine.state.isTyping) {
                return "AI is generating a response. Leaving now may cause data loss.";
            }
            NeuralMemory.saveToLocal();
        };
    }
};

/* # initiate system launch */
// සයිට් එක ලෝඩ් වුණු ගමන් බූට් එක ස්ටාර්ට් කිරීම
window.addEventListener('DOMContentLoaded', () => {
    PyonixMaster.boot();
    PyonixMaster.cleanup();
});

/**
 * ==========================================================
 * DEVELOPER NOTICE:
 * This master kernel ensures that all pyoniX modules are 
 * properly instantiated within a secure sandbox environment.
 * ==========================================================
 */
