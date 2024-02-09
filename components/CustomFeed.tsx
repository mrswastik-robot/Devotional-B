import React from 'react'

import PostFeed from './PostFeed'
import TopFeedCard from './TopFeedCard'

type Props = {}

const CustomFeed = (props: Props) => {
  return (
    <div className='col-span-5 space-y-5'>
        <TopFeedCard/>
        <PostFeed/>
    </div>
  )
}

export default CustomFeed