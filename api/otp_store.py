# Shared in-memory OTP store for demo purposes
# In production, use Redis or a database

import time

otp_store = {}  # Structure: { email: { "otp": "123456", "expires": timestamp } }

OTP_EXPIRY_SECONDS = 120  # 2 minutes
