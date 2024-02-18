"use client";





import React, { useState } from "react";

import { postData } from "@/lib/data";
import QuePost from "@/components/queAnsPage/QuePost";
import { Tiptap as TipTap } from "@/components/TipTap";
import AnsPost from "@/components/queAnsPage/AnsPost";
import RecentFeed from "@/components/queAnsPage/RecentFeed";


type Props = {
  params: {
    postId: string;
  };
};

const PostPage = ({ params: { postId } }: Props) => {
  // console.log(params.postId)
  const queObject = postData.filter((post) => post.id === postId)[0];

  const [description, setDescription] = useState("");

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-7 gap-y-4 md:gap-x-4 pb-6">

      <div className=" md:col-span-5 ">
        <div>
          <QuePost post={queObject} />
        </div>

        {/* TipEditor */}
        <div>
          <TipTap setDescription={setDescription} />
        </div>

        {/* Answers to the question */}
        <div>
          <AnsPost answers={queObject?.answers} />
        </div>
      </div>

      <div className=" col-span-2 overflow-hidden h-fit rounded-lg border border-gray-300 order-first md:order-last">
        <RecentFeed />
      </div>
    </div>
  );
};

export default PostPage;
