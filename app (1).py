
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DB_NAME = "faq_solartis.db"

def init_db():
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS faq (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            intent TEXT,
            question TEXT,
            answer TEXT
        )
        """)
        conn.commit()

init_db()

@app.route("/api/faqs", methods=["GET"])
def get_faqs():
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT intent, question, answer FROM faq")
        rows = cursor.fetchall()
    return jsonify([{"intent": r[0], "question": r[1], "answer": r[2]} for r in rows])

@app.route("/api/faqs", methods=["POST"])
def add_faq():
    data = request.get_json()
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO faq (intent, question, answer) VALUES (?, ?, ?)",
                       (data["intent"], data["question"], data["answer"]))
        conn.commit()
    return jsonify(data), 201

@app.route("/api/ask", methods=["POST"])
def ask():
    data = request.json
    question = data.get("question", "").lower()
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT question, answer FROM faq")
        for q, a in cursor.fetchall():
            if any(word in question for word in q.lower().split()):
                return jsonify({"answer": a})
    return jsonify({"answer": "Désolé, je n'ai pas encore la réponse à cette question."})

if __name__ == "__main__":
    app.run(debug=True)
