"use client"

import React, { useRef } from 'react'

import parse from 'html-react-parser'

import { MessageSquare } from 'lucide-react'
import { Share } from 'lucide-react'
import { Bookmark } from 'lucide-react'

import  Link  from 'next/link'
import Image from 'next/image'

import PostVoteClient from './post-vote/PostVoteClient'
import PostVoteClientPhone from './post-vote/PostVoteClientPhone'
import { Avatar, AvatarFallback } from './ui/avatar'

import { formatTimeToNow } from '@/lib/date'
import { Separator } from './ui/separator'
import { Button } from './ui/button'

import { auth } from '@/utils/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'


type Props = {
    post: {
        id: string
        title: string
        name: string
        description: string
        profilePic: string
        postImage: string
        likes: number
        comments: number
        shares: number
        questionImageURL: string
        createdAt: string
        anonymity: boolean
        ansNumbers: number
    }
    // children: Element
    // id: string
}

const Post = ({post}: Props) => {

    const pRef = useRef<HTMLDivElement>(null)

    const isAnonymous = post.anonymity

    //needed to send it to PostVoteClientPhone so that it can get the current user's vote
    const [user] = useAuthState(auth);

  return (
    <div className='rounded-md bg-white dark:bg-[#262626] shadow my-1'>
      <div className='px-6 py-4 flex justify-between'>
        {/* <PostVoteClient
        //   postId={post.id}
        //   initialVotesAmt={_votesAmt}
        //   initialVote={_currentVote?.type}
        /> */}

        {/* <PostVoteClientPhone/> */}

        <div className='w-0 flex-1 break-normal overflow-hidden'>
          <div className='flex max-h-40 mt-1 space-x-3 text-xs text-gray-500'>
            {/* <div> */}
                <Avatar>
                    <div className=' relative w-full h-full aspect-square'>
                        <Image
                        fill
                        src={isAnonymous ? ('https://qph.cf2.quoracdn.net/main-qimg-73e139be8bfc1267eeed8ed6a2802109-lq') : (post.profilePic)}
                        alt='profile picture'
                        referrerPolicy='no-referrer'
                        />
                    </div>
                    <AvatarFallback>SP</AvatarFallback>
                </Avatar>
            {/* </div> */}
            <Separator orientation='vertical' className=' h-5 mt-4 '/>
            <span className=' mt-4'>{isAnonymous ? ('Anonymous') : (post.name)}</span>{' '}            
            <svg viewBox="0 0 48 48" className=" mt-5 w-2 h-2" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M24 36C30.6274 36 36 30.6274 36 24C36 17.3725 30.6274 12 24 12C17.3726 12 12 17.3725 12 24C12 30.6274 17.3726 36 24 36Z" fill="#333333"></path> </g></svg>
            <Button variant='ghost' className=' text-blue-500 text-xs mt-1 p-0'>Follow</Button>
            {/* {formatTimeToNow(new Date(post.createdAt))} */}
          </div>
          <Link href={`/postPage2/${post.title.split(' ').join('-')}`}>
            <h1 className='text-lg font-semibold py-2 leading-6 text-gray-900 dark:text-white'>
              {post.title}
            </h1>
          </Link>

          {post.questionImageURL ? (
            <div className='relative w-full h-60'>
              <Image
                src={post.questionImageURL}
                layout='fill'
                objectFit='cover'
                alt='post image'
              />
            </div>
          ) : null}

          <div
            className='relative text-sm max-h-40 w-full overflow-clip'
            ref={pRef}>
            {/* <EditorOutput content={post.content} /> */}
            <p>{parse(post.description)}</p>
            <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white/90 dark:from-[#262626] to-transparent'></div>
            {/* {pRef.current?.clientHeight === 160 ? (
              // blur bottom if content is too long
              
            ) : null} */}
          </div>
        </div>
      </div>

      <div className='bg-gray-50 dark:bg-[#1A1A1B]/65 z-20  flex justify-between  gap-x-3 text-sm px-4 py-2  sm:px-6'>


        {/* <div className=' sm:block md:hidden '> */}
          <PostVoteClientPhone postId={post.id} postType="questions" userId={user?.uid!}/>
        {/* </div> */}


        <div className=' flex gap-x-3'>
          <Link
            href={`/postPage2/${post.title.split(' ').join('-')}`}
            className='w-fit flex items-center gap-2'>
            <MessageSquare className='h-4 w-4' /> <span className=' sm:block hidden'>{post.comments} Answers</span>
          </Link>
          <Link href={`/r/post/${post.id}`} className='w-fit flex items-center gap-2'>
            <Share className='h-4 w-4' /> <span className=' sm:block hidden'>Share</span>
          </Link>
          <Link href={`/r/post/${post.id}`} className='w-fit flex items-center gap-2'>
            <Bookmark className='h-4 w-4' /> <span className=' sm:block hidden'>Save</span>
          </Link>
        </div>

        
        

      </div>
    </div>
  )
}

export default Post