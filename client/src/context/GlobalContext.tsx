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
  publicActions,
  Hex,
  Account,
  http,
  hexToBigInt,
  sliceHex,
  parseEther,
} from "viem";
import {sepolia, hederaTestnet, baseSepolia} from "viem/chains";
import {getContract} from "viem";
import EcoAttestABI from "../lib/EcoAttestABI.json";
import HookABI from "../lib/Hook.json";
import countabi from "../lib/CountAbi.json";
import {Web3Auth} from "@web3auth/modal";
import {useRouter} from "next/router";
import axios from "axios";
import {privateKeyToAccount} from "viem/accounts";
import {SignProtocolClient, EvmChains, SpMode} from "@ethsign/sp-sdk";
import {toast} from "sonner";
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
  registerForEvent?: (eventId: number) => Promise<void>;
  loggedInAddress?: string | null;
  balanceAddress?: string | null;
  isOrganizerState?: boolean;
  attestations?: [];
  isSubOrganizerState?: boolean;
  testbase?: () => Promise<void>;
  getAllEvents?: () => Promise<any>;
  getOrgAddressFromSub?: () => Promise<any>;
  getParticipantByAddress?: (address: string) => Promise<any>;
  attest?: (
    orgAddress: string,
    participantAddress: string,
    eventId: number,
    score: number
  ) => Promise<void>;
  testFunc?: (participantName: string, photo: string) => Promise<void>;
  CONTRACT_ADDRESS?: string;
  storeProgram?: () => Promise<void>;
  storeVotesByOrganisers?: (
    voteValue: number,
    participantAddress: string
  ) => Promise<void>;
  computeResult?: (participantAddress: string) => Promise<void>;
  feedbackResult?: number | undefined;

  // loading states
  addOrganizationLoading?: boolean;
  addSubOrganizerLoading?: boolean;
  registerEventLoading?: boolean;
  createEventLoading?: boolean;
  storeProgramLoading?: boolean;
  storeVotesLoading?: boolean;
  computeLoading?: boolean;
}

export const GlobalContext = createContext<PublicClientContextType>({
  publicClient: null,
  walletClient: null,
  login: async () => {},
  logout: async () => {},
  provider: null,
  loggedIn: false,
  status: "not_ready",
  CONTRACT_ADDRESS: "",
});

// Function to generate a random seed (hex string)
function generateRandomSeed() {
  // Generates a random 32-byte hex seed
  return (
    "0x" +
    [...Array(64)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("")
  );
}

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x128",
  // rpcTarget: "https://296.rpc.thirdweb.com",
  rpcTarget: "https://testnet.hashio.io/api",
  displayName: "Hedera Testnet",
  blockExplorerUrl: "https://hashscan.io/testnet/",
  ticker: "HBAR",
  tickerName: "Hedera",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: {chainConfig},
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

// const CONTRACT_ADDRESS = "0xF73972ACe5Bd3A9363Bc1F12052f18fAeF26139B";
// const CONTRACT_ADDRESS = "0xe3fc547ba753f2Ce611cf3CD6b8C5861911aE44c";
const CONTRACT_ADDRESS = "0xd5A40d6371d20eD0FF7e95dE0b952AbE84Fd2418";
// const CONTRACT_ADDRESS = "0xa11ff608DB42F526180543260d9eb135a3c30cFe";

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

  // const createNillionProgramForFeedback = async (seed: string) => {
  //   try {

  //     return res.data as string;
  //   } catch (error) {
  //     console.log(error, "from createNillionProgramForFeedback");
  //   }
  // };

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
          console.log(privateKey, "private KEy");
          const account = privateKeyToAccount(`0x${privateKey}` as Hex);
          setUserAccount(account);
        }
      } catch (error) {
        console.error(error, "Error initializing Web3Auth 1");
      }
    };

    init();
  }, []);

  useEffect(() => {
    (async function () {
      try {
        if (
          web3auth &&
          web3auth.connected &&
          web3auth.provider &&
          web3auth.connected
        ) {
          // console.log(loggedInAddress, "loggedInAddress");
          const walletClient = createWalletClient({
            chain: hederaTestnet,
            transport: custom(web3auth.provider),
            account: loggedInAddress as Hex,
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
      } catch (error) {
        console.error(error, "Error initializing Web3Auth 2");
      }
    })();
  }, [router, web3auth.connected, web3auth.provider, loggedIn, web3auth]);

  useEffect(() => {
    (async function () {
      try {
        if (publicClient && walletClient && loggedIn && loggedInAddress) {
          const userInfo = await getUserInfo();
          if (userInfo) {
            const isParticipant = await publicClient.readContract({
              address: CONTRACT_ADDRESS,
              functionName: "isParticipant",
              abi: EcoAttestABI,
              args: [loggedInAddress],
            });

            console.log(isParticipant, "dsa1");

            console.log(loggedInAddress, "dsa1");

            console.log(userInfo.name, userInfo.profileImage, "dsa2");

            if (isParticipant) console.log("Participant already exists dsa");
            if (!isParticipant && userInfo.name && userInfo.profileImage) {
              const fundingAcc = privateKeyToAccount(
                `0x${process.env.NEXT_PUBLIC_PRIVATE_KEY!}` as Hex
              );

              const fundingClient = createWalletClient({
                account: fundingAcc,
                chain: hederaTestnet,
                transport: http(),
              });

              console.log("Creating participant");

              console.log(userInfo.name, userInfo.profileImage, "dsa3");

              const tx = await walletClient.writeContract({
                address: CONTRACT_ADDRESS,
                abi: EcoAttestABI,
                functionName: "createParticipant",
                account: loggedInAddress as Hex,
                args: [userInfo.name, userInfo.profileImage],
              });

              await publicClient.waitForTransactionReceipt({hash: tx});

              console.log("Participant created successfully");
            }
          }
        }
      } catch (error) {
        console.error(error, "Error initializing Web3Auth 3");
      }
    })();
  }, [publicClient, walletClient, loggedInAddress]);

  const [storeProgramLoading, setStoreProgramLoading] = useState(false);

  async function storeProgram() {
    setStoreProgramLoading(true);
    toast.loading("Storing Program Id on nillion network");

    // Function to retry the backend request
    const retryRequest = async (retryCount = 0) => {
      try {
        if (loggedInAddress && walletClient && publicClient) {
          // Sending request to backend
          const {data} = await axios.post(
            "http://localhost:6969/storeProgram",
            {
              seed: loggedInAddress,
            }
          );

          console.log("program id is succesful from nillion backend");
          toast.success("Successfully stored Program Id on nillion network");
          if (data) {
            // Contract update if backend request succeeds
            const tx = await walletClient.writeContract({
              address: CONTRACT_ADDRESS,
              abi: EcoAttestABI,
              functionName: "updateProgramId",
              account: loggedInAddress as Hex,
              args: [data],
            });

            await publicClient.waitForTransactionReceipt({hash: tx});
            console.log("Program Id updated successfully");
            toast.success("Program Id updated successfully in contract");

            // Request and transaction successful, set loading to false
            setStoreProgramLoading(false);
            router.reload();
          }
        }
      } catch (error) {
        // If backend server error, log and retry
        console.log(error, "from storeProgram");

        if (retryCount < 5) {
          console.log(`Retry attempt: ${retryCount + 1}`);

          // Retry after 3 seconds delay
          await new Promise((resolve) => setTimeout(resolve, 3000));
          await retryRequest(retryCount + 1);
        } else {
          // After max retries, log error and set loading to false
          console.log("Max retry attempts reached. Aborting request.");
          toast.error("Max retry attempts reached. Aborting request.");
          setStoreProgramLoading(false); // Ensure loading is set to false on failure
        }
      }
    };

    // Call the retry function to start the process
    await retryRequest();
  }

  const [storeVotesLoading, setStoreVotesLoading] = useState(false);

  async function storeVotesByOrganisers(
    voteValue: number,
    participantAddress: string
  ) {
    setStoreVotesLoading(true);

    // Function to retry the backend request
    const retryRequest = async (retryCount = 0) => {
      try {
        if (loggedInAddress && walletClient && publicClient) {
          // fetch feedbackStoreIds

          const participantByAddress = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            functionName: "getParticipantByAddress",
            abi: EcoAttestABI,
            args: [participantAddress],
          });

          const arrayofstoreid = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            functionName: "getFeedbackStoreIds",
            abi: EcoAttestABI,
            args: [participantAddress],
          });

          console.log(participantByAddress, "storeVotesByOrganisersfucku");
          console.log(arrayofstoreid, "arrayofstoreid");
          if (!participantByAddress) return;

          // @ts-ignore
          if (participantByAddress && participantByAddress.programId) {
            const {data} = await axios.post("http://localhost:6969/storeVote", {
              seed: loggedInAddress,
              vote_value: voteValue,
              secret_name: `feedback${(arrayofstoreid as string[]).length + 1}`,
              // @ts-ignore
              programId: participantByAddress.programId,
              // @ts-ignore
              programOwnerSeed: participantByAddress.user,
            });

            console.log("feedback stored");
            toast.success("Successfully stored feedback on nillion network");
            if (data) {
              const tx = await walletClient.writeContract({
                address: CONTRACT_ADDRESS,
                abi: EcoAttestABI,
                functionName: "storeFeedback",
                account: loggedInAddress as Hex,
                // @ts-ignore
                args: [data, participantByAddress.user],
              });

              await publicClient.waitForTransactionReceipt({hash: tx});
              console.log("Feedback stored successfully in contract");
              toast.success("Feedback stored successfully in contract");

              // Request and transaction successful, set loading to false
              setStoreVotesLoading(false);
            }
          }
        }
      } catch (error) {
        // If backend server error, log and retry
        console.log(error, "from storeProgram");

        if (retryCount < 5) {
          console.log(`Retry attempt: ${retryCount + 1}`);

          // Retry after 3 seconds delay
          await new Promise((resolve) => setTimeout(resolve, 3000));
          await retryRequest(retryCount + 1);
        } else {
          // After max retries, log error and set loading to false
          console.log("Max retry attempts reached. Aborting request.");
          toast.error("Max retry attempts reached. Aborting request.");
          setStoreProgramLoading(false); // Ensure loading is set to false on failure
        }
      } finally {
        setStoreVotesLoading(false);
      }
    };

    // Call the retry function to start the process
    await retryRequest();
  }

  const [computeLoading, setComputeLoading] = useState(false);

  const [feedbackResult, setFeedbackResult] = useState<number | undefined>(
    undefined
  );

  async function computeResult(participantAddress: string) {
    setComputeLoading(true);

    // Function to retry the backend request
    const retryRequest = async (retryCount = 0) => {
      try {
        if (loggedInAddress && walletClient && publicClient) {
          // fetch feedbackStoreIds

          const participantByAddress = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            functionName: "getParticipantByAddress",
            abi: EcoAttestABI,
            args: [participantAddress],
          });

          const arrayofstoreid = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            functionName: "getFeedbackStoreIds",
            abi: EcoAttestABI,
            args: [participantAddress],
          });

          const arrayofprogramseeds = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            functionName: "getVoters",
            abi: EcoAttestABI,
            args: [participantAddress],
          });

          console.log(participantByAddress, "ppppppppppp");
          if (!participantByAddress) return;
          // @ts-ignore
          if (participantByAddress && participantByAddress.programId !== "") {
            // const feedbackStoreIds =
            //   // @ts-ignore
            //   participantByAddress.feedbackStoreIds as string[];

            // const subOrganisersSeed =
            //   // @ts-ignore
            //   participantByAddress.subOrganisersSeed as string[];

            // @ts-ignore
            const programId = participantByAddress.programId;

            // if ((arrayofprogramseeds as string[]).length < 3) {
            //   const numberOfVotesToStore =
            //     3 - (arrayofprogramseeds as string[]).length;
            //   const remainingArrayOfSeeds = [
            //     ...(arrayofprogramseeds as string[]),
            //   ];

            //   // Generate random seeds and push to remainingArrayOfSeeds
            //   for (let i = 0; i < numberOfVotesToStore; i++) {
            //     const randomSeed = generateRandomSeed();
            //     remainingArrayOfSeeds.push(randomSeed);

            //     const {data} = await axios.post(
            //       "http://localhost:6969/storeVote",
            //       {
            //         seed: randomSeed,
            //         vote_value: 0,
            //         secret_name: "feedback2",
            //         programId:
            //           "3LD8sj1T9c1u6yg63dupUztmhXVwecdh3VLCWxrLoeDG9q9VX88jMRyL1TXvn5iSKCKTCzt7LtQRxSrHKDJAs2eq/feedback_program",
            //         programOwnerSeed:
            //           "0xdd4dB825306bFEeC56Bb74dcC66FE30C300B6f5A",
            //       }
            //     );
            //   }

            //   // setFeedbackResult(data.avg_feedback);
            // } else if ((arrayofprogramseeds as string[]).length === 3) {
            //   const {data} = await axios.post("http://localhost:6969/compute", {
            //     stored_secret_ids: arrayofstoreid,
            //     subOrganisersSeed: arrayofprogramseeds,
            //     participantSeed: loggedInAddress,
            //     // @ts-ignore
            //     programId: participantByAddress.programId,
            //   });

            //   setFeedbackResult(data.avg_feedback);
            // }

            const {data} = await axios.post("http://localhost:6969/compute", {
              stored_secret_ids: [
                "06f23a7d-5b9d-4097-ab16-4b302ba76f2e",
                "53997b22-2fc4-4e14-b9da-142c7bbce6b0",
                "2e78eba6-35de-4adc-ab60-ce840644f58f",
              ],
              subOrganisersSeed: [
                "0xf0b2975277884ADe4476329Abedcde4f15D95f7F",
                "0x4c15a97eABF9CA6bAc35cb91543bD3C010f0ef9C",
                "0xdd4dB825306bFEeC56Bb74dcC66FE30C300B6f5A",
              ],
              participantSeed: participantAddress,
              programId: programId,
            });

            setFeedbackResult(data.avg_feedback);

            console.log("feedback stored");
            toast.success("Successfully stored feedback on nillion network");
            // if (data) {
            //   // Contract update if backend request succeeds
            //   const tx = await walletClient.writeContract({
            //     address: CONTRACT_ADDRESS,
            //     abi: EcoAttestABI,
            //     functionName: "storeFeedback",
            //     account: loggedInAddress as Hex,
            //     args: [data],
            //   });

            //   await publicClient.waitForTransactionReceipt({hash: tx});
            //   console.log("Feedback stored successfully in contract");
            //   toast.success("Feedback stored successfully in contract");

            //   // Request and transaction successful, set loading to false
            //   setComputeLoading(false);
            // }

            setComputeLoading(false);
          }
        }
      } catch (error) {
        // If backend server error, log and retry
        console.log(error, "from storeProgram");

        if (retryCount < 5) {
          console.log(`Retry attempt: ${retryCount + 1}`);

          // Retry after 3 seconds delay
          await new Promise((resolve) => setTimeout(resolve, 3000));
          await retryRequest(retryCount + 1);
        } else {
          // After max retries, log error and set loading to false
          console.log("Max retry attempts reached. Aborting request.");
          toast.error("Max retry attempts reached. Aborting request.");
          setStoreProgramLoading(false); // Ensure loading is set to false on failure
        }
      } finally {
        setStoreVotesLoading(false);
      }
    };

    // Call the retry function to start the process
    await retryRequest();
  }

  const testFunc = async (_participantName: string, _photo: string) => {
    try {
      if (publicClient && walletClient && loggedInAddress) {
        const isParticipant = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          functionName: "isParticipant",
          abi: EcoAttestABI,
          args: [loggedInAddress],
        });

        console.log(isParticipant, "isParticipant dsa");

        if (!isParticipant) {
          console.log("Creating participant dsa");
          console.log(_participantName, _photo, loggedInAddress, "dsa3");

          const tx = await walletClient.writeContract({
            address: CONTRACT_ADDRESS,
            abi: EcoAttestABI,
            functionName: "createParticipant",
            account: loggedInAddress as Hex,
            args: [_participantName, _photo],
            chain: hederaTestnet,
          });

          await publicClient.waitForTransactionReceipt({hash: tx});

          console.log("Participant created successfully dsa");
        }
      }
    } catch (error) {
      console.log("error dsa", error);
    }
  };

  const [mainLoading, setMainLoading] = useState(false);
  const login = async () => {
    setMainLoading(true);
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
    router.push("/");
    setProvider(null);
    setLoggedIn(false);
  };
  // 0.0.4798103

  // Create a contract instance
  const contract = getContract({
    address: CONTRACT_ADDRESS,
    abi: EcoAttestABI,
    // 1a. Insert a single client
    // client: publicClient,
    // // 1b. Or public and/or wallet clients
    client: {
      public: publicClient as PublicClient,
      wallet: walletClient as WalletClient,
    },
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

        await publicClient.waitForTransactionReceipt({hash: tx});
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

  const [createEventLoading, setCreateEventLoading] = useState(false);

  const createEvent = async (
    _eventName: string,
    _eventPhoto: string,
    _eventDesc: string,
    _carbonCreds: number,
    _maxSeats: number,
    _dateTime: number
  ) => {
    setCreateEventLoading(true);
    try {
      if (walletClient && publicClient) {
        console.log("create event");
        const tx = await walletClient.writeContract({
          address: CONTRACT_ADDRESS,
          abi: EcoAttestABI,
          functionName: "createEvent",
          account: loggedInAddress,
          args: [
            _eventName,
            _eventPhoto,
            _eventDesc,
            _carbonCreds,
            _maxSeats,
            _dateTime,
          ],
        });

        await publicClient.waitForTransactionReceipt({hash: tx});
      }
      console.log("Event created successfully");
    } catch (error) {
      console.log(error, "from createEvent");
    } finally {
      setCreateEventLoading(false);
    }
  };

  const [addSubOrganizerLoading, setAddSubOrganizerLoading] = useState(false);

  const addSubOrganizer = async (subOrgAddress: string) => {
    setAddSubOrganizerLoading(true);

    console.log("dsa--------");
    try {
      if (publicClient && walletClient && loggedInAddress) {
        console.log("dsa--------");

        const tx = await walletClient.writeContract({
          address: CONTRACT_ADDRESS,
          abi: EcoAttestABI,
          functionName: "addSubOrganizer",
          account: loggedInAddress as Hex,
          args: [subOrgAddress],
        });

        await publicClient.waitForTransactionReceipt({hash: tx});
        console.log("Sub-organizer added successfully");

        // setWhitelist(address attester, bool allowed)
        // subOrgAddress, true
        const pKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
        console.log(pKey, "sadsads");
        const account = privateKeyToAccount(`0x${pKey}`);

        const client = createWalletClient({
          account,
          chain: baseSepolia,
          transport: http(),
        });

        const HOOK_ADDRESS = "0xffd0982617febbfd14fc41f7fb445839c721b262";
        const tx2 = await client.writeContract({
          address: HOOK_ADDRESS,
          abi: HookABI,
          functionName: "setWhitelist",
          account: account,
          args: [subOrgAddress, true],
        });

        // await client.waitForTransactionConfirmation({ hash: tx2 });
        console.log("Sub-organizer added successfully in HOOK_ADDRESS ", tx2);
      }
    } catch (error) {
      console.error(error, "from addSubOrganizer");
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

  const [registerEventLoading, setRegisterLoginLoading] = useState(false);
  const registerForEvent = async (eventId: number) => {
    setRegisterLoginLoading(true);
    try {
      if (loggedIn && walletClient && publicClient) {
        const tx = await walletClient.writeContract({
          address: CONTRACT_ADDRESS,
          abi: EcoAttestABI,
          functionName: "registerForEvent",
          account: loggedInAddress as Hex,
          args: [eventId],
        });

        await publicClient.waitForTransactionReceipt({hash: tx});

        console.log("Registered for event successfully");
      }
    } catch (error) {
      console.log(error, "from registerForEvent");
    } finally {
      setRegisterLoginLoading(false);
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
      if (publicClient && loggedInAddress) {
        const data = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: EcoAttestABI,
          functionName: "isOrganizer",
          args: [loggedInAddress],
        });
        console.log(data, "helloworld");
        setIsOrganizerState(data as boolean);
        // return data;
        return data;
      }
    } catch (error) {
      console.log(error, "from isOrganizer");
    }
  };

  const getParticipantByAddress = async (address: string): Promise<any> => {
    try {
      if (publicClient) {
        const data = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: EcoAttestABI,
          functionName: "getParticipantByAddress",
          args: [address],
        });

        console.log(data, "getParticipantByAddress");
        return data;
      }
    } catch (error) {
      console.log(error, "from getParticipantByAddress");
    }
  };

  useEffect(() => {
    if (publicClient) {
      isSubOrganizer();
      isOrganizer();
    }

    // fetchAttestations();
  }, [publicClient, loggedInAddress]);

  const getOrgAddressFromSub = async () => {
    try {
      if (publicClient) {
        const data = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: EcoAttestABI,
          functionName: "getOrgAddressFromSub",
          args: [loggedInAddress],
        });

        console.log(data, "from getOrgAddressFromSub");
        return data;
      }
    } catch (error) {
      console.log(error, "from getOrgAddressFromSub");
    }
  };

  const getAllEvents = async () => {
    try {
      if (publicClient && loggedIn && loggedInAddress) {
        const data = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: EcoAttestABI,
          functionName: "getAllEvents",
          account: loggedInAddress as Hex,
        });

        console.log(data, "from getallevents");
        return data;
      }
    } catch (error) {
      console.log(error, "from getallevents");
    }
  };

  async function testbase() {
    if (web3auth.provider) {
      const privateKey = await web3auth.provider.request({
        method: "eth_private_key",
      });

      const acc = privateKeyToAccount(`0x${privateKey}` as Hex);

      // const baseSepoliaPublicClient = createPublicClient({
      //   transport: http(),
      //   chain: baseSepolia,
      // });

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
      // const data = await baseSepoliaPublicClient.readContract({
      //   address: "0x9586a27C47EA790e2c9f8939F6A661e4f5Aaa6db" as Hex,
      //   abi: countabi,
      //   functionName: "getValue",
      // });

      // console.log(data, "vit");
    }
  }

  const attest = async (
    orgAddress: string,
    participantAddress: string,
    eventId: number,
    score: number
  ) => {
    try {
      if (web3auth && web3auth.provider && loggedInAddress) {
        // const SchemaId = "0x1a2";

        const SchemaId = "0x225";
        // const privateKey = ("0x" + process.env.NEXT_PUBLIC_PRIVATE_KEY!) as Hex;
        const privateKey = await web3auth.provider.request({
          method: "eth_private_key",
        });

        const account = privateKeyToAccount(`0x${privateKey}`);

        const client = new SignProtocolClient(SpMode.OnChain, {
          chain: EvmChains.baseSepolia,
          account: account,
        });
        // 0x2b06bFDe18Ac8619177DDaE76e683fa12F326b3d
        console.log("Attest ", client);

        if (client !== undefined) {
          const data = {
            orgAddress: orgAddress,
            subOrgAddress: loggedInAddress,
            participantAddress: participantAddress,
            eventId: eventId,
            score: score,
          };

          try {
            const createAttestationRes = await client.createAttestation({
              data: data,
              schemaId: SchemaId,
              indexingValue: "xxx",
              recipients: [orgAddress, loggedInAddress, participantAddress],
            });
            console.log(createAttestationRes);

            const url = `https://testnet-scan.sign.global/attestation/onchain_evm_84532_${createAttestationRes.attestationId}`;

            console.log(url);
          } catch (error) {
            console.log(error);
            alert(error);
          }
        }
      } else {
        console.log("web3 auth not fetch");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [attestations, setAttestations] = useState<any>([]);

  function decodeData(encodedData: string, attestationId: any) {
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
        const address1 = "0x" + chunks[0].slice(24); // Extract the last 20 bytes (40 hex characters)
        const address2 = "0x" + chunks[1].slice(24); // Extract the last 20 bytes (40 hex characters)
        const address3 = "0x" + chunks[2].slice(24); // Extract the last 20 bytes (40 hex characters)

        // Decode the boolean/integer (convert the value to BigInt)
        const booleanOrInt = Number(hexToBigInt(`0x${chunks[3]}`));
        // Decode the integer value
        const integerValue = Number(hexToBigInt(`0x${chunks[4]}`));

        console.log(address1, address2, address3, booleanOrInt, integerValue);
        return {
          orgAddress: address1,
          subOrgAddress: address2,
          participantAddress: address3,
          eventId: booleanOrInt,
          score: integerValue,
          attestationId: attestationId,
        };
      }
    }
  }
  const fetchAttestations = async () => {
    const id = "onchain_evm_84532_0x225";
    const res = await axios.get(
      `https://testnet-rpc.sign.global/api/scan/attestations?schemaId=${id}`
    );
    // https://testnet-rpc.sign.global/api/scan/attestations?schemaId=onchain_evm_84532_0x1a2

    const rows = res.data.data.rows;

    const deRows = await Promise.all(
      rows?.map(async (val: any, index: number) => {
        console.log(val, "val");
        const iid = val.id;
        const rr = await axios.get(
          `https://testnet-rpc.sign.global/api/scan/attestations/${iid}`
        );
        console.log(rr, "rr --attestations");

        const encodedData = rr.data.data.data;
        console.log(encodedData, "encodedData");
        const decoded = decodeData(encodedData, iid);
        console.log(decoded, "decoded");
        // const decodedValue = Promise.all(decoded);
        return decoded;
      })
    );

    console.log(deRows, "deRows");
    console.log(rows, "attestations");

    setAttestations(deRows);
  };

  useEffect(() => {
    fetchAttestations();
  }, []);

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
        getAllEvents,
        testFunc,
        registerEventLoading,
        CONTRACT_ADDRESS,
        createEventLoading,
        storeProgram,
        storeProgramLoading,
        storeVotesByOrganisers,
        storeVotesLoading,
        getParticipantByAddress,
        getOrgAddressFromSub,
        computeResult,
        computeLoading,
        attestations,
        feedbackResult,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
