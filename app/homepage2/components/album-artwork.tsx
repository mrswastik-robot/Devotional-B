import Image from "next/image"
import { PlusCircleIcon } from "lucide-react"
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

import { Album } from "../data/albums"
import { playlists } from "../data/playlists"
import Link from "next/link";

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
      name: string;
      description: string;
      profilePic: string;
      postImage: string;
      likes: number;
      comments: number;
      shares: number;
      questionImageURL: string;
      createdAt: string;
      anonymity: boolean;
      uid: string; // User ID of the post creator
      // ansNumbers: number
    };
    // children: Element
    // id: string
    isProfile?: boolean;
    handleDelete?: Function;
  };

export function AlbumArtwork({ post, isProfile = false, handleDelete = () => {} }: Props) {

    //console.log("Post: ", post)
  return (
    <div className="lg:w-[23rem] w-[full] lg:h-40 h-[7.2rem]">
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-hidden rounded-md">
            {
            post.questionImageURL==undefined?    
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
              src={post.questionImageURL}
              alt="QuestionImage"
              width={900}
              height={500}
              className={cn(
                "h-auto w-auto object-cover transition-all hover:scale-105",
              )}
            />
            }
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
      <Link href={`/${encodeURIComponent(post?.title?.split(" ").join("-"))}`}>
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