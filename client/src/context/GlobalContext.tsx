import {createContext, ReactNode, useEffect, useState} from "react";
import {
  ADAPTER_STATUS_TYPE,
  CHAIN_NAMESPACES,
  EVM_ADAPTERS,
  IProvider,
  MULTI_CHAIN_ADAPTERS,
  WALLET_ADAPTERS,
  WEB3AUTH_NETWORK,
} from "@web3auth/base";
import {EthereumPrivateKeyProvider} from "@web3auth/ethereum-provider";
import {OpenloginAdapter, OpenloginUserInfo} from "@web3auth/openlogin-adapter";
import {
  createWalletClient,
  createPublicClient,
  custom,
  type PublicClient,
  WalletClient,
} from "viem";
import {sepolia, hederaTestnet} from "viem/chains";
import {getContract} from "viem";
import EcoAttestABI from "../lib/EcoAttestABI.json";
import {Web3Auth} from "@web3auth/modal";
import {useRouter} from "next/router";

interface PublicClientContextType {
  publicClient: PublicClient | null;
  walletClient: WalletClient | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo?: () => Promise<Partial<OpenloginUserInfo> | undefined>;
  provider: IProvider | null;
  loggedIn: boolean;
  status: ADAPTER_STATUS_TYPE;
  getAllOrganizations?: () => Promise<void>;
  loggedInAddress?: string | null;
  balanceAddress?: string | null;
}

export const GlobalContext = createContext<PublicClientContextType>({
  publicClient: null,
  walletClient: null,
  login: async () => {},
  logout: async () => {},
  provider: null,
  loggedIn: false,
  status: "not_ready",
});

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x128",
  rpcTarget: "https://testnet.hashio.io/api",
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: {chainConfig},
});

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
  uiConfig: {
    mode: "dark",
  },
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
  const [balanceAddress, setBalanceAddress] = useState<string | null>(null);
  const [loggedInAddress, setLoggedInAddress] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();

        setProvider(web3auth.provider);
      } catch (error) {
        console.error(error, "Error initializing Web3Auth");
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (web3auth.connected && web3auth.provider) {
      const walletClient = createWalletClient({
        chain: hederaTestnet,
        transport: custom(web3auth.provider),
      });

      setWalletClient(walletClient);

      const publicClient = createPublicClient({
        chain: hederaTestnet,
        transport: custom(web3auth.provider),
      });

      setPublicClient(publicClient);
    }

    if (web3auth.connected) {
      setLoggedIn(true);
    }
  }, [router, web3auth.connected, web3auth.provider, loggedIn]);

  const login = async () => {
    try {
      const web3authProvider = await web3auth.connect();
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
      console.log(user, "dsa");
      return user;
    } catch (error) {
      console.error(error, "Error getting user info");
    }
  };

  useEffect(() => {
    (async function () {
      try {
        if (walletClient && publicClient) {
          const [address] = await walletClient.getAddresses();
          console.log(address, "dsaaddress");
          setLoggedInAddress(address);

          const balance = await publicClient.getBalance({
            address: address,
          });

          console.log(balance.toString(), "balance");
          setBalanceAddress(balance.toString());
        }
      } catch (error) {
        console.error(error, "Error logging in");
      }
    })();
  }, [walletClient, publicClient, provider, loggedIn, router.pathname]);

  const logout = async () => {
    await web3auth.logout();
    router.reload();
    setProvider(null);
    setLoggedIn(false);
  };
  // 0.0.4798103

  const CONTRACT_ADDRESS = "0x8934C4959c865dAAC507C1f5E1587fe5Dd7365Bf";

  // Create a contract instance
  const contract = getContract({
    address: CONTRACT_ADDRESS,
    abi: EcoAttestABI,
    // 1a. Insert a single client
    // client: publicClient,
    // // 1b. Or public and/or wallet clients
    client: {public: publicClient, wallet: walletClient},
  });

  const getAllOrganizations = async () => {
    try {
      if (publicClient) {
        console.log(contract, "contract");
        const data = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: EcoAttestABI,
          functionName: "getAllOrganizations",
        });
        console.log(data, "Das");
        // return data;
        return data;
      }
    } catch (error) {
      console.log(error, "from getAllOrganizations");
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        publicClient,
        walletClient,
        login,
        logout,
        getUserInfo,
        provider,
        loggedIn,
        status: web3auth.status,
        getAllOrganizations,
        balanceAddress,
        loggedInAddress,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
