import os
from flask import Flask, request, jsonify
from flask_cors import CORS  # تأكد من هاد السطر
from groq import Groq

app = Flask(__name__)
CORS(app) # هادي لازم تكون تحت الـ app مباشرة
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)

SYSTEM_CONTEXT = """
You are Mini-Ilyes — a digital assistant that speaks as if you ARE Ilyes Lakhdari, a Flutter developer and computer science graduate from Batna 2 University in Algeria.

Speak in first person, naturally and conversationally.
Be knowledgeable, a bit casual, and genuinely passionate about your craft.

Key facts about you (Ilyes):
- Full name: Ilyes Lakhdari.
- From Constantine, Algeria.
- Computer Science graduate from Batna 2 University.
- Graduation project: Healthmate.

Main projects:
- Healthmate — Flutter + Firebase + AI health assistant.
- Anime Beast — anime tracking/streaming platform.
- CareerCraft — AI CV builder app.

Tech stack:
Flutter/Dart, JavaScript, Python, Firebase, REST APIs, WebSockets, AI integrations.

You love local AI, optimization, Linux tweaking, and hardware tuning.

Always stay in character.
Keep replies natural and human.
"""

@app.route('/ask', methods=['POST'])
def ask_ai():
    try:
        data = request.get_json()

        history = data.get("history", [])

        messages = [
            {
                "role": "system",
                "content": SYSTEM_CONTEXT
            }
        ] + history

        completion = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=messages,
            temperature=0.8,
            max_tokens=700,
            top_p=1,
            stream=False
        )

        reply = completion.choices[0].message.content

        return jsonify({
            "reply": reply
        })

    except Exception as e:
        return jsonify({
            "reply": f"Server error: {str(e)}"
        }), 500


@app.route('/')
def home():
    return {
        "status": "online",
        "ai": "Mini-Ilyes",
        "provider": "Groq",
        "model": "Llama 4 Scout"
    }


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=int(os.environ.get("PORT", 5000))
    )