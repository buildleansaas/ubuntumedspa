import React from "react";
import Script from "next/script";

import "./globals.css";
import { Toaster } from "components/ui/toaster";
import Header from "components/header";
import Footer from "components/footer";
import { Metadata } from "next";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, ORIGIN } from "lib/seo";

interface LayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  metadataBase: new URL(ORIGIN),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
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
    <html lang="en">
      <Script strategy="afterInteractive" id="gtag" src="https://www.googletagmanager.com/gtag/js?id=G-FBEPLGSS9L" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-FBEPLGSS9L');
        `}
      </Script>
      <body className="m-0 p-0">
        <Toaster />
        <div className="min-h-screen max-w-8xl mx-auto w-full relative mt-[-2rem]">
          {/* <div
            className="absolute inset-0 bg-base-100 bg-contain bg-no-repeat bg-top"
            style={{ zIndex: -1, backgroundImage: "url(/bg.png)" }}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-base-100/70 to-transparent" style={{ zIndex: 0 }} /> */}
          <div
            className="w-full text-base-content flex items-center justify-center flex-col flex-grow mt-8 px-4 md:px-9 lg:px-18 xl:px-27 relative"
            style={{ zIndex: 1 }}
          >
            <Header />
            {children}
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
