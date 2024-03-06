import React from 'react'

import PostFeed from './PostFeed'
import TopFeedCard from './TopFeedCard'

type Props = {}

const CustomFeed = (props: Props) => {
  return (
    <div className=''>
        {/* <TopFeedCard/> */}
        <PostFeed/>
    </div>
  )
}

export default CustomFeed