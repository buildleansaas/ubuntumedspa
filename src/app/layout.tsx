import React from "react";
import Script from "next/script";

import "./globals.css";
import { Toaster } from "components/ui/toaster";
import Header from "components/header";
import Footer from "components/footer";
import { Metadata } from "next";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "lib/seo";

interface LayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
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
      <body className="bg-black m-0 p-0">
        <Toaster />
        <div className="min-h-screen max-w-8xl mx-auto w-full relative mt-[-2rem]">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-black bg-contain bg-no-repeat bg-top"
            style={{ zIndex: -1, backgroundImage: "url(/bg.png)" }}
          />

          {/* Gradient Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.69)] to-transparent"
            style={{ zIndex: 0 }}
          />

          {/* Content */}
          <div
            className="w-full text-white flex items-center justify-center flex-col flex-grow mt-8 px-4 md:px-9 lg:px-18 xl:px-27 relative"
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
