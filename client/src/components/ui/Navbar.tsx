import { useRouter } from "next/router";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { useEffect, useState } from "react";
import { OpenloginUserInfo } from "@web3auth/openlogin-adapter";
import useGlobalContextHook from "@/context/useGlobalContextHook";

export default function Navbar() {
  const router = useRouter();

  const [loggedInAddress, setLoggedInAddress] = useState<string | null>(null);
  const [balanceAddress, setBalanceAddress] = useState<string | null>(null);
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
    isOrganizerState,
    isSubOrganizerState,
    addSubOrganizer,
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
        if (walletClient && publicClient) {
          const [address] = await walletClient.getAddresses();
          console.log(address, "dsaaddress");
          setLoggedInAddress(address);

          const balance = await publicClient.getBalance({
            address: address,
          });

          console.log(balance.toString(), "balance");
          setBalanceAddress(balance.toString());

          getUser();
        }
      } catch (error) {
        console.error(error, "Error logging in");
      }
    })();
  }, [walletClient, publicClient, provider, loggedIn, router.pathname, status]);

  console.log(publicClient, "publicClient", walletClient, "walletClient");

  return (
    <nav className="w-full h-[70px] flex justify-between items-center px-5 border-b">
      <div
        className="font-sans font-bold cursor-pointer"
        onClick={() => router.push("/feed")}
      >
        EcoAttest
      </div>
      {/* <div className="w-1/3">
        <Input placeholder="Search" className="focus-visible:ring-0" />
      </div> */}
      <div className="flex items-center gap-5">
        {status === "not_ready" && <div>Connecting...</div>}
        {status === "connected" && loggedInAddress && balanceAddress && (
          <div>
            Addr:{" "}
            {loggedInAddress.slice(0, 6) + "..." + loggedInAddress.slice(-4)}
          </div>
        )}
        {loggedInAddress &&

          <Button variant={"outline"} onClick={() => {
            // attest!('0xecC6E5aA22E2Bb7aDD9296e5E7113E1A44C4D736', loggedInAddress, 1, 10)
            // addSubOrganizer!(loggedInAddress)
            logout
          }}>
            Logout
          </Button>
        }
        <Button
          variant={"outline"}
          onClick={() => router.push(`/requestOrganiser`)}
        >
          Become organizer
        </Button>
        {isOrganizerState && <Button variant={"outline"} onClick={() => router.push(`/organiser`)}>
          Organisation
        </Button>}
        {
          isSubOrganizerState &&
          <Button
            variant={"outline"}
            onClick={() => router.push(`/suborganisers`)}
          >
            SubOrg
          </Button>
        }
        <Avatar
          onClick={() => router.push("/profile")}
          className="cursor-pointer"
        >
          <AvatarImage src={userInfo?.profileImage || "/man.png"} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
