import os
from flask import Flask, request, jsonify
from groq import Groq

app = Flask(__name__)

# استخدام متغيرات البيئة (Environment Variables) - لا تضع المفتاح هنا!
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

@app.route('/ask', methods=['POST'])
def ask_ai():
    data = request.json
    user_message = data.get("message")
    
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": user_message}],
        model="llama3-8b-8192",
    )
    return jsonify({"reply": chat_completion.choices[0].message.content})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))