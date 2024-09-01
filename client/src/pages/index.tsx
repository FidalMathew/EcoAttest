import Image from "next/image";
import {ArrowRight} from "lucide-react";
import {useRouter} from "next/router";
import {useFetchValue, useStoreValue} from "@nillion/client-react-hooks";
import useGlobalContextHook from "@/context/useGlobalContextHook";
import {OpenloginUserInfo} from "@web3auth/openlogin-adapter";

import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  // web3auth -------
  const {getUserInfo, login, loggedIn, status} = useGlobalContextHook();

  useEffect(() => {
    if (loggedIn && status === "connected") {
      router.push(`/feed`);
    }
  }, [status, loggedIn]);

  // web3auth -------

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
        <div className="h-full w-full gap-6 flex flex-col items-center justify-center font-sans">
          <div
            className="w-[80%] mx-auto h-[200px] border-2 border-green-900 rounded-xl flex flex-col group relative justify-center items-center cursor-pointer"
            onClick={login}
          >
            <img
              src="/wallet.png"
              alt="wallet"
              className="w-24 h-24 absolute top-10 left-10 hidden sm:block"
            />
            <p className="text-2xl font-semibold sm:ml-10 text-green-950">
              Connect your Wallet
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
