"use client";

import React, { useEffect, useState } from 'react'
import Post from './Post'
import { postData } from '@/lib/data'

import {db} from '@/utils/firebase'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'

type Props = {}

type PostType = {
  id: string;
  name: string;
  title: string;
  description: string;
  profilePic: string;
  postImage: string;
  likes: number;
  shares: number;
  comments: number;
  questionImageURL: string;
  // Add any other fields as necessary
}

const PostFeed = (props: Props) => {

  const [posts , setPosts] = useState<PostType[]>([]);

  useEffect(() => {

    const collectionRef = collection(db, 'questions');
    const q = query(collectionRef,);

    const unsub = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()} as PostType)));
    })

    return () => {
      unsub()
    }
  }, [])

  return (
    <div className=' w-[100%]'>
        <ul className=' flex flex-col col-span-2 space-y-6'>
          {posts.map((post, index) => (
            <li key={index}>
              <Post post={post} />
            </li>
          ))}
        </ul>
    </div>
  )
}

export default PostFeed