# Locust Load Testing Configuration
# Copy this to locust_config.py and update with your actual values

# =============================================================================
# ADMIN CREDENTIALS (from your .env.local ADMINS variable)
# =============================================================================
# Format in .env.local: ADMINS={"admin":{"password":"your_password","role":"admin"}}

ADMIN_USERNAME = "2M"
ADMIN_PASSWORD = "123@@"  # ← UPDATE THIS!

# =============================================================================
# PRODUCT IDS FOR TESTING
# =============================================================================
# Get these from your MongoDB database
# Run: db.products.find({}, {_id: 1}).limit(10) in MongoDB shell

PRODUCT_IDS = [
    "690f814b2d347474a225a197",  
    "6911b14f4a4d6f5b49358e30",
    "691447069bd6cd1c7be2ce53",
    "69144c08f8cc0efa3022d9fa",
    "69144c08f8cc0efa3022d9ff",
    "69144c08f8cc0efa3022da03",
    "69144c08f8cc0efa3022da07",
    "69144c08f8cc0efa3022da0b",
]

# =============================================================================
# TEST CONFIGURATION
# =============================================================================

# Where is your app running?
TARGET_HOST = "http://localhost:4010"

# How many virtual users to simulate?
# Start small (10-20) and increase gradually
USERS = 50
SPAWN_RATE = 10  # Users spawned per second

# Test duration
RUN_TIME = "5m"  # 5 minutes - increase for longer tests
