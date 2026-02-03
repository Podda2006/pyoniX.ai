/**
 * config.js - Central Configuration for pyoniX.ai
 * Version: 2.0.4 [STABLE]
 */

const Config = {
    key: "YOUR_GEMINI_API_KEY", // මෙතනට ඔයාගේ Key එක දාන්න
    endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    
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
