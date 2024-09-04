import {Button} from "@/components/ui/button";
import {ArrowUpRight, Pencil, Plus, Search, UserIcon} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Field, Form, Formik} from "formik";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import useGlobalContextHook from "@/context/useGlobalContextHook";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";

export default function Organisation() {
  const {loggedInAddress, getOrganizationByAddress, addSubOrganizer} =
    useGlobalContextHook();

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

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [createEventsModal, setCreateEventsModal] = useState(false);
  return (
    <div className="min-h-screen w-full p-5 flex items-center-center font-sans flex-col gap-5 items-center">
      <Dialog open={open2} onOpenChange={setOpen2}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              <Formik initialValues={{address: ""}} onSubmit={() => {}}>
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

                    <Button
                      type="submit"
                      className="mt-4 w-full border-2 border-gray-700"
                      variant={"outline"}
                    >
                      Add Sub Organizer
                    </Button>
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
                    <div className="w-[150px] h-[150px] bg-white border-2 border-gray-700 rounded-full relative">
                      <div className="w-full h-full overflow-hidden rounded-full">
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

      <p className="text-center text-3xl font-semibold font-sans">EcoAttest</p>
      <div className="h-[250px] w-full lg:w-2/3  border-gray-700 border-2 rounded-2xl flex">
        <div className="w-1/3 h-full bg-blue-700 rounded-l-2xl flex justify-center items-center">
          <div className="rounded-full border-2 border-white-700 w-[80%] md:w-3/5 aspect-square bg-white flex flex-col">
            {organizationDetails && (
              <img
                src={organizationDetails.imageUrl || "/ecosystem.png"}
                alt={organizationDetails.name || "EcoAttest"}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col justify-center ml-6 gap-6">
          <p className="text-3xl   font-semibold">
            {organizationDetails.name || ""}
          </p>
          <p className="text-md lg:text-lg font-normal">
            {loggedInAddress &&
              loggedInAddress.slice(0, 10) + "..." + loggedInAddress.slice(-10)}
          </p>
        </div>
      </div>

      <div className="h-full w-full flex gap-5 flex-col lg:flex-row lg:px-28">
        <Card className="w-full border-2 border-gray-700">
          <CardHeader className="border-b-2 border-gray-700 mb-5 flex justify-between flex-row items-center py-3 bg-blue-800 text-white">
            <CardTitle>Sub Organisers</CardTitle>
            <div>
              <Button
                className="mr-2 rounded-full border-2 border-gray-700 "
                variant={"outline"}
                size="icon"
                // onClick={() => addSubOrganizer!(tempSubOrganizer)}
                onClick={() => setOpen2((prev) => !prev)}
              >
                <Plus className="h-5 w-5 text-black" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-8">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex border-2 border-gray-700">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>

                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {"0x10AbbDc83E8e33974650cB897b16250E07979CBa".slice(0, 5) +
                      "..." +
                      "0x10AbbDc83E8e33974650cB897b16250E07979CBa".slice(-8)}
                  </p>
                </div>
                <div className="ml-auto font-medium">1111</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="w-full border-2 border-gray-700">
          <CardHeader className="border-b-2 border-gray-700 mb-5 flex justify-between flex-row items-center py-6 bg-blue-800 text-white">
            <CardTitle>Attestations</CardTitle>
            <div>
              <Button
                className="mr-2 rounded-full border-2 border-gray-700 "
                variant={"outline"}
                size="icon"
                // onClick={() => addSubOrganizer!(tempSubOrganizer)}
                onClick={() => setCreateEventsModal((prev) => !prev)}
              >
                <Plus className="h-5 w-5 text-black" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-8">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex border-2 border-gray-700">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>

                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {"0x10AbbDc83E8e33974650cB897b16250E07979CBa".slice(0, 5) +
                      "..." +
                      "0x10AbbDc83E8e33974650cB897b16250E07979CBa".slice(-8)}
                  </p>
                </div>
                <div className="ml-auto font-medium">1111</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
