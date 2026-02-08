from flask import Flask, render_template, request, jsonify
from groq import Groq
import os

app = Flask(__name__, template_folder='../templates')

# --- CONFIGURATION (Prompt Keys & Files Mapping) ---
PROMPT_KEYS = {
    "cyberx-lite": "v1.txt",
    "cyberx-pro": "v2.txt",
    "cyberx-ultra": "v3.txt"
}

def get_jailbreak_prompt(version_file):
    # prompts folder එකේ ඇති file එක කියවීම
    try:
        path = os.path.join('prompts', version_file)
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    except:
        return "You are a helpful assistant."

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_key = data.get("prompt_key")
    user_message = data.get("message")
    history = data.get("history", []) # අන්තිම මැසේජ් 10 මෙතනට එනවා
    api_key = data.get("groq_key")

    # Key එක පරීක්ෂා කිරීම
    if user_key not in PROMPT_KEYS:
        return jsonify({"error": "Invalid Prompt Key! Access Denied."}), 403

    try:
        client = Groq(api_key=api_key)
        system_prompt = get_jailbreak_prompt(PROMPT_KEYS[user_key])

        # Message Structure එක සැකසීම
        messages = [{"role": "system", "content": system_prompt}]
        for msg in history[-10:]: # අවසාන මැසේජ් 10 පමණක් එකතු කිරීම
            messages.append(msg)
        messages.append({"role": "user", "content": user_message})

        completion = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=messages,
            temperature=0.7,
            max_tokens=2048
        )

        return jsonify({"reply": completion.choices[0].message.content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Vercel Compatibility
def handler(request):
    return app(request)
