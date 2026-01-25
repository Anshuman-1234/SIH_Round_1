from flask import Flask, request, jsonify
from flask_cors import CORS
import time
from otp_store import otp_store

app = Flask(__name__)
CORS(app)

@app.route("/api/verify-otp", methods=["POST"])
def verify_otp():
    data = request.json
    email = data.get("email")
    user_otp = data.get("otp")

    if not email or not user_otp:
        return jsonify({"message": "Email and OTP required"}), 400

    if email not in otp_store:
        return jsonify({"message": "OTP not found or expired"}), 400

    stored_otp = otp_store[email]['otp']
    expires = otp_store[email]['expires']

    if time.time() > expires:
        del otp_store[email]
        return jsonify({"message": "OTP expired"}), 400

    if user_otp != stored_otp:
        return jsonify({"message": "Invalid OTP"}), 400

    del otp_store[email]
    return jsonify({"message": "OTP verified successfully ✅"})

# Required for Vercel serverless
def handler(environ, start_response):
    from werkzeug.wrappers import Request, Response
    request = Request(environ)
    response = Response(app(request.environ, request.start_response))
    return response(environ, start_response)
