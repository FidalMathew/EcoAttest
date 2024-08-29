import Navbar from "@/components/ui/Navbar";
import {ArrowRight, Gem, Star} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";

export default function Profile() {
  const router = useRouter();
  return (
    <div className="min-h-screen w-full">
      <Navbar />

      <div
        style={{
          height: "calc(100% - 70px)",
        }}
        className="flex gap-2 p-7 flex-col lg:flex-row"
      >
        <div className="w-[600px] h-full flex items-center py-5 lg:flex-col gap-3 justify-center lg:justify-start">
          <div className="w-[200px] h-[200px] bg-green-400 rounded-full border-2 border-green-800"></div>
          <div className="flex flex-col gap-3 text-center ">
            <div className="w-[250px] text-4xl font-normal">
              <p>Jaydeep Dey</p>
            </div>
            <div className="w-[250px] h-fit">jaydeep@mail.com</div>
            <div className="w-[250px] h-[50px] bg-green-900 rounded-xl flex border-2 border-gray-800 items-center justify-center font-semibold gap-3 text-white">
              <Star className="w-6 h-6 fill-yellow-500" />
              <span>Carbon Score : 600</span>
            </div>
            <div className="w-[250px] h-[50px] bg-yellow-900 rounded-xl flex border-2 border-gray-800 items-center justify-center font-semibold gap-3 text-white">
              <Gem className="w-6 h-6 fill-yellow-500" />

              <span>Carbon Credits : 600</span>
            </div>
          </div>
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
