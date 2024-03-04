import { RecentPosts } from '@/lib/data'
import React, {useEffect, useState} from 'react'
import { db } from '@/utils/firebase'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'

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
    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsub = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()} as PostType)));
    })

    return () => {
      unsub()
    }
  }, [])

  return (
    <div className='  px-6 py-4'>

      <div>
        <h1 className='font-normal text-xl md:text-base uppercase'>Recent Posts</h1>
      </div>

        {
            posts.slice(0, 5).map((post, index) => (
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