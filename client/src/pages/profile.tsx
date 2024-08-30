import Navbar from "@/components/ui/Navbar";
import {ArrowRight, Gem, QrCode, Shrub, Star} from "lucide-react";
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
import {useState} from "react";

export default function Profile() {
  const router = useRouter();
  const [openQr, setOpenQr] = useState(false);
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
                <img src="/qr.png" alt="qr" className="h-full w-full" />
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div
        style={{
          height: "calc(100% - 70px)",
        }}
        className="flex gap-2 p-7 flex-col lg:flex-row"
      >
        <div
          className="w-[600px] rounded-2xl flex items-center lg:flex-col justify-center lg:justify-start border-2 border-gray-700 relative"
          style={{
            height: "calc(100vh - 30vh)",
          }}
        >
          <div className="h-3/5 w-full bg-green-600 rounded-t-2xl flex justify-center items-center">
            <div className="w-[250px] h-[250px] bg-white rounded-full border-2 border-green-800"></div>
          </div>
          <div className="font-sans h-2/5 w-full rounded-b-2xl px-7 pt-6 flex flex-col gap-4 relative">
            <div
              className="absolute top-3 right-4 hover:bg-slate-100 p-1 rounded-lg cursor-pointer"
              onClick={() => setOpenQr((prev) => !prev)}
            >
              <QrCode />
            </div>
            <p className="text-3xl font-normal">Jaydeep Dey</p>
            <p>
              {"0x3f93B8DCAf29D8B3202347018E23F76e697D8539".slice(0, 10) +
                "..." +
                "0x3f93B8DCAf29D8B3202347018E23F76e697D8539".slice(-10)}
            </p>
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
          </div>

          <footer className="rounded-b-xl absolute bottom-0 right-0 w-full h-10"></footer>
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
                className="w-full overflow-y-auto flex flex-col gap-4 px-4"
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
            <TabsContent value="past">
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
