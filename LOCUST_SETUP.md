# 🚀 Locust Load Testing - Setup & Run Guide

## ⚠️ **BEFORE YOU RUN TESTS**

### 1. **Create Your Configuration File**

```bash
# Copy the template
cp locust_config_TEMPLATE.py locust_config.py
```

Then edit `locust_config.py` and update:

#### **Admin Credentials**
Check your `.env.local` for the `ADMINS` variable:
```
ADMINS={"admin":{"password":"YOUR_ACTUAL_PASSWORD","role":"admin"}}
```

Update in `locust_config.py`:
```python
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "YOUR_ACTUAL_PASSWORD"  # ← Same as in .env.local
```

#### **Product IDs**
Get real product IDs from your MongoDB:

**Option A: Using MongoDB Compass**
1. Connect to your database
2. Go to the `products` collection
3. Copy 5-10 product `_id` values

**Option B: Using MongoDB Shell**
```javascript
db.products.find({}, {_id: 1}).limit(10)
```

Add them to `locust_config.py`:
```python
PRODUCT_IDS = [
    "actual_product_id_1",
    "actual_product_id_2",
    "actual_product_id_3",
]
```

---

## 🎯 **Running Load Tests**

### **Start your application first!**
```bash
npm run dev
```

### **Run Locust**

#### **Option 1: Web UI (Recommended for first-time)**
```bash
python -m locust
```
Then:
1. Open http://localhost:8089
2. Enter:
   - **Number of users**: Start with 10-20
   - **Spawn rate**: 2-5 users/second
   - **Host**: http://localhost:4010
3. Click "Start swarming"

#### **Option 2: Headless (for automated testing)**
```bash
python -m locust --headless --users 50 --spawn-rate 10 --run-time 5m --html report.html
```

---

## 📊 **Understanding Results**

### ✅ **Good Metrics**
- **Failures**: < 1%
- **`/api/products` response time**: < 200ms (due to caching)
- **`/api/orders` POST**: < 500ms
- **Homepage**: < 1000ms

### 🔴 **Bad Signs**
- **High failure rate** (> 5%)
- **500 errors**: Server crashes under load
- **Connection resets**: Server can't handle concurrent connections
- **Increasing response times**: Performance degradation

---

## 🐛 **Troubleshooting**

### **Problem: "401 Unauthorized" on admin login**
**Fix**: Update `ADMIN_PASSWORD` in `locust_config.py` to match your `.env.local`

### **Problem: "400 Bad Request" on order creation**
**Fix**: 
1. Make sure `PRODUCT_IDS` contains valid product IDs
2. Check terminal logs for validation errors

### **Problem: "Connection forcibly closed"**
**Fix**: 
- Reduce number of users
- Increase spawn rate interval
- Check if your dev server has connection limits

### **Problem: Tests are too fast/slow**
**Fix**: Adjust `wait_time` in the user classes:
```python
wait_time = between(2, 8)  # Wait 2-8 seconds between tasks
```

---

## 🎓 **Best Practices**

1. **Start Small**: Begin with 5-10 users, gradually increase
2. **Monitor Logs**: Watch your terminal for errors during tests
3. **Check Database**: Ensure test data is cleaned up after
4. **Production Testing**: Use a staging environment, not production!
5. **Baseline First**: Run test with 1 user to get baseline metrics

---

## 📈 **Progressive Load Testing**

Run tests in this order:

```bash
# 1. Smoke test (1 user, verify everything works)
python -m locust --headless --users 1 --spawn-rate 1 --run-time 1m

# 2. Light load (10 users)
python -m locust --headless --users 10 --spawn-rate 2 --run-time 3m --html light_load.html

# 3. Medium load (50 users)
python -m locust --headless --users 50 --spawn-rate 10 --run-time 5m --html medium_load.html

# 4. Heavy load (100+ users) - Only if previous tests passed!
python -m locust --headless --users 100 --spawn-rate 20 --run-time 10m --html heavy_load.html
```

---

## 🎉 **You're Ready!**

Now follow the steps above and re-run your load test!
