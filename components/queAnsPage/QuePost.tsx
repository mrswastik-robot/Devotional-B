"use client";

import React, { useRef , useState , useEffect } from "react";

import parse from "html-react-parser";

import { MessageSquare } from "lucide-react";
import { Share } from "lucide-react";
import { Bookmark } from "lucide-react";

import Link from "next/link";
import Image from "next/image";

import PostVoteClient from "@/components/post-vote/PostVoteClient";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

import { formatTimeToNow } from "@/lib/date";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import PostVoteClientPhone from "../post-vote/PostVoteClientPhone";

import { auth } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { db } from "@/utils/firebase";
import { doc, getDoc, updateDoc , arrayRemove, arrayUnion } from "firebase/firestore";

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
  };
  // id: string
};

const QuePost = ({ post }: Props) => {

  const { toast } = useToast();

  //to send userId in postvoteclient for voting system
  const [user] = useAuthState(auth);
  
  const pRef = useRef<HTMLDivElement>(null);

  const isAnonymous = post.anonymity;

  //handling the saving Post functionality
  //saving the post funcitonality
  const [savedState , setSavedState] = useState(false);

  const handleSave = async() => {

    if(!user)
    {
      toast({
        title:' Please sign in to save posts ',
        variant:'destructive',
      })
      return;
    }
    
      const userRef = doc(db , 'users' , user.uid);
    

    if(savedState)
    {
      //post is currently saved remove it from saved posts
      await updateDoc(userRef , {
        savedPosts: arrayRemove(post.id)
      })
      toast({
        title:' Post removed from saved ',
        variant:'default',  
      })
    }else{
      //post is currently not saved add it to saved posts
      await updateDoc(userRef , {
        savedPosts: arrayUnion(post.id),
      })
      toast({
        title:' Post saved ',
        variant:'default',
      })
    }


      setSavedState(!savedState);
  }

  //fetching savedPosts from user's document
  useEffect(() => {
    const fetchUser = async () => {
      if(!user) return;
        const userRef = doc(db, 'users', user.uid); // Replace 'user.uid' with the actual user ID
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.savedPosts.includes(post.id)) {
                setSavedState(true);
            }
        }
    };

    fetchUser();
}, [post.id , user ]);

  return (
    <div className="rounded-md bg-white dark:bg-[#262626] shadow break-words overflow-hidden">
      <div className="px-6 md:py-6 py-4 flex justify-between">
        {/* <PostVoteClient
        //   postId={post.id}
        //   initialVotesAmt={_votesAmt}
        //   initialVote={_currentVote?.type}
        /> */}

        <div className="w-0 flex-1">
          <div className="flex max-h-60 mt-1 space-x-3 text-xs text-gray-500">
            {/* <div> */}
            <Avatar>
              <div className=" relative w-full h-full aspect-square">
                <Image
                  fill
                  src={isAnonymous ? ('https://qph.cf2.quoracdn.net/main-qimg-73e139be8bfc1267eeed8ed6a2802109-lq') : (post.profilePic)}
                  alt="profile picture"
                  referrerPolicy="no-referrer"
                />
              </div>
              <AvatarFallback>SP</AvatarFallback>
            </Avatar>
            {/* </div> */}
            {/* <Separator orientation="vertical" className=" h-5 mt-3 " /> */}
            <span className=" mt-3">{isAnonymous ? ('Anonymous') : (post.name)}</span>{" "}
            <svg
              viewBox="0 0 48 48"
              className=" mt-4 w-2 h-2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M24 36C30.6274 36 36 30.6274 36 24C36 17.3725 30.6274 12 24 12C17.3726 12 12 17.3725 12 24C12 30.6274 17.3726 36 24 36Z"
                  fill="#333333"
                ></path>{" "}
              </g>
            </svg>
            <Button variant="ghost" className=" text-blue-500 text-xs p-0">
              Follow
            </Button>
            {/* {formatTimeToNow(new Date(post.createdAt))} */}
          </div>
          {/* <a href={`/postPage/${post.id}`}> */}
            <h1 className="text-2xl font-semibold py-3 leading-6 text-gray-900 dark:text-white">
              {post.title}
            </h1>
          {/* </a> */}

          {post.questionImageURL ? (
            <div className="relative w-full h-[400px]">
              <Image
                src={post.questionImageURL}
                className="rounded-md"
                alt="question image"
                layout="fill"
                objectFit="contain"
              />
            </div>
          ) : null}

          <div
            className="relative text-base max-h-50 w-full  "
            ref={pRef}
          >
            {/* <EditorOutput content={post.content} /> */}
            <p className="ProseMirror">{post.description ? parse(post.description) : ""}</p>
            {/* <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white/80 dark:from-[#262626] to-transparent'></div> */}
            {/* {pRef.current?.clientHeight === 160 ? (
              // blur bottom if content is too long
              
            ) : null} */}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-[#1A1A1B]/65 z-20  flex justify-between gap-x-3 text-sm px-4 py-2 sm:px-6">

        <PostVoteClientPhone postId={post.id} postType="questions" userId={user?.uid!}/>

        <div className=" flex gap-x-3">
          <button
            className="w-fit flex items-center gap-2"
          >
            <Share className="h-4 w-4" /> <span className=' sm:block hidden'>Share</span>
          </button>
          <button
            className="w-fit flex items-center gap-2"
            onClick={handleSave}
          >
            <Bookmark className={cn("h-4 w-4", {" text-black fill-black" : savedState == true,})} />{" "}
            {savedState ? (<span className=" sm:block hidden">Saved</span>) : (<span className=" sm:block hidden">Save</span>)}
          </button>
        </div>
        
        
      </div>
    </div>
  );
};

export default QuePost;
