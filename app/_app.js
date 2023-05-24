import { usePreserveScroll } from "hooks/usePreserveScroll";

import "@fontsource/feeling-passionate";
import "tailwind.css";

const Fonts = () => (
  <style jsx global>{`
    /* latin */
    @font-face {
      font-family: "Feeling Passionate";
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url("/FeelingPassionate.otf") format("otf");
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC,
        U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
  `}</style>
);

export default function MyApp({ Component, pageProps }) {
  usePreserveScroll();
  return (
    <>
      <Fonts />
      <Component {...pageProps} />
    </>
  );
}
