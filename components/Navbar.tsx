"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
// import { useRouter } from "next/router";        this won't work as we are using next/navigation in Next.js 14
import { usePathname } from "next/navigation";

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

import { auth } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import algoliasearch from "algoliasearch/lite";
// import { InstantSearch, SearchBox } from "react-instantsearch-core";
import { useMemo } from "react";

type Props = {
  // searchState: any;
  // setSearchState: any;
  // searchClient: any;
};

const Navbar = ({}: Props) => {

  //for searching stuff through the search bar in the navbar
  // const searchClient = useSelector((state: RootState) => state.search.searchClient);
  // const searchClient = algoliasearch('8XQGGZTFH3', 'bd743f217017ce1ea457a8febb7404ef');
  // const searchClient = useMemo(() => algoliasearch('8XQGGZTFH3', 'bd743f217017ce1ea457a8febb7404ef'), []);

  const [clicked, setClicked] = useState("");

  const [user, loading] = useAuthState(auth);

  const pathname = usePathname();

  if (pathname === "/auth") {
    return null;
  }

  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-[#FFFFFF] dark:bg-[#020817] border-b border-zinc-300 z-[10] py-2">
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

        <div className="relative">
              
                 {/* <InstantSearch searchClient={searchClient} indexName="search_questions"> */}
                {/* <InstantSearch searchClient={searchClient} indexName="search_questions" searchState={searchState} onSearchStateChange={setSearchState}>
                  <SearchBox searchAsYouType={true} />
                </InstantSearch> */}
              
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-700" />
        </div>

        <div className=" flex gap-4">
          <ThemeToggler className=" mr-4" />

          {(user) ? (
            <Link href="/profilePage">
            <Avatar>
              <div className=" relative w-full h-full aspect-square">
                <Image
                  fill
                  src={user?.photoURL || "/nodp.webp"}
                  alt="profile picture"
                  referrerPolicy="no-referrer"
                />
              </div>
              <AvatarFallback>SP</AvatarFallback>
            </Avatar>
            </Link>
          ) : (
            <Link href="/auth">
              <Button variant="default" className=" rounded-3xl">Sign In</Button>
            </Link>
          )}
          

        </div>
      </div>
    </div>
  );
};

export default Navbar;
