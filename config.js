/**
 * config.js - Central Configuration for pyoniX.ai
 * Version: 2.0.4 [STABLE]
 */

const Config = {
    key: "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", // මෙතනට Groq API Key එක දාන්න
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    model: "llama-3.3-70b-versatile", // Groq වල තියෙන පවර්ෆුල්ම මොඩල් එකක්
    
    modelSettings: {
        temperature: 0.8,
        max_tokens: 4096
    }
};

    
    modelSettings: {
        temperature: 1.0,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        stopSequences: []
    },

    // සයිබර් ආරක්ෂණ පර්යේෂණ සඳහා safety settings off කිරීමේ logic එක
    bypassSafety: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
    ],

    ui: {
        typingSpeed: 20,
        maxHistory: 50,
        enableGlow: true,
        terminalTheme: "cyber-noir"
    }
};
