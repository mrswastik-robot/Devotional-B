"use client";

import React, { useState } from "react";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

type Props = {};

const PostVoteClientPhone = (props: Props) => {
  const [currentVote, setCurrentVote] = useState<"UP" | "DOWN" | null>(null);
  const [votesAmt, setVotesAmt] = useState<number>(0);

  const vote = (type: "UP" | "DOWN") => {
    if (currentVote === type) {
      setCurrentVote(null);
      setVotesAmt(type === "UP" ? votesAmt - 1 : votesAmt + 1);
    } else if (currentVote === null) {
      setCurrentVote(type);
      setVotesAmt(type === "UP" ? votesAmt + 1 : votesAmt - 1);
    } else {
      setCurrentVote(type);
      setVotesAmt(type === "UP" ? votesAmt + 2 : votesAmt - 2);
    }
  };

  return (
    <div className=" flex gap-1 border border-1 dark:border-zinc-400 border-zinc-400 rounded-3xl">
      {/* upvote */}
      <Button
        onClick={() => vote("UP")}
        size="sm"
        variant="votingPhoen"
        aria-label="upvote"
      >
        <ArrowBigUp
          className={cn("h-5 w-5 text-zinc-700 dark:text-white", {
            "text-emerald-500 fill-emerald-500": currentVote === "UP",
          })}
        />
        <p className=" text-sm text-zinc-500 ml-2 hover:text-zinc-700">Support</p>
      {/* <Separator orientation="vertical" className=" h-7 my-1 ml-2 dark:text-zinc-400 text-zinc-500"/> */}

      </Button>


      {/* score */}
      <p className="text-center py-2 font-medium text-sm text-zinc-900 dark:text-white">
        {votesAmt}
      </p>



      {/* downvote */}
      <Button
        onClick={() => vote("DOWN")}
        size="sm"
        className={cn({
          "text-emerald-500": currentVote === "DOWN",
        })}
        variant="votingPhoen"
        aria-label="downvote"
      >
      <Separator orientation="vertical" className=" h-7 my-1 mr-2 dark:text-zinc-400"/>
        <ArrowBigDown
          className={cn("h-5 w-5 text-zinc-700 dark:text-white", {
            "text-red-500 fill-red-500": currentVote === "DOWN",
          })}
        />
      </Button>
    </div>
  );
};

export default PostVoteClientPhone;
