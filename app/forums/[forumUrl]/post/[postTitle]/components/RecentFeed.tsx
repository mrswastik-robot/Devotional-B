import { RecentPosts } from '@/lib/data'
import React, { useEffect, useState } from 'react'

// import RecentFeedCard from './RecentFeedCard'
import { collection, getDocs, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '@/utils/firebase'
import { Separator } from '@/components/ui/separator'
import parse from "html-react-parser"

type Props = {}

type PostType = {
  id: string;
  name: string;
  title: string;
  profilePic: string;
  description: string;
  voteAmt: number;
  comments: number;
  createdAt: string;
  anonymity: boolean;
  // Add any other fields as necessary
}

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const RecentFeed = (props: Props) => {

  const [posts , setPosts] = useState<PostType[]>([]);
  const params = useParams();
  const forumUrl = params.forumUrl


 //fetching latest forum posts
  useEffect(() => {

    const collectionRef = collection(db, 'forumPosts');
    const q = query(collectionRef, orderBy('createdAt', 'desc'), limit(5));

    const unsub = onSnapshot(q, async(snapshot) => {
      const postsData =[];

      for (const doc of snapshot.docs) {
        
        // Fetch the 'answers' subcollection for each question
        const answersCollectionRef = collection(doc.ref, 'answers');
        const answersQuery = query(answersCollectionRef);
    
        const answersSnapshot = await getDocs(answersQuery);
        const numAnswers = answersSnapshot.size;
    
        // Add the total number of answers to the question data
        const questionData = { id: doc.id, comments: numAnswers, ...doc.data() } as PostType;
    
        postsData.push(questionData);
      }
  
      //console.log(postsData)
      setPosts(postsData);
    })

    return () => {
      unsub()
    }
  }, [])
  
  return (
    <div>
      
    <div className='max-h-[40rem] p-2 overflow-auto bg-[#FFFFFF] rounded-2xl dark:bg-[#262626] shadow-[0px_0px_0px_1px_rgba(8,112,184,0.06),0px_1px_1px_-0.5px_rgba(8,112,184,0.06),0px_3px_3px_-1.5px_rgba(8,112,184,0.06),_0px_6px_6px_-3px_rgba(8,112,184,0.06),0px_12px_12px_-6px_rgba(8,112,184,0.06),0px_24px_24px_-12px_rgba(8,112,184,0.06)]'>

<Table>
      <TableHeader>
        <TableRow>
          <TableHead className=" text-left font-bold text-[20px] dark:text-white text-[#000000]">Latest Posts</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post, index) => (
          <TableRow key={index}>
            <Link className='flex flex-col' href={`/forums/${forumUrl}/post/${encodeURIComponent(post?.title?.split(" ").join("-"))}`}>
            <TableCell className=" text-[14px] font-[500]">{post.title.length>70?post.title.substring(0, 69)+"...":post.title}</TableCell>
            <TableCell className="text-[14px]">{post.description.length>1000?parse(post.description.substring(0, 99))+"...":parse(post.description)}</TableCell>
            </Link>
            {index!=4&&
            <Separator/>
}
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell>Ask Question...</TableCell>
        </TableRow>
      </TableFooter> */}
      </Table>


    </div>
    </div>
  )
}

export default RecentFeed