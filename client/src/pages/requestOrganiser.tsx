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
import {PinataSDK} from "pinata-web3";
import {Field, Formik, Form} from "formik";

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

  const [userAddress, setUserAddress] = useState<string>("");
  const [qrValue, setQrValue] = useState<string>("");

  const [userInfo, setUserInfo] = useState<
    Partial<OpenloginUserInfo> | undefined
  >();

  useEffect(() => {
    const test = async () => {
      try {
        if (!getUserInfo) return;
        const userInfo = await getUserInfo();
        console.log(userInfo, "userInfo");
        setUserInfo(userInfo);
      } catch (error) {
        console.error(error, "Error logging in");
      }
    };
    console.log(status, walletClient, publicClient);

    if (
      (getUserInfo && loggedIn && status == "connected") ||
      status == "connected"
    ) {
      test();
    }
  }, [status, walletClient, publicClient]);

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

    if (status == "connected" || status == "ready") {
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

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Safely accessing the first file
    if (file) {
      // const pinata = new PinataSDK({
      //   pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
      //   pinataGateway: "example-gateway.mypinata.cloud",
      // });

      // const upload = await pinata.upload.file(file);

      // console.log(upload, " upload");
      // const cid = upload?.IpfsHash;
      // setImageSrc(cid);
      // console.log("IPFS CID:", cid);

      setImageFile(file);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center font-sans">
      <div className="lg:w-1/2 w-[90%] h-fit border-2 border-gray-700 rounded-xl flex justify-center items-center flex-col gap-8">
        <div className="bg-green-800 text-white w-full h-24 flex justify-start items-center px-10 rounded-t-xl">
          <p className="text-2xl font-semibold">Request to be an Organiser</p>
        </div>

        <Formik
          initialValues={{orgName: ""}}
          onSubmit={(values, _) => {
            console.log(values);
            console.log(imageFile);

            (async function () {
              try {
                if (imageFile) {
                  const pinata = new PinataSDK({
                    pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
                    pinataGateway: "example-gateway.mypinata.cloud",
                  });

                  const upload = await pinata.upload.file(imageFile);

                  console.log(upload, " upload");
                  const cid = upload?.IpfsHash;

                  console.log("IPFS CID:", cid);
                }
              } catch (error) {
                console.error(error, "Error uploading image to ipfs");
              }
            })();
          }}
        >
          {(formik) => (
            <Form className="grid gap-4 w-full px-10 pb-10">
              <div className="w-full h-full flex justify-center items-center">
                <div className="w-[150px] h-[150px] bg-white border-2 border-gray-700 rounded-full relative">
                  <div className="w-full h-full overflow-hidden rounded-full">
                    <img
                      src={
                        imageFile ? URL.createObjectURL(imageFile) : "/user.png"
                      }
                      alt="user"
                      className="-z-50 overflow-hidden"
                    />
                  </div>
                  <Field
                    as={Input}
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

                <Field
                  as={Input}
                  id="orgName"
                  placeholder="Organisation Name"
                  name="orgName"
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

                {userAddress ? (
                  <>
                    <Input
                      id="address"
                      type="text"
                      value={userAddress}
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
            </Form>
          )}
        </Formik>
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
