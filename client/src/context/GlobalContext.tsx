import {createContext, ReactNode, useEffect, useState} from "react";
import {
  CHAIN_NAMESPACES,
  IProvider,
  WALLET_ADAPTERS,
  WEB3AUTH_NETWORK,
} from "@web3auth/base";
import {EthereumPrivateKeyProvider} from "@web3auth/ethereum-provider";
import {Web3AuthNoModal} from "@web3auth/no-modal";
import {OpenloginAdapter} from "@web3auth/openlogin-adapter";
import {
  createWalletClient,
  createPublicClient,
  custom,
  type PublicClient,
  WalletClient,
} from "viem";
import {sepolia, hedera} from "viem/chains";

interface PublicClientContextType {
  publicClient: PublicClient | null;
  walletClient: WalletClient | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const GlobalContext = createContext<PublicClientContextType>({
  publicClient: null,
  walletClient: null,
  login: async () => {},
  logout: async () => {},
});

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: {chainConfig},
});

const web3auth = new Web3AuthNoModal({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});

const openloginAdapter = new OpenloginAdapter();
web3auth.configureAdapter(openloginAdapter);

export default function GlobalContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [walletClient, setWalletClient] = useState<any>(null);
  const [publicClient, setPublicClient] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.init();
        setProvider(web3auth.provider);

        if (web3auth.connected && web3auth.provider) {
          const walletClient = createWalletClient({
            chain: sepolia,
            transport: custom(web3auth.provider),
          });

          setWalletClient(walletClient);

          const publicClient = createPublicClient({
            chain: sepolia,
            transport: custom(web3auth.provider),
          });

          setPublicClient(publicClient);
        }

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error, "Error initializing Web3Auth");
      }
    };

    init();
  }, []);

  const login = async () => {
    try {
      const web3authProvider = await web3auth.connectTo(
        WALLET_ADAPTERS.OPENLOGIN,
        {
          loginProvider: "google",
        }
      );

      setProvider(web3authProvider);

      if (web3auth.connected) {
        setLoggedIn(true);
      }
    } catch (error) {
      console.error(error, "Error logging in");
    }
  };

  const getUserInfo = async () => {
    try {
      const user = await web3auth.getUserInfo();
      return user;
    } catch (error) {
      console.error(error, "Error getting user info");
    }
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  return (
    <GlobalContext.Provider value={{publicClient, walletClient, login, logout}}>
      {children}
    </GlobalContext.Provider>
  );
}
