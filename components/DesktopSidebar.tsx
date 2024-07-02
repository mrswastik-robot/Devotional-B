import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { setCategoryQ, categoryQ } from "@/store/slice";
import { auth, storage } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";

// import { Playlist } from "../data/playlists"

type Playlist = [
  "Recently Added",
  "Recently Played",
  "Top Songs",
  "Top Albums",
  "Top Artists",
  "Logic Discography",
  "Bedtime Beats",
  "Feeling Happy",
  "I miss Y2K Pop",
  "Runtober",
  "Mellow Days",
  "Eminem Essentials"
];

import { current } from "@reduxjs/toolkit";
import { use, useEffect, useState } from "react";
import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import Loader from "@/components/ui/Loader";
import { setCategoryE, categoryE, change, setChange } from "@/store/slice";
import { useSelector, useDispatch } from "react-redux";
import { store } from "@/store/store";
import { PlusCircleIcon } from "lucide-react";
import { Separator } from "./ui/separator";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  playlists: Playlist[];
}

export function Sidebar({ className, playlists }: SidebarProps) {
  const sidebarCategory = [
    "Afterlife",
    "Astrology/Remedies/Occult",
    "Death",
    "Festivals",
    "GemStones/Rudraksha",
    "Help",
    "How to",
    "Meditation",
    "Miracles and Spirituality",
    "Mystery/Haunted/Ghost",
    "Mythology",
    "Religious Text",
    "Rituals",
    "Science and Religion",
    "Worship",
  ];
  const categoryPosts = useSelector(categoryQ);
  const [user, loading] = useAuthState(auth);
  const dispatch = useDispatch();

  const selectChange = (category: any) => {
    dispatch(setCategoryQ(category));
  };

  const [forums, setForums] = useState<any>([]);

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const forumsCollection = collection(db, "forums");
        const forumsSnapshot = await getDocs(forumsCollection);

        const forumsData: any = [];
        forumsSnapshot.forEach((doc) => {
          // Assuming each forum document has fields like title, description, etc.
          const forumDetails = {
            uniqueForumName: doc.data().uniqueForumName,
            title: doc.data().name,
            description: doc.data().description,
            // Add other fields as needed
          };
          forumsData.push(forumDetails);
        });

        setForums(forumsData);
      } catch (error) {
        console.error("Error fetching forums:", error);
      }
    };

    fetchForums();
  }, []);

  return (
    <div>
      <div
        className={cn(
          "pb-1 rounded-lg lg:top-[69px] max-h-[39rem] dark:bg-[#262626] bg-[#ffffff] shadow-[0px_0px_0px_1px_rgba(8,112,184,0.06),0px_1px_1px_-0.5px_rgba(8,112,184,0.06),0px_3px_3px_-1.5px_rgba(8,112,184,0.06),_0px_6px_6px_-3px_rgba(8,112,184,0.06),0px_12px_12px_-6px_rgba(8,112,184,0.06),0px_24px_24px_-12px_rgba(8,112,184,0.06)]",
          className
        )}
      >
        <div className="space-y-4 py-4">
          <div className=" py-2">
            <h2 className="mb-2 px-7 text-[20px] font-bold tracking-tight">
              Categories
            </h2>
            <Command className="dark:bg-[#262626]">
              <CommandInput className="" placeholder="Search..." />
              <CommandList>
                <CommandEmpty>No results found</CommandEmpty>
                <CommandGroup>
                  <Button
                    onClick={() => {
                      selectChange("all");
                    }}
                    variant={`${
                      categoryPosts == "all" ? "secondary" : "ghost"
                    }`}
                    className="w-full px-7 justify-start"
                  >
                    <CommandItem>All</CommandItem>
                  </Button>
                </CommandGroup>
                <ScrollArea className="h-[250px] px-1">
                <div>
                  {sidebarCategory ? (
                    sidebarCategory.map((categoryD: any, index: any) => (
                      <CommandGroup key={index}>
                        <div
                          onClick={() => {
                            selectChange(categoryD);
                          }}
                          // variant={`${
                          //   categoryPosts == categoryD ? "secondary" : "ghost"
                          // }`}
                          className="w-full px-4 py-[1px] justify-start cursor-pointer"
                        >
                          <CommandItem ><div className="text-black dark:text-white">{categoryD}</div></CommandItem>
                          <Separator />
                        </div>
                      </CommandGroup>
                    ))
                  ) : (
                    <div>
                      <Loader />
                    </div>
                  )}
                </div>
                </ScrollArea>
              </CommandList>
            </Command>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "py-[14px] bt-1 border-black rounded-lg bg-[#ffffff] dark:bg-[#262626] mt-[30px] shadow-[0px_0px_0px_1px_rgba(8,112,184,0.06),0px_1px_1px_-0.5px_rgba(8,112,184,0.06),0px_3px_3px_-1.5px_rgba(8,112,184,0.06),_0px_6px_6px_-3px_rgba(8,112,184,0.06),0px_12px_12px_-6px_rgba(8,112,184,0.06),0px_24px_24px_-12px_rgba(8,112,184,0.06)]",
          className
        )}
      >
        <h2 className="relative px-7 font-bold tracking-tight flex items-center justify-between">
          <h2 className="text-[20px]">Forums</h2>
          <Link href="/createForum">
            <span>
              <PlusCircleIcon />
            </span>
          </Link>
        </h2>
        <ScrollArea className="h-[150px] px-1">
          <div className="space-y-1 p-2">
            {forums ? (
              forums.map((forum: any, index: any) => (
                <div key={index}>
                  <div className="w-full justify-start px-4 py-2 text-base">
                    <Link href={`/forums/${forum.uniqueForumName}`}>
                      {forum.title}
                    </Link>
                  </div>
                  <Separator />
                </div>
              ))
            ) : (
              <div>
                <Loader />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
