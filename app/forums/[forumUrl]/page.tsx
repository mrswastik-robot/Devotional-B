"use client";

import { db } from '@/utils/firebase';
import { collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import parse from "html-react-parser"
import Image from 'next/image'
import React, { useEffect, useState } from 'react';
import { SubRedditPost } from './components/subredditPost';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { useDispatch } from 'react-redux';
import { setForumURL } from '@/store/slice';
import ForumsPostFeed from '../../../components/ForumsPostFeed'

type Props = {
    params: {
      forumUrl: string
    }
  }


const ForumsPage = ({ params: { forumUrl } }: Props) => {

    const [forumDetails , setForumDetails] = useState<any>({});  
    const [joined, setForumJoin] = useState(true);
    const router = useRouter();
    const dispatch = useDispatch();
    //const joined = false;
    let dateString;
    if (forumDetails.createdAt) {
    const date = forumDetails.createdAt.toDate();
    dateString = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    useEffect(()=>{
        dispatch(setForumURL(forumUrl));
    }, []);

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
      const numOfMembers = forumData.noOfMembers;

        if(joined==false){
        await updateDoc(forumRef, { noOfMembers: numOfMembers + 1 });
        setForumJoin(true);
        }
        else{
        await updateDoc(forumRef, { noOfMembers: numOfMembers - 1 });
        setForumJoin(false);
        }

      console.log("NumOfMembers updated successfully.");
      // toast({
      //   title: "Forum Updated",
      //   description: "NumOfPosts updated successfully.",
      // });

      // router.push("/forums");
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
    
    return (
        <div>
      
        </div>
    );
}

export default ForumsPage;
