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
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";

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
      dateOfEvent: string;
      locationOfEvent: string;
      durationOfEvent: number;
      registrationLink: string;
      uid: string;
      createdAt: string;
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
        const savedPosts = userData.savedPosts;

        // If the post is in the savedPosts array, set savedState to true
        if (savedPosts.includes(post.id)) {
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
        savedPosts: arrayRemove(post.id),
      });
      toast({
        title: " Post removed from saved ",
        variant: "default",
      });
    } else {
      //post is currently not saved add it to saved posts
      await updateDoc(userRef, {
        savedPosts: arrayUnion(post.id),
      });
      toast({
        title: " Post saved ",
        variant: "default",
      });
    }

    setSavedState(!savedState);
  };
    //console.log("Post: ", post)
  return (
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
        <h3 className="text-lg font-semibold leading-none">{post.title}</h3>
      </Link>  
      <div className="hidden lg:block">
        {
        <p className="text-sm mt-[0.30rem] overflow-hidden line-clamp-2 mb-8">{parse(`${post.description.length>65?post.description.substring(0, 64)+"...":post.description}`)}</p>
}
        </div>
      </div>
    </div>
  )
}