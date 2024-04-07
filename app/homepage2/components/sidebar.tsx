import { cn } from "@/lib/utils"
import { Button } from "../../../components/ui/button"
import { ScrollArea } from "../../../components/ui/scroll-area"

import { Playlist } from "../data/playlists"
import { current } from "@reduxjs/toolkit"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  playlists: Playlist[],
  selectChange: Function,
  currentC: string
}

export function Sidebar({ className, playlists, selectChange, currentC }: SidebarProps) {

  //console.log("LS: ", selectChange);
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-1 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="space-y-1">
            <Button onClick={()=>{selectChange("all")}} variant={`${currentC=="all"?"secondary":"ghost"}`} className="w-full justify-start">
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
            <Button onClick={()=>{selectChange("How To")}} variant={`${currentC=="How To"?"secondary":"ghost"}`} className="w-full justify-start">
              How To
            </Button>
            <Button onClick={()=>{selectChange("Help")}} variant={`${currentC=="Help"?"secondary":"ghost"}`} className="w-full justify-start">
              Help
            </Button>
            <Button onClick={()=>{selectChange("Mystery/Haunted/Ghost")}} variant={`${currentC=="Mystery/Haunted/Ghost"?"secondary":"ghost"}`} className="w-full justify-start">
            Mystery/Haunted/Ghost
            </Button>
            <Button onClick={()=>{selectChange("Astrology/Remedies/Occult")}} variant={`${currentC=="Astrology/Remedies/Occult"?"secondary":"ghost"}`} className="w-full justify-start">
            Astrology/Remedies/Occult
            </Button>
            <Button onClick={()=>{selectChange("GemStones/Rudraksha")}} variant={`${currentC=="GemStones/Rudraksha"?"secondary":"ghost"}`}className="w-full justify-start">
            GemStones/Rudraksha
            </Button>
          </div>
        </div>
        <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight">
            Playlists
          </h2>
          <ScrollArea className="h-[300px] px-1">
            <div className="space-y-1 p-2">
              {playlists?.map((playlist, i) => (
                <Button
                  key={`${playlist}-${i}`}
                  variant="ghost"
                  className="w-full justify-start font-normal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M21 15V6" />
                    <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                    <path d="M12 12H3" />
                    <path d="M16 6H3" />
                    <path d="M12 18H3" />
                  </svg>
                  {playlist}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}