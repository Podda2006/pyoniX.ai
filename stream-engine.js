/**
 * ==========================================================
 * PROJECT: pyoniX.ai - Neural Interface Flux Engine
 * MODULE: Real-time Data Streamer & HTML Renderer
 * VERSION: 5.0.0-PRO (Streaming Node)
 * ==========================================================
 * FLUX POLICY: 
 * Handles asynchronous chunked data from various API nodes.
 * Implements high-speed text injection with typewriter FX.
 * ==========================================================
 */

const StreamEngine = {

    /* # flux internal state */
    // ස්ට්‍රීම් එකේ වර්තමාන තත්වය පාලනය කරන ඒකකය
    state: {
        isProcessing: false,
        currentBuffer: "",
        renderQueue: [],
        typeSpeed: Config.interface.streaming.speed || 10
    },

    /* # stream bridge initializer */
    // AI එකෙන් එන Response එක කියවීම ආරම්භ කරන තැන
    processStream: async function(response, targetElement) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let fullContent = "";

        this.state.isProcessing = true;
        this.clearWelcomeStage(); // සයිට් එකේ මුලින් පේන මැසේජ් අයින් කිරීම

        /* # message bubble node */
        const messageBubble = this.createMessageBubble(targetElement);

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                /* # chunk decoding node */
                const chunk = decoder.decode(value, { stream: true });
                const parsedData = this.parseChunks(chunk);

                if (parsedData) {
                    fullContent += parsedData;
                    // අකුරෙන් අකුර පෙන්වීමේ ලොජික් එක
                    this.renderToUI(messageBubble, parsedData);
                }
            }
        } catch (error) {
            console.error("[pyoniX_STREAM_ERROR]:", error);
        } finally {
            this.state.isProcessing = false;
            this.finalizeMessage(messageBubble, fullContent);
        }
    },

    /* # chunk parsing logic */
    // API එකෙන් එන අමු දත්ත (Raw Data) පිරිසිදු කිරීම
    parseChunks: function(chunk) {
        const lines = chunk.split("\n");
        let content = "";

        for (const line of lines) {
            const trimmed = line.replace(/^data: /, "").trim();
            if (trimmed === "[DONE]") return content;

            try {
                const json = JSON.parse(trimmed);
                // Groq/OpenAI Format එකට අනුව content එක ගැනීම
                const delta = json.choices[0].delta.content || "";
                content += delta;
            } catch (e) {
                // JSON නොවන කැබලි මගහැරීම
            }
        }
        return content;
    },

    /* # ui injection node */
    // අකුරෙන් අකුර සයිට් එකේ ලස්සනට පෙන්වන ලොජික් එක
    renderToUI: function(element, text) {
        const span = document.createElement("span");
        span.className = "neural-token";
        span.textContent = text;
        element.appendChild(span);

        /* # auto scroll logic */
        // මැසේජ් එක ලොකු වෙද්දී පේජ් එක පල්ලෙහාට ස්ක්‍රෝල් කිරීම
        const viewport = document.getElementById("chat-viewport");
        viewport.scrollTop = viewport.scrollHeight;
    },

    /* # message bubble factory */
    // අලුත් මැසේජ් එකක් සඳහා HTML කූඩුවක් (Bubble) සෑදීම
    createMessageBubble: function(container) {
        const wrapper = document.createElement("div");
        wrapper.className = "msg-container msg-ai msg-entrance";
        
        const avatar = document.createElement("img");
        avatar.src = "assets/logo.jpg";
        avatar.className = "msg-avatar dragon-breathe";

        const contentDiv = document.createElement("div");
        contentDiv.className = "msg-content-body";
        contentDiv.id = `msg-${Date.now()}`;

        wrapper.appendChild(avatar);
        wrapper.appendChild(contentDiv);
        container.appendChild(wrapper);

        return contentDiv;
    },

    /* # markdown finalizer node */
    // මැසේජ් එක ඉවර වුණාම ඒක Markdown විදිහට ලස්සනට සැකසීම
    finalizeMessage: function(element, fullText) {
        // Markdown ලොජික් එක මෙතනදී ක්‍රියාත්මක වේ (Markdown.js හරහා)
        if (window.pyoniX_Markdown) {
            element.innerHTML = window.pyoniX_Markdown.render(fullText);
            /* # code syntax highlighting */
            this.highlightCodeBlocks(element);
        } else {
            element.textContent = fullText;
        }
    },

    /* # code highlight module */
    // කෝඩ් කෑලි වලට පාට දීම (Syntax Highlighting)
    highlightCodeBlocks: function(element) {
        const codes = element.querySelectorAll("pre code");
        codes.forEach((block) => {
            // මෙතනදී prism.js හෝ ලියන්න යන syntax-h.js භාවිතා වේ
            console.log("[pyoniX_STREAM]: Highlighting code block...");
        });
    },

    /* # stage management node */
    clearWelcomeStage: function() {
        const welcome = document.getElementById("welcome-stage");
        if (welcome) welcome.style.display = "none";
    },

    /* # token counter tracker */
    // පාවිච්චි වුණු ටෝකන් ගණන යාවත්කාලීන කිරීම
    updateTokenCount: function(count) {
        const counter = document.getElementById("token-counter");
        if (counter) counter.textContent = `Tokens: ${count}`;
    }
};

/**
 * ==========================================================
 * DEVELOPER NOTICE:
 * The StreamEngine uses a direct DOM injection method for 
 * maximum performance on mobile browsers.
 * ==========================================================
 */



