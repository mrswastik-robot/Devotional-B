import Image from "next/image";
import React from "react";
import { Separator } from "../ui/separator";

type Props = {
  post: {
    title: string;
    image: string;
    points: number;
    comments: number;
    date: string;
  };
};

const RecentFeedCard = ({ post }: Props) => {
  return (
    <div className="">
        <Separator className=" my-1" />
      <div className="flex gap-4 items-center">
        <div className="w-[5rem] h-[4rem] rounded-lg overflow-hidden">
          <Image
            // src={post.image}
            src='/oppenheimer.jpg'
            alt="fetch error"
            width={200}
            height={150}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="  ">
          <h3 className="font-medium text-lg">{post.title}</h3>
          <div className="text-sm flex gap-1 ">
            <p className="text-zinc-500">{post.points} points</p>
            <svg viewBox="0 0 48 48" className=" mt-1 w-3 h-3" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M24 36C30.6274 36 36 30.6274 36 24C36 17.3725 30.6274 12 24 12C17.3726 12 12 17.3725 12 24C12 30.6274 17.3726 36 24 36Z" fill="#333333"></path> </g></svg>
            <p className="text-zinc-500">{post.comments} comments</p>
            {/* <p className='text-zinc-500'>{post.date}</p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentFeedCard;