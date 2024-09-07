import Navbar from "@/components/ui/Navbar";
import {
  ArrowRight,
  Check,
  CloudDownload,
  CloudUpload,
  Copy,
  Gem,
  QrCode,
  Shrub,
  Star,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import QRX from "@qr-x/react";
import useGlobalContextHook from "@/context/useGlobalContextHook";
import { OpenloginUserInfo } from "@web3auth/openlogin-adapter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatEther, Hex, parseEther } from "viem";
import EcoAttestABI from "../lib/EcoAttestABI.json";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReloadIcon } from "@radix-ui/react-icons";

import {
  hexToBigInt,
  sliceHex
} from "viem";
import axios from "axios";

export default function Profile() {
  const router = useRouter();
  const [openQr, setOpenQr] = useState(false);
  const [userInfo, setUserInfo] = useState<
    Partial<OpenloginUserInfo> | undefined
  >();

  const {
    getUserInfo,
    walletClient,
    publicClient,
    logout,
    provider,
    loggedIn,
    status,
    loggedInAddress,
    balanceAddress,
    registerEventLoading,
    CONTRACT_ADDRESS,
    storeProgram,
    storeProgramLoading,
    programId,
  } = useGlobalContextHook();

  const [attestations, setAttestations] = useState<any>([]);

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
        const address1 = "0x" + chunks[0].slice(24); // Extract the last 20 bytes (40 hex characters)
        const address2 = "0x" + chunks[1].slice(24); // Extract the last 20 bytes (40 hex characters)
        const address3 = "0x" + chunks[2].slice(24); // Extract the last 20 bytes (40 hex characters)

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
    const id = "onchain_evm_84532_0x226";
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
        const decoded = decodeData(encodedData);
        console.log(decoded, "decoded");
        // const decodedValue = Promise.all(decoded);
        return decoded;
      })
    );

    console.log(deRows, "deRows");
    console.log(rows, "attestations");

    setAttestations(deRows)
  };

  const getUser = async () => {
    if (!getUserInfo) return;
    try {
      const userInfo = await getUserInfo();
      setUserInfo(userInfo);
      console.log(userInfo, "User info");
      fetchAttestations()
    } catch (error) {
      console.error(error, "Error user info");
    }
  };

  useEffect(() => {
    (async function () {
      try {
        getUser();
      } catch (error) {
        console.error(error, "Error logging in");
      }
    })();
  }, [walletClient, publicClient, provider, loggedIn, router.pathname, status]);

  console.log(userInfo, "dsa");

  const [isCopied, setIsCopied] = useState(false);
  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      console.log("Copied to clipboard");
    } catch (error) {
      console.error("Failed to copy: ", error);
    } finally {
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }

  const [isParticipant, setIsParticipant] = useState(false);

  useEffect(() => {
    (async function () {
      try {
        if (loggedIn && loggedInAddress && publicClient && walletClient) {
          const isParticipant = await publicClient.readContract({
            address: CONTRACT_ADDRESS! as Hex,
            functionName: "isParticipant",
            abi: EcoAttestABI,
            args: [loggedInAddress],
          });

          if (isParticipant) setIsParticipant(isParticipant as boolean);
        }
      } catch (error) {
        console.error(error, "Error checking participant");
      }
    })();
  }, [loggedIn, loggedInAddress, publicClient, walletClient]);

  console.log(isParticipant, "isParticipant");

  const [participantFetched, setParticipantFetched] = useState<any>({});

  useEffect(() => {
    (async function () {
      try {
        if (loggedIn && loggedInAddress && publicClient && walletClient) {
          const ParticipantDetails = await publicClient.readContract({
            address: CONTRACT_ADDRESS! as Hex,
            functionName: "getParticipantByAddress",
            abi: EcoAttestABI,
            args: [loggedInAddress],
          });

          if (ParticipantDetails) {
            console.log(ParticipantDetails, "ParticipantDetails");
            setParticipantFetched(ParticipantDetails);
          }
        }
      } catch (error) {
        console.error(error, "Error getting program id");
      }
    })();
  }, [loggedIn, loggedInAddress, publicClient, walletClient]);

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <Dialog open={openQr} onOpenChange={setOpenQr}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan QR</DialogTitle>
            <DialogDescription className="h-[500px] w-full flex items-center justify-center flex-col gap-4">
              <Shrub className="h-16 w-16 text-green-800" />
              <p className="text-xl font-sans font-bold text-gray-900 text-center">
                Verify User with Carbon QR
              </p>
              <p className="text-sm font-sans text-gray-900 text-center">
                Scan this QR to Attest Carbon Credits to User
              </p>

              <div className="h-1/2 w-1/2">
                {/* <img src="/qr.png" alt="qr" className="h-full w-full" /> */}
                <QRX
                  data="https://qr-x.devtrice.dev/"
                  color="rgb(20, 93, 20)"
                  shapes={{
                    body: "circle",
                    eyeball: "circle",
                    eyeframe: "rounded",
                  }}
                />
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div
        style={{
          height: "calc(100% - 70px)",
        }}
        className="flex gap-9 p-7 flex-col lg:flex-row items-center"
      >
        <div className="max-w-[400px] w-[550px] lg:w-[600px] h-[650px] rounded-2xl flex items-center flex-col lg:justify-center gap-5 border-2 border-gray-700 ">
          <div className="lg:h-full h-3/5 rounded-t-2xl w-full bg-green-600 flex justify-center items-center">
            <div className="w-full flex justify-center items-center px-7">
              <div className="bg-white rounded-full border-2 border-green-800 h-[250px] w-[250px] flex overflow-hidden">
                {userInfo && userInfo.profileImage ? (
                  <>
                    <img src={userInfo.profileImage} alt="dp" />
                  </>
                ) : (
                  <Skeleton className="w-[250px] h-[250px] rounded-full bg-gray-300" />
                )}
              </div>
            </div>
          </div>
          <div className="font-sans h-fit pb-5 w-full lg:py-6 justify-center rounded-b-2xl px-6 flex flex-col gap-4 relative">
            <div
              className="absolute lg:top-3 lg:right-4 top-5 right-5 hover:bg-slate-100 rounded-lg cursor-pointer p-1"
              onClick={() => setOpenQr((prev) => !prev)}
            >
              <QrCode />
            </div>
            {userInfo && userInfo.name ? (
              <>
                <p className="text-3xl font-normal">{userInfo.name}</p>
              </>
            ) : (
              <Skeleton className="w-3/4 bg-gray-300 h-[30px]" />
            )}

            {loggedInAddress ? (
              <div className="flex flex-col relative">
                <div className="flex items-center gap-4">
                  <p>
                    {loggedInAddress.slice(0, 10) +
                      "..." +
                      loggedInAddress.slice(-10)}
                  </p>

                  {
                    <div
                      className="hover:bg-gray-100 p-1 rounded cursor-pointer"
                      onClick={() => copyToClipboard(loggedInAddress)}
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4 " />
                      )}
                    </div>
                  }
                </div>
                <p>
                  {balanceAddress &&
                    "Balance: " + formatEther(BigInt(balanceAddress)) + " HBAR"}
                </p>

                {storeProgram &&
                  (storeProgramLoading ? (
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      disabled
                      className="absolute bottom-0 right-0 border border-gray-700 rounded-full cursor-pointer w-7 h-7"
                    >
                      {/* put nillion */}
                      <ReloadIcon className="h-3 w-3 animate-spin" />
                    </Button>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant={"outline"}
                            size={"icon"}
                            className="absolute bottom-0 right-0 border border-gray-700 p-1 rounded-full cursor-pointer h-7 w-7"
                            onClick={storeProgram}
                          >
                            {/* put nillion */}
                            <CloudUpload className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>Deploy Program ID to Nillion</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
              </div>
            ) : (
              <Skeleton className="w-4/5 bg-gray-300 h-[30px]" />
            )}

            <div className="flex items-center w-full justify-between">
              <div className="flex items-center gap-2 truncate">
                <p>
                  {/*nillion program id */}
                  {participantFetched && participantFetched.programId && (
                    <span>
                      {participantFetched.programId.slice(0, 10) +
                        "..." +
                        participantFetched.programId.slice(-17)}
                    </span>
                  )}
                </p>
              </div>
              <p>
                <img
                  src="https://img.cryptorank.io/coins/nillion1670856857177.png"
                  alt="nillion"
                  className="w-6 h-6"
                />
              </p>
            </div>
            <div className="flex items-center justify-between font-sans font-semibold mt-5">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 fill-yellow-500" />
                <span>Carbon Score</span>
              </div>

              <p>4.77</p>
            </div>
            <div className="flex items-center justify-between font-sans font-semibold">
              <div className="flex items-center gap-2">
                <Gem className="w-6 h-6 fill-yellow-500" />

                <span>Carbon Credits</span>
              </div>

              <p>600</p>
            </div>
            {/* <div className="flex items-center justify-between font-sans font-semibold">
              <div className="flex items-center gap-2">
                <img
                  src="https://img.cryptorank.io/coins/nillion1670856857177.png"
                  className="w-6 h-6 fill-yellow-500"
                />

                <span>Nillion Program ID</span>
              </div>

              <p>600</p>
            </div> */}
          </div>

          {/* <footer className="rounded-b-xl absolute bottom-0 right-0 w-full h-10"></footer> */}
        </div>
        <div className="h-full w-full flex flex-col gap-4">
          <p className="text-2xl">Events</p>
          <Tabs defaultValue="ongoing" className="w-full">
            <TabsList className="">
              <TabsTrigger
                value="ongoing"
                className="data-[state=active]:border-2 data-[state=active]:border-gray-700 data-[state=active]:bg-green-700 data-[state=active]:text-white"
              >
                Ongoing Events
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="data-[state=active]:border-2 data-[state=active]:border-gray-700 data-[state=active]:bg-green-700 data-[state=active]:text-white"
              >
                Past Events
              </TabsTrigger>
            </TabsList>
            <TabsContent value="ongoing" className="focus-visible:ring-0">
              <div
                className="w-full overflow-y-auto flex flex-col gap-4 pr-4"
                style={{
                  height: "70vh",
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, index) => (
                  <div
                    className="w-full h-full rounded-xl flex flex-col gap-10 items-end"
                    key={index}
                  >
                    <div className="w-full h-[150px] rounded-xl border-2 border-gray-700 flex justify-around items-center">
                      <p className="lg:text-xl max-w-sm lg:max-w-full">
                        {" "}
                        Car Pooling to Accenture
                      </p>
                      <Badge
                        variant={"outline"}
                        className={`lg:px-8 lg: text-sm  py-2 border-2 border-gray-700  text-white ${index % 3 ? "bg-yellow-700" : "bg-green-700"
                          }`}
                      >
                        {index % 3 == 0 ? "Issued CC" : "Participated"}
                      </Badge>
                      <Button
                        variant={"outline"}
                        size="sm"
                        className="border-2 border-gray-700 group hover:bg-white"
                        onClick={() => router.push(`/events/${index}`)}
                      >
                        View
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 duration-200 " />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="past">
              <div
                className="w-full overflow-y-auto flex flex-col gap-4 pr-4"
                style={{
                  height: "calc(100vh - 30vh)",
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
                  <div
                    className="w-full h-full rounded-xl flex flex-col gap-10 items-end"
                    key={index}
                  >
                    <div className="w-full h-[150px] rounded-xl border-2 border-gray-700 flex justify-around items-center">
                      <p className="lg:text-xl max-w-sm lg:max-w-full">
                        {" "}
                        Car Pooling to Accenture
                      </p>
                      <Badge
                        variant={"outline"}
                        className={`lg:px-8 lg: text-sm  py-2 border-2 border-gray-700  text-white ${index % 3 === 0
                          ? index === 2
                            ? "bg-red-700"
                            : "bg-green-800"
                          : "bg-yellow-700"
                          }`}
                      >
                        {index % 3 === 0
                          ? index === 2
                            ? "Attended"
                            : "Issued CC"
                          : "Participated"}
                      </Badge>
                      <Button
                        variant={"outline"}
                        size="sm"
                        className="border-2 border-gray-700 group hover:bg-white"
                        onClick={() => router.push(`/events/${index}`)}
                      >
                        View
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 duration-200 " />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
