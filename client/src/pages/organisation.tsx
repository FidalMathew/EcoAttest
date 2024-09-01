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
import {useState} from "react";

export default function Organisation() {
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
              <div className="grid grid-cols-3 grid-flow-row grid-rows-3 w-full place-items-center pt-5 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item: any, index: number) => (
                  <div
                    key={index}
                    className="border rounded-xl p-4 flex flex-col gap-2 aspect-square h-fit items-center cursor-pointer hover:bg-muted"
                    onClick={() => {}}
                  >
                    <img
                      src={"/man.png"}
                      alt={"item.name"}
                      className="h-16 w-16"
                    />
                    <p>Man</p>
                  </div>
                ))}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="flex items-center gap-4">
        <div className="h-[300px] w-[400px] border-2 border-gray-700 rounded-xl flex flex-col items-center justify-center gap-5">
          <img src="org.png" alt="org" className="h-[100px] w-[100px]" />
          <p className="text-2xl">Request to Join as Organisation</p>
          <Button className="rounded-full" variant={"outline"}>
            <ArrowRight className="h-7 w-7" />
          </Button>
        </div>
        <div className="h-[300px] w-[400px] border-2 border-gray-700 rounded-xl flex flex-col items-center justify-center gap-5">
          <img src="hierarchy.png" alt="org" className="h-[100px] w-[100px]" />
          <p className="text-2xl">Request to Join as Sub Organiser</p>
          <Button
            className="rounded-full"
            variant={"outline"}
            onClick={() => setOpen((prev) => !prev)}
          >
            <ArrowRight className="h-7 w-7" />
          </Button>
        </div>
      </div>
    </div>
  );
}
