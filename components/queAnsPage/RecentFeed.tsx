import { RecentPosts } from '@/lib/data'
import React, { useEffect, useState } from 'react'

import RecentFeedCard from './RecentFeedCard'
import { collection, getDocs, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '@/utils/firebase'
import { Separator } from '../ui/separator'

type Props = {}

type PostType = {
  id: string;
  name: string;
  title: string;
  profilePic: string;
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

const RecentFeed = (props: Props) => {

  const [posts , setPosts] = useState<PostType[]>([]);

  useEffect(() => {

    const collectionRef = collection(db, 'questions');
    const q = query(collectionRef, orderBy('createdAt', 'desc'), limit(7));

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
    <div className=' bg-[#FFFFFF] dark:bg-[#262626]'>


<Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left font-[590] text-base text-black dark:text-white">Recent Posts</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post, index) => (
          <TableRow key={index}>
            <Link href={`/${post.title.split(' ').join('-')}`}>
            <TableCell className="text-[#195FAA] text-base">{post.title}</TableCell>
            </Link>
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
  )
}

export default RecentFeed