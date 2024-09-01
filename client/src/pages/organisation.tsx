import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {ArrowRight, Search} from "lucide-react";
import {useRouter} from "next/router";
import {useState} from "react";
import {Form, Formik} from "formik";
import {Checkbox} from "@radix-ui/react-checkbox";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";

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
    <div className="min-h-screen w-full flex justify-center items-center">
      <div></div>
    </div>
  );
}
