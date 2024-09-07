import Navbar from "@/components/ui/Navbar";
import {CircleCheck, Leaf, Star, TicketCheck} from "lucide-react";
import {useRouter} from "next/router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {Label} from "@/components/ui/label";
import useGlobalContextHook from "@/context/useGlobalContextHook";
import {register} from "module";
import {Skeleton} from "@/components/ui/skeleton";
import EcoAttestABI from "../../lib/EcoAttestABI.json";
import {Hex} from "viem";
import QRX from "@qr-x/react";

const CONTRACT_ADDRESS = "0x72315482d982c4360aD8cf5d63975B02CFb213A0";

export default function Events() {
  const router = useRouter();

  const [openStatus, setOpenStatus] = useState(false);

  const {eventId} = router.query;

  const {
    testbase,
    getEventById,
    loggedInAddress,
    registerForEvent,
    publicClient,
    walletClient,
    registerEventLoading,
  } = useGlobalContextHook();

  const [event, setEvent] = useState<any>(undefined);

  console.log(
    event &&
      loggedInAddress &&
      event.participants.some(
        (participant: any) =>
          participant.user.toLowerCase() === loggedInAddress.toLowerCase()
      ),
    "isevent"
  );
  useEffect(() => {
    const fetchEvent = async () => {
      if (loggedInAddress && getEventById) {
        const id = Number(eventId as string);
        const res = await getEventById(id);
        console.log(res, "getEventById");
        setEvent(res);
      }
    };
    fetchEvent();
  }, [registerEventLoading, loggedInAddress]);

  const [qrValue, setQrValue] = useState<string>("");
  // const { loggedInAddress } = useGlobalContextHook();

  const requestAttestion = () => {
    const schemaTemplate = {
      orgAddress: event.organizer,
      eventId: Number(eventId as unknown as string),
      participant: loggedInAddress,
    };

    const url = JSON.stringify(schemaTemplate);
    setQrValue(url);
  };

  return (
    <div className="min-h-screen w-full">
      <Dialog open={openStatus} onOpenChange={setOpenStatus}>
        <DialogContent className="h-fit lg:w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Attestation</DialogTitle>
            <DialogDescription>
              {/* <div className="w-full h-full flex flex-col mt-5 font-sans text-black text-left">
                <div className="w-full h-[80px] flex items-center px-4">
                  <p className="text-xl w-full">Attended</p>
                  <CircleCheck className="h-9 w-9 fill-green-700 text-white " />
                </div>
                <div className="w-full h-[80px] flex items-center px-4">
                  <p className="text-xl w-full">Participated</p>
                  <CircleCheck className="h-9 w-9 fill-green-700 text-white" />
                </div>
                <div className="w-full h-[80px] flex items-center px-4">
                  <div className="flex flex-col">
                    <p className="text-xl w-full">Issued Carbon Credits</p>
                    <p className="text-xs text-blue-800">
                      <a
                        href=" https://testnet-scan.sign.global/attestation/onchain_evm_84532_0x2b2"
                        target="_blank"
                      >
                        {" "}
                        https://testnet-scan.sign.global/attestation/onchain_evm_84532_0x2b2
                      </a>
                    </p>
                  </div>
                  <CircleCheck className="h-9 w-9 fill-green-700 text-white" />
                </div>

                <div className="grid gap-2 mx-4 my-5">
                  <Label>Rating</Label>
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 fill-primary" />
                    <Star className="w-6 h-6 fill-primary" />
                    <Star className="w-6 h-6 fill-primary" />
                    <Star className="w-6 h-6 fill-muted stroke-muted-foreground" />
                    <Star className="w-6 h-6 fill-muted stroke-muted-foreground" />
                  </div>
                </div>
              </div> */}

              <div className="flex items-center justify-center">
                {/* {userAddress} */}
                <div className="w-96 h-3/4">
                  {qrValue && (
                    <QRX
                      data={qrValue}
                      color="rgb(20, 93, 20)"
                      shapes={{
                        body: "circle",
                        eyeball: "circle",
                        eyeframe: "rounded",
                      }}
                    />
                  )}
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Navbar />

      <div
        style={{
          height: "calc(100% - 70px)",
        }}
        className="flex gap-2 p-7 lg:flex-row flex-col"
      >
        <div className="lg:w-[500px] h-full flex items-center lg:m-0 m-auto py-5 flex-col gap-3">
          <div className="w-[400px] h-[400px] bg-green-400 rounded-xl border-2 border-green-800">
            {event && (
              <img
                src={`https://gateway.pinata.cloud/ipfs/${event.eventPhoto}`}
                alt=""
                className="object-cover w-full h-full rounded-xl"
              />
            )}
          </div>
          <div className="w-[400px] h-[80px] bg-green-900 rounded-xl flex items-center px-10 border-2 border-gray-800 justify-center text-white">
            <Leaf className="h-8 w-8 mr-2" />
            <p className="font-bold font-sans text-2xl">12 CC</p>
          </div>

          {!registerEventLoading && loggedInAddress && event ? (
            !event.participants.some(
              (participant: any) =>
                participant.user.toLowerCase() === loggedInAddress.toLowerCase()
            ) ? (
              <div
                onClick={() => {
                  if (registerForEvent)
                    registerForEvent(Number(eventId as string));
                }}
                className="cursor-pointer w-[400px] h-[60px] bg-orange-900 hover:bg-orange-800 rounded-xl flex items-center px-10 border-2 border-gray-800 justify-center text-white"
              >
                <TicketCheck className="h-6 w-6 mr-2" />
                <p className="font-bold font-sans text-2xl">Join</p>
              </div>
            ) : (
              <div
                onClick={() => {
                  if (registerForEvent)
                    registerForEvent(Number(eventId as string));
                }}
                className="cursor-pointer w-[400px] h-[60px] bg-orange-700 hover:bg-orange-700 rounded-xl flex items-center px-10 border-2 border-gray-800 justify-center text-white"
              >
                <TicketCheck className="h-6 w-6 mr-2" />
                <p className="font-bold font-sans text-2xl">Joined</p>
              </div>
            )
          ) : (
            <div
              onClick={() => {
                if (registerForEvent)
                  registerForEvent(Number(eventId as string));
              }}
              className="cursor-pointer w-[400px] h-[60px] bg-orange-900 hover:bg-orange-600 rounded-xl flex items-center px-10 border-2 border-gray-800 justify-center text-white"
            >
              <TicketCheck className="h-6 w-6 mr-2" />
              <p className="font-bold font-sans text-2xl">Joining...</p>
            </div>
          )}
        </div>
        <div className="w-full h-full p-6">
          <div className="w-full h-full rounded-xl flex flex-col gap-10">
            <h1 className="font-bold text-3xl font-sans">
              {" "}
              {event && event.eventName ? (
                event.eventName
              ) : (
                <Skeleton className="w-3/4 h-[50px]" />
              )}{" "}
            </h1>

            {event && event.eventDesc ? (
              <div className="h-fit pb-60px">
                <p className="text-lg font-sans">
                  {event && event.eventDesc ? event.eventDesc : ""}
                </p>
              </div>
            ) : (
              <div className="flex gap-4 flex-col">
                <Skeleton className="w-full h-[30px]" />
                <Skeleton className="w-full h-[30px]" />
                <Skeleton className="w-full h-[30px]" />
                <Skeleton className="w-full h-[30px]" />
              </div>
            )}
            <Card className="shadow-none border-2 border-green-900 font-sans">
              <CardHeader className="border-b-2 border-green-900 bg-green-900 text-white">
                <CardTitle>Participants</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-8 mt-6">
                {event &&
                  event.participants.length > 0 &&
                  event.participants.map((value: any, index: number) => (
                    <div className="flex items-center gap-4" key={index}>
                      <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src={value.photo} alt="Avatar" />
                        <AvatarFallback className="border-2 border-gray-700">
                          OM
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                          {value.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {value.user.slice(0, 6) +
                            "..." +
                            value.user.slice(-4)}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        <Button
                          size="sm"
                          variant="outline"
                          className="px-4 py-2 border-2 border-green-900 rounded-full"
                          onClick={() => {
                            setOpenStatus((prev) => !prev);
                            requestAttestion();
                          }}
                        >
                          Request Attestation
                        </Button>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
