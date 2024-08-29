import GlobalContextProvider from "@/context/GlobalContext";
import "@/styles/globals.css";
import type {AppProps} from "next/app";

export default function App({Component, pageProps}: AppProps) {
  return (
    <GlobalContextProvider>
      <Component {...pageProps} />
    </GlobalContextProvider>
  );
}
