Framework: Next.js 15.5.3 (App Router)
Language: JavaScript
Database: MongoDB (accessed via Mongoose ODM)
Styling: Tailwind CSS (with clsx and tailwind-merge for utility management)
State Management: Zustand (for global client-side state)
Authentication: Clerk (@clerk/nextjs)
Image Hosting: Cloudinary

2. Folder Structure Explanation
The project follows a standard Next.js App Router structure within the src directory.

src/
├── app/                 # Main application routes and API endpoints
│   ├── api/             # Backend API routes (Server-side logic)
│   ├── dashboard/       # Admin/User Dashboard pages
│   ├── (pages)/         # Various public pages (AboutUs, CartPage, etc.)
│   ├── layout.js        # Root layout (HTML structure, providers)
│   └── page.js          # Home page
├── components/          # Reusable React components (UI, Forms, etc.)
├── lib/                 # Core libraries and configurations
│   ├── mongoose.js      # MongoDB connection logic
│   └── cloudinary.js    # Cloudinary configuration
├── models/              # Mongoose database schemas (User, Product, Order, etc.)
├── store/               # Zustand stores for client-side state management
├── hooks/               # Custom React hooks
└── utils/               # Helper functions

## 3. Navigation and Routing
The project uses the Next.js App Router, meaning the file system defines the routes.

Public Routes
/ -> Landing Page (
src/app/page.js
)
/login -> Login Page
/CartPage -> Shopping Cart
/Checkout -> Checkout Process
/ProductDetails/[id] -> Dynamic route for individual product details. The [id] folder indicates a dynamic segment.
Protected/Dashboard Routes
/dashboard -> Main Dashboard area. Likely contains sub-routes for managing products, orders, etc., depending on the user's role (Admin vs. Customer).
Navigation Implementation
Linking: Navigation is handled using the <Link> component from next/link for client-side transitions.
Redirects: Server-side redirects (e.g., protecting routes) are likely handled in
src/middleware.js
or within individual page components/layouts.

## 4. Backend Logic & Data Flow
The backend logic is strictly separated into API Routes and Database Models.

API Routes (src/app/api/)
These files handle HTTP requests (GET, POST, PUT, DELETE). They run on the server.

/api/auth - Authentication related endpoints.
/api/products - CRUD operations for products.
/api/orders - Order processing and management.
/api/users - User profile management.
/api/uploadImages - Handles file uploads to Cloudinary.
Database Connection
Location: src/lib/mongoose.js
Pattern: Uses a cached connection pattern. This ensures that in a serverless environment (like Vercel), the application reuses the existing database connection instead of creating a new one for every request, preventing connection exhaustion.
Data Flow Example (Fetching Products)
Client: A component (e.g., in src/app/productsPage/page.js) requests data.
API: It calls /api/products.
Server: The API route connects to MongoDB using src/lib/mongoose.js.
Query: It uses the Product model from src/models to query the database.
Response: JSON data is returned to the client.
State Management
Zustand (src/store/) is used to manage global client state, such as the Shopping Cart or User Preferences, avoiding "prop drilling" across components.

## 5. Main Features of the Project

### Pages Overview

#### Public Pages
*   **Landing Page (`/`)**: The main storefront displaying featured products, sales, and categories.
*   **Product Details (`/ProductDetails/[id]`)**: Detailed view of a specific product, including specs, images, and "Add to Cart" functionality.
*   **Cart (`/CartPage`)**: Displays selected items, allows quantity adjustment, and shows total price.
*   **Checkout (`/Checkout`)**: Collects shipping and payment information to place an order.
*   **Login (`/login`)**: Admin/User login page.
*   **Static Pages**: `AboutUs`, `FAQPage`, `PrivacyPolicy`, `TermsAndConditions`, `ShippingInfo`, `ReturnsPolicy`.

#### Dashboard (`/dashboard`)
A protected area for administrators to manage the store.
*   **Overview**: General stats (likely implemented in `DashboardClient.jsx`).
*   **Product Management**:
    *   **Add Product**: Form to create new products with images and details.
    *   **Edit Product**: Interface to update existing product information.
*   **Order Management**: View and process customer orders.
*   **Marketing**:
    *   **Coupons**: Create and manage discount codes.
    *   **Flash Sales**: Manage sale events.
    *   **Newsletter**: View and manage newsletter subscribers.
*   **User Management**: View registered users.
*   **Messages**: View inquiries sent via the Contact Us form.

### API Endpoints (`src/app/api/`)

*   **`/api/auth/login`**: Handles admin login. Verifies credentials against environment variables and issues a JWT in an HTTP-only cookie.
*   **`/api/products`**:
    *   `GET`: Fetches all products (implements server-side caching for performance).
    *   `POST`: Creates a new product (Admin only).
*   **`/api/orders`**:
    *   `GET`: Fetches all orders (Admin only).
    *   `POST`: Creates a new order (Public/User). Handles validation and coupon usage updates.
*   **`/api/coupons`**: CRUD operations for discount codes.
*   **`/api/contact`**: Handles contact form submissions.
*   **`/api/newsletter`**: Manages newsletter subscriptions.
*   **`/api/uploadImages`**: Handles image uploads to Cloudinary.

### Important Components

*   **`Header` / `Navbar`**: Main navigation bar, likely containing the Logo, Search, Cart icon, and User menu.
*   **`ProductCard`**: Reusable component to display product preview (image, price, title) in grids.
*   **`Cart` (State)**: Managed via Zustand (`src/store/`), handles adding/removing items and calculating totals globally.
*   **`DashboardClient`**: The main layout/controller for the dashboard, handling the switching between different admin views (Products, Orders, etc.).
*   **`AddProduct` / `EditProductModal`**: Complex forms with validation for managing product data.

### Authentication & Session Flow

The project currently uses a **Custom JWT Authentication** system (despite Clerk presence in dependencies).

1.  **Login**: User submits credentials to `/api/auth/login`.
2.  **Verification**: Server checks credentials against the `ADMINS` environment variable.
3.  **Token Issuance**: A JWT signed with `JWT_SECRET` is created containing the user's role (e.g., 'admin').
4.  **Cookie**: The token is set in an `auth` HTTP-only cookie.
5.  **Middleware Protection**: `src/middleware.js` intercepts requests to `/dashboard`. It verifies the `auth` cookie using `jose`. If invalid or missing, it redirects to `/login`.
6. Role-Based Access: The middleware specifically checks if the user has the 'admin' role for sensitive routes.

## 6. All Available API Endpoints

### Authentication
| Route | Method | Protected | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | `POST` | No | Admin login. Expects `{ username, password }`. Returns `{ message, role }` and sets HTTP-only cookie. |
| `/api/auth/login` | `GET` | No | Verifies current session. Returns `{ message, role }`. |

### Products
| Route | Method | Protected | Description |
| :--- | :--- | :--- | :--- |
| `/api/products` | `GET` | No | Fetches all products. Uses server-side caching (`all_products`). |
| `/api/products` | `POST` | **Yes (Admin)** | Creates a new product. Expects product JSON. Clears cache. |
| `/api/products/[_id]` | `GET` | No | Fetches a single product by ID. Uses caching. |
| `/api/products/[_id]` | `PUT` | **Yes (Admin)** | Updates a product. Expects partial/full product JSON. Clears cache. |
| `/api/products/[_id]` | `DELETE` | **Yes (Admin)** | Deletes a product and its associated Cloudinary images. |

### Orders
| Route | Method | Protected | Description |
| :--- | :--- | :--- | :--- |
| `/api/orders` | `POST` | No | Creates a new order. Expects `{ firstName, lastName, items, total, ... }`. Validates fields and updates coupon usage. |
| `/api/orders` | `GET` | **Yes (Admin)** | Fetches all orders sorted by date. |
| `/api/orders/latest` | `GET` | No | Returns the timestamp of the most recent order (`{ lastOrderTime }`). |

### Coupons
| Route | Method | Protected | Description |
| :--- | :--- | :--- | :--- |
| `/api/coupons` | `GET` | **Yes (Admin)** | Fetches all discount coupons. |
| `/api/coupons` | `POST` | **Yes (Admin)** | Creates a new coupon. Expects `{ code, discount, ... }`. |
| `/api/coupons/[id]` | `PUT` | **Yes (Admin)** | Updates an existing coupon. |
| `/api/coupons/[id]` | `DELETE` | **Yes (Admin)** | Deletes a coupon. |

### Users
| Route | Method | Protected | Description |
| :--- | :--- | :--- | :--- |
| `/api/users` | `GET` | **Yes (Admin)** | Fetches list of users from Clerk. Returns `{ count, users: [...] }`. |

### Marketing & Content
| Route | Method | Protected | Description |
| :--- | :--- | :--- | :--- |
| `/api/sale` | `GET` | No | Fetches current Flash Sale configuration (banner, dates, discount). |
| `/api/sale` | `POST` | **Yes (Admin)** | Updates or creates the Flash Sale configuration. Handles image replacement. |
| `/api/newsletter` | `POST` | No | Subscribes an email to the newsletter. Expects `{ email }`. |
| `/api/newsletter` | `GET` | **Yes (Admin)** | Fetches all newsletter subscribers. |
| `/api/newsletter` | `DELETE` | **Yes (Admin)** | Deletes a subscriber. Expects `{ id }`. |
| `/api/contact` | `POST` | No | Submits a contact form message. Expects `{ name, email, message }`. |
| `/api/contact` | `GET` | **Yes (Admin)** | Fetches all contact messages. |

### Utilities
| Route | Method | Protected | Description |
| :--- | :--- | :--- | :--- |
| `/api/uploadImages` | `POST` | **Yes (Admin)** | Uploads an image to Cloudinary. Expects `FormData` with `file`. Returns `{ url, public_id }`. |

## 7. Full User Flow

### 1. Authentication Flow
*   **Admin Login**:
    1.  User visits `/login`.
    2.  Enters credentials which are sent to `/api/auth/login`.
    3.  Server validates against `process.env.ADMINS`.
    4.  On success, an HTTP-only `auth` cookie is set, and the user is redirected to `/dashboard`.
    5.  Session storage is updated with `userRole` for client-side UI logic.
*   **Customer Session**:
    *   Currently, there is no strict "Customer Login" flow enforced for browsing or buying.
    *   Customer data (email, address) is collected at **Checkout** time.
    *   The Cart is persisted in `localStorage` via Zustand, allowing users to return to their session without logging in.

### 2. Product Browsing & Details
1.  **Landing Page**:
    *   The user lands on `/`.
    *   `useProductsStore` (Zustand) fetches all products from `/api/products`.
    *   Data is cached in the browser store to prevent re-fetching on navigation.
2.  **Product Details**:
    *   User clicks a product card, navigating to `/ProductDetails/[id]`.
    *   The page checks the local `products` store first.
    *   If the product isn't found (e.g., direct link access), it triggers `ensureProductsLoaded()` to fetch from the API.
    *   Images are displayed using the `ImageGallery` component.

### 3. Cart & Order Logic
1.  **Add to Cart**:
    *   User clicks "Add to Cart".
    *   `useCartStore` updates the `cartItem` object (mapping `productId` -> `quantity`).
    *   The updated cart is immediately saved to `localStorage`.
2.  **Checkout**:
    *   User navigates to `/Checkout`.
    *   The page reads `cartItem` from the store and calculates totals.
    *   User fills in shipping details.
3.  **Order Placement**:
    *   User submits the form.
    *   A POST request is sent to `/api/orders` with the payload: `{ items, total, userDetails, ... }`.
    *   Server validates the order, decrements coupon usage (if any), and saves to MongoDB.
    *   On success, the cart is cleared (`clearCart()`).

## 8. Performance-Critical Routes

These are the areas that will experience the highest load and are critical for user retention.

### 1. High-Volume Read Endpoints
*   **`/api/products` (GET)**:
    *   **Criticality**: High. Called by every user on the landing page.
    *   **Current Optimization**: Server-side in-memory caching (`src/lib/cache.js`) prevents hitting MongoDB on every request.
    *   **Risk**: If the cache is cold or invalidated frequently, MongoDB connections could spike.
*   **`/api/sale` (GET)**:
    *   **Criticality**: Medium. Fetched on the home page to show banners.

### 2. High-Importance Write Endpoints
*   **`/api/orders` (POST)**:
    *   **Criticality**: Critical. This is the revenue generation endpoint.
    *   **Complexity**: Involves validation, potential coupon database updates, and order creation.
    *   **Risk**: Race conditions on coupon usage or inventory (if inventory tracking is added later).

### 3. Database & External Services
*   **MongoDB Connection**: The serverless environment requires the cached connection pattern (`mongoose.js`) to avoid connection limit errors under load.
*   **Cloudinary**: Used for images. While not a direct server load, image loading speed affects perceived performance (Core Web Vitals).

## 9. Locust Load Testing Guide

To ensure the application can handle traffic, we should simulate realistic user behaviors.

### Recommended Test Scenarios

#### Scenario A: The Window Shopper (High Volume)
*   **Behavior**: Lands on home page -> Scrolls (fetches products) -> Views 2-3 product details -> Leaves.
*   **Load Profile**: Heavy read operations.
*   **Target Routes**: `/api/products`, `/api/sale`.

#### Scenario B: The Buyer (Critical Path)
*   **Behavior**: Home -> Product Details -> Add to Cart -> Checkout -> Place Order.
*   **Load Profile**: Mixed read/write.
*   **Target Routes**: `/api/products`, `/api/orders` (POST).

### Example Locust User Actions (Python)

```python
from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    wait_time = between(1, 5)

    @task(3)
    def view_products(self):
        # Simulate landing page load
        self.client.get("/api/products")
        self.client.get("/api/sale")

    @task(1)
    def view_product_details(self):
        # In a real test, you'd pick a dynamic ID from the product list
        # For now, we simulate hitting a specific product endpoint
        # Note: The frontend often uses the list from /api/products, 
        # but direct API access might look like this:
        self.client.get("/api/products/6744883d0698731376e9729d") 

    @task(1)
    def place_order(self):
        # Simulate placing an order
        payload = {
            "firstName": "Load",
            "lastName": "Tester",
            "phone": "1234567890",
            "address": "123 Test St",
            "city": "Test City",
            "state": "Test State",
            "items": [{"id": "6744883d0698731376e9729d", "quantity": 1}],
            "shipping": 50,
            "payment": "cod",
            "subtotal": 1000,
            "total": 1050,
            "userId": "guest",
            "userEmail": "test@example.com",
            "orderNumber": "ORD-TEST-123" 
        }
        # Note: You'll need to generate unique orderNumbers to avoid 409 conflicts
        # self.client.post("/api/orders", json=payload)
```

### Key Metrics to Watch
1.  **Response Time for `/api/products`**: Should remain under 200ms even with high concurrency due to caching.
2.  **Error Rate on `/api/orders`**: Any 500 errors here are critical failures.
3.  **MongoDB Connection Pool**: Monitor if the number of connections exceeds the tier limit.