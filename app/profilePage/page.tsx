"use client";

import ProfileCard from '@/components/profilePage/ProfileCard'
import Image from 'next/image'
import React, { useEffect , useState} from 'react'
import { useRouter } from 'next/navigation';

import { auth , db } from '@/utils/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { collection, query , where , onSnapshot, orderBy} from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Post from '@/components/Post';



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

const ProfilePage = (props: Props) => {

    const router = useRouter();
    const [user, loading] = useAuthState(auth);
    // console.log(user);
    const [questions, setQuestions] = useState<PostType[]>([]);

    useEffect(() => {
      if (!user) {
        router.push('/auth');
      } else {
        const questionsRef = collection(db, 'questions');
        const q = query(questionsRef, where('uid', '==', user.uid), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snapshot) => {
          setQuestions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as PostType)));
        });
  
        return () => {
          unsub();
        }
      }
    }, [user, loading, router]);

  return (
    <div className=' mt-4'>
        <ProfileCard user={user}/>

        {(questions?.length === 0) ? (
          <div className=' absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 '>
            <Image
            src='/trash.png'
            width={300}
            height={300}
            className=" w-[10rem] h-[9rem] rounded-full"
            alt="Profile Pic"
            />
            <h1 className=' text-2xl text-zinc-500'>No posts yet</h1>
          </div>
        ) : (
          questions &&
            questions.map((post, index) => (
              // <Post key={index} post={post} />
              <div key={index} className=' my-7'>
                <Post post={post} />
              </div>
            ))
        )}

        <div>
          <button onClick={() => auth.signOut()} className="font-medium bg-red-600 hover:bg-red-900 text-white py-2 px-4 rounded-lg textx-sm my-7">Sign Out</button>
        </div>
        
    </div>
  )
}

export default ProfilePage