"use client"

import React, { useRef } from 'react'

import { MessageSquare } from 'lucide-react'
import { Share } from 'lucide-react'
import { Bookmark } from 'lucide-react'

import  Link  from 'next/link'
import Image from 'next/image'

import PostVoteClient from './post-vote/PostVoteClient'
import { Avatar, AvatarFallback } from './ui/avatar'

import { formatTimeToNow } from '@/lib/date'
import { Separator } from './ui/separator'


type Props = {
    post: any
    // id: string
}

const Post = ({post}: Props) => {

    const pRef = useRef<HTMLDivElement>(null)

  return (
    <div className='rounded-md bg-white dark:bg-[#1A1A1B] shadow'>
      <div className='px-6 py-4 flex justify-between'>
        <PostVoteClient
        //   postId={post.id}
        //   initialVotesAmt={_votesAmt}
        //   initialVote={_currentVote?.type}
        />

        <div className='w-0 flex-1'>
          <div className='flex max-h-40 mt-1 space-x-3 text-xs text-gray-500'>
            {/* <div> */}
                <Avatar>
                    <div className=' relative w-full h-full aspect-square'>
                        <Image
                        fill
                        src={post.postImage}
                        alt='profile picture'
                        referrerPolicy='no-referrer'
                        />
                    </div>
                    <AvatarFallback>SP</AvatarFallback>
                </Avatar>
            {/* </div> */}
            <Separator orientation='vertical' className=' h-5 mt-4 '/>
            <span className=' mt-4'>Posted by u/{post.name}</span>{' '}
            {/* {formatTimeToNow(new Date(post.createdAt))} */}
          </div>
          <a href={`/r/post/${post.id}`}>
            <h1 className='text-lg font-semibold py-2 leading-6 text-gray-900 dark:text-white'>
              {post.title}
            </h1>
          </a>

          <div
            className='relative text-sm max-h-40 w-full overflow-clip'
            ref={pRef}>
            {/* <EditorOutput content={post.content} /> */}
            <p>{post.description}</p>
            {/* {pRef.current?.clientHeight === 160 ? (
              // blur bottom if content is too long
              <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent'></div>
            ) : null} */}
          </div>
        </div>
      </div>

      <div className='bg-gray-50 dark:bg-[#161617] z-20 items-end flex justify-end gap-x-3 text-sm px-4 py-4 sm:px-6'>

        <Link
          href={`/r/post/${post.id}`}
          className='w-fit flex items-center gap-2'>
          <MessageSquare className='h-4 w-4' /> {5} comments
        </Link>
        <Link href={`/r/post/${post.id}`} className='w-fit flex items-center gap-2'>
          <Share className='h-4 w-4' /> Share
        </Link>
        <Link href={`/r/post/${post.id}`} className='w-fit flex items-center gap-2'>
          <Bookmark className='h-4 w-4' /> Save
        </Link>

      </div>
    </div>
  )
}

export default Post