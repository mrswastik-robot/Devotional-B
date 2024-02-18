import { RecentPosts } from '@/lib/data'
import React from 'react'

import RecentFeedCard from './RecentFeedCard'

type Props = {}

const RecentFeed = (props: Props) => {
  return (
    <div className='  px-6 py-4 dark:bg-[#262626]'>

      <div>
        <h1 className='font-normal text-xl md:text-base uppercase'>Recent Posts</h1>
      </div>

        {
            RecentPosts.map((post, index) => (
                <div key={index} className='flex gap-4 items-center justify-center mx-auto mt-4'>
                    <RecentFeedCard post={post}/>
                </div>
            ))
        }

        <div className=' mt-5 justify-end items-end flex'>
            <p className='text-sm'>Clear</p>
        </div>

    </div>
  )
}

export default RecentFeed