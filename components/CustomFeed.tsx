import React from 'react'

import PostFeed from './PostFeed'
import TopFeedCard from './TopFeedCard'

type Props = {
  newPost: boolean
}

const CustomFeed = (props: Props) => {
  //console.log(props.newPost)
  return (
    <div className='col-span-5 space-y-5'>
        {/* <TopFeedCard/> */}
        <PostFeed newPost={props.newPost}/>
    </div>
  )
}

export default CustomFeed