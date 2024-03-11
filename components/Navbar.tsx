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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "./ui/input";
import { ThemeToggler } from "./ThemeToggler";
import { Button } from "./ui/button";

import { auth } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { useDispatch , useSelector } from "react-redux";
import { setSearchText , triggerSearch } from "@/store/slice";
import { RootState } from "@/store/store";
import { useTheme } from "next-themes";
import AskQuestion from "./AskQuestion";



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

  const dispatch = useDispatch();
  const searchText = useSelector((state: RootState) => state.search.searchText);

  const handleSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    dispatch(setSearchText(e.target.value));
  }

  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }

  const [clicked, setClicked] = useState("");

  const [user, loading] = useAuthState(auth);

  const pathname = usePathname();

  if (pathname === "/auth") {
    return null;
  }


  return (
    <div className="fixed top-0 max-w-full inset-x-0 h-fit bg-[#FFFFFF] dark:bg-[#020817] border-b border-zinc-300 z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        {/* logo */}
        <div className=" flex gap-[1.7rem]">
          <Link href="/" className="flex gap-2 items-center">
            <p className="hidden text-zinc-700 dark:text-emerald-100 text-xl font-bold md:block">
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
          {/* <Input className=" pl-10 w-[40rem]" placeholder="Search" /> */}
          <input type="text" 
            value={searchText}
            onChange={handleSearchText} 
            placeholder="Search" 
            className="w-[30rem] text-sm border border-gray-300 rounded-md p-2 pl-8" 
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  dispatch(triggerSearch());
                }
            }}
          />
          <Search className=" absolute left-2 top-1/2 transform text-gray-400 -translate-y-1/2 h-4 w-4" />
        </div>

        <div>
        <Button className="rounded-full h-9 bg-slate-500 font-semibold">Ask Question</Button>
        </div>

        <div className="flex gap-4">
          {/* <ThemeToggler className=" mr-4" /> Theme option added on dropdown menu  */}

          {(user) ? (<div>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Avatar className='cursor-pointer'>
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
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>{user.displayName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
              <Link href="/profilePage">
                <DropdownMenuItem>
                
                  Profile
                
                </DropdownMenuItem>
                </Link>
                
                <Link href="">
                <DropdownMenuItem>
                  Settings
                </DropdownMenuItem>
                </Link>
                <div className="mt-1 ml-2 mb-2">
                <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" onCheckedChange={toggleTheme} checked={theme==='dark'}/>
      <Label htmlFor="airplane-mode">Dark Mode</Label>
    </div>
                </div>
                </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => auth.signOut()}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
            {/* Old comp */}
            {/* <Link href="/profilePage">
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
            </Link> */}
            </div>
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
