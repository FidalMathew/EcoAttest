import { createContext, ReactNode, useEffect, useState } from "react";
import {
  ADAPTER_STATUS_TYPE,
  CHAIN_NAMESPACES,
  EVM_ADAPTERS,
  IProvider,
  MULTI_CHAIN_ADAPTERS,
  WALLET_ADAPTERS,
  WEB3AUTH_NETWORK,
} from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { OpenloginAdapter, OpenloginUserInfo } from "@web3auth/openlogin-adapter";
import {
  createWalletClient,
  createPublicClient,
  custom,
  type PublicClient,
  WalletClient,
  publicActions,
  Hex,
  Account,
  http,
  hexToBigInt, sliceHex
} from "viem";
import { sepolia, hederaTestnet, baseSepolia } from "viem/chains";
import { getContract } from "viem";
import EcoAttestABI from "../lib/EcoAttestABI.json";
import countabi from "../lib/CountAbi.json";
import { Web3Auth } from "@web3auth/modal";
import { useRouter } from "next/router";
import axios from "axios";
import { privateKeyToAccount } from "viem/accounts";
import { SignProtocolClient, EvmChains, SpMode } from "@ethsign/sp-sdk";

interface PublicClientContextType {
  publicClient: PublicClient | null;
  walletClient: WalletClient | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo?: () => Promise<Partial<OpenloginUserInfo> | undefined>;
  provider: IProvider | null;
  loggedIn: boolean;
  status: ADAPTER_STATUS_TYPE;
  getAllOrganizations?: () => Promise<any>;
  addOrganization?: (
    cName: string,
    cEmail: string,
    cLogo: string
  ) => Promise<void>;
  getOrganizationByAddress?: (organizationAddress: string) => Promise<any>;
  getEventById?: (eventId: number) => Promise<any>;
  createEvent?: (
    _eventName: string,
    _eventPhoto: string,
    _eventDesc: string,
    _carbonCreds: number,
    _maxSeats: number,
    _dateTime: number
  ) => Promise<void>;
  addSubOrganizer?: (subOrgAddress: string) => Promise<void>;
  verifySubOrganizer?: (
    orgAddress: string,
    subOrgAddress: string
  ) => Promise<void>;
  registerForEvent?: (
    eventId: number
  ) => Promise<void>;
  loggedInAddress?: string | null;
  balanceAddress?: string | null;
  isOrganizerState?: boolean;
  isSubOrganizerState?: boolean;
  testbase?: () => Promise<void>;
  getAllEvents?: () => Promise<any>;
  attest?: (orgAddress: string, participantAddress: string, eventId: number, score: number) => Promise<void>;
  // loading states

  addOrganizationLoading?: boolean;
  addSubOrganizerLoading?: boolean;
}

export const GlobalContext = createContext<PublicClientContextType>({
  publicClient: null,
  walletClient: null,
  login: async () => { },
  logout: async () => { },
  provider: null,
  loggedIn: false,
  status: "not_ready",
});

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x128",
  rpcTarget: "https://296.rpc.thirdweb.com",
  displayName: "Hedera Testnet",
  blockExplorerUrl: "https://hashscan.io/testnet/",
  ticker: "HBAR",
  tickerName: "Hedera",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  sessionTime: 60 * 60 * 24 * 30, // 30 days
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
  const [publicClient, setPublicClient] = useState<PublicClient | null>(null);
  const [balanceAddress, setBalanceAddress] = useState<string | null>(null);
  const [loggedInAddress, setLoggedInAddress] = useState<string | null>(null);
  const [userAccount, setUserAccount] = useState<Account | null>(null);

  const [isSubOrganizerState, setisSubOrganizerState] =
    useState<boolean>(false);
  const [isOrganizerState, setIsOrganizerState] = useState<boolean>(false);
  const router = useRouter();

  const [currentUserIdNillion, setCurrentUserIdNillion] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (loggedInAddress && loggedIn) {
      (async function () {
        try {
          const res = await axios.post(
            "http://localhost:6969/generateUserKey",
            {
              seed: loggedInAddress.toString(),
            }
          );

          console.log(res.data, "hellworld");
          setCurrentUserIdNillion(res.data);
        } catch (error) {
          console.log(error, "from generateUserKey");
        }
      })();
    }
  }, [loggedInAddress, loggedIn]);

  const createNillionProgramForFeedback = async (seed: string) => {
    try {
      const res = await axios.post(
        "http://localhost:6969/createNillionProgramForFeedback",
        {
          seed: seed,
        }
      );
    } catch (error) {
      console.log(error, "from createNillionProgramForFeedback");
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();

        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }

        if (web3auth.provider && web3auth.connected) {
          const privateKey = await web3auth.provider.request({
            method: "eth_private_key",
          });
          console.log(privateKey, "da");

          const account = privateKeyToAccount(privateKey as Hex);
          setUserAccount(account);
        }
      } catch (error) {
        console.error(error, "Error initializing Web3Auth");
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (
      web3auth &&
      web3auth.connected &&
      web3auth.provider &&
      web3auth.connected
    ) {
      const walletClient = createWalletClient({
        chain: hederaTestnet,
        transport: custom(web3auth.provider),
      });

      // console.log(walletClient, "hellowalletClient");

      setWalletClient(walletClient);

      const publicClient = createPublicClient({
        chain: hederaTestnet,
        transport: custom(web3auth.provider),
      });

      // console.log(publicClient, "hellopublicClient");
      setPublicClient(publicClient);
    }

    if (web3auth.connected) {
      setLoggedIn(true);
    }
  }, [router, web3auth.connected, web3auth.provider, loggedIn, web3auth]);

  const login = async () => {
    try {
      const web3authProvider = await web3auth.connect();

      console.log(web3authProvider, "Connected");
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

  // const CONTRACT_ADDRESS = "0xF73972ACe5Bd3A9363Bc1F12052f18fAeF26139B";
  const CONTRACT_ADDRESS = "0xe3fc547ba753f2Ce611cf3CD6b8C5861911aE44c";

  // Create a contract instance
  const contract = getContract({
    address: CONTRACT_ADDRESS,
    abi: EcoAttestABI,
    // 1a. Insert a single client
    // client: publicClient,
    // // 1b. Or public and/or wallet clients
    client: { public: publicClient as PublicClient, wallet: walletClient },
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
        return data as any;
      }
    } catch (error) {
      console.log(error, "from getAllOrganizations");
    }
  };

  const [addOrganizationLoading, setAddOrganizationLoading] = useState(false);
  const addOrganization = async (
    cName: string,
    cEmail: string,
    cLogo: string
  ) => {
    setAddOrganizationLoading(true);
    try {
      if (publicClient && walletClient) {
        const tx = await walletClient.writeContract({
          address: CONTRACT_ADDRESS,
          abi: EcoAttestABI,
          functionName: "addOrganization",
          account: loggedInAddress,
          args: [cName, cEmail, cLogo],
        });

        await publicClient.waitForTransactionReceipt({ hash: tx });
      }
      console.log("successfully added organization");
    } catch (error) {
      console.log(error);
    } finally {
      setAddOrganizationLoading(false);
    }
  };

  const getOrganizationByAddress = async (organizationAddress: string) => {
    try {
      if (publicClient) {
        const data = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: EcoAttestABI,
          functionName: "getOrganizationByAddress",
          args: [organizationAddress],
        });
        console.log("Organization Details:", data);
        return data as any;
      }
    } catch (error) {
      console.log(error, "from getOrganizationByAddress");
    }
  };

  const getEventById = async (eventId: number) => {
    try {
      if (publicClient) {
        const data = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: EcoAttestABI,
          functionName: "getEventById",
          args: [eventId],
        });
        console.log("Event Details:", data);
        return data as any;
      }
    } catch (error) {
      console.log(error, "from getEventById");
    }
  };

  // only for contract Admins
  const verifyOrganization = async (organizationAddress: string) => {
    try {
      await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: EcoAttestABI,
        functionName: "verifyOrganization",
        account: loggedInAddress,
        args: [organizationAddress],
      });

      console.log("Organization verified successfully");
    } catch (error) {
      console.log(error, "from verifyOrganization");
    }
  };

  const createEvent = async (
    _eventName: string,
    _eventPhoto: string,
    _eventDesc: string,
    _carbonCreds: number,
    _maxSeats: number,
    _dateTime: number
  ) => {
    try {
      console.log('create event')
      await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: EcoAttestABI,
        functionName: "createEvent",
        account: loggedInAddress,
        args: [_eventName, _eventPhoto, _eventDesc, _carbonCreds, _maxSeats, _dateTime],
      });

      console.log("Event created successfully");
    } catch (error) {
      console.log(error, "from createEvent");
    }
  };

  const [addSubOrganizerLoading, setAddSubOrganizerLoading] = useState(false);
  const addSubOrganizer = async (subOrgAddress: string) => {
    setAddSubOrganizerLoading(true);
    try {
      if (publicClient) {
        const tx = await walletClient.writeContract({
          address: CONTRACT_ADDRESS,
          abi: EcoAttestABI,
          functionName: "addSubOrganizer",
          account: loggedInAddress,
          args: [subOrgAddress],
        });

        await publicClient.waitForTransactionReceipt({ hash: tx });
        console.log("Sub-organizer added successfully");
      }
    } catch (error) {
      console.log(error, "from addSubOrganizer");
    } finally {
      setAddSubOrganizerLoading(false);
    }
  };

  const verifySubOrganizer = async (
    orgAddress: string,
    subOrgAddress: string
  ) => {
    try {
      await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: EcoAttestABI,
        functionName: "verifySubOrganizer",
        account: loggedInAddress,
        args: [orgAddress, subOrgAddress],
      });

      console.log("Sub-organizer verified successfully");
    } catch (error) {
      console.log(error, "from verifySubOrganizer");
    }
  };

  const registerForEvent = async (
    eventId: number
  ) => {
    try {
      await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: EcoAttestABI,
        functionName: "registerForEvent",
        account: loggedInAddress,
        args: [eventId],
      });

      console.log("Registered for event successfully");
    } catch (error) {
      console.log(error, "from registerForEvent");
    }
  };

  const isSubOrganizer = async () => {
    try {
      if (publicClient && loggedInAddress) {
        const data = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: EcoAttestABI,
          functionName: "isSubOrganizer",
          args: [loggedInAddress],
        });
        setisSubOrganizerState(data as boolean);
        console.log(data, "isSubOrganiser");
        // return data;
        return data;
      }
    } catch (error) {
      console.log(error, "from isSubOrganizer");
    }
  };

  const isOrganizer = async () => {
    try {
      if (publicClient) {
        const data = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: EcoAttestABI,
          functionName: "isOrganizer",
          args: [loggedInAddress],
        });
        setIsOrganizerState(data as boolean);
        console.log(data, "isOrganizer");
        // return data;
        return data;
      }
    } catch (error) {
      console.log(error, "from isOrganizer");
    }
  };

  function decodeData(encodedData: string) {
    // Remove '0x' prefix if present
    if (encodedData.startsWith("0x")) {
      encodedData = encodedData.slice(2);
    }

    // Split the encoded data into 32-byte (64 hex character) chunks
    const chunks = encodedData.match(/.{1,64}/g);

    if (chunks?.length === 5) {
      if (chunks) {

        console.log(chunks, "chunks");
        // Decode each chunk
        const address1 = '0x' + chunks[0].slice(24); // Extract the last 20 bytes (40 hex characters)
        const address2 = '0x' + chunks[1].slice(24); // Extract the last 20 bytes (40 hex characters)
        const address3 = '0x' + chunks[2].slice(24); // Extract the last 20 bytes (40 hex characters)

        // Decode the boolean/integer (convert the value to BigInt)
        const booleanOrInt = Number(hexToBigInt(`0x${chunks[3]}`));
        // Decode the integer value
        const integerValue = Number(hexToBigInt(`0x${chunks[4]}`));

        console.log(address1, address2, address3, booleanOrInt, integerValue);
        return {
          address1,
          address2,
          address3,
          booleanOrInt,
          integerValue,
        };
      }
    }
  }
  const fetchAttestations = async () => {
    const id = "onchain_evm_84532_0x1a2"
    const res = (await axios.get(`https://testnet-rpc.sign.global/api/scan/attestations?schemaId=${id}`))
    // https://testnet-rpc.sign.global/api/scan/attestations?schemaId=onchain_evm_84532_0x1a2

    const rows = res.data.data.rows;

    const deRows = await Promise.all(rows?.map(async (val: any, index: number) => {

      console.log(val, "val")
      const iid = val.id;
      const rr = await axios.get(`https://testnet-rpc.sign.global/api/scan/attestations/${iid}`)
      console.log(rr, "rr --attestations");

      const encodedData = rr.data.data.data;
      console.log(encodedData, "encodedData");
      const decoded = decodeData(encodedData);
      console.log(decoded, "decoded");
      // const decodedValue = Promise.all(decoded);
      return decoded;
    }))

    console.log(deRows, "deRows");

    console.log(rows, "attestations")
  }

  useEffect(() => {
    if (publicClient) {
      isSubOrganizer();
      isOrganizer();
    }

    fetchAttestations();
  }, [publicClient, loggedInAddress]);


  const getAllEvents = async () => {
    try {
      if (publicClient) {
        const data = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: EcoAttestABI,
          functionName: "getAllEvents",
        });

        return data;
      }
    } catch (error) {
      console.log(error, "from isOrganizer");
    }
  }



  async function testbase() {
    // try {
    //   if (web3auth.provider) {
    //     const basePrivateKeyProvider = new EthereumPrivateKeyProvider({
    //       config: {
    //         chainConfig: {
    //           chainId: "0x14a34",
    //           displayName: "Base Sepolia",
    //           chainNamespace: CHAIN_NAMESPACES.EIP155,
    //           tickerName: "Base Sepolia",
    //           ticker: "ETH",
    //           decimals: 18,
    //           rpcTarget: "https://base-sepolia-rpc.publicnode.com",
    //           blockExplorerUrl: "https://sepolia.basescan.org/io",
    //           logo: "https://images.toruswallet.io/eth.svg",
    //           isTestnet: true,
    //         },
    //       },
    //     });

    //     const privateKey = await web3auth.provider.request({
    //       method: "eth_private_key",
    //     });

    //     console.log(privateKey);

    //     await basePrivateKeyProvider.setupProvider(privateKey as string);

    //     if (basePrivateKeyProvider) {
    //       const baseSepoliaPublicClient = createPublicClient({
    //         chain: baseSepolia,
    //         transport: custom(basePrivateKeyProvider),
    //       });

    //       const baseSepoliaWalletClient = createWalletClient({
    //         chain: baseSepolia,
    //         transport: custom(basePrivateKeyProvider),
    //       });

    //       // const tx = await baseSepoliaWalletClient.writeContract({
    //       //   address: "0x2f4De3b6Aee43c8BE6Cf25e3452aDEeed65D1c26" as Hex,
    //       //   abi: CountABI,
    //       //   functionName: "increment",
    //       //   account: "0x2f4De3b6Aee43c8BE6Cf25e3452aDEeed65D1c26" as Hex,
    //       //   args: [],
    //       // });

    //       // await baseSepoliaPublicClient.waitForTransactionReceipt({hash: tx});

    //       const data = await baseSepoliaPublicClient.readContract({
    //         address: "0x2f4De3b6Aee43c8BE6Cf25e3452aDEeed65D1c26" as Hex,
    //         abi: CountABI,

    //         functionName: "getCount",
    //       });

    //       console.log(data, "count");
    //     }
    //   }
    // } catch (error) {
    //   console.log(error, "from testbase");
    // }

    if (web3auth.provider) {
      const privateKey = await web3auth.provider.request({
        method: "eth_private_key",
      });

      console.log(privateKey, "private key");
      const acc = privateKeyToAccount(`0x${privateKey}` as Hex);

      const baseSepoliaPublicClient = createPublicClient({
        transport: http(),
        chain: baseSepolia,
      });

      // const baseSepoliaWalletClient = createWalletClient({
      //   transport: http(
      //     `https://base-sepolia.g.alchemy.com/v2/mNBmuddfdRetMg5zjtZTAYo2IKPMH-nF`
      //   ),
      //   chain: baseSepolia,
      //   account: acc,
      // });

      // console.log("started");

      // const tx = await baseSepoliaWalletClient.writeContract({
      //   address: "0x9586a27C47EA790e2c9f8939F6A661e4f5Aaa6db" as Hex,
      //   abi: countabi,
      //   functionName: "increment",
      //   args: [],
      // });

      // await baseSepoliaPublicClient.waitForTransactionReceipt({hash: tx});

      // console.log("done");
      const data = await baseSepoliaPublicClient.readContract({
        address: "0x9586a27C47EA790e2c9f8939F6A661e4f5Aaa6db" as Hex,
        abi: countabi,
        functionName: "getValue",
      });

      console.log(data, "vit");
    }
  }


  const attest = async (orgAddress: string, participantAddress: string, eventId: number, score: number) => {
    try {

      if (web3auth && web3auth.provider && loggedInAddress) {

        const SchemaId = "0x1a2";
        // const privateKey = ("0x" + process.env.NEXT_PUBLIC_PRIVATE_KEY!) as Hex;
        const privateKey = await web3auth.provider.request({
          method: 'eth_private_key'
        })
        const account = privateKeyToAccount(`0x${privateKey}`);

        const client = new SignProtocolClient(SpMode.OnChain, {
          chain: EvmChains.baseSepolia,
          account: account,
        });

        if (client !== undefined) {

          const data = {
            orgAddress: orgAddress,
            subOrgAddress: loggedInAddress,
            participantAddress: participantAddress,
            eventId: eventId,
            score: score
          };

          const createAttestationRes = await client.createAttestation({
            data: data,
            schemaId: SchemaId,
            indexingValue: "xxx",
            recipients: [
              loggedInAddress,

            ],
          });

          console.log(createAttestationRes);
        }
      }
      else {
        console.log("web3 auth not fetch")
      }
    } catch (error) {
      console.error(error);
    }
  }

  // register for event participant -> provide name, image along with msg.sender

  console.log(web3auth.status, "web3auth.status");

  console.log(userAccount, "lol");

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
        addOrganization,
        getOrganizationByAddress,
        getEventById,
        createEvent,
        addSubOrganizer,
        verifySubOrganizer,
        registerForEvent,
        isSubOrganizerState,
        isOrganizerState,
        addOrganizationLoading,
        addSubOrganizerLoading,
        testbase,
        attest,
        getAllEvents
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
