import "./globals.css";
import StoreInitializer from '@/store/initializeStore';
import { ClerkProvider } from "@clerk/nextjs";

// You get the verification code after you add your site to ( Google Search Console ) for the first time.
export const metadata = {
  title: "Buy Tech Store",
  description: "Premium laptops, desktops, and tech products",
  verification: {
    google: "YOUR_VERIFICATION_CODE",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/icon1.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon_io/icon1.png" />
        <link rel="icon" href="/favicon_io/icon0.svg" />
        <link rel="manifest" href="/favicon_io/manifest.json" />
      </head>
      <body>
        <StoreInitializer />
        <ClerkProvider 
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder'}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
