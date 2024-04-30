import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { setCategoryQ, categoryQ } from "@/store/slice";

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
  "Eminem Essentials",
]

import { current } from "@reduxjs/toolkit"
import { use, useEffect, useState } from "react"
import { db } from "@/utils/firebase"
import { collection, getDocs } from "firebase/firestore"
import Loader from "@/components/ui/Loader"
import { setCategoryE, categoryE, change, setChange } from "@/store/slice";
import { useSelector, useDispatch } from "react-redux"
import { store } from "@/store/store"
import { PlusCircleIcon } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  playlists: Playlist[],
}

export function Sidebar({ className, playlists }: SidebarProps) {

  const sidebarCategory = ["Afterlife", "Astrology/Remedies/Occult", "Death", "Festivals", "GemStones/Rudraksha", "Help", "How to", "Meditation", "Miracles and Spirituality", "Mystery/Haunted/Ghost", "Mythology", "Religious Text", "Rituals", "Science and Religion", "Worship"]
  const categoryPosts = useSelector(categoryQ);
  const dispatch = useDispatch();

  const selectChange = (category: any)=>{
      dispatch(setCategoryQ(category));
  }

  return (
    <div className={cn("pb-1 border border-gray-300 rounded-lg sticky lg:top-[4.2rem] max-h-[40rem] bg-[#ffffff]", className)}>
      <div className="space-y-4 py-4">
        <div className="px-1 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Categories
          </h2>
          <ScrollArea className="h-[350px] px-1">
          <div className="space-y-1">
            <Button onClick={()=>{selectChange("all")}} variant={`${categoryPosts=="all"?"secondary":"ghost"}`} className="w-full justify-start">
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg> */}
              All
            </Button>
            <div>
              {
                sidebarCategory?
                sidebarCategory.map((categoryD:any, index:any)=>(
                  <div key={index}>
                    <Button onClick={()=>{selectChange(categoryD)}} variant={`${categoryPosts==categoryD?"secondary":"ghost"}`} className="w-full justify-start">
                      {categoryD}
                    </Button>
                  </div>
                )):
                <div><Loader/></div>
              }
            </div>
            {/* <Button onClick={()=>{selectChange("How To")}} variant={`${currentC=="How To"?"secondary":"ghost"}`} className="w-full justify-start">
              How To
            </Button>
            <Button onClick={()=>{selectChange("Help")}} variant={`${currentC=="Help"?"secondary":"ghost"}`} className="w-full justify-start">
              Help
            </Button>
            <Button onClick={()=>{selectChange("Mystery|Haunted|Ghost")}} variant={`${currentC=="Mystery/Haunted/Ghost"?"secondary":"ghost"}`} className="w-full justify-start">
            Mystery/Haunted/Ghost
            </Button>
            <Button onClick={()=>{selectChange("Astrology|Remedies|Occult")}} variant={`${currentC=="Astrology/Remedies/Occult"?"secondary":"ghost"}`} className="w-full justify-start">
            Astrology/Remedies/Occult
            </Button>
            <Button onClick={()=>{selectChange("GemStones|Rudraksha")}} variant={`${currentC=="GemStones/Rudraksha"?"secondary":"ghost"}`}className="w-full justify-start">
            GemStones/Rudraksha
            </Button> */}
          </div>
          </ScrollArea>
        </div>
        <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight">
            Forums
          </h2>
          <ScrollArea className="h-[300px] px-1">
            <div className="space-y-1 p-2">
              {
                <Button
                  className="w-full flex items-center justify-center gap-3"
                >
                  <PlusCircleIcon/>
                  Create Forum
                </Button>}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}