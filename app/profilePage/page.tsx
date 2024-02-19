import ProfileCard from '@/components/profilePage/ProfileCard'
import Image from 'next/image'
import React from 'react'

type Props = {}

const ProfilePage = (props: Props) => {
  return (
    <div className=' mt-4'>
        <ProfileCard/>

        <div className=' absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 '>
            <Image
            src="/trash.png"
            width={300}
            height={300}
            className=" w-[10rem] h-[9rem] rounded-full"
            alt="Profile Pic"
            />
            <h1 className=' text-2xl text-zinc-500'>No posts yet</h1>
        </div>
        
    </div>
  )
}

export default ProfilePage