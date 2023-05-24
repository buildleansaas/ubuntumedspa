import React from "react";
import Script from "next/script";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

import Navbar from "components/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en" className={inter.className}>
      <Script id="gtag" src={`https://www.googletagmanager.com/gtag/js?id=G-Q9LX7K1BRY`} />
      <Script
        id="init-gtag"
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            
              gtag('config', 'G-Q9LX7K1BRY');
              `,
        }}
      />
      <body>
        <div className="h-screen w-screen bg-black overflow-hidden">
          <div
            className="flex flex-col min-h-screen max-w-screen-2xl w-full mx-auto bg-black text-white"
            style={{
              backgroundImage: "url(/bg.png)",
              backgroundSize: "contain",
              backgroundPosition: "top",
              backgroundRepeat: "no-repeat",
            }}
          >
            <Navbar sharedProductName="Ubuntu Med Spa" sharedProductSlogan="Regenerative Health and Wellness" />
            <div className={`w-full flex items-center justify-center flex-col flex-1 mt-8`}>{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
