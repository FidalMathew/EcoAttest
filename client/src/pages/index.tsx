import Image from "next/image";
import Link from "next/link";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {ArrowRight} from "lucide-react";

export default function Home() {
  return (
    <div className="w-full lg:grid lg:grid-cols-3 lg:min-h-screen">
      <div className="hidden bg-muted lg:block">
        <Image
          src={`/agriculture2.jpg`}
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex items-center justify-center py-12 flex-col col-span-2 h-screen">
        <div className="flex justify-center items-center flex-col gap-5">
          <p className="font-bold text-4xl font-sans">EcoAttest</p>
          <p className="text-xl max-w-lg text-center">
            Join eco-friendly events, earn carbon credits. Together, let's build
            a sustainable future.
          </p>
        </div>
        <div className="h-full w-full gap-6 flex flex-col items-center justify-center cursor-pointer font-sans">
          <div className="w-[80%] mx-auto h-[200px] border-2 border-green-900 rounded-xl flex flex-col group relative justify-center items-center">
            <img
              src="/ecosystem.png"
              alt="ecosystem"
              className="w-32 h-32 absolute top-10 left-10 hidden sm:block"
            />
            <p className="text-2xl font-semibold sm:ml-10 text-green-950">
              Are you a Organiser?
            </p>

            <div className="rounded-full border-0 hover:bg-white aspect-square p-0 h-10 absolute bottom-3 right-5 focus-visible:ring-0">
              <ArrowRight className="h-7 w-7 group-hover:translate-x-1 duration-100 text-green-900" />
            </div>
          </div>

          <div className="w-[80%] mx-auto h-[200px] border-2 border-green-900 rounded-xl flex flex-col group relative justify-center items-center">
            <img
              src="/world.png"
              alt="world"
              className="w-32 h-32 absolute top-10 left-10 hidden sm:block"
            />
            <p className="text-2xl font-semibold sm:ml-10 text-green-950">
              Are you a Participant?
            </p>

            <div className="rounded-full border-0 hover:bg-white aspect-square p-0 h-10 absolute bottom-3 right-5 focus-visible:ring-0">
              <ArrowRight className="h-7 w-7 group-hover:translate-x-1 duration-100 text-green-900" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
