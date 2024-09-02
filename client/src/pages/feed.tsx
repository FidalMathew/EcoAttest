import {Input} from "@/components/ui/input";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {ArrowRight, Leaf} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {OpenloginUserInfo} from "@web3auth/openlogin-adapter";
import useGlobalContextHook from "@/context/useGlobalContextHook";

export default function Feed() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div
        style={{
          height: "calc(100% - 70px)",
        }}
        className="w-full flex flex-col gap-4 items-center p-5 py-10"
      >
        {[1, 2, 3, 4].map((_, index) => (
          <div
            key={index}
            className="border-2 border-gray-600 w-[90%] lg:w-[900px] h-[250px] rounded-md"
          >
            <div className="w-full h-full flex flex-col justify-between">
              <div className="flex-1 p-5 flex flex-col">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-2xl font-sans">
                    Car Pooling to Accenture
                  </p>
                  <div className="w-fit h-fit px-4 py-1 bg-green-700 text-white font-bold font-sans rounded-full flex gap-2 items-center border-2 border-green-900">
                    12 CC
                    <Leaf className="h-4 w-4" />
                  </div>
                </div>
                {/* <div className="flex items-center justify-between"> */}
                <div className="my-auto max-w-3xl">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Cupiditate nemo ut dignissimos obcaecati quisquam nostrum
                  tempore porro dolor repellat in odit et, adipisci laudantium
                  aperiam natus. Placeat nesciunt porro voluptates?
                </div>

                {/* <img src="/earth.png" alt="earth" className="h-52 w-52" /> */}
                {/* </div> */}
              </div>
              <div className="h-[60px] w-full flex justify-between items-center px-5 border-t-2 border-gray-600 bg-green-700">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    <Avatar className="h-8 w-8 -ml-4 first:ml-0 border-2 border-gray-700">
                      <AvatarImage src="/man.png" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 -ml-4 border-2 border-gray-700">
                      <AvatarImage src="/man.png" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 -ml-4 border-2 border-gray-700">
                      <AvatarImage src="/man.png" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </div>
                  <p className="text-white font-bold font-sans">4 others</p>
                </div>

                <Button
                  variant={"outline"}
                  className="border-2 border-gray-600 group"
                  onClick={() => router.push(`/events/${index}`)}
                >
                  View
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 duration-200" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
