import React, { useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import TawkTo from "tawkto-react";

import { Box, Fade, useBreakpointValue, Spinner } from "@chakra-ui/react";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({
  id,
  colorScheme,
  // integrations
  tawkTo,
  google,
  facebook,
  // social
  socialLinks = [],
  companyName,
  companyLink,
  sharedProductName,
  sharedProductSlogan,
  seo: { title = "", description = "", imageUrl = "" },
  // loading,
  loading,
  //  styling
  flexChildValue = 1,
  fullWidth = false,
  // rest
  children,
}) {
  const { asPath } = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      const tawk = new TawkTo(tawkTo.accountID, tawkTo.chatID);
      tawk.onStatusChange((status) =>
        console.log("tawk initiated, status: ", status)
      );
    }
  }, []);

  const SEO = {
    title,
    description,
    ...(facebook?.facebookAppId && {
      facebook: {
        appId: facebook?.facebookAppId,
      },
    }),
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_IE",
      site_name: sharedProductName,
      url: asPath,
      images: [imageUrl],
    },
  };

  const wrapperMarginTop = useBreakpointValue({ base: 8 });

  return (
    <>
      <NextSeo {...SEO} />

      {google.googleTagManagerId && (
        <>
          <Script
            id="gtag"
            src={`https://www.googletagmanager.com/gtag/js?id=${google.googleTagManagerId}`}
          />
          <Script
            id="init-gtag"
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', '${google.googleTagManagerId}');
            `,
            }}
          />
        </>
      )}

      {loading ? (
        <Box
          {...{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100vw",
            height: "100vh",
          }}
        >
          <Fade in>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="black"
              size="xl"
            />
          </Fade>
        </Box>
      ) : (
        <Fade in>
          <Box
            {...{
              id,
              display: "flex",
              alignItems: "center",
              flexDir: "column",
              minH: "100vh",
              maxW: "8xl",
              width: "100%",
              margin: "0 auto",
              ...(!fullWidth && { p: { base: 3, md: 9, lg: 18, xl: 27 } }),
              background: "black",
              color: "white",
              bgImage: "url(/bg.png)",
              bgSize: "cover",
              bgPosition: "center",
              _after: {
                content: `""`,
                display: "block",
                w: "full",
                h: "full",
                bg: "blackAlpha.700",
                position: "absolute",
                inset: 0,
                zIndex: 0,
              },
            }}
          >
            {/*             <Navbar
              {...{
                id,
                sharedProductName,
                sharedProductSlogan,
                companyLink,
                colorScheme,
              }}
            /> */}
            <Box
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDir="column"
              flex={flexChildValue}
              mt={wrapperMarginTop}
            >
              {children}
            </Box>
            <Footer {...{ companyName, companyLink, colorScheme }} />
          </Box>
        </Fade>
      )}
    </>
  );
}
