"use client";

import React, { useEffect, useState } from "react";

import { postData } from "@/lib/data";
import QuePost from "@/components/queAnsPage/QuePost";
import { Tiptap as TipTap } from "@/components/TipTap";
import AnsPost from "@/components/queAnsPage/AnsPost";
import RecentFeed from "@/components/queAnsPage/RecentFeed";

import { db } from "@/utils/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { get } from "http";


type Props = {
  params: {
    postId: string;
  };

  // post: {
  //   id: string;
  //   title: string;
  //   name: string;
  //   description: string;
  //   profilePic: string;
  //   postImage: string;
  //   likes: number;
  //   comments: number;
  //   shares: number;
  // };
};

type QuestionType = {
  id: string;
  title: string;
  name: string;
  description: string;
  profilePic: string;
  postImage: string;
  likes: number;
  comments: number;
  shares: number;
  // Add any other fields as necessary
};

type AnswerType = {
  // id: string;
  name: string;
  description: string;
  profilePic: string;
  // postImage: string;
  likes: number;
  comments: number;
  shares: number;
  // Add any other fields as necessary
};

const PostPage = ({ params: { postId } }: Props) => {
  // console.log(postId);
  // const queObject = postData.filter((post) => post.id === postId)[0];

  const [queObject, setQueObject] = useState<QuestionType>({} as QuestionType); //postData.filter((post) => post.id === postId)[0
  const [answers, setAnswers] = useState<AnswerType[]>([]);

  useEffect(() => {
    const fetchQueandAns = async () => {
      try {

        //main question fetching
        const queRef = doc(db, "questions", postId);
        const queDoc = await getDoc(queRef);

        if (queDoc.exists()) {
          setQueObject(queDoc.data() as QuestionType);
        } else {
          console.log("No such document!");
        }

        //answers fetching
        const ansRef = collection(db, "questions", postId, "answers");
        const ansSnapshot = await getDocs(ansRef);                   //getting whole collection of answers for the question

        const answers = ansSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as AnswerType }));

        setAnswers(answers);
        
      } catch (error) {
        console.log('Error fetching que details',error);
      }
    }
    fetchQueandAns();
  }, [postId]);

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
          <AnsPost answers={answers} />
        </div>
      </div>

      <div className=" col-span-2 overflow-hidden h-fit rounded-lg border border-gray-300 order-first md:order-last">
        <RecentFeed />
      </div>
    </div>
  );
};

export default PostPage;
