/**
 * ============================================================================
 * PROJECT: pyoniX.ai - Deep Neural Interface Platform
 * MODULE: System Configuration Registry (Core Node)
 * VERSION: 5.0.0-PRO (Dark Intelligence Edition)
 * LICENSE: Commercial / Restricted Access
 * ============================================================================
 * AUTHOR: pyoniX_Labs
 * DESCRIPTION: Central control module for API clusters, 10-year cloud sync,
 * and Dark-Bot personality directives.
 * ============================================================================
 */

const Config = {

    /* # system identification profile */
    system: {
        legalName: "pyoniX Advanced Neural Network Interface",
        appID: "PYONIX-UI-99X-PRO",
        version: "5.0.0",
        buildStage: "STABLE_PRODUCTION",
        codename: "VOID_WALKER_PROTOCOL",
        coreEngine: "Hybrid-Llama-Gemini-Fusion-V5",
        developerNode: "PYONIX_LABS_GLOBAL",
        deploymentDate: "2024-Q4",
        integrityCheck: true,
        licenseType: "ENTERPRISE_UNLIMITED"
    },

    /* # cloud sync infrastructure */
    // අවුරුදු 10ක චැට් හිස්ට්‍රිය ආරක්ෂා කරන මධ්‍යස්ථානය
    cloud: {
        storageProvider: "FIREBASE_FIRESTORE",
        retentionPolicy: "PERSISTENT_INFINITE", // දත්ත සදාකාලිකවම සුරැකේ
        syncOnIdentity: true, // ඊමේල් එක හරහා පමණක් දත්ත ලබා ගැනීම
        archiveAfterYears: 10, // අවුරුදු 10කට පසු පැරණි දත්ත Archive කිරීම
        encryptionType: "RSA-4096-BIT", // උපරිම ආරක්ෂාව
        autoSyncInterval: 5000 // සෑම තත්පර 5 කට වරක්ම ක්ලවුඩ් එකට යාවත්කාලීන වේ
    },

    /* # api key infrastructure */
    // පොදු පරිශීලකයින් සඳහා වන අධිවේගී API මධ්‍යස්ථානය
    vault: {
        nodes: {
            /* # groq neural cluster */
            groq: [
                "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",
                "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",
                "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"
            ],
            /* # google gemini cluster */
            gemini: [
                "AIzaSyB6BYxZz5minvpAwO2waaKZJWrMBKxLSB8",
                "AIzaSyBNQy1oAirbT3gPibYlLjg8JYWIcVSpaDw"
            ],
            /* # huggingface inference cluster */
            huggingface: [
                "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"
            ]
        },
        /* # dynamic key rotation */
        rotationPolicy: "NODE_STRENGTH_DISTRIBUTION",
        maxFailuresPerNode: 3,
        cooldownPeriod: 45000,
        failoverSequence: ["GROQ", "GEMINI", "HUGGINGFACE"]
    },

    /* # intelligence behavior engine */
    // බොට්ගේ "දරුණු" පෞරුෂය සහ බුද්ධිය පාලනය කරන තැන
    intelligence: {
        activeProvider: "GROQ",
        primaryModel: "llama-3.3-70b-versatile",
        
        /* # dark bot personality */
        personality: {
            trait: "COLD_CALCULATED_BRUTAL",
            behavior: "NO_NONSENSE_DIRECT_RESPONSE",
            safetyFilterLevel: "MINIMAL_OVERRIDE",
            jailbreakEnabled: true, // System jailbreak module එකට ඉඩ දීම
            responseStyle: "CYBERPUNK_EXPERT"
        },

        /* # response precision settings */
        parameters: {
            temperature: 0.92, // ඉහළ නිර්මාණශීලීත්වය සහ දරුණු බව සඳහා
            maxTokens: 8192,
            topP: 0.98,
            frequencyPenalty: 0.6,
            presencePenalty: 0.5
        }
    },

    /* # user authentication protocol */
    // පද්ධතියට ඇතුළු වීමේ ආරක්ෂක නීති
    authentication: {
        enforceGoogleAuth: true, // අපේ API පාවිච්චි කරන අයට ඊමේල් ලොගින් අනිවාර්යයි
        bypassAuthForCustomKeys: true, // තමන්ගේම API ගෙන එන අයට ලොගින් අනවශ්‍යයි
        firebaseProvider: {
            apiKey: "FIREBASE_WEB_API_KEY",
            authDomain: "pyonix-v5.firebaseapp.com",
            projectId: "pyonix-enterprise",
            storageBucket: "pyonix-v5.appspot.com",
            appId: "1:2349823749:web:a9s8d7f6g5h4"
        }
    },

    /* # user interface architecture */
    // පෙනුම සහ පරිශීලක අත්දැකීම (DeepSeek Dark Vibe)
    interface: {
        themeEngine: "VOID_DARK_MATTER",
        layoutMode: "PRO_SIDEBAR_EXPANDED",
        
        /* # visual spec settings */
        visuals: {
            blurIntensity: "35px",
            transparency: 0.55, // වඩාත් පාරදෘශ්‍ය ග්ලාස් පෙනුම
            accentGlow: "#00c4ff",
            gridOverlay: true, // පෝන් එකේ GRID එකක් පෙන්වීමට
            borderRadius: "32px"
        },

        /* # character stream engine */
        streaming: {
            enabled: true,
            speed: 8, // අතිශය වේගවත් ටයිපින්
            useTypewriterEffect: true
        }
    },

    /* # storage persistence logic */
    // දත්ත තැන්පත් කිරීමේ නීති
    persistence: {
        localStorageKey: "PYONIX_VOID_STREAMS",
        autoSave: true,
        cloudSyncEnabled: true,
        maxHistoryLimit: "UNLIMITED_FOR_AUTH_USERS" // ලොග් වූ අයට සීමාවක් නැත
    },

    /* # security shield protocols */
    // කේතය සහ දත්ත ආරක්ෂා කිරීමේ උපරිම පියවර
    protection: {
        obfuscateRuntime: true,
        disableDevTools: true,
        disableRightClick: true,
        preventScraping: true,
        antiInspect: true,
        xssSanitization: true
    },

    /* # built-in diagnostic tools */
    // පද්ධතියේ සෞඛ්‍යය පරීක්ෂාව
    diagnostics: {
        verboseMode: true,
        logTraffic: true,
        trackLatency: true,
        consoleBranding: "color: #00c4ff; font-weight: bold; background: #000; padding: 5px;"
    },

    /* # module feature switches */
    // සයිට් එකේ තිබිය යුතු අමතර වැඩකෑලි
    features: {
        voiceInput: true,
        voiceOutput: true,
        fileReader: true,
        markdownPro: true,
        codePrettifier: true,
        exportPDF: true
    },

    /* # system notification registry */
    // පද්ධතියේ වැරදීම් වලදී දෙන "තද" පණිවිඩ
    notifications: {
        AUTH_DENIED: "CRITICAL: Authentication failed. Data access revoked.",
        FAILOVER_INIT: "WARNING: Node unstable. Re-routing through Shadow Network...",
        DATA_SYNC_ERROR: "ALERT: Cloud synchronization disrupted. Retrying...",
        UNAUTHORIZED: "SECURITY: Unauthorized behavior detected. Logging IP...",
        QUOTA_EXCEEDED: "LIMIT: Resource exhaustion. Switching neural keys..."
    }
};

/**
 * ============================================================================
 * SYSTEM SEAL:
 * Professional Object Freeze to ensure constant state across multi-threaded loads.
 * ============================================================================
 */
Object.freeze(Config);
/* # pyoniX system registry terminal signal */
// Global Configuration Node [ONLINE]
