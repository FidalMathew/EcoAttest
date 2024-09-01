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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Listed Organisation</DialogTitle>
            <DialogDescription>
              <div className="w-full flex items-center gap-3 px-5 mt-6">
                <Input placeholder="Search" className="focus-visible:ring-0" />
              </div>
              <Formik
                initialValues={{selectedOrganisation: ""}}
                onSubmit={(values) => {}}
              >
                {(formik) => (
                  <Form>
                    <div className="grid grid-cols-3 grid-flow-row grid-rows-3 w-full place-items-center pt-5 gap-6">
                      {orgs.map((item: any, index: number) => (
                        <RadioGroup defaultValue="Org1" key={index}>
                          <RadioGroupItem
                            value={item.name}
                            id={item.name}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={item.name}
                            // className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            className="border rounded-xl p-4 flex flex-col gap-2 aspect-square h-fit items-center cursor-pointer hover:bg-muted peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <div>
                              <img
                                src={"/man.png"}
                                alt={"item.name"}
                                className="h-16 w-16"
                              />
                              <p>Man</p>
                            </div>
                          </Label>
                        </RadioGroup>
                      ))}
                    </div>
                  </Form>
                )}
              </Formik>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="flex items-center gap-4 flex-col md:flex-row">
        <div className="h-[300px] w-[400px] border-2 border-gray-700 rounded-xl flex flex-col items-center justify-center gap-5">
          <img src="org.png" alt="org" className="h-[100px] w-[100px]" />
          <p className="text-2xl">Request to Join as Organisation</p>
          <Button
            className="rounded-full border-2 border-gray-700"
            variant={"outline"}
            size="icon"
            onClick={() => router.push("/requestOrganiser")}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="h-[300px] w-[400px] border-2 border-gray-700 rounded-xl flex flex-col items-center justify-center gap-5">
          <img src="hierarchy.png" alt="org" className="h-[100px] w-[100px]" />
          <p className="text-2xl"> Join as Sub Organiser</p>
          <Button
            className="rounded-full border-2 border-gray-700"
            variant={"outline"}
            size="icon"
            onClick={() => setOpen((prev) => !prev)}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
