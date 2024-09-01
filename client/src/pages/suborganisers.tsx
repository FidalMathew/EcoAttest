import Navbar from "@/components/ui/Navbar";
import {
  ArrowRight,
  Building,
  Camera,
  Gem,
  QrCode,
  Shrub,
  Star,
} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {useEffect, useRef, useState} from "react";
import Webcam from "react-webcam";

export default function Profile() {
  const router = useRouter();
  const [openQr, setOpenQr] = useState(false);
  const [cameraModal, setCameraModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // useEffect(() => {
  //   const getWebcamStream = async () => {
  //     try {
  //       const stream = await navigator.mediaDevices.getUserMedia({video: true});
  //       if (videoRef.current) {
  //         videoRef.current.srcObject = stream;
  //         videoRef.current.play();
  //       }
  //     } catch (error) {
  //       console.error("Error accessing the webcam: ", error);
  //     }
  //   };

  //   getWebcamStream();

  //   return () => {
  //     if (videoRef.current && videoRef.current.srcObject && openQr === false) {
  //       const stream = videoRef.current.srcObject as MediaStream;
  //       stream.getTracks().forEach((track) => track.stop());
  //     }
  //   };
  // }, []);
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

              <div className="rounded-2xl border-2 border-gray-700">
                <Webcam
                  height={600}
                  width={600}
                  className="h-full w-full rounded-2xl"
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
        className="flex gap-9 p-7 flex-col lg:flex-row"
      >
        <div className="max-w-[800px] lg:w-[600px] h-[250px] lg:h-[580px] flex flex-col gap-3">
          <div className="w-full h-full rounded-2xl flex items-center lg:flex-col justify-center lg:justify-start border-2 border-gray-700 relative ">
            <div className="h-full rounded-l-2xl lg:rounded-l-none w-full bg-orange-600 lg:rounded-t-2xl flex justify-center items-center">
              <div className="w-full h-full flex justify-center items-center px-7">
                <div className="bg-white rounded-full border-2 border-green-800 h-[170px] w-[170px] lg:h-[250px] lg:w-[250px]"></div>
              </div>
            </div>
            <div className="font-sans lg:h-2/5 w-full lg:py-6 rounded-b-2xl px-6 flex flex-col gap-4 lg:relative">
              {/* <div className="absolute lg:top-3 lg:right-4 top-5 right-5 hover:bg-slate-100 rounded-lg cursor-pointer p-1">
                <QrCode />
              </div> */}
              <p className="text-2xl lg:text-3xl font-normal">
                Sub Organiser Name
              </p>
              <p>
                {"0x3f93B8DCAf29D8B3202347018E23F76e697D8539".slice(0, 10) +
                  "..." +
                  "0x3f93B8DCAf29D8B3202347018E23F76e697D8539".slice(-10)}
              </p>
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
              {/* <div className="flex items-center justify-between font-sans font-semibold">
              <div className="flex items-center gap-2">
                <Gem className="w-6 h-6 fill-yellow-500" />

                <span>Carbon Credits</span>
              </div>

              <p>600</p>
            </div> */}
            </div>
            <div className=""></div>
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
                className="w-full overflow-y-auto flex flex-col gap-4"
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
                      <p className="text-xl"> Car Pooling to Accenture</p>
                      <Badge
                        variant={"outline"}
                        className={`px-8 py-2 border-2 border-gray-700  text-white ${
                          index % 3 === 0
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
                className="w-full overflow-y-auto flex flex-col gap-4"
                style={{
                  height: "calc(100vh - 30vh)",
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, index) => (
                  <div className="w-full h-full rounded-xl flex flex-col gap-10 items-end">
                    <div className="w-full h-[150px] rounded-xl border-2 border-gray-700 flex justify-around items-center">
                      <p className="text-xl"> Car Pooling to Accenture</p>
                      <Badge
                        variant={"outline"}
                        className={`px-8 py-2 border-2 border-gray-700  text-white ${
                          index % 3 ? "bg-yellow-700" : "bg-green-700"
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
