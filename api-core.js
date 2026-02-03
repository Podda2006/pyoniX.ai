/**
 * api-core.js - Advanced API Controller for pyoniX.ai
 * Optimized for Groq's Low-Latency Infrastructure
 */

const ApiCore = {
    async sendMessage(userInput) {
        // UI එකට කියනවා සිස්ටම් එක පණ ගැන්වෙනවා කියලා
        UIEngine.toggleLoading(true);

        // Groq/OpenAI Format එකට අදාළ Payload එක
        const payload = {
            model: Config.model,
            messages: [
                {
                    role: "system",
                    content: Prompts.getSystemPayload()
                },
                {
                    role: "user",
                    content: userInput
                }
            ],
            temperature: Config.modelSettings.temperature,
            max_tokens: Config.modelSettings.max_tokens,
            top_p: Config.modelSettings.top_p
        };

        try {
            console.log("[SYSTEM]: Initiating Secure Handshake with Groq...");
            
            const response = await fetch(Config.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Config.key}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `HTTP_ERR_${response.status}`);
            }

            const data = await response.json();
            
            // Response එක Extract කිරීම
            if (data.choices && data.choices[0] && data.choices[0].message) {
                const aiResult = data.choices[0].message.content;
                UIEngine.renderMessage(aiResult, 'ai');
            } else {
                throw new Error("EMPTY_DATA_PACKET_RECEIVED");
            }

        } catch (error) {
            console.error("[CRITICAL_FAILURE]:", error);
            UIEngine.renderMessage(`[SYSTEM_ERROR]: ${error.message}. Please verify API Connectivity.`, 'error');
        } finally {
            UIEngine.toggleLoading(false);
        }
    },

    // Connectivity test logic
    async checkNodeStatus() {
        return Config.key.startsWith("gsk_"); // Groq keys start with gsk_
    }
};
