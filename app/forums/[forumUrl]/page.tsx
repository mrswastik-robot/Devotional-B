"use client";

import { db } from '@/utils/firebase';
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, increment, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
//import parse from "html-react-parser"
import Image from 'next/image'
import React, { useEffect, useState } from 'react';
import { SubRedditPost } from './components/subredditPost';
import parse from "html-react-parser";
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AvatarFallback } from '@radix-ui/react-avatar';
import { useDispatch } from 'react-redux';
import { setForumURL } from '@/store/slice';
import ForumsPostFeed from '../../../components/ForumsPostFeed'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/utils/firebase';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/Loader';

type Props = {
    params: {
      forumUrl: string
    }
  }


const ForumsPage = ({ params: { forumUrl } }: Props) => {

    const [forumDetails , setForumDetails] = useState<any>({});  
    const [memberDetails, setMemberDetails] = useState<any>([]);
    const [joined, setForumJoin] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const [rerun, setRerun] = useState(false);
    const { toast } = useToast();
    //const joined = false;
    let dateString;
    if (forumDetails.createdAt) {
    const date = forumDetails.createdAt.toDate();
    dateString = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    const [user, loading] = useAuthState(auth);

    useEffect(()=>{
      //console.log("User: ", user);
        //dispatch(setForumURL(forumUrl));
        //storing value of eventId in sessional storage
        const devotionalforumUrl = sessionStorage.getItem('devotionalforumUrl');
        
        if (!devotionalforumUrl) {
          // If "devotionalEventId" is not already present, store "eventId"
          sessionStorage.setItem('devotionalforumUrl', forumUrl);
        } else {
          // If "devotionalEventId" is already present, update it with the new "eventId"
          sessionStorage.setItem('devotionalforumUrl', forumUrl);
        }


    }, []);

    useEffect(()=>{
     isJoined();
    }, [rerun, user])

    useEffect(() => {
      const fetchMemberDetails = async () => {
        if (forumDetails) {
          const allUids = [forumDetails.uid, ...(forumDetails.members || [])];
          const uniqueUids = Array.from(new Set(allUids)); // Convert Set back to array
  
          const memberPromises = uniqueUids.map(async (uid) => {
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);
  
            if (userSnap.exists()) {
              return { uid, ...userSnap.data() };
            } else {
              console.error(`User document for UID ${uid} not found.`);
              return null;
            }
          });
  
          const members = await Promise.all(memberPromises);
          setMemberDetails(members.filter((member) => member !== null));
        }
      };
  
      fetchMemberDetails();
      console.log(memberDetails);
    }, [forumDetails]);

    const isJoined = async()=>{
      const forumQuery = query(collection(db, "forums"), where("uniqueForumName", "==", forumUrl));

      const forumSnapshot = await getDocs(forumQuery);
  
      if (forumSnapshot.empty) {
        console.error("Forum not found.");
        return;
      }
  
      const forumDoc = forumSnapshot.docs[0];
      const forumRef = doc(db, "forums", forumDoc.id);
  
      const docSnap = await getDoc(forumRef);
  
      if (docSnap.exists()) {
        const forumData = docSnap.data();
        if(user){
        
          const members = forumData.members || [];
    const userIndex = members.indexOf(user.uid);

    //console.log("UserId", user.uid);

    if (userIndex !== -1||forumData.uid==user.uid) {
      setForumJoin(true);
    }
    else {
      setForumJoin(false);
    }
      }
    }
    }

    const joinInForum = async()=>{
      //setForumJoin((prev)=>!prev);
      const forumQuery = query(collection(db, "forums"), where("uniqueForumName", "==", forumUrl));

  try {
    const forumSnapshot = await getDocs(forumQuery);

    if (forumSnapshot.empty) {
      console.error("Forum not found.");
      return;
    }

    const forumDoc = forumSnapshot.docs[0];
    const forumRef = doc(db, "forums", forumDoc.id);

    const docSnap = await getDoc(forumRef);

    if (docSnap.exists()) {
      const forumData = docSnap.data();
      if(user){
      if(forumData.uid==user.uid){
        toast({
          title: "You can't leave your own server",
          variant: "destructive",
        });
        return
      }
    
    const members = forumData.members || [];
    const userIndex = members.indexOf(user.uid);
    let updateData;

    if (userIndex !== -1) {
      // User exists in members array, remove them
      updateData = {
        members: arrayRemove(user.uid),
        noOfMembers: increment(-1),
      };
    } else {
      // User does not exist in members array, add them
      updateData = {
        members: arrayUnion(user.uid),
        noOfMembers: increment(1),
      };
    }

    await updateDoc(forumRef, updateData);
  }

    console.log("Members and noOfMembers updated successfully.");

      //logic to add user in forums  


      console.log("NumOfMembers updated successfully.");
      // toast({
      //   title: "Forum Updated",
      //   description: "NumOfPosts updated successfully.",
      // });

      // router.push("/forums");
      setRerun((prev)=>!prev)
    } else {
      console.error("Forum document not found.");
    }
  } catch (error) {
    console.error("Error updating document: ", error);
  }
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
      ,[forumUrl, router, joined])

      //console.log(user);
    
    return (
      <div>
      <div className="" />
      <div className="w-full h-[10rem] relative border-white border-[3px]">
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
      <div className="h-18 bg-white rounded-b-2xl">
        <div className="mx-auto container px-16 py-2 flex relative flex-col">
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
              {/* <AvatarFallback>SP</AvatarFallback> */}
            </Avatar>
          <div className="flex items-center">
            <h4 className="forumHeading ml-[7rem] text-2xl font-bold">
              {forumDetails.name}
            </h4>
            <button className="ml-5 text-sm text-[#007dfd] font-semibold border border-[#007dfd] py-1 px-3 rounded-lg focus:outline-none" onClick={joinInForum}>
              {joined ? "JOINED" : "JOIN"}
            </button>
          </div>
          <p className="ml-[7rem] text-sm">r/{forumDetails.uniqueForumName}</p>
          <div className="flex ml-[7rem] text-sm mt-[2px] font-semibold">
              <div>
                  <span className='mr-1'>{forumDetails.noOfMembers}</span>
                  <span className="text-sm">Members</span>
              </div> 
              <div className='ml-3'> 
                  <span className='mr-1'>{forumDetails.numOfPosts||0}</span>
                  <span className="text-sm">total Posts</span>
              </div>  
          </div>
          <div className='absolute right-[7rem] bottom-[27px]'>
              {joined?
              <Link href={`/createForumPost`}>
              <button className="focus:outline-none rounded-xl bg-[#007dfd] text-white w-full py-2 px-2 font-semibold border border-[#007dfd]">
                CREATE POST
              </button>
              </Link>:
              <button onClick={()=>{
                toast({
                  title: "Join Forum to post stuffs",
                  variant: "destructive",
                });
              }} className="focus:outline-none rounded-xl w-full py-2 bg-[#007dfd] text-white px-2 font-semibold border border-[#007dfd]">
              CREATE POST
            </button>
            }
            </div>
        </div>
      </div>
      <div className="flex container mx-auto py-[11px] px-0 items-start">
        <div className='w-1/4 border-0 '>
      <div className=" bg-[#ffffff] mt-[7px] mr-4 rounded-2xl border-0">
            
      <div className={"pb-1 dark:bg-[#262626] bg-[#ffffff] rounded-2xl shadow-[0px_0px_0px_1px_rgba(8,112,184,0.06),0px_1px_1px_-0.5px_rgba(8,112,184,0.06),0px_3px_3px_-1.5px_rgba(8,112,184,0.06),_0px_6px_6px_-3px_rgba(8,112,184,0.06),0px_12px_12px_-6px_rgba(8,112,184,0.06),0px_24px_24px_-12px_rgba(8,112,184,0.06)]"}>
      <div className="space-y-4 py-4">
        <div className="px-2 py-2">
          <h2 className="mb-[10px] px-4 text-[20px] font-bold tracking-tight">
            Members
          </h2>
          <ScrollArea className="px-1 h-[150px]">
          <div className="space-y-1">
            <div>
              {
                memberDetails?
                memberDetails.map((member:any, index:any)=>(
                  <div key={index}>
                    <div >
            <div className="mb-[10px]">

            <div className="flex ml-[13px]">
              <div>
            <Image
                        src={member.profilePic}
                        width={250}
                        height={250}
                        alt='Conference'
                        className=' w-10 h-10 rounded-full'
                        />
            </div>  
          <div className="ml-4 space-y-1">
          <p className="text-[17px] font-medium leading-none mt-2">{member.name}</p>
          {/* <p className="text-[12px] text-muted-foreground">{member.email}</p> */}
          </div>
        </div>
              
            </div>
          </div>
                  </div>
                )):
                <div><Loader/></div>
              }
            </div>
            
          </div>
          </ScrollArea>
        </div>
        </div>
      </div>
    
            
          </div>

            
          </div>
        
          {/* Left Column (Posts) */}
          <div className="w-2/4 ">
            
            <ForumsPostFeed newPost={false} forumURL={forumUrl}/>
            {/* {forumPost?.map((post:any, index:any) => (
              <SubRedditPost key={index}/>
            ))} */}
          </div>

          {/* >Right Column (sidebar) */}
          <div className="w-1/4 ml-4 bg-white rounded-2xl mt-[7px] shadow-[0px_0px_0px_1px_rgba(8,112,184,0.06),0px_1px_1px_-0.5px_rgba(8,112,184,0.06),0px_3px_3px_-1.5px_rgba(8,112,184,0.06),_0px_6px_6px_-3px_rgba(8,112,184,0.06),0px_12px_12px_-6px_rgba(8,112,184,0.06),0px_24px_24px_-12px_rgba(8,112,184,0.06)]">
            
          <Card x-chunk="dashboard-01-chunk-5" className='rounded-2xl'>
              <CardHeader className='text-sm pb-1'>
                <CardTitle className='text-[20px] font-[700]'>Forum Description</CardTitle>
                <div className='text-xs text-muted-foreground'><span>Created On : {` `}</span>{" "}
                <span>{dateString && <>{dateString}</>}</span></div>
              </CardHeader>
              <CardContent className="mt-3">
                <p className="text-[21px]">{forumDetails.description?parse(forumDetails.description):""}</p>
                {/* <p className='text-[17px] max-h-[18rem] overflow-y-scroll'>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
                </p> */}
                
              </CardContent>
          </Card>
            
          </div>
        </div>
      </div>

    );
}

export default ForumsPage;
