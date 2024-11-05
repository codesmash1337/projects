# app.py

import csv
import os
import uuid
from io import StringIO
from typing import Dict, List

from flask import Flask, jsonify, render_template, request, send_from_directory

app = Flask(
    __name__,
    static_folder="../frontend/static",
    template_folder="../frontend/templates",
)

# In-memory data stores (in production, use a proper database)
decks = {}
cards = {}


# API Routes
@app.route("/api/decks", methods=["GET"])
def get_decks():
    """Get all decks."""
    return jsonify(list(decks.values())), 200


@app.route("/api/decks", methods=["POST"])
def create_deck():
    """Create a new deck."""
    data = request.get_json()

    if not data or "name" not in data:
        return jsonify({"error": "Name is required"}), 400

    deck_id = str(uuid.uuid4())
    deck = {
        "id": deck_id,
        "name": data["name"],
        "description": data.get("description", ""),
    }
    decks[deck_id] = deck
    return jsonify(deck), 201


@app.route("/api/decks/<string:deck_id>/cards", methods=["GET"])
def get_cards(deck_id):
    """Get all cards for a specific deck."""
    if deck_id not in decks:
        return jsonify({"error": "Deck not found"}), 404

    deck_cards = [card for card in cards.values() if card["deck_id"] == deck_id]
    return jsonify(deck_cards), 200


@app.route("/api/decks/<string:deck_id>/cards", methods=["POST"])
def add_cards(deck_id):
    """Add cards to a specific deck."""
    if deck_id not in decks:
        return jsonify({"error": "Deck not found"}), 404

    data = request.get_json()
    if not data or "cards" not in data:
        return jsonify({"error": "Cards data is required"}), 400

    new_cards = []
    for item in data["cards"]:
        if not item.get("question") or not item.get("answer"):
            continue

        card_id = str(uuid.uuid4())
        card = {
            "id": card_id,
            "deck_id": deck_id,
            "question": item["question"],
            "answer": item["answer"],
        }
        cards[card_id] = card
        new_cards.append(card)

    return jsonify(new_cards), 201


@app.route("/api/decks/<string:deck_id>/cards/bulk", methods=["POST"])
def bulk_add_cards(deck_id):
    """Add multiple cards from tab-separated text."""
    if deck_id not in decks:
        return jsonify({"error": "Deck not found"}), 404

    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "Tab-separated text is required"}), 400

    # Process the tab-separated text
    text = data["text"].strip()
    new_cards: List[Dict] = []

    # Use CSV reader to handle tab-separated input
    f = StringIO(text)
    reader = csv.reader(f, delimiter="\t")

    for row in reader:
        if len(row) < 2 or not row[0].strip() or not row[1].strip():
            continue

        card_id = str(uuid.uuid4())
        card = {
            "id": card_id,
            "deck_id": deck_id,
            "question": row[0].strip(),
            "answer": row[1].strip(),
        }
        cards[card_id] = card
        new_cards.append(card)

    return jsonify(new_cards), 201


# Frontend Routes
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    """Serve frontend files."""
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return render_template("index.html")


# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    """Handle 404 errors."""
    if request.path.startswith("/api/"):
        return jsonify({"error": "Resource not found"}), 404
    return render_template("index.html")


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    if request.path.startswith("/api/"):
        return jsonify({"error": "Internal server error"}), 500
    return render_template("error.html"), 500


if __name__ == "__main__":
    app.run(debug=True)
