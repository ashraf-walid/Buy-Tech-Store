# Next.js Rendering Strategies: Best Practices Guide

> A comprehensive guide to choosing and implementing the right rendering strategy for your Next.js application

## Table of Contents
- [Overview](#overview)
- [SSG - Static Site Generation](#ssg---static-site-generation)
- [SSR - Server-Side Rendering](#ssr---server-side-rendering)
- [ISR - Incremental Static Regeneration](#isr---incremental-static-regeneration)
- [CSR - Client-Side Rendering](#csr---client-side-rendering)
- [Decision Tree](#decision-tree)
- [Performance Comparison](#performance-comparison)

---

## Overview

Next.js supports four main rendering strategies, each with specific use cases and trade-offs:

| Strategy | When HTML is Generated | Best For |
|----------|----------------------|----------|
| **SSG** | Build time | Static content, blogs, marketing pages |
| **SSR** | Every request | Personalized content, real-time data |
| **ISR** | Build time + Periodic revalidation | Semi-dynamic content, e-commerce |
| **CSR** | Client browser | Dashboards, authenticated pages |

---

## SSG - Static Site Generation

### 🎯 What is SSG?

Pre-renders pages at **build time**. HTML is generated once and reused for every request.

### ✅ When to Use SSG

- ✅ Content doesn't change frequently
- ✅ Content is the same for all users
- ✅ Page can be pre-rendered ahead of time
- ✅ Performance is critical (fastest option)
- ✅ SEO is important

### 📋 Use Cases

- 📄 Blog posts and articles
- 📚 Documentation
- 🛍️ Product catalog pages (with ISR)
- 🏠 Landing pages
- 📰 Marketing pages
- ❓ FAQ pages
- 📖 About/Contact pages

### 💻 Code Example

```jsx
// app/blog/page.js
// Default behavior in Next.js App Router - automatically SSG

export default async function BlogPage() {
  // This runs at BUILD TIME only
  const posts = [
    { id: 1, title: "Post 1", content: "..." },
    { id: 2, title: "Post 2", content: "..." },
  ];

  return (
    <div>
      <h1>Blog</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  );
}
```

### 📊 Pros & Cons

| Pros ✅ | Cons ❌ |
|---------|---------|
| ⚡ Fastest performance | 🔄 Content can become stale |
| 💰 Lowest server cost | ⏰ Requires rebuild to update |
| 🌍 Easy CDN caching | 📈 Long build times for many pages |
| 🔍 Perfect SEO | 🎯 Not suitable for personalized content |

### 🔍 How to Identify in Build Output

```bash
○ /blog                # ○ = Static (SSG)
```

### ⚡ Best Practices

1. **Use for content that rarely changes**
2. **Combine with ISR for semi-dynamic content**
3. **Keep build times reasonable** (use ISR for large datasets)
4. **Pre-generate important pages only**
5. **Use `generateStaticParams` for dynamic routes**

---

## SSR - Server-Side Rendering

### 🎯 What is SSR?

Renders pages **on every request** on the server. Fresh HTML generated for each user.

### ✅ When to Use SSR

- ✅ Content changes frequently
- ✅ Content is personalized per user
- ✅ Real-time data is required
- ✅ SEO is important
- ✅ Need fresh data on every request

### 📋 Use Cases

- 🔐 User dashboards (authenticated)
- 🛒 Shopping cart pages
- 👤 User profile pages
- 📊 Real-time analytics
- 🔍 Search results pages
- 🎫 Ticket booking systems
- 💬 Social media feeds

### 💻 Code Example

```jsx
// app/dashboard/page.js
// Force dynamic rendering

// Option 1: Using dynamic = 'force-dynamic'
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // This runs on EVERY REQUEST
  const userData = await fetch('https://api.example.com/user', {
    cache: 'no-store' // Disable caching
  });
  
  return (
    <div>
      <h1>Welcome, {userData.name}</h1>
      <p>Last login: {new Date().toLocaleString()}</p>
    </div>
  );
}

// Option 2: Using cookies/headers (automatically makes it dynamic)
import { cookies } from 'next/headers';

export default async function ProfilePage() {
  const cookieStore = cookies();
  const userId = cookieStore.get('userId');
  
  // Fetch user-specific data
  const user = await getUserData(userId);
  
  return <UserProfile user={user} />;
}
```

### 📊 Pros & Cons

| Pros ✅ | Cons ❌ |
|---------|---------|
| 🎯 Always fresh data | 🐌 Slower than SSG |
| 👤 Personalized content | 💰 Higher server costs |
| 🔍 Good SEO | ⚡ Can't use CDN effectively |
| 🔐 Secure (server-only logic) | 📈 Scales with traffic |

### 🔍 How to Identify in Build Output

```bash
ƒ /dashboard            # ƒ = Dynamic (SSR)
```

### ⚡ Best Practices

1. **Use only when necessary** (SSG/ISR are faster)
2. **Optimize database queries** (use indexes, caching)
3. **Implement proper error handling**
4. **Use streaming for large pages** (`loading.js`)
5. **Cache expensive operations** (not the page itself)
6. **Consider ISR as an alternative**
7. **Use Suspense boundaries** for better UX

```jsx
// Good: Use Suspense for better UX
export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<Skeleton />}>
        <UserData />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <Analytics />
      </Suspense>
    </div>
  );
}
```

---

## ISR - Incremental Static Regeneration

### 🎯 What is ISR?

Combines SSG benefits with periodic updates. Pages are **static but regenerate** in the background.

### ✅ When to Use ISR

- ✅ Content changes periodically (not constantly)
- ✅ You want SSG performance with fresh data
- ✅ Acceptable to show slightly stale data
- ✅ E-commerce product pages
- ✅ News/blog sites with updates

### 📋 Use Cases

- 🛍️ Product pages (prices, stock)
- 📰 News articles
- 📊 Analytics dashboards (updated hourly)
- 🏆 Leaderboards
- 🌦️ Weather pages
- 📈 Stock price pages
- 🎬 Movie/show listings

### 💻 Code Example

```jsx
// app/products/[id]/page.js

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function ProductPage({ params }) {
  const product = await fetch(`https://api.example.com/products/${params.id}`, {
    next: { revalidate: 60 } // Per-fetch revalidation
  });

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Price: ${product.price}</p>
      <p>Stock: {product.stock}</p>
      <p className="text-sm text-gray-500">
        Updated: {new Date().toLocaleString()}
      </p>
    </div>
  );
}

// Generate static params at build time
export async function generateStaticParams() {
  const products = await fetch('https://api.example.com/products');
  
  return products.map(product => ({
    id: product.id.toString(),
  }));
}
```

### 📊 Pros & Cons

| Pros ✅ | Cons ❌ |
|---------|---------|
| ⚡ Fast like SSG | ⏰ Data can be stale (revalidation delay) |
| 🔄 Automatic updates | 🤔 Complex invalidation logic |
| 💰 Lower cost than SSR | 🎯 Not suitable for real-time data |
| 🌍 CDN-friendly | 🔧 Harder to debug |
| 📈 Scales well | ⚠️ First visitor after revalidation waits |

### 🔍 How to Identify in Build Output

```bash
◐ /products/[id]       # ◐ = ISR (if revalidate is set)
```

### ⚡ Best Practices

1. **Choose appropriate revalidation time**
   - 60s for stock/prices
   - 3600s (1 hour) for news
   - 86400s (1 day) for blogs

2. **Use on-demand revalidation when possible**
```jsx
// app/api/revalidate/route.js
import { revalidatePath } from 'next/cache';

export async function POST(request) {
  const { path } = await request.json();
  revalidatePath(path);
  return Response.json({ revalidated: true });
}
```

3. **Combine with `generateStaticParams`** for dynamic routes
4. **Monitor stale data tolerance**
5. **Use different revalidation times per data type**

---

## CSR - Client-Side Rendering

### 🎯 What is CSR?

Rendering happens **in the browser** using JavaScript. Initial HTML is minimal.

### ✅ When to Use CSR

- ✅ Highly interactive components
- ✅ Data behind authentication
- ✅ SEO is not important
- ✅ Real-time updates (WebSocket, polling)
- ✅ User-specific data that doesn't need SSR

### 📋 Use Cases

- 🎮 Interactive widgets/tools
- 📊 Real-time charts
- 💬 Chat applications
- 🎨 Drawing/design tools
- 🗺️ Interactive maps
- 📝 Rich text editors
- 🔐 Private dashboards

### 💻 Code Example

```jsx
// components/UserDashboard.jsx
'use client'; // Mark as Client Component

import { useState, useEffect } from 'react';

export default function UserDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch on client-side
    fetch('/api/user/data')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1>Welcome, {data.name}</h1>
      {/* Interactive components */}
    </div>
  );
}
```

### 📊 Pros & Cons

| Pros ✅ | Cons ❌ |
|---------|---------|
| 🎯 Highly interactive | ❌ Poor SEO |
| ⚡ Reduced server load | 🐌 Slower initial load |
| 🔄 Real-time updates easy | 📱 More client resources |
| 💻 Simpler architecture | ⚠️ Exposed API calls |

### ⚡ Best Practices

1. **Use `'use client'` directive** at the top
2. **Show loading states** (skeleton screens)
3. **Implement error boundaries**
4. **Lazy load heavy components**
5. **Combine with SSR** (hybrid approach)
6. **Use React Suspense** for better UX
7. **Minimize client bundle size**

```jsx
// Good: Hybrid approach
// app/products/page.js (SSG)
import ProductInteraction from './ProductInteraction';

export default function ProductPage({ product }) {
  return (
    <div>
      {/* Server-rendered content */}
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      
      {/* Client-side interactive features */}
      <ProductInteraction productId={product.id} />
    </div>
  );
}

// components/ProductInteraction.jsx (CSR)
'use client';

export default function ProductInteraction({ productId }) {
  // Client-side interactivity
  const [likes, setLikes] = useState(0);
  
  return <button onClick={() => setLikes(likes + 1)}>❤️ {likes}</button>;
}
```

---

## Decision Tree

```
Start: Do you need SEO?
│
├─ YES → Is content the same for all users?
│  │
│  ├─ YES → Does content change frequently?
│  │  │
│  │  ├─ NO → Use SSG ✅
│  │  └─ YES → Can users tolerate stale data?
│  │     │
│  │     ├─ YES → Use ISR ✅
│  │     └─ NO → Use SSR ✅
│  │
│  └─ NO (Personalized) → Use SSR ✅
│
└─ NO → Do you need server data?
   │
   ├─ NO → Use CSR ✅
   └─ YES → Is data behind auth?
      │
      ├─ YES → Use CSR ✅
      └─ NO → Use SSG/ISR ✅
```

---

## Performance Comparison

### Speed (Fastest to Slowest)

1. **SSG** ⚡⚡⚡⚡⚡ (Instant)
2. **ISR** ⚡⚡⚡⚡ (Fast, occasional regeneration)
3. **SSR** ⚡⚡⚡ (Moderate, server processing)
4. **CSR** ⚡⚡ (Slower, client processing)

### Cost (Cheapest to Most Expensive)

1. **SSG** 💰 (Minimal server, CDN friendly)
2. **ISR** 💰💰 (Background regeneration)
3. **CSR** 💰💰 (Client resources)
4. **SSR** 💰💰💰 (Continuous server processing)

### SEO Ranking

1. **SSG** 🔍🔍🔍🔍🔍 (Perfect)
2. **ISR** 🔍🔍🔍🔍🔍 (Perfect)
3. **SSR** 🔍🔍🔍🔍 (Excellent)
4. **CSR** 🔍 (Poor without workarounds)

---

## Real-World Examples from Your Project

### ✅ SSG Examples
```javascript
// ✅ BlogPage - Perfect for SSG
// Content: Static blog posts
// Updates: Rarely
// SEO: Important
src/app/BlogPage/page.js

// ✅ AboutUs - Perfect for SSG
src/app/AboutUs/page.js

// ✅ FAQPage - Perfect for SSG
src/app/FAQPage/page.js
```

### ✅ SSR Examples
```javascript
// ✅ Dashboard - Needs SSR
// Content: User-specific, authenticated
// Updates: Real-time
// SEO: Not needed
src/app/dashboard/page.js

// ✅ ProductDetails - Could use SSR or ISR
// Content: Product data (price, stock)
// Updates: Frequently
// SEO: Important
src/app/ProductDetails/[id]/page.js
```

### ✅ ISR Recommendation
```javascript
// 🔄 Consider ISR for these:

// Products page - prices/stock change periodically
src/app/productsPage/page.jsx
// ➡️ Add: export const revalidate = 300; // 5 minutes

// Product details - individual product updates
src/app/ProductDetails/[id]/page.js
// ➡️ Add: export const revalidate = 60; // 1 minute
```

### ✅ CSR Examples
```javascript
// ✅ Newsletter Form - Client Component
src/components/NewsletterForm.jsx

// ✅ Cart interactions - Client-side
src/app/CartPage/page.js
```

---

## Best Practices Summary

### ✅ DO's

- ✅ Use **SSG by default** in Next.js App Router
- ✅ Add **ISR** for semi-dynamic content
- ✅ Use **SSR** only when absolutely necessary
- ✅ Implement **hybrid rendering** (SSG + CSR)
- ✅ Use `loading.js` for better UX
- ✅ Implement proper error boundaries
- ✅ Monitor Core Web Vitals
- ✅ Cache expensive operations
- ✅ Use `generateStaticParams` for dynamic routes

### ❌ DON'Ts

- ❌ Don't use SSR when SSG/ISR works
- ❌ Don't use CSR for SEO-critical pages
- ❌ Don't fetch on every render (cache when possible)
- ❌ Don't ignore loading states
- ❌ Don't mix rendering strategies unnecessarily
- ❌ Don't forget revalidation for ISR
- ❌ Don't overuse client components

---

## Quick Reference Table

| Page Type | Recommended Strategy | Revalidate Time |
|-----------|---------------------|-----------------|
| Blog posts | SSG | N/A |
| Product pages | ISR | 60-300s |
| User dashboard | SSR / CSR | N/A |
| Landing pages | SSG | N/A |
| Search results | SSR | N/A |
| Shopping cart | CSR | N/A |
| News articles | ISR | 300-600s |
| Documentation | SSG | N/A |
| Analytics | SSR / CSR | N/A |
| About page | SSG | N/A |

---

## Performance Metrics to Monitor

1. **First Contentful Paint (FCP)** - SSG wins
2. **Largest Contentful Paint (LCP)** - SSG wins
3. **Time to Interactive (TTI)** - SSG wins
4. **Cumulative Layout Shift (CLS)** - All equal (if done right)
5. **First Input Delay (FID)** - CSR can struggle

---

## Conclusion

> **Golden Rule**: Start with SSG, upgrade to ISR if needed, use SSR only when required, sprinkle CSR for interactivity.

The best strategy depends on your specific use case. Most applications benefit from a **hybrid approach**:
- **SSG/ISR** for public pages
- **SSR** for personalized content
- **CSR** for interactive features

---

**Last Updated**: December 2025  
**Next.js Version**: 15.x  
**Author**: Buy Tech Store Development Team
