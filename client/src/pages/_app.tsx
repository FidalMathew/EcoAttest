import GlobalContextProvider from "@/context/GlobalContext";
import "@/styles/globals.css";
import type {AppProps} from "next/app";
import {useEffect, useState} from "react";
// import {NillionClient} from "@nillion/client-vms";
// import {NamedNetwork} from "@nillion/client-core";
// import {createSignerFromKey} from "@nillion/client-payments";
// import {NillionClientProvider} from "@nillion/client-react-hooks";

// export const client = NillionClient.create({
//   network: NamedNetwork.enum.Devnet,
//   overrides: async () => {
//     const signer = await createSignerFromKey(
//       process.env.NEXT_PUBLIC_NILLION_NILCHAIN_PRIVATE_KEY!
//     );
//     return {
//       signer,
//       endpoint: process.env.NEXT_PUBLIC_NILLION_ENDPOINT,
//       cluster: process.env.NEXT_PUBLIC_NILLION_CLUSTER_ID,
//       bootnodes: [process.env.NEXT_PUBLIC_NILLION_BOOTNODE_WEBSOCKET],
//       chain: process.env.NEXT_PUBLIC_CHAIN,
//       userSeed: process.env.NEXT_PUBLIC_NILLION_USER_SEED,
//       nodeSeed: Math.random().toString(),
//     };
//   },
// });

export default function App({Component, pageProps}: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    // <NillionClientProvider client={client}>
    <GlobalContextProvider>
      <Component {...pageProps} />
    </GlobalContextProvider>
    // </NillionClientProvider>
  );
}
