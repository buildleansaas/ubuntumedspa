import React, { Suspense } from "react";
import Script from "next/script";

import "./globals.css";
import { Toaster } from "components/ui/toaster";
import StructuredData from "components/structured-data";
import Header from "components/header";
import Footer from "components/footer";
import CartDrawer from "components/cart-drawer";
import { CartProvider } from "components/cart-provider";
import RouteProgressBar from "components/route-progress-bar";
import { Metadata } from "next";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, ORIGIN } from "lib/seo";

interface LayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  metadataBase: new URL(ORIGIN),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1d2333" },
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: "/",
    siteName: "Williamsburg Med Spa",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Williamsburg Med Spa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/twitter-image"],
  },
};

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en" className="bg-base-100">
      <Script strategy="afterInteractive" id="gtag" src="https://www.googletagmanager.com/gtag/js?id=G-FBEPLGSS9L" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-FBEPLGSS9L');
        `}
      </Script>
      <body className="m-0 bg-base-100 p-0 text-base-content antialiased">
        <CartProvider>
          <Suspense fallback={null}>
            <RouteProgressBar />
          </Suspense>
          <CartDrawer />
          <Toaster />
          <StructuredData type="Organization" />
          <StructuredData type="LocalBusiness" />
          <div className="min-h-screen w-full">
            <div className="sticky top-0 z-40 w-full border-b border-base-300 bg-base-100 shadow-sm">
              <div className="mx-auto w-full max-w-xl px-4 md:max-w-7xl md:px-8">
                <Header />
              </div>
            </div>
            <main className="mx-auto w-full max-w-8xl px-4 pt-6 md:px-9 md:pt-8 lg:px-18 xl:px-27">
              <div className="relative flex w-full flex-col items-center justify-center text-base-content">
                {children}
                <Footer />
              </div>
            </main>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
