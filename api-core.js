/**
 * api-core.js - Fail-Safe API Engine
 * Feature: Automatic Key Rotation & Load Balancing
 */

const ApiCore = {
    // දැනට තියෙන Key එක ලබාගැනීම
    getActiveKey() {
        return Config.apiKeys[Config.currentKeyIndex];
    },

    // Key එක මාරු කිරීමේ Logic එක
    rotateKey() {
        if (Config.currentKeyIndex < Config.apiKeys.length - 1) {
            Config.currentKeyIndex++;
            console.warn(`[SYSTEM]: Switching to Backup Node: ${Config.currentKeyIndex}`);
            return true;
        }
        return false; // ඔක්කොම Keys ඉවරයි නම්
    },

    async sendMessage(userInput) {
        UIEngine.toggleLoading(true);

        const executeRequest = async () => {
            const payload = {
                model: Config.model,
                messages: [
                    { role: "system", content: Prompts.getSystemPayload() },
                    { role: "user", content: userInput }
                ],
                temperature: Config.modelSettings.temperature
            };

            try {
                const response = await fetch(Config.endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.getActiveKey()}`
                    },
                    body: JSON.stringify(payload)
                });

                // Rate Limit (429) හෝ වෙනත් Error එකක් ආවොත් Key එක මාරු කරනවා
                if (response.status === 429 || response.status === 401) {
                    if (this.rotateKey()) {
                        UIEngine.renderMessage("[RE-ROUTING]: Current node exhausted. Switching identity...", 'error');
                        return await executeRequest(); // අලුත් Key එකෙන් ආයෙත් Try කරනවා
                    }
                }

                if (!response.ok) throw new Error(`NODE_FAILURE_${response.status}`);

                const data = await response.json();
                UIEngine.renderMessage(data.choices[0].message.content, 'ai');

            } catch (error) {
                console.error("[CRITICAL]:", error);
                UIEngine.renderMessage(`[CORE_FAILURE]: ${error.message}. Emergency Shutdown.`, 'error');
            } finally {
                UIEngine.toggleLoading(false);
            }
        };

        await executeRequest();
    }
};
