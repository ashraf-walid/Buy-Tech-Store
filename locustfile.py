from locust import HttpUser, task, between
import random
import time

# Try to import configuration, use defaults if not found
try:
    from locust_config import ADMIN_USERNAME, ADMIN_PASSWORD, PRODUCT_IDS, TARGET_HOST
except ImportError:
    print("⚠️  locust_config.py not found. Using default values.")
    print("   Copy locust_config_TEMPLATE.py to locust_config.py and update your credentials!")
    ADMIN_USERNAME = "admin"
    ADMIN_PASSWORD = "UPDATE_THIS_PASSWORD"  # ← Will fail until you update this!
    PRODUCT_IDS = ["6744883d0698731376e9729d"]
    TARGET_HOST = "http://localhost:4010"


class BuyTechUser(HttpUser):
    """
    Simulates a regular customer browsing and shopping on Buy-Tech store.
    No login required for browsing - authentication is only for admin dashboard.
    """
    wait_time = between(2, 8)
    host = TARGET_HOST
    product_ids = PRODUCT_IDS

    @task(5)
    def browse_homepage(self):
        """Land on homepage - highest frequency task"""
        self.client.get("/", name="Homepage")
        
        # Also fetch the data that homepage needs
        self.client.get("/api/products", name="API: Get Products")
        self.client.get("/api/sale", name="API: Get Sale Banner")

    @task(3)
    def view_product_details(self):
        """View a product detail page"""
        if self.product_ids:
            product_id = random.choice(self.product_ids)
            self.client.get(
                f"/ProductDetails/{product_id}", 
                name="Product Details Page"
            )

    @task(2)
    def check_latest_order(self):
        """Public endpoint to show 'last order' timestamp"""
        self.client.get("/api/orders/latest", name="API: Latest Order")

    @task(1)
    def place_order(self):
        """Simulate placing an order (most critical endpoint)"""
        order_number = f"ORD-LOAD-{int(time.time())}-{random.randint(1000, 9999)}"
        
        # Must match EXACT Order model schema (see src/models/Order.js)
        # Required fields in items: id, quantity, price, name
        # shipping must be an OBJECT with method and price (not a number!)
        payload = {
            "firstName": "LoadTest",
            "lastName": "User",
            "phone": f"05{random.randint(10000000, 99999999)}",
            "address": "123 Test Street, Apt 4",
            "city": "Cairo",
            "state": "Cairo Governorate",
            "items": [
                {
                    "id": random.choice(PRODUCT_IDS),
                    "quantity": random.randint(1, 3),
                    "price": 1000,  # REQUIRED by Order model
                    "name": "Test Product",  # REQUIRED by Order model
                    "image": "https://via.placeholder.com/150",  # Optional
                }
            ],
            "shipping": {
                "method": "standard",  # REQUIRED - must be object, not number!
                "price": 50  # REQUIRED
            },
            "payment": "cod",
            "subtotal": 1000,
            "total": 1050,
            "userId": "guest",
            "userEmail": f"loadtest{random.randint(1000, 9999)}@example.com",
            "orderNumber": order_number
        }
        
        with self.client.post(
            "/api/orders",
            json=payload,
            catch_response=True,
            name="API: Place Order"
        ) as response:
            if response.status_code == 200:
                response.success()
            elif response.status_code == 409:
                response.failure("Duplicate order (expected in load test)")
            elif response.status_code == 400:
                try:
                    error = response.json()
                    response.failure(f"Validation error: {error.get('error', 'Unknown')}")
                except:
                    response.failure(f"400 Bad Request: {response.text}")
            else:
                response.failure(f"Failed with status {response.status_code}")


class AdminUser(HttpUser):
    """
    Simulates admin users accessing the dashboard.
    Requires authentication via JWT in HTTP-only cookie.
    """
    wait_time = between(3, 10)
    host = TARGET_HOST
    
    def on_start(self):
        """Login to admin dashboard"""
        self.login()

    def login(self):
        """Admin login - uses cookie-based JWT auth"""
        response = self.client.post(
            "/api/auth/login",
            json={
                "username": ADMIN_USERNAME,
                "password": ADMIN_PASSWORD
            },
            name="Admin Login"
        )
        
        if response.status_code != 200:
            print(f"⚠️  Admin login failed: {response.status_code}")

    @task(3)
    def view_orders(self):
        """Fetch all orders (admin only)"""
        self.client.get("/api/orders", name="Admin: Get All Orders")

    @task(2)
    def view_products_admin(self):
        """View products from admin perspective"""
        self.client.get("/api/products", name="Admin: View Products")

    @task(1)
    def view_coupons(self):
        """View discount coupons"""
        self.client.get("/api/coupons", name="Admin: View Coupons")

    @task(1)
    def view_contacts(self):
        """View contact form messages"""
        self.client.get("/api/contact", name="Admin: View Messages")

    @task(1)
    def view_newsletter_subscribers(self):
        """View newsletter subscribers"""
        self.client.get("/api/newsletter", name="Admin: View Subscribers")
