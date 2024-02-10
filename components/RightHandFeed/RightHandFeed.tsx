import { RecentPosts } from '@/lib/data'
import React from 'react'

import RightHandFeedCard from './RightHandFeedCard'

type Props = {}

const RightHandFeed = (props: Props) => {
  return (
    <div className='  px-6 py-4'>

      <div>
        <h1 className='font-normal text-xl md:text-base uppercase'>Recent Posts</h1>
      </div>

        {
            RecentPosts.map((post, index) => (
                <div key={index} className='flex gap-4 items-center justify-center mx-auto mt-4'>
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