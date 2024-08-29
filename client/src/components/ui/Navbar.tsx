import {useRouter} from "next/router";
import {Avatar, AvatarFallback, AvatarImage} from "./avatar";
import {Input} from "./input";

export default function Navbar() {
  const router = useRouter();
  return (
    <nav className="w-full h-[70px] flex justify-between items-center px-5 border-b">
      <div className="font-sans font-bold">EcoAttest</div>
      <div className="w-1/3">
        <Input placeholder="Search" className="focus-visible:ring-0" />
      </div>
      <div className="">
        <Avatar
          onClick={() => router.push("/profile")}
          className="cursor-pointer"
        >
          <AvatarImage src="/man.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
