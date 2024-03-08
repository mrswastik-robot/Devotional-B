"use client";

import React, { useState, useRef, useEffect } from "react";

import parse from "html-react-parser";

import { MessageSquare } from "lucide-react";
import { Share } from "lucide-react";
import { Bookmark } from "lucide-react";
import ShareDialog from "./ShareDialog";
// import { Trash2 } from "lucide-react";
import { AiTwotoneDelete } from "react-icons/ai";

import Link from "next/link";
import Image from "next/image";

import PostVoteClient from "./post-vote/PostVoteClient";
import PostVoteClientPhone from "./post-vote/PostVoteClientPhone";
import { Avatar, AvatarFallback } from "./ui/avatar";

import { formatTimeToNow } from "@/lib/date";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

import { auth, db } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { useToast } from "./ui/use-toast";
import { cn } from "@/lib/utils";
import {
  arrayRemove,
  arrayUnion,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

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
    // ansNumbers: number
  };
  // children: Element
  // id: string
  isProfile?: boolean;
  handleDelete?: Function;
};

const Post = ({ post, isProfile = false, handleDelete = () => {} }: Props) => {
  const pRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();

  const isAnonymous = post.anonymity;
  const [isExpanded , setIsExpanded] = useState(false);

  //needed to send it to PostVoteClientPhone so that it can get the current user's vote
  const [user, loading] = useAuthState(auth);

  //saving the post funcitonality
  const [savedState, setSavedState] = useState(false);

  const HandleDelete = () => {
    handleDelete(post.id);
  };

  const handleSave = async () => {
    if (!user) {
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

  //fetching savedPosts from user's document
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

  return (
    <div className="rounded-md bg-white dark:bg-[#262626] shadow my-1">
      <div className="px-6 py-4 flex justify-between">
        {/* <PostVoteClient
        //   postId={post.id}
        //   initialVotesAmt={_votesAmt}
        //   initialVote={_currentVote?.type}
        /> */}

        {/* <PostVoteClientPhone/> */}

        <div className="w-0 flex-1 break-normal overflow-hidden">
          <div className="flex max-h-40 mt-1 space-x-2 text-xs text-gray-500">
            {/* <div> */}
            <Avatar>
              <div className=" relative w-full h-full aspect-square">
                <Image
                  fill
                  src={
                    isAnonymous
                      ? "https://e7.pngegg.com/pngimages/416/62/png-clipart-anonymous-person-login-google-account-computer-icons-user-activity-miscellaneous-computer.png"
                      : post.profilePic
                  }
                  alt="profile picture"
                  referrerPolicy="no-referrer"
                />
              </div>
              <AvatarFallback>SP</AvatarFallback>
            </Avatar>
            {/* </div> */}
            {/* <Separator orientation="vertical" className=" h-5 mt-4 " /> */}
            <span className=" mt-3">
              {isAnonymous ? "Anonymous" : post.name}
            </span>{" "}
            {isAnonymous ? null : (
              <div className=" flex space-x-2 ">
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

                <Button
                  variant="ghost"
                  className=" text-blue-500 text-xs mt-0 p-0"
                  onClick={() => {
                    toast({
                      title: " Feature coming soon ... ",
                      variant: "feature",
                    });
                  }}
                >
                  Follow
                </Button>
              </div>
            )}
            {/* {formatTimeToNow(new Date(post.createdAt))} */}
          </div>
          <Link href={`/postPage2/${post?.title?.split(" ").join("-")}`}>
            <h1 className={`text-lg font-semibold py-2 leading-6 text-gray-900 dark:text-white ${isExpanded ? 'hover:underline' : ''}`}>
              {post.title}
            </h1>
          </Link>

          {post.questionImageURL ? (
            <div className="relative w-full h-60">
              <Image
                src={post.questionImageURL}
                layout="fill"
                objectFit="cover"
                alt="post image"
              />
            </div>
          ) : null}

          <div
            className={`relative text-sm max-h-20 w-full overflow-clip ${isExpanded ? 'max-h-none': '' }`}
            ref={pRef}
          >
            {/* <EditorOutput content={post.content} /> */}
            <p>{parse(post.description)}</p>
            {isExpanded ? '' : <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white/95 dark:from-[#262626] to-transparent"></div> }
            {/* {pRef.current?.clientHeight === 160 ? (
              // blur bottom if content is too long
              
            ) : null} */}
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 w-full text-right">
                <button className=" text-blue-500/80 hover:underline" onClick={() => setIsExpanded(true)}>(more)</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-[#1A1A1B]/65 z-20 border border-t-gray-150 flex justify-between  gap-x-3 text-sm px-4 py-2  sm:px-6">
        {/* <div className=' sm:block md:hidden '> */}
        <PostVoteClientPhone
          postId={post.id}
          postType="questions"
          userId={user?.uid!}
        />
        {/* </div> */}

        <div className=" flex gap-x-3">
          <Link
            href={`/postPage2/${post?.title?.split(" ").join("-")}`}
            className="w-fit flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />{" "}
            <span className=" sm:block hidden">{post.comments} Answers</span>
          </Link>
          <button className="w-fit flex items-center gap-2">
            <ShareDialog
              postLink={`/postPage2/${post?.title?.split(" ").join("-")}`}
            />
          </button>
          <button
            className="w-fit flex items-center gap-2"
            onClick={handleSave}
          >
            <Bookmark
              className={cn("h-4 w-4", {
                " text-black fill-black": savedState == true,
              })}
            />{" "}
            {savedState ? (
              <span className=" sm:block hidden">Saved</span>
            ) : (
              <span className=" sm:block hidden">Save</span>
            )}
          </button>
          {isProfile && (
            <button
              className="w-fit flex items-center gap-2"
              onClick={HandleDelete}
            >
              <AiTwotoneDelete className="text-xl" />{" "}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
