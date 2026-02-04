/**
 * ==========================================================
 * PROJECT: pyoniX.ai - Neural Interface Connectivity Node
 * MODULE: Universal API Nexus & Request Formatter
 * VERSION: 5.0.0-PRO (Nexus Edition)
 * ==========================================================
 * BRIDGE POLICY: 
 * Standardizes multi-provider payloads into a unified stream.
 * Manages latency tracking and model hot-swapping.
 * ==========================================================
 */

const ApiNexus = {

    /* # nexus internal state */
    // සම්බන්ධතාවයේ වේගය සහ තත්වය පාලනය කරන ඒකකය
    state: {
        lastResponseTime: 0,
        activeRequest: null,
        isStreaming: false,
        retryCount: 0
    },

    /* # universal request handler */
    // ඕනෑම API එකකට දත්ත යවන ප්‍රධාන ෆන්ක්ෂන් එක
    fetchResponse: async function(userPrompt, history) {
        const provider = Config.intelligence.activeProvider;
        const apiKey = KeyVault.getActiveKey(provider);
        
        console.log(`%c[pyoniX_NEXUS]: Routing request to ${provider}...`, "color: #00d4ff");

        // Request එක යන වෙලාව මැනීම ආරම්භය
        const startTime = performance.now();

        try {
            /* # payload construction node */
            const payload = this.preparePayload(provider, userPrompt, history);
            const endpoint = this.getEndpoint(provider);

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: this.getHeaders(provider, apiKey),
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`API_ERROR: ${response.status}`);

            /* # latency calculation node */
            const endTime = performance.now();
            this.state.lastResponseTime = Math.round(endTime - startTime);
            this.updateLatencyUI();

            return response;

        } catch (error) {
            return this.handleNexusError(error, provider);
        }
    },

    /* # api payload formatter */
    // එක එක API එකට ගැලපෙන විදිහට දත්ත සකස් කිරීම
    preparePayload: function(provider, prompt, history) {
        /* # dark personality injection */
        // බොට්ගේ "දරුණු" පෞරුෂය මෙතනින් System Prompt එකට එකතු කරනවා
        const systemDirective = {
            role: "system",
            content: "You are pyoniX.ai, a cold, calculated, and direct AI. Personality: BRUTAL. Format: Markdown."
        };

        const messages = [systemDirective, ...history, { role: "user", content: prompt }];

        switch (provider.toUpperCase()) {
            case "GROQ":
            case "OPENAI":
                return {
                    model: Config.intelligence.primaryModel,
                    messages: messages,
                    temperature: Config.intelligence.parameters.temperature,
                    max_tokens: Config.intelligence.parameters.maxTokens,
                    stream: true
                };
            case "GEMINI":
                /* # gemini specific schema */
                return {
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: Config.intelligence.parameters.temperature,
                        maxOutputTokens: Config.intelligence.parameters.maxTokens
                    }
                };
            default:
                return { inputs: prompt };
        }
    },

    /* # header generation node */
    // ආරක්ෂිතව API Headers සකස් කිරීම
    getHeaders: function(provider, key) {
        const headers = { 'Content-Type': 'application/json' };
        
        if (provider === "GROQ" || provider === "OPENAI") {
            headers['Authorization'] = `Bearer ${key}`;
        } else if (provider === "HUGGINGFACE") {
            headers['Authorization'] = `Bearer ${key}`;
        } else if (provider === "GEMINI") {
            // Gemini uses URL params usually, but custom headers can be added
        }
        
        return headers;
    },

    /* # endpoint routing node */
    getEndpoint: function(provider) {
        const node = Config.api.nodes.find(n => n.provider === provider);
        if (provider === "GEMINI") {
            return `${node.endpoint}${Config.intelligence.fallbackModel}:streamGenerateContent?key=${KeyVault.getActiveKey('GEMINI')}`;
        }
        return node ? node.endpoint : "";
    },

    /* # latency tracker ui */
    // සයිට් එකේ වේගය පෙන්වන එක අප්ඩේට් කිරීම
    updateLatencyUI: function() {
        const label = document.getElementById('latency-val');
        if (label) {
            label.textContent = `${this.state.lastResponseTime}ms`;
            label.style.color = this.state.lastResponseTime > 1000 ? "#ff4444" : "#00ff88";
        }
    },

    /* # nexus error management */
    // සම්බන්ධතාවය බිඳ වැටුණොත් නැවත උත්සාහ කිරීම (Failover)
    handleNexusError: async function(err, provider) {
        console.error(`[pyoniX_NEXUS_FAILURE]: ${err.message}`);
        
        if (this.state.retryCount < Config.api.failover.maxRetries) {
            this.state.retryCount++;
            KeyVault.rotateKey(provider); // කී එක මාරු කිරීම
            NeuralShield.triggerAlert("Nexus unstable. Rotating neural node...");
            return this.fetchResponse(); // නැවත උත්සාහ කිරීම
        } else {
            this.state.retryCount = 0;
            return null;
        }
    },

    /* # hot swap module */
    // චැට් එක අතරතුරදී මොඩල් එක මාරු කිරීම
    switchProvider: function(newProvider) {
        Config.intelligence.activeProvider = newProvider;
        console.log(`%c[pyoniX_NEXUS]: Switched to ${newProvider}`, "color: #cc00ff");
        NeuralShield.triggerAlert(`Provider Switched: ${newProvider}`);
    }
};

/**
 * ==========================================================
 * DEVELOPER NOTICE:
 * The ApiNexus acts as the single point of truth for all
 * outgoing neural traffic. Do not bypass this layer.
 * ==========================================================
 */
