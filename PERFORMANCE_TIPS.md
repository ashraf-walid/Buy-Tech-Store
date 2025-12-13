# 🔧 **Performance Tuning Tips**

## 📉 **Reducing Connection Resets**

If you're seeing `ConnectionResetError` (10054), this means your server is overwhelmed:

### **Quick Fixes:**

1. **Reduce User Count** (in Locust web UI):
   - Try: 20-30 users instead of 50
   - Spawn rate: 2-5 users/second instead of 5-10

2. **Increase Next.js Server Limits**:

Edit `next.config.mjs`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Increase request body size limit
  serverRuntimeConfig: {
    maxRequestSize: '10mb'
  },
  
  // Experimental features for better performance
  experimental: {
    serverMinification: false,  // Disable minification in dev
    optimizeCss: false,  // Disable CSS optimization in dev
  }
};

export default nextConfig;
```

3. **Monitor Your MongoDB Connection Pool**:
   - Current limit in `mongoose.js`: Check connection pooling settings
   - Recommended: `maxPoolSize: 10` for development

4. **Add Rate Limiting Protection** (Optional):
   ```bash
   npm install express-rate-limit
   ```

---

## 🎯 **Expected Results After Fix:**

```
✅ Order Creation: 0-2% failures (was 100%)
✅ Connection Resets: <1% (was 5%)
✅ Response Times:
   - /api/products: <150ms
   - /api/orders (POST): <400ms
   - Homepage: <600ms
```

---

## ⚡ **Run Your Next Test:**

```bash
# Stop current test (Ctrl+C in terminal)
# Restart Locust to load the updated code
python -m locust

# Then in browser (http://localhost:8089):
# - Users: 30
# - Spawn rate: 5
# - Duration: 5 minutes
```

---

## 📊 **Success Criteria:**

Your app is **production-ready** when:
- ✅ Overall failure rate < 1%
- ✅ 95th percentile < 1 second
- ✅ Can handle 50+ concurrent users
- ✅ No 500 errors under load
