"use client";

import React, { useRef , useState , useEffect} from "react";
import parse from "html-react-parser";

import { Key, MessageSquare } from "lucide-react";
import { Share } from "lucide-react";
import { Bookmark } from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import PostVoteClient from "@/components/post-vote/PostVoteClient";
import CommentBox from "./CommentBox";
import PostVoteClientPhone from "../post-vote/PostVoteClientPhone";

import { auth, db } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, doc, getDocs, query } from "firebase/firestore";

type Props = {
  answers: {
    id: string;
    name: string;
    profilePic: string;
    // postImage: string;
    // title: string;
    description: string;
    likes: number;
    comments: number;
    shares: number;
    answerImageURL: string;
    createdAt: string;
    anonymity: boolean;
  }[];
  postTitleWithSpaces: string;
  postId: string;
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
  answerImageURL: string;
  createdAt: string;
  anonymity: boolean;
  // Add any other fields as necessary
};

const AnsPost = ({ answers , postTitleWithSpaces , postId }: Props) => {
  
  //to send in postvoteclient for voting system
  const [user] = useAuthState(auth);
  const [dispAnswer, setDispAnswer] = useState<AnswerType[]>([] as AnswerType[]);
  // console.log(postId);

  const pRef = useRef<HTMLDivElement>(null);

  // const isAnonymous = answers[0].anonymity;

  const [commentInputVisibility , setCommentInputVisibility] = useState(answers.map(() => false))
  const [commentAdded, setCommentAdded] = useState(false);

  const toggleCommentInputVisibility = (index: number) => {
    // Update the visibility of the comment input at the given index
    setCommentInputVisibility(prevVisibility =>
      prevVisibility.map((isVisible, i) => (i === index ? !isVisible : isVisible))
    );
  };

  useEffect(() => {
    // Close all comment inputs when the component is unmounted
     setCommentInputVisibility(answers.map(() => false));


  }, [answers]);

  useEffect(()=>{
    const fetchData = async () => {
      const updatedAnswers = await Promise.all(
        answers.map(async (answer) => {
          // Fetch the 'comments' subcollection for each 'answers' document
          const commentsCollectionRef = collection(
            doc(db, 'questions', postId, 'answers', answer.id),
            'comments'
          );
          //console.log("answer", answer);
          const commentsQuery = query(commentsCollectionRef);
          const commentsSnapshot = await getDocs(commentsQuery);

          // Add the total number of comments to the 'answers' data
          return { ...answer, comments: commentsSnapshot.size };
        })
      );

      setDispAnswer(updatedAnswers);
      // Do something with updatedAnswers, such as updating state
    };

    fetchData();
  }, [postId, answers, commentAdded]);

  return (

    <div>
      {dispAnswer.map((answer: any, key) => (

        <div
          key={answer.id}
          className="rounded-md bg-white dark:bg-[#262626] shadow mt-7 space-y-4 break-words overflow-hidden" 
        >
          <div className="px-6 py-5 flex justify-between">
            {/* <PostVoteClient
            //   postId={post.id}
            //   initialVotesAmt={_votesAmt}
            //   initialVote={_currentVote?.type}
            /> */}

            <div className="w-0 flex-1">
              <div className="flex max-h-40 mt-1 space-x-3 text-xs text-gray-500">
                {/* <div> */}
                <Avatar>
                  <div className=" relative w-full h-full aspect-square">
                    <Image
                      fill
                      src={answer.anonymity ? ('https://qph.cf2.quoracdn.net/main-qimg-73e139be8bfc1267eeed8ed6a2802109-lq') : (answer.profilePic)}
                      alt="profile picture"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <AvatarFallback>SP</AvatarFallback>
                </Avatar>
                {/* </div> */}
                <Separator orientation="vertical" className=" h-5 mt-3 " />
                <span className=" mt-3">{answer.anonymity ? ('Anonymous') : (answer.name)}</span>{" "}
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
                  className=" text-blue-500 text-xs  p-0"
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

              {answer.answerImageURL ? (
                  <div className="relative w-full h-[400px] mt-2">
                    <Image
                      src={answer.answerImageURL}
                      className="rounded-md"
                      layout="fill"
                      alt="answer image"
                      objectFit="contain"
                    />
                  </div>
                ) : null
              }

              <div
                className="relative text-lg max-h-50 w-full mt-2 "
                ref={pRef}
              >
                {/* <EditorOutput content={post.content} /> */}
            <p className="ProseMirror">{answer.description ? parse(answer.description) : ""}</p>

                {/* <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white/80 dark:from-[#262626] to-transparent'></div> */}
                {/* {pRef.current?.clientHeight === 160 ? (
              // blur bottom if content is too long
              
            ) : null} */}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-[#1A1A1B]/65 z-20  flex justify-between gap-x-3 text-sm px-4 py-2 sm:px-6">

            <PostVoteClientPhone postId={answer.id} postType="answers"  userId={user?.uid!} questionId={postId}/>
            
            <div className=" flex gap-x-3">
              <button
                // href={`/postPage/${answer.id}`}
                className="w-fit flex items-center gap-2"
                onClick={() => toggleCommentInputVisibility(key)}
              >

                <MessageSquare className="h-4 w-4" /> <span className=' sm:block hidden'>{answer.comments} Answers</span>

              </button>
              <button
                className="w-fit flex items-center gap-2"
              >
                <Share className="h-4 w-4" /> <span className=' sm:block hidden'>Share</span>
              </button>
              <button
                className="w-fit flex items-center gap-2"
              >
                <Bookmark className="h-4 w-4" /> <span className=' sm:block hidden'>Save</span>
              </button>
            </div>
          </div>

          {/* Add a comment input that shows or hides when the comments button is clicked */}
          {commentInputVisibility[key] && (
            <CommentBox postTitleWithSpaces={postTitleWithSpaces} changeHandler={setCommentAdded} answerId={answer.id} toggleCommentInputVisibility={() => toggleCommentInputVisibility(key)} />
          )} 

        </div>
      ))}
    </div>
  );
};
export default AnsPost;
