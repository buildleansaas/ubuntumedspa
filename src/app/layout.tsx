import React from "react";
import Script from "next/script";
import NextLink from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

interface NavbarProps {
  color?: string;
  sharedProductName?: string;
  sharedProductSlogan?: string;
}

function Navbar({
  color = "black",
  sharedProductName = "Ubuntu Med Spa",
  sharedProductSlogan = "Plasma Rich Platelet Health Therapy",
}: NavbarProps) {
  return (
    <div className="flex items-start justify-between w-full px-6 py-6">
      <NextLink href="/" passHref>
        <div className="flex items-center justify-start">
          <Image
            width={50}
            height={50}
            src={color === "black" ? "/ubuntu-black.png" : "/ubuntu.png"}
            alt="Ubuntu Med Spa logo"
          />
          <div className="flex flex-col items-start justify-center ml-2">
            <h1 className="text-lg md:text-xl text-white font-bold">{sharedProductName}</h1>
            <p className="mt-0 text-sm md:text-base text-white font-light">{sharedProductSlogan}</p>
          </div>
        </div>
      </NextLink>
      <div className="flex items-center">
        <NextLink href="/#about" passHref className="mx-2 text-white-600 hover:text-white">
          Procedures
        </NextLink>{" "}
        <NextLink href="/blog" passHref className="mx-2 text-white-600 hover:text-white">
          Beauty Blog
        </NextLink>
      </div>
    </div>
  );
}

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
      <body className="bg-black">
        <div
          className="min-h-screen max-w-8xl mx-auto w-full bg-black text-white bg-contain bg-no-repeat bg-top relative overflow-hidden"
          style={{ backgroundImage: "url(/bg.png)" }}
        >
          <Navbar sharedProductName="Ubuntu Med Spa" sharedProductSlogan="Regenerative Health and Wellness" />
          <div className="w-full flex items-center justify-center flex-col flex-grow mt-8 px-4 md:px-9 lg:px-18 xl:px-27">
            {children}
          </div>
          <footer class="text-center text-white mt-16">
            <div className="p-4 text-center">
              © 2023 Copyright:
              <NextLink className="text-white" href="/">
                Ubuntu Med Spa
              </NextLink>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
