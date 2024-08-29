import Image from "next/image";
import {Inter} from "next/font/google";
import {Input} from "@/components/ui/input";

const inter = Inter({subsets: ["latin"]});

export default function Home() {
  return (
    <div className="h-screen w-full">
      <nav className="w-full h-[70px]"></nav>
      <div>hello</div>
    </div>
  );
}
