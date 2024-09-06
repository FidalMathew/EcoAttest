import Navbar from "@/components/ui/Navbar";
import {
  ArrowRight,
  Building,
  Camera,
  FileCheck,
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
import { useEffect, useRef, useState } from "react";
// import Webcam from "react-webcam";
import useGlobalContextHook from "@/context/useGlobalContextHook";
import { OpenloginUserInfo } from "@web3auth/openlogin-adapter";
import { Skeleton } from "@/components/ui/skeleton";
import QrScanner from "qr-scanner";
import QrFrame from "../../public/qr-frame.svg";
import QrReader from "@/components/QrReader";

export default function Profile() {
  const router = useRouter();
  const [openQr, setOpenQr] = useState(false);
  const [openAttQr, setOpenAttQr] = useState(false);
  const [cameraModal, setCameraModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
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
    attest
  } = useGlobalContextHook();

  const getUser = async () => {
    if (!getUserInfo) return;
    try {
      const userInfo = await getUserInfo();
      setUserInfo(userInfo);
      console.log(userInfo, "User info");
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


  const [scannedResult, setScannedResult] = useState<string | undefined>("");

  const [attestationDetails, setAttestationDetails] = useState<any>({});
  console.log(scannedResult, "Scanned Result");



  useEffect(() => {
    // console.log(scannedResult, "Scanned Result");

    if (scannedResult) {
      // alert(scannedResult);
      const scannedObj = JSON.parse(scannedResult)

      const { orgAddress, eventId, participant } = scannedObj;

      if (!orgAddress || !eventId || !participant) {
        console.error("Attestation requirement values incomplete")
        return;
      }

      setAttestationDetails({
        orgAddress: orgAddress,
        eventId: eventId,
        participantAddress: participant,
      })

      setOpenAttQr(true);
    }
  }, [scannedResult]);



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
                Scan the QR to issue Attestations to the User
              </p>
              <div className="rounded-2xl border-2 border-gray-700 h-full">
                {/* webcam */}
                <QrReader
                  scannedResult={scannedResult}
                  setScannedResult={setScannedResult}
                  setOpenQr={setOpenQr}
                />
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={openAttQr} onOpenChange={setOpenAttQr}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attest Participant</DialogTitle>
            <DialogDescription className="h-[500px] w-full flex items-center justify-center flex-col gap-4">
              {
                attestationDetails &&
                (<>
                  Hello
                  {attestationDetails.orgAddress + " " + attestationDetails.eventId + " " + attestationDetails.participantAddress}

                  <button onClick={() => {
                    if (attest)
                      attest(attestationDetails.orgAddress, attestationDetails.participantAddress, attestationDetails.eventId, 10);
                  }}>

                    Attest
                  </button>
                </>)
              }
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
        <div className="max-w-[400px] w-[550px] lg:w-[600px] h-[650px] rounded-2xl flex items-center flex-col lg:justify-center relative gap-5">
          <div className="w-full h-full rounded-2xl flex items-center lg:flex-col justify-center lg:justify-start border-2 border-gray-700 relative flex-col">
            <div className="lg:h-full h-3/5 rounded-t-2xl w-full bg-orange-600 flex justify-center items-center">
              <div className="bg-white rounded-full border-2 border-green-800 h-[250px] w-[250px] flex overflow-hidden">
                {userInfo && userInfo.profileImage ? (
                  <>
                    <img
                      src={
                        "https://lh3.googleusercontent.com/a/ACg8ocJnJ7LnlmcMN-yPSILf-BYvk34oUaxOfA1wPDtlP8F6TwQdTg=s96-c"
                      }
                      alt="dp"
                    />
                  </>
                ) : (
                  <Skeleton className="w-[250px] h-[250px] rounded-full bg-gray-300" />
                )}
              </div>
            </div>
            <div className="font-sans h-2/5 w-full lg:py-6 justify-center rounded-b-2xl px-6 flex flex-col gap-4 lg:relative">
              {/* <div className="absolute lg:top-3 lg:right-4 top-5 right-5 hover:bg-slate-100 rounded-lg cursor-pointer p-1">
                <QrCode />
              </div> */}
              {userInfo && userInfo.name ? (
                <>
                  <p className="text-3xl font-normal">
                    {"Sub Organisers Name"}
                  </p>
                </>
              ) : (
                <Skeleton className="w-3/4 bg-gray-300 h-[30px]" />
              )}
              {loggedInAddress ? (
                <p>
                  {loggedInAddress.slice(0, 10) +
                    "..." +
                    loggedInAddress.slice(-10)}
                </p>
              ) : (
                <Skeleton className="w-4/5 bg-gray-300 h-[30px]" />
              )}
              <div className="flex items-center justify-between font-sans font-semibold mt-5">
                <div className="flex items-center gap-2">
                  <Building className="w-6 h-6 fill-yellow-500" />
                  <span>Organisation</span>
                </div>

                <div className="flex items-center gap-2">
                  <img
                    className="h-6"
                    src="https://freelogopng.com/images/all_img/1659761297uber-icon.png"
                    alt="uber"
                  />
                  <p>Uber</p>
                </div>
              </div>
              <div className="flex items-center justify-between font-sans font-semibold">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-6 h-6 fill-yellow-500" />

                  <span>Attestations</span>
                </div>

                <p>6</p>
              </div>
            </div>
            {/* <footer className="rounded-b-xl absolute bottom-0 right-0 w-full h-10"></footer> */}
          </div>
          <Button
            onClick={() => setOpenQr((prev) => !prev)}
            className="w-full h-[50px] bg-yellow-900 hover:bg-yellow-900 rounded-xl flex border-2 border-gray-800 items-center justify-center font-semibold gap-3 text-white"
          >
            <Camera className="w-6 h-6" />

            <span>Open Camera for Attestation</span>
          </Button>
        </div>

        <div className="h-full w-full flex flex-col gap-4">
          <p className="text-2xl">Events</p>
          <Tabs defaultValue="recentAttestation" className="w-full">
            <TabsList className="">
              <TabsTrigger
                value="Events"
                className="data-[state=active]:border-2 data-[state=active]:border-gray-700 data-[state=active]:bg-orange-700 data-[state=active]:text-white"
              >
                Recent Attestation
              </TabsTrigger>
              <TabsTrigger
                value="recentAttestation"
                className="data-[state=active]:border-2 data-[state=active]:border-gray-700 data-[state=active]:bg-orange-700 data-[state=active]:text-white"
              >
                Ongoing Events
              </TabsTrigger>
            </TabsList>

            <TabsContent value="Events">
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
                            : "bg-green-700"
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
            <TabsContent
              value="recentAttestation"
              className="focus-visible:ring-0"
            >
              <div
                className="w-full overflow-y-auto flex flex-col gap-4 pr-4"
                style={{
                  height: "calc(100vh - 30vh)",
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, index) => (
                  <div className="w-full h-full rounded-xl flex flex-col gap-10 items-end">
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
          </Tabs>
        </div>
      </div>
    </div>
  );
}
