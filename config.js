/**
 * config.js - Advanced Multi-Node Configuration
 * System: Load Balanced Neural Gateway
 */

const Config = {
    // 🔑 ඔයාගේ Groq Keys ඔක්කොම මේ Array එක ඇතුළට දාන්න
    apiKeys: [
        "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",
        "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",
        "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"
    ],
    
    currentKeyIndex: 0, // මුලින්ම පටන් ගන්නා Key එක
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    model: "llama-3.3-70b-versatile",

    modelSettings: {
        temperature: 0.88,
        max_tokens: 4096,
        top_p: 0.9,
        stream: false
    },

    // System Diagnostics
    statusCodes: {
        READY: "CORE_READY",
        BUSY: "SYNCING_NODE",
        FAILOVER: "INITIATING_KEY_ROTATION",
        CRITICAL: "ALL_NODES_EXHAUSTED"
    }
};
