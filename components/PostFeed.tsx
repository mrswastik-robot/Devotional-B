import React from 'react'
import Post from './Post'
import { postData } from '@/lib/data'

type Props = {}

const PostFeed = (props: Props) => {
  return (
    <div className=' w-[100%]'>
        <ul className=' flex flex-col col-span-2 space-y-6'>
          {postData.map((post, index) => (
            <li key={index}>
              <Post post={post} />
            </li>
          ))}
        </ul>
    </div>
  )
}

export default PostFeed