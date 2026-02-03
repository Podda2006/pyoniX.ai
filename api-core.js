/**
 * api-core.js
 * Comprehensive API Handler for pyoniX.ai Core connection.
 */

const ApiCore = {
    async sendMessage(userInput) {
        // UI එකට කියනවා සිස්ටම් එක Busy කියලා
        UIEngine.toggleLoading(true);

        const requestBody = {
            contents: [{
                parts: [{
                    text: Prompts.getSystemPayload() + "\n\nCMD: " + userInput
                }]
            }],
            generationConfig: Config.modelSettings,
            safetySettings: Config.bypassSafety
        };

        try {
            const response = await fetch(`${Config.endpoint}?key=${Config.key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) throw new Error(`HTTP_ERR: ${response.status}`);

            const data = await response.json();
            
            if (data.candidates && data.candidates[0].content) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                UIEngine.renderMessage(aiResponse, 'ai');
            } else {
                throw new Error("EMPTY_RESPONSE_FROM_CORE");
            }

        } catch (error) {
            console.error("PYONIX_CRITICAL_ERR:", error);
            UIEngine.renderMessage(`[CRITICAL_FAILURE]: ${error.message}`, 'error');
        } finally {
            UIEngine.toggleLoading(false);
        }
    }
};
