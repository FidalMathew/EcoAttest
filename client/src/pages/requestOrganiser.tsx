import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Skeleton} from "@/components/ui/skeleton";
import useGlobalContextHook from "@/context/useGlobalContextHook";
import QRX from "@qr-x/react";
import {OpenloginUserInfo} from "@web3auth/openlogin-adapter";
import {Pencil} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/router";
import {ChangeEvent, useEffect, useState} from "react";

export default function RequestOrganiser() {
  const router = useRouter();
  const {
    getAllOrganizations,
    status,
    walletClient,
    publicClient,
    getUserInfo,
    logout,
    provider,
    loggedIn,
    loggedInAddress,
    balanceAddress,
  } = useGlobalContextHook();

  const [userAddress, setUserAddress] = useState<String>("");
  const [qrValue, setQrValue] = useState<string>("");

  const [userInfo, setUserInfo] = useState<
    Partial<OpenloginUserInfo> | undefined
  >();

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

  useEffect(() => {
    const fetchOrganizations = async () => {
      if (getAllOrganizations) {
        const res = await getAllOrganizations();
        console.log(res, "organizations");
      }

      if (walletClient) {
        const [address] = await walletClient.getAddresses();
        console.log(address, "address");
        setUserAddress(address);
      }
    };

    if (status == "connected") {
      fetchOrganizations();
    }
  }, [status, walletClient, publicClient]);

  const requestAttestion = (organization: String, event: String) => {
    const schemaTemplate = {
      organization,
      event,
      participant: userAddress,
    };
    const schema = JSON.stringify(schemaTemplate);

    // let test = "sda"
    setQrValue(schema);
  };

  // return (
  //   <div>
  //     <button onClick={() => requestAttestion("Uber", "carpooling")}>
  //       check
  //     </button>
  //     <div className="flex items-center justify-center">
  //       {/* {userAddress} */}
  //       <div className="w-1/4 h-1/2">
  //         {qrValue && (
  //           <QRX
  //             data={qrValue}
  //             color="rgb(20, 93, 20)"
  //             shapes={{
  //               body: "circle",
  //               eyeball: "circle",
  //               eyeframe: "rounded",
  //             }}
  //           />
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );

  const [imageSrc, setImageSrc] = useState("/user.png");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Safely accessing the first file
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImageSrc(reader.result as string); // Type assertion to string
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen w-full grid place-content-center font-sans">
      <div className="w-[800px] h-fit border-2 border-gray-700 rounded-xl flex justify-center items-center flex-col gap-8">
        <div className="bg-green-800 text-white w-full h-24 flex justify-start items-center px-10">
          <p className="text-2xl font-semibold">Request to be an Organiser</p>
        </div>
        <div className="grid gap-4 w-full px-10 pb-10">
          <div className="w-full h-full flex justify-center items-center">
            <div className="w-[150px] h-[150px] bg-white border-2 border-gray-700 rounded-full relative">
              <div className="w-full h-full overflow-hidden rounded-full">
                <img
                  src={imageSrc}
                  alt="user"
                  className="-z-50 overflow-hidden"
                />
              </div>
              <Input
                type="file"
                className="hidden"
                id="orgIcon"
                name="orgIcon"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Label htmlFor="orgIcon" className="z-[100]">
                <div className="cursor-pointer h-10 w-10 border-2 border-gray-700 rounded-full grid place-content-center bg-green-700 text-white absolute bottom-0 right-0">
                  <Pencil />
                </div>
              </Label>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="orgName">Name</Label>

            <Input
              id="orgName"
              placeholder="Organisation Name"
              required
              className="focus-visible:ring-0 border-2 border-gray-700"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            {userInfo && userInfo.email ? (
              <>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="border-2 border-gray-700"
                  value={userInfo.email}
                  disabled
                />
              </>
            ) : (
              <Skeleton className="w-3/4 bg-gray-300 h-[30px]" />
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>

            {loggedInAddress ? (
              <>
                <Input
                  id="address"
                  type="text"
                  value={loggedInAddress}
                  disabled
                  className="border-2 border-gray-700"
                />
              </>
            ) : (
              <Skeleton className="w-full bg-gray-300 h-10" />
            )}
          </div>
          <Button
            type="submit"
            variant={"outline"}
            className="w-full border-2 border-gray-700"
          >
            Request
          </Button>
        </div>
      </div>
    </div>
  );
}

/*
 // "@nillion/client-core": "^0.1.0-rc.12",
    // "@nillion/client-payments": "^0.1.0-rc.12",
    // "@nillion/client-react-hooks": "^0.1.0-rc.12",
    // "@nillion/client-vms": "^0.1.0-rc.12",
    // "@nillion/client-web": "^0.5.0",

*/
