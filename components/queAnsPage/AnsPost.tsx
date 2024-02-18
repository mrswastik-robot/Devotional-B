import React, { useRef } from "react";

import { MessageSquare } from "lucide-react";
import { Share } from "lucide-react";
import { Bookmark } from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import PostVoteClient from "@/components/post-vote/PostVoteClient";

type Props = {
  answers: {
    // id: string;
    name: string;
    profilePic: string;
    // postImage: string;
    // title: string;
    description: string;
    likes: number;
    comments: number;
    shares: number;
  }[];
};

const AnsPost = ({ answers }: Props) => {
  const pRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      {answers.map((answer: any, key) => (
        <div
          key={answer.id}
          className="rounded-md bg-white dark:bg-[#262626] shadow mt-7 space-y-4" 
        >
          <div className="px-6 py-5 flex justify-between">
            <PostVoteClient
            //   postId={post.id}
            //   initialVotesAmt={_votesAmt}
            //   initialVote={_currentVote?.type}
            />

            <div className="w-0 flex-1">
              <div className="flex max-h-40 mt-1 space-x-3 text-xs text-gray-500">
                {/* <div> */}
                <Avatar>
                  <div className=" relative w-full h-full aspect-square">
                    <Image
                      fill
                      src={answer.profilePic}
                      alt="profile picture"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <AvatarFallback>SP</AvatarFallback>
                </Avatar>
                {/* </div> */}
                <Separator orientation="vertical" className=" h-5 mt-4 " />
                <span className=" mt-4">{answer.name}</span>{" "}
                <svg
                  viewBox="0 0 48 48"
                  className=" mt-5 w-2 h-2"
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
                  className=" text-blue-500 text-sm mt-1 p-0"
                >
                  Follow
                </Button>
                {/* {formatTimeToNow(new Date(post.createdAt))} */}
              </div>
              {/* <a href={`/postPage/${answer.id}`}>
                <h1 className="text-3xl font-semibold py-2 leading-6 text-gray-900 dark:text-white">
                  {answer.title}
                </h1>
              </a> */}

              <div
                className="relative text-lg max-h-40 w-full overflow-clip"
                ref={pRef}
              >
                {/* <EditorOutput content={post.content} /> */}
                <p>{answer.description}</p>
                {/* <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white/80 dark:from-[#262626] to-transparent'></div> */}
                {/* {pRef.current?.clientHeight === 160 ? (
              // blur bottom if content is too long
              
            ) : null} */}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-[#1A1A1B]/65 z-20 items-end flex justify-end gap-x-3 text-sm px-4 py-4 sm:px-6">
            <Link
              href={`/postPage/${answer.id}`}
              className="w-fit flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" /> {5} comments
            </Link>
            <Link
              href={`/r/post/${answer.id}`}
              className="w-fit flex items-center gap-2"
            >
              <Share className="h-4 w-4" /> Share
            </Link>
            <Link
              href={`/r/post/${answer.id}`}
              className="w-fit flex items-center gap-2"
            >
              <Bookmark className="h-4 w-4" /> Save
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
export default AnsPost;
