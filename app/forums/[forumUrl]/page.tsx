"use client";

import { db } from '@/utils/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import parse from "html-react-parser"
import Image from 'next/image'
import React, { useEffect, useState } from 'react';
import { SubRedditPost } from './components/subredditPost';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';

type Props = {
    params: {
      forumUrl: string
    }
  }


const ForumsPage = ({ params: { forumUrl } }: Props) => {

    const [forumDetails , setForumDetails] = useState<any>({});  
    const [forumPost, setForumPost] = useState<any>(["me", "you", "fun"]); 
    const router = useRouter();
    const joined = false;
    let dateString;
    if (forumDetails.createdAt) {
    const date = forumDetails.createdAt.toDate();
    dateString = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
 
    useEffect(() => {
        const eventRef = collection(db, 'forums');
        console.log("FU: ", forumUrl);
        const q = query(eventRef, where('uniqueForumName', '==', forumUrl));
    
        const eventsUnsub = onSnapshot(q, (snapshot) => {
          if(!snapshot.empty)
            {
              const doc = snapshot.docs[0];
              const data = doc.data();
              setForumDetails(data);
    
              //listener for the comments of the event
            //   const eventCommentsRef = collection(db, 'eventsComments');
            //   const q = query(eventCommentsRef, where('eventId', '==', doc.id));
            //   const commentsUnsub = onSnapshot(q, (snapshot) => {
            //     const comments = snapshot.docs.map((doc) => {
            //       const data = doc.data() as EventCommentType;
            //       return {
            //         eventId: data.eventId,
            //         eventTitle: data.eventTitle,
            //         comment: data.comment,
            //         uid: data.uid,
            //         name: data.name,
            //         profilePic: data.profilePic,
            //         createdAt: data.createdAt,
            //         imageUrl: data.imageUrl,
            //       }
            //     })
            //     setEventComment(comments);
            //   })
    
              return () => {
                eventsUnsub();
                // commentsUnsub();
              }
            }
            else
            {
              console.log('No such event found');
              router.push('/404'); 
            }
        }
        )
      }
      ,[forumUrl, router])
    
    return (
        <div>
      <div className="" />
      <div className="w-full h-[9rem] relative border-white border-[3px]">
              <div className="w-full h-full">
                <Image
                  fill
                  src={
                    forumDetails.bannerImageURL==null
                      ? "https://static.vecteezy.com/system/resources/thumbnails/000/701/690/small/abstract-polygonal-banner-background.jpg"
                      : forumDetails.bannerImageURL
                  }
                  alt="profile picture"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
      <div className="h-18 bg-white">
        <div className="mx-auto container px-12 py-2 flex relative flex-col">
          {/* <div className="w-16 absolute h-16 bottom-6 rounded-full bg-green-400 border-white border-2" /> */}
          <Avatar className="w-24 absolute h-24 bottom-6 rounded-full border-white border-[3px]">
              <div className="">
                <Image
                  fill
                  src={
                    forumDetails.imageURL==null
                      ? "https://www.adobe.com/content/dam/cc/us/en/creativecloud/design/discover/mascot-logo-design/mascot-logo-design_fb-img_1200x800.jpg"
                      : forumDetails.imageURL
                  }
                  alt="profile picture"
                  referrerPolicy="no-referrer"
                />
              </div>
              <AvatarFallback>SP</AvatarFallback>
            </Avatar>
          <div className="flex items-center">
            <h4 className="ml-[6.5rem] text-2xl font-bold text-gray-700">
              {forumDetails.name}
            </h4>
            <button className="ml-4 text-sm text-green-400 font-semibold border border-green-400 py-1 px-3 rounded-md focus:outline-none">
              {joined ? "JOINED" : "JOIN"}
            </button>
          </div>
          <p className="ml-[6.5rem] text-sm text-gray-600">r/{forumDetails.uniqueForumName}</p>
        </div>
      </div>
      <div className="bg-gray-300">
        <div className="flex container mx-auto py-4 px-4 items-start">
          {/* Left Column (Posts) */}
          <div className="w-2/3">
            <Link href={`/forums/createForum`}>
              <div className="w-full block text-center py-3 text-xl font-bold bg-white rounded-md shadow-sm hover:shadow-lg outline-none focus:outline-none">
                Create Post
              </div>
            </Link>
            <div className='flex flex-col items-center justify-center mt-2'>
            <Image
                    src="/trash.png"
                    width={300}
                    height={300}
                    className=" w-[10rem] h-[9rem] rounded-full"
                    alt="Profile Pic"
                  />
                  <div>No Posts Found</div>
            </div>
            {/* {forumPost?.map((post:any, index:any) => (
              <SubRedditPost key={index}/>
            ))} */}
          </div>

          {/* >Right Column (sidebar) */}
          <div className="w-1/3 ml-4 bg-white rounded-md">
            <div className="bg-green-400 py-4 px-2 rounded-t-md">
              <p className="text-sm text-gray-900 font-bold">About Community</p>
            </div>
            <div className="p-2">
              <p>{forumDetails.description?parse(forumDetails.description):""}</p>
              <div className="flex w-full mt-2 font-semibold">
                <div className="w-full">
                  <p>{forumDetails.noOfMembers}</p>
                  <p className="text-sm">Members</p>
                </div>
                <div className="w-full">
                  <p>{0}</p>
                  <p className="text-sm">total Posts</p>
                </div>
              </div>
              <div className="w-full h-px bg-gray-300 my-4" />
              <p className="text-md mb-4 flex">
                <b>Created On : {` `}</b>{" "}
                <span>{dateString && <p className='ml-1 mt-[2.5px] font-semibold text-gray-900 text-sm'>{dateString}</p>}</span>
              </p>
              <button className="focus:outline-none rounded-md w-full py-3 text-gray-900 font-semibold bg-green-400">
                CREATE POST
              </button>
            </div>
          </div>
        </div>
      </div>
        </div>
    );
}

export default ForumsPage;
