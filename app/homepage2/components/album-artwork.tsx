import Image from "next/image"
import { Bookmark, PlusCircleIcon } from "lucide-react"
import FImage from "../../../public/flowers-7455009_1280.jpg"

import parse from "html-react-parser";

import { cn } from "@/lib/utils"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "../../../components/ui/context-menu"

import { auth, db } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useToast } from "@/components/ui/use-toast";

import { Album } from "../data/albums"
import { playlists } from "../data/playlists"
import Link from "next/link";
import { useEffect, useState } from "react";
import { Timestamp, arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  album: Album
  aspectRatio?: "portrait" | "square"
  width?: number
  height?: number
}

type Props = {
    post: {
      id: string;
      title: string;
      description: string;
      eventImageURL: string;
      dateOfEvent: Timestamp;
      locationOfEvent: string;
      durationOfEvent: number;
      registrationLink: string;
      uid: string;
      createdAt: string;
      category: Array<string>;
      name: string;
      profilePic: string;
    };
    // children: Element
    // id: string
    isProfile?: boolean;
    handleDelete?: Function;
  };

export function AlbumArtwork({ post, isProfile = false, handleDelete = () => {} }: Props) {

  const [savedState, setSavedState] = useState(false);
  const [user, loading] = useAuthState(auth);
  const {toast} = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const savedEvents = userData.savedEvents;

        // If the post is in the savedPosts array, set savedState to true
        if (savedEvents.includes(post.id)) {
          setSavedState(true);
        } else {
          // If the post is not in the savedPosts array, set savedState to false
          // unless it's the recently saved post (post.id === savedPostId)
          // setSavedState(post.id === savedPostId);
        }
      }
    };

    fetchUser();
  }, [post.id, user]);

  const handleSave = async () => {
    if (!user||user.isAnonymous==true) {
      toast({
        title: " Please sign in to save posts ",
        variant: "destructive",
      });
      return;
    }

    const userRef = doc(db, "users", user.uid);

    if (savedState) {
      //post is currently saved remove it from saved posts
      await updateDoc(userRef, {
        savedEvents: arrayRemove(post.id),
      });
      toast({
        title: " Event removed from saved ",
        variant: "default",
      });
    } else {
      //post is currently not saved add it to saved posts
      await updateDoc(userRef, {
        savedEvents: arrayUnion(post.id),
      });
      toast({
        title: " Event saved ",
        variant: "default",
      });
    }

    setSavedState(!savedState);
  };

  // let dateString;
  // if (post.dateOfEvent) {
  // const date = post.dateOfEvent.toDate();
  // dateString = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  // }

    //console.log("Post: ", post)
  return (
    <div className="shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] hover:shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] h-[21.1rem] w-[19.5rem] pl-[0.52rem] rounded-md pt-1 transition-all duration-300">
    <div className="lg:w-[18.5rem] w-[full] lg:h-[8.1rem] h-[7.7rem]">
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-hidden rounded-md relative h-[10.15rem] w-[18.49rem]">
            {
            post.eventImageURL== null ?    
            <Image
              src={FImage}
              alt="QuestionImage"
              width={900}
              height={500}
              className={cn(
                "h-auto w-auto object-cover transition-all hover:scale-105",
              )}
            />:
            <Image
              src={post.eventImageURL}
              alt="QuestionImage"
              width={900}
              height={500}
              className={cn(
                "h-auto w-auto object-cover transition-all hover:scale-105",
              )}
            />
            }
            <div className='absolute bottom-[0.6rem] right-[0.1rem]'>
            <button
            className="w-fit flex items-center gap-2"
            onClick={handleSave}
          >
            <Bookmark
              className={cn("h-4 w-4 text-white", {
                " text-white fill-white": savedState == true,
              })}
            />{" "}
            {savedState ? (
              <span className=" sm:block hidden font-dmsans"></span>
            ) : (
              <span className=" sm:block hidden font-dmsans"></span>
            )}
          </button>
          </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-40">
          <ContextMenuItem>Save Post</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Like</ContextMenuItem>
          <ContextMenuItem>Share</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <div className="mt-3 text-sm">
      <Link href={`/EventDetailsPage/${encodeURIComponent(post?.title?.split(" ").join("-"))}`}>
        <h3 className="text-[17px] font-bold leading-none">{post.title.length>28?post.title.substring(0, 27)+"...":post.title}</h3>
      </Link>  
      {/* {dateString && <div className="mt-[0.30rem] text-[14px] text-red-600 font-semibold">{dateString}</div>} */}
      <div className="mt-[0.30rem] text-[14px] font-semibold opacity-85">{post.locationOfEvent}</div>
      <div className="hidden lg:block">
        {
        <p className="mt-[0.30rem] overflow-hidden opacity-85 line-clamp-2 text-[15px]">{parse(`${post.description.length>84?post.description.substring(0, 83)+"...":post.description}`)}</p>
}
        </div>
        <div className="pt-[0.6rem]">
          {
            post?.category?.slice(0, 2).map((category, index)=>(
              <Button key={index} className=' bg-[#F1F2F2] text-black hover:text-white rounded-3xl h-[1.7rem] mr-[0.4rem]'>
                            {category}
                            </Button>
            ))
}                 
        </div>
      </div>
    </div>
    </div>
  )
}