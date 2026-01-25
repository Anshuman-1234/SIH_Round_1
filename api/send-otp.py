from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.message import EmailMessage
import random
import os
from otp_store import otp_store, OTP_EXPIRY_SECONDS

# Optional: load .env for local testing
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

# Environment variables for Gmail credentials
EMAIL_ADDRESS = os.environ.get("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.environ.get("EMAIL_PASSWORD")

@app.route("/api/send-otp", methods=["POST"])
def send_otp():
    data = request.json
    email = data.get("email")
    name = data.get("name", "User")

    if not email:
        return jsonify({"message": "Email required"}), 400

    # Generate OTP
    otp = random.randint(100000, 999999)
    expiry_time = time.time() + OTP_EXPIRY_SECONDS
    otp_store[email] = {"otp": str(otp), "expires": expiry_time}

    # Create email message
    msg = EmailMessage()
    msg['Subject'] = 'Your OTP Verification'
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = email
    msg.set_content(f"""Hello {name},\n\nYour OTP is: {otp}\n\nThis OTP is valid for 2 minutes.\nDo not share it with anyone.\n\n— Security Team""")

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            smtp.send_message(msg)
    except Exception as e:
        print("Error sending OTP:", e)
        return jsonify({"message": "Failed to send OTP"}), 500

    return jsonify({"message": "OTP sent successfully ✅"})

# Vercel serverless handler
def handler(environ, start_response):
    from werkzeug.wrappers import Request, Response
    request = Request(environ)
    response = Response(app(request.environ, request.start_response))
    return response(environ, start_response)
