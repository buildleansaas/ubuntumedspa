// pages/_app.js
import { ChakraProvider } from "@chakra-ui/react";
import { Global } from "@emotion/react";

// 1. Import the extendTheme function
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({});

// 3. Pass the `theme` prop to the `ChakraProvider`
export default function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
