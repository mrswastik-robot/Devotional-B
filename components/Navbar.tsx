"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Book, HomeIcon, Search, User } from "lucide-react";
import { Home } from "lucide-react";
import { Bell } from "lucide-react";
import { NotebookTabs } from "lucide-react";
import { SquarePen } from "lucide-react";
import { UserRoundPlus } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "./ui/input";
import { ThemeToggler } from "./ThemeToggler";
import { Button } from "./ui/button";

type Props = {};

const Navbar = (props: Props) => {

  const [clicked, setClicked] = useState("");

  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 dark:bg-[#020817] border-b border-zinc-300 z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        {/* logo */}
        <div className=" flex gap-[1.7rem]">
          <Link href="/" className="flex gap-2 items-center">
            <p className="hidden text-zinc-700 dark:text-emerald-100 text-xl font-medium md:block">
              Devotional-B
            </p>
          </Link>

          <div className=" ml-3 space-x-5 flex">
          <Button variant="ghost" onClick={() => setClicked("home")}>
            <Home
              className={`h-5 w-5 ${clicked === 'home' ? "text-red-500 " : ""}`}
            />
          </Button>
          <Button
            variant="ghost"
            onClick={() => setClicked("notebook")}
          >
            <UserRoundPlus
              className={`w-5 h-5 ${clicked === "notebook" ? "text-red-500" : ""}`}
            />
          </Button>
          
          <Button variant="ghost" onClick={() => setClicked("notification")}>
            <Bell
              className={`w-5 h-5 ${clicked === 'notification' ? "text-red-500" : ""}`}
            />
          </Button>
        </div>
        </div>

        {/* search bar */}
        <div className=" relative ">
          <Input className=" pl-10 w-[40rem]" placeholder="Search" />
          <Search className=" absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-700" />
        </div>

        <div className=" flex gap-4">
          <ThemeToggler className=" mr-4" />
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
