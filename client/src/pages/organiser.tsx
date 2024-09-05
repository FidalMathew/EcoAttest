import Navbar from "@/components/ui/Navbar";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Copy,
  FileCheck,
  Gem,
  Pencil,
  QrCode,
  Shrub,
  Star,
  UsersRound,
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
import {useEffect, useState} from "react";
import QRX from "@qr-x/react";
import useGlobalContextHook from "@/context/useGlobalContextHook";
import {OpenloginUserInfo} from "@web3auth/openlogin-adapter";
import {Skeleton} from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Field, Form, Formik} from "formik";
import {ReloadIcon} from "@radix-ui/react-icons";

export default function Organisers() {
  const router = useRouter();
  const {
    getUserInfo,
    walletClient,
    publicClient,
    logout,
    provider,
    loggedIn,
    status,
    balanceAddress,
    loggedInAddress,
    getOrganizationByAddress,
    addSubOrganizer,
    addOrganizationLoading,
    addSubOrganizerLoading,
  } = useGlobalContextHook();

  const [openQr, setOpenQr] = useState(false);
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

  const [organizationDetails, setOrganizationDetails] = useState<any>({});
  const [tempSubOrganizer, setTempSubOrganizer] = useState<string>(
    "0x723d14A921D450C669CCc18C4A713be63bF25D0c"
  );

  useEffect(() => {
    const fetchDetails = async () => {
      if (getOrganizationByAddress) {
        const res = await getOrganizationByAddress(loggedInAddress as string);
        console.log(res, "organisation");
        setOrganizationDetails(res);
      }
    };

    if (loggedInAddress) fetchDetails();
  }, [loggedInAddress]);

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [createEventsModal, setCreateEventsModal] = useState(false);

  const [whichTabActive, setWhichTabActive] = useState("suborganisers");

  const [isCopied, setIsCopied] = useState(false);
  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      console.log("Copied to clipboard");
    } catch (error) {
      console.error("Failed to copy: ", error);
    } finally {
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }

  return (
    <div className="min-h-screen w-full">
      <Navbar />

      <Dialog open={open2} onOpenChange={setOpen2}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Sub Organisers</DialogTitle>
            <DialogDescription>
              <Formik
                initialValues={{address: ""}}
                onSubmit={async (values, _) => {
                  if (addSubOrganizer) await addSubOrganizer(values.address);
                }}
              >
                {(formik) => (
                  <Form className="font-sans">
                    <div className="my-6 mb-3">
                      <Label htmlFor="address">Address</Label>
                      <Field
                        as={Input}
                        id="address"
                        name="address"
                        type="text"
                        placeholder="0x1234...."
                        className="w-full focus-visible:ring-0 mt-2"
                      />
                    </div>

                    {addSubOrganizerLoading ? (
                      <Button
                        disabled
                        className="mt-4 w-full border-2 border-gray-700"
                        variant={"outline"}
                      >
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="mt-4 w-full border-2 border-gray-700"
                        variant={"outline"}
                      >
                        Add Sub Organizer
                      </Button>
                    )}
                  </Form>
                )}
              </Formik>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={createEventsModal} onOpenChange={setCreateEventsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
            <DialogDescription>
              <Formik
                initialValues={{
                  // orgIcon: "",
                  title: "",
                  description: "",
                  carboncredits: 0,
                }}
                onSubmit={(values, _) => console.log(values)}
              >
                {(formik) => (
                  <Form className="font-sans">
                    <div className="w-full flex justify-center mt-5">
                      <div className="w-[150px] h-[150px] bg-white border-2 border-gray-700 rounded-full relative">
                        <div className="w-full h-full overflow-hidden rounded-full ">
                          <img
                            src={"/user.png"}
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
                          // onChange={handleImageChange}
                        />
                        <Label htmlFor="orgIcon" className="z-[100]">
                          <div className="cursor-pointer h-10 w-10 border-2 border-gray-700 rounded-full grid place-content-center bg-green-700 text-white absolute bottom-0 right-0">
                            <Pencil />
                          </div>
                        </Label>
                      </div>
                    </div>
                    <div className="my-6 mb-3">
                      <Label htmlFor="title">Title</Label>
                      <Field
                        as={Input}
                        id="title"
                        name="title"
                        type="text"
                        placeholder="Title"
                        className="w-full focus-visible:ring-0 mt-2"
                      />
                    </div>
                    <div className="my-6 mb-3">
                      <Label htmlFor="description">Description</Label>
                      <Field
                        as={Textarea}
                        id="description"
                        name="description"
                        type="text"
                        placeholder="Description"
                        className="w-full focus-visible:ring-0 mt-2"
                      />
                    </div>
                    <div className="my-6 mb-3">
                      <Label htmlFor="carboncredits">Carbon Credits</Label>

                      <Field
                        as={Input}
                        id="carboncredits"
                        name="carboncredits"
                        type="number"
                        placeholder="Carbon Credits"
                        className="w-full focus-visible:ring-0 mt-2"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="mt-4 w-full border-2 border-gray-700"
                      variant={"outline"}
                    >
                      Add Event
                    </Button>
                  </Form>
                )}
              </Formik>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div
        style={{
          height: "calc(100% - 70px)",
        }}
        className="flex gap-9 p-7 flex-col lg:flex-row items-center"
      >
        <div className="max-w-[400px] w-[550px] lg:w-[600px] h-[650px] rounded-2xl flex items-center flex-col lg:justify-center gap-5 border-2 border-gray-700 ">
          <div className="lg:h-full h-3/5 rounded-t-2xl w-full bg-blue-600 flex justify-center items-center">
            <div className="w-full flex justify-center items-center px-7">
              <div className="bg-white rounded-full border-2 border-green-800 h-[250px] w-[250px] flex overflow-hidden">
                {organizationDetails ? (
                  <>
                    <img
                      src={
                        "https://gateway.pinata.cloud/ipfs/" +
                          organizationDetails.imageUrl || "/ecosystem.png"
                      }
                      alt={organizationDetails.name || "EcoAttest"}
                    />
                  </>
                ) : (
                  <Skeleton className="w-[250px] h-[250px] rounded-full bg-gray-300" />
                )}
              </div>
            </div>
          </div>
          <div className="font-sans h-2/5 w-full lg:py-6 justify-center rounded-b-2xl px-6 flex flex-col gap-4 relative">
            {/* <div
              className="absolute lg:top-3 lg:right-4 top-5 right-5 hover:bg-slate-100 rounded-lg cursor-pointer p-1"
              onClick={() => setOpenQr((prev) => !prev)}
            >
              <QrCode />
            </div> */}
            {organizationDetails ? (
              <>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-normal">
                    {organizationDetails.name || "name hasn't loaded"}{" "}
                  </p>
                  <div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <BadgeCheck className="fill-blue-700 text-white" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Verified Organisation</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </>
            ) : (
              <Skeleton className="w-3/4 bg-gray-300 h-[30px]" />
            )}

            {loggedInAddress ? (
              <div className="items-center flex gap-4 ">
                <p>
                  {loggedInAddress.slice(0, 10) +
                    "..." +
                    loggedInAddress.slice(-10)}
                </p>

                {
                  <div
                    className="hover:bg-gray-100 p-1 rounded cursor-pointer"
                    onClick={() => copyToClipboard(loggedInAddress)}
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4 " />
                    )}
                  </div>
                }
              </div>
            ) : (
              <Skeleton className="w-4/5 bg-gray-300 h-[30px]" />
            )}
            <div className="flex items-center justify-between font-sans font-semibold mt-5">
              <div className="flex items-center gap-2">
                <UsersRound className="w-6 h-6 fill-yellow-500" />
                <span>Sub Organisers</span>
              </div>

              <p>3</p>
            </div>
            <div className="flex items-center justify-between font-sans font-semibold">
              <div className="flex items-center gap-2">
                <FileCheck className="w-6 h-6 fill-yellow-500" />

                <span>Attestations</span>
              </div>

              <p>5</p>
            </div>
          </div>

          {/* <footer className="rounded-b-xl absolute bottom-0 right-0 w-full h-10"></footer> */}
        </div>
        <div className="h-full w-full flex flex-col gap-4">
          <p className="text-2xl">Details</p>
          <Tabs
            defaultValue="suborganisers"
            className="w-full"
            onValueChange={(value) => {
              setWhichTabActive(value);
            }}
          >
            <div className="flex justify-between">
              <TabsList className="">
                <TabsTrigger
                  value="suborganisers"
                  className="data-[state=active]:border-2 data-[state=active]:border-gray-700 data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                >
                  Sub Organisers
                </TabsTrigger>
                <TabsTrigger
                  value="events"
                  className="data-[state=active]:border-2 data-[state=active]:border-gray-700 data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                >
                  Events
                </TabsTrigger>
                <TabsTrigger
                  value="attestations"
                  className="data-[state=active]:border-2 data-[state=active]:border-gray-700 data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                >
                  Attestations
                </TabsTrigger>
              </TabsList>
              <div className="pr-4">
                {whichTabActive === "suborganisers" ? (
                  <Button
                    onClick={() => setOpen2(true)}
                    className="w-fit border-2 border-gray-700"
                    variant={"outline"}
                  >
                    Add Sub Organiser
                  </Button>
                ) : (
                  whichTabActive === "events" && (
                    <Button
                      onClick={() => setCreateEventsModal(true)}
                      className="w-fit border-2 border-gray-700"
                      variant={"outline"}
                    >
                      Create Event
                    </Button>
                  )
                )}
              </div>
            </div>

            <TabsContent value="suborganisers" className="focus-visible:ring-0">
              <div
                className="w-full overflow-y-auto flex flex-col gap-4 pr-4 items-end"
                style={{
                  height: "calc(100vh - 30vh)",
                }}
              >
                {[1, 2, 3, 5, 6, 7, 8, 9, 0].map((_, index) => (
                  <div className="w-full h-full rounded-xl flex flex-col gap-10 items-end">
                    <div className="w-full h-[150px] rounded-xl border-2 border-gray-700 flex justify-around items-center">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src="/man.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-2">
                        <p className="lg:text-xl max-w-sm lg:max-w-full">
                          {" "}
                          Sub Organisers Name
                        </p>
                        <p className="lg:text-md max-w-sm lg:max-w-full">
                          {" "}
                          0x33434...334fe34234
                        </p>
                        <p className="lg:text-sm max-w-sm lg:max-w-full">
                          {" "}
                          suborganisers@mail.com
                        </p>
                      </div>
                      <Badge
                        variant={"outline"}
                        className={`lg:px-8 lg: text-sm  py-2 border-2 border-gray-700  text-white  bg-green-700`}
                      >
                        Event Name
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
            <TabsContent value="events">
              <div
                className="w-full overflow-y-auto flex flex-col gap-4 pr-4"
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
                      <p className="lg:text-xl max-w-sm lg:max-w-full">
                        {" "}
                        Car Pooling to Accenture
                      </p>
                      <Badge
                        variant={"outline"}
                        className={`lg:px-8 lg: text-sm  py-2 border-2 border-gray-700  text-white ${
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
            <TabsContent value="attestations">
              <div
                className="w-full overflow-y-auto flex flex-col gap-4 pr-4"
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
                      <p className="lg:text-xl max-w-sm lg:max-w-full">
                        {" "}
                        Car Pooling to Accenture
                      </p>
                      <Badge
                        variant={"outline"}
                        className={`lg:px-8 lg: text-sm  py-2 border-2 border-gray-700  text-white ${
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
