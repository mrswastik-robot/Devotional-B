"use client";
import ProfileCard from '@/components/profilePage/ProfileCard'
import Image from 'next/image'
import React, { useEffect } from 'react'

import { auth , db } from '@/utils/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/navigation';



type Props = {}

const ProfilePage = (props: Props) => {

    const router = useRouter();
    const [user, loading] = useAuthState(auth);
    // console.log(user);

    useEffect(() => {
        if(!user)
          router.push('/auth');
      }
    , [user, loading])

  return (
    <div className=' mt-4'>
        <ProfileCard user={user}/>

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

        <div>
        <button onClick={() => auth.signOut()} className="font-medium bg-red-600 text-white py-2 px-4 rounded-lg textx-sm my-7">Sign Out</button>
        </div>
        
    </div>
  )
}

export default ProfilePage