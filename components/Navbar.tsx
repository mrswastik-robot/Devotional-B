import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "./ui/input";
import { ThemeToggler } from "./ThemeToggler";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        {/* logo */}
        <Link href="/" className="flex gap-2 items-center">
          <p className="hidden text-zinc-700 text-sm font-medium md:block">
            Devotional-B
          </p>
        </Link>

        {/* search bar */}
        <div className=" relative w-[15]">
          <Input 
            className=" pl-10 w-[15]"
            placeholder="Search"
            
            />
            <Search className=" absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-700" />
        </div>
               
        <div className=" flex gap-4">
          <ThemeToggler />
          <Avatar>
            <div className=" relative w-full h-full aspect-square">
              <Image
                fill
                src="https://avatars.githubusercontent.com/u/107865087?v=4"
                alt="profile picture"
                referrerPolicy="no-referrer"
              />
            </div>
            <AvatarFallback>SP</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
