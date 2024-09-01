import {Button} from "@/components/ui/button";
import {ArrowUpRight, Plus, Search, UserIcon} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {useRouter} from "next/router";
import {useState} from "react";
import {Form, Formik} from "formik";
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
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

const orgs = [
  {
    name: "Org1",
    logo: "org1.png",
  },
  {
    name: "Org2",
    logo: "org2.png",
  },
  {
    name: "Org3",
    logo: "org3.png",
  },
  {
    name: "Org4",
    logo: "org4.png",
  },
  {
    name: "Org5",
    logo: "org5.png",
  },
  {
    name: "Org6",
    logo: "org6.png",
  },
  {
    name: "Org7",
    logo: "org7.png",
  },
  {
    name: "Org8",
    logo: "org8.png",
  },
];

export default function Organisation() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen w-full p-5 flex items-center-center font-sans flex-col gap-5 items-center">
      <p className="text-center text-3xl font-semibold font-sans">EcoAttest</p>
      <div className="h-[250px] w-full lg:w-2/3  border-gray-700 border-2 rounded-2xl flex">
        <div className="w-1/3 h-full bg-blue-700 rounded-l-2xl flex justify-center items-center">
          <div className="rounded-full border-2 border-white-700 w-[80%] md:w-3/5 aspect-square bg-white flex flex-col">
            {/* <img
              src="https://freelogopng.com/images/all_img/1659761297uber-icon.png"
              alt="uber"
            /> */}
          </div>
        </div>
        <div className="flex flex-col justify-center ml-6 gap-6">
          <p className="text-3xl   font-semibold">Organisation Name</p>
          <p className="text-md lg:text-lg font-normal">
            {"0x10AbbDc83E8e33974650cB897b16250E07979CBa".slice(0, 10) +
              "..." +
              "0x10AbbDc83E8e33974650cB897b16250E07979CBa".slice(-10)}
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
            {/* <div>
              <Button
                className="mr-2 rounded-full border-2 border-gray-700 "
                variant={"outline"}
                size="icon"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div> */}
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
