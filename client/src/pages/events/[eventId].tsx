import Navbar from "@/components/ui/Navbar";
import {CircleCheck, Leaf, Star, TicketCheck} from "lucide-react";
import {useRouter} from "next/router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {Button} from "@/components/ui/button";
import {useState} from "react";
import {Label} from "@/components/ui/label";

export default function Events() {
  const router = useRouter();

  const [openStatus, setOpenStatus] = useState(false);

  const {eventId} = router.query;
  return (
    <div className="min-h-screen w-full">
      <Dialog open={openStatus} onOpenChange={setOpenStatus}>
        <DialogContent className="h-fit w-[500px]">
          <DialogHeader>
            <DialogTitle>Check Status</DialogTitle>
            <DialogDescription>
              <div className="w-full h-full flex flex-col mt-5 font-sans text-black">
                <div className="w-full h-[80px] flex items-center px-4">
                  <p className="text-xl w-full">Attended</p>
                  <CircleCheck className="h-9 w-9 fill-green-700 text-white " />
                </div>
                <div className="w-full h-[80px] flex items-center px-4">
                  <p className="text-xl w-full">Participated</p>
                  <CircleCheck className="h-9 w-9 fill-green-700 text-white" />
                </div>
                <div className="w-full h-[80px] flex items-center px-4">
                  <div className="flex flex-col">
                    <p className="text-xl w-full">Issued Carbon Credits</p>
                    <p className="text-xs text-blue-800">
                      <a
                        href=" https://testnet-scan.sign.global/attestation/onchain_evm_84532_0x2b2"
                        target="_blank"
                      >
                        {" "}
                        https://testnet-scan.sign.global/attestation/onchain_evm_84532_0x2b2
                      </a>
                    </p>
                  </div>
                  <CircleCheck className="h-9 w-9 fill-green-700 text-white" />
                </div>

                <div className="grid gap-2 mx-4 my-5">
                  <Label>Rating</Label>
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 fill-primary" />
                    <Star className="w-6 h-6 fill-primary" />
                    <Star className="w-6 h-6 fill-primary" />
                    <Star className="w-6 h-6 fill-muted stroke-muted-foreground" />
                    <Star className="w-6 h-6 fill-muted stroke-muted-foreground" />
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Navbar />

      <div
        style={{
          height: "calc(100% - 70px)",
        }}
        className="flex gap-2 p-7 lg:flex-row flex-col"
      >
        <div className="w-[500px] h-full flex items-center lg:m-0 m-auto py-5 flex-col gap-3">
          <div className="w-[400px] h-[400px] bg-green-400 rounded-xl border-2 border-green-800"></div>
          <div className="w-[400px] h-[80px] bg-green-900 rounded-xl flex items-center px-10 border-2 border-gray-800 justify-center text-white">
            <Leaf className="h-8 w-8 mr-2" />
            <p className="font-bold font-sans text-2xl">12 CC</p>
          </div>
          <div className="cursor-pointer w-[400px] h-[60px] bg-orange-900 hover:bg-orange-800 rounded-xl flex items-center px-10 border-2 border-gray-800 justify-center text-white">
            <TicketCheck className="h-6 w-6 mr-2" />

            <p className="font-bold font-sans text-2xl">Join</p>
          </div>
        </div>
        <div className="w-full h-full p-6">
          <div className="w-full h-full rounded-xl flex flex-col gap-10">
            <h1 className="font-bold text-3xl font-sans">
              {" "}
              Car Pooling to Accenture
            </h1>
            <p className="text-xl font-light font-sans">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. In veniam
              qui blanditiis impedit, ex maiores neque itaque perferendis
              corporis quia aliquam nesciunt doloremque cumque eum praesentium
              non, animi dignissimos tenetur. Neque facere voluptas hic
              blanditiis, molestias aliquid quas aperiam sapiente
              necessitatibus. Expedita explicabo aliquid molestias, doloremque
              iure repudiandae itaque. Esse, nostrum reprehenderit repellat, in
              dolores voluptatibus beatae consectetur magnam atque doloremque
              dolore, illo recusandae maiores. Ipsum unde temporibus nostrum ab,
              quas reprehenderit officiis reiciendis doloremque, aspernatur
              corporis modi illo! Possimus suscipit mollitia reiciendis eligendi
              temporibus totam ullam quae vel. Beatae, obcaecati? Quos eius
              maiores eos cumque omnis facilis rem nihil?
            </p>

            <Card className="shadow-none border-2 border-green-900 font-sans">
              <CardHeader className="border-b-2 border-green-900 bg-green-900 text-white">
                <CardTitle>Participants</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-8 mt-6">
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <div className="flex items-center gap-4" key={index}>
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/01.png" alt="Avatar" />
                      <AvatarFallback className="border-2 border-gray-700">
                        OM
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        Olivia Martin
                      </p>
                      <p className="text-sm text-muted-foreground">
                        olivia.martin@email.com
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      <Button
                        size="sm"
                        variant="outline"
                        className="px-4 py-2 border-2 border-green-900 rounded-full"
                        onClick={() => setOpenStatus((prev) => !prev)}
                      >
                        Check Status
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
