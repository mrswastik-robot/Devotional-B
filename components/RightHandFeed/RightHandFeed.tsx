import { RecentPosts } from '@/lib/data'
import React, {useEffect, useState} from 'react'
import { db } from '@/utils/firebase'
import { collection, getDocs, limit, onSnapshot, orderBy, query } from 'firebase/firestore'

import RightHandFeedCard from './RightHandFeedCard'

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

const RightHandFeed = (props: Props) => {

  const [posts , setPosts] = useState<PostType[]>([]);

  useEffect(() => {

    const collectionRef = collection(db, 'questions');
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
    <div className=' bg-[#FFFFFF] dark:bg-[#262626]  px-6 py-4'>

      <div>
        <h1 className='font-normal text-xl md:text-base uppercase'>Recent Posts</h1>
      </div>

        {
            posts.map((post, index) => (
                <div key={index} className='flex gap-4 items-start mt-3'>
                    <RightHandFeedCard post={post}/>
                </div>
            ))
        }

        <div className=' mt-5 justify-end items-end flex'>
            <p className='text-sm'>Clear</p>
        </div>

    </div>
  )
}

export default RightHandFeed