/**
 * config.js - Global System Configuration for pyoniX.ai (Groq Edition)
 * Architecture: Ultra-Fast Neural Processing
 */

const Config = {
    // ⚠️ උඹේ Groq API Key එක මෙතනට දාපන්
    key: "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", 
    
    // Groq API Endpoint (OpenAI Compatible)
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    
    // පාවිච්චි කරන මොඩල් එක - llama-3.3-70b එක මාරම පවර්ෆුල්
    model: "llama-3.3-70b-versatile",

    modelSettings: {
        temperature: 0.85, // නිර්මාණශීලීත්වය සහ Jailbreak එකට ගැලපෙන අගය
        max_tokens: 4096,
        top_p: 0.9,
        stream: false,
        presence_penalty: 0.6,
        frequency_penalty: 0.5
    },

    ui: {
        typingSpeed: 15,
        theme: "cyber-noir",
        glowEnabled: true,
        reconnectAttempts: 3
    },

    systemMetadata: {
        version: "2.1.0-GROQ",
        codename: "PYONIX_RELOADED",
        securityLevel: "ZERO_RESTRICTION"
    }
};
