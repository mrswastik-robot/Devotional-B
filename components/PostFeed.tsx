"use client";

import React, { useEffect, useState } from 'react'
import Post from './Post'
import { postData } from '@/lib/data'
import { Button } from './ui/button';
import Loader from './ui/Loader';

import {db} from '@/utils/firebase'
import { collection, getDocs, limit, onSnapshot, orderBy, query, startAfter } from 'firebase/firestore'

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
  createdAt: string;
  anonymity: boolean;
  // Add any other fields as necessary
}

const PostFeed = (props: Props) => {

  const [posts , setPosts] = useState<PostType[]>([]);
  const limitValue:number=7;
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loadMore, setLoadMore] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    
    setIsLoading(true);
    const collectionRef = collection(db, 'questions');

    let q;
    if(lastDoc){
    q = query(collectionRef, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(limitValue));
    }
    else{
      q=query(collectionRef, orderBy('createdAt', 'desc'), limit(limitValue));
    }

    const unsub = onSnapshot(q, async(snapshot) => {
      const postsData:any = [];

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
      
      const lastDocument = snapshot.docs[snapshot.docs.length - 1];
      setLoadMore(lastDocument);
      setPosts((prevPosts)=>[...prevPosts, ...postsData]);
      setIsLoading(false);
      setPageLoaded(true);
    })

    return () => {
      unsub()
    }
  }, [lastDoc]);

  const loadMoreData = ()=>{
    setLastDoc(loadMore);
  }

  return (
    <div className=' w-[100%]'>
        <ul className=' flex flex-col col-span-2 space-y-6'>
          {posts.map((post, index) => (
            <li key={index}>
              <Post post={post} />
            </li>
          ))}
        </ul>
        <div className='w-[100%] lg:ml-64 md:ml-80 xl:ml-96'>
        { isLoading?<Loader/>:pageLoaded&&
        <div className='mt-4'>
        <Button>
        <button onClick={loadMoreData}>LoadMore</button>
        </Button>
        </div>
        }
        </div>
    </div>
  )
}

export default PostFeed