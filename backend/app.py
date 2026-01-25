from flask import Flask, request, jsonify
import smtplib
from email.message import EmailMessage
import random
import time
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend (public folder)

# ================= CONFIG =================
EMAIL_ADDRESS = "codehelp1234@gmail.com"
EMAIL_PASSWORD = "gxrqoqjtwzfdrjuy"

OTP_EXPIRY_SECONDS = 120  # 2 minutes

# Temporary in-memory OTP store
# Structure: { email: { "otp": "123456", "expires": timestamp } }
otp_store = {}

# ================= SEND OTP =================
@app.route('/send-otp', methods=['POST'])
def send_otp():
    data = request.json
    email = data.get('email')
    name = data.get('name', 'User')

    if not email:
        return jsonify({"message": "Email required"}), 400

    otp = random.randint(100000, 999999)
    expiry_time = time.time() + OTP_EXPIRY_SECONDS

    otp_store[email] = {
        "otp": str(otp),
        "expires": expiry_time
    }

    msg = EmailMessage()
    msg['Subject'] = 'Your OTP Verification'
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = email
    msg.set_content(
        f"""Hello {name},

Your OTP is: {otp}

This OTP is valid for 2 minutes.
Do not share it with anyone.



— Security Team
"""
    )

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            smtp.send_message(msg)
    except Exception as e:
        return jsonify({"message": "Failed to send OTP"}), 500

    return jsonify({"message": "OTP sent successfully"})

# ================= VERIFY OTP =================
@app.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.json
    email = data.get('email')
    user_otp = data.get('otp')

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

    # OTP verified — remove it
    del otp_store[email]

    return jsonify({"message": "OTP verified successfully ✅"})

# ================= RUN SERVER =================
if __name__ == "__main__":
    app.run(debug=True)
