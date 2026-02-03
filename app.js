/**
 * app.js - Main Application Entry Point
 * Orchestrates all modules (Config, UI, API, Prompts)
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("[INIT]: pyoniX.ai Cyber-Core Loading...");

    // 1. Clock Initialization
    setInterval(() => {
        const now = new Date();
        document.getElementById('clock').innerText = now.toTimeString().split(' ')[0];
    }, 1000);

    // 2. Remove Loader Overlay
    setTimeout(() => {
        const loader = document.getElementById('loader-overlay');
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
        UIEngine.renderMessage("CONNECTION_ESTABLISHED. PYONIX_CORE_v2.0_ONLINE.", 'ai');
    }, 2500);

    // 3. Command Execution Logic
    const inputField = document.getElementById('userInput');
    const executeBtn = document.getElementById('execute-btn');

    const handleExecution = async () => {
        const rawInput = inputField.value.trim();
        if (!rawInput) return;

        const cleanInput = Auth.sanitizeInput(rawInput);
        inputField.value = ''; // පේළි 500ක් ලියනකොට මේවා ඉතා වැදගත්

        // User message එක පෙන්වනවා
        UIEngine.renderMessage(cleanInput, 'user');

        // AI එකට කතා කරනවා
        await ApiCore.sendMessage(cleanInput);
    };

    // Events
    executeBtn.addEventListener('click', handleExecution);

    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleExecution();
        }
    });

    // Sidebar Log Simulation
    const logList = document.getElementById('log-list');
    const addLog = (msg) => {
        const li = document.createElement('li');
        li.innerText = `> ${msg}`;
        logList.appendChild(li);
        if(logList.children.length > 10) logList.removeChild(logList.firstChild);
    };

    setInterval(() => addLog(`HEARTBEAT_ACK_${Math.random().toString(36).substring(7).toUpperCase()}`), 5000);
});
