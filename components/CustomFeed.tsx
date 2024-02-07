import React from 'react'

import PostFeed from './PostFeed'

type Props = {}

const CustomFeed = (props: Props) => {
  return (
    <div className='col-span-5'>
        <PostFeed/>
    </div>
  )
}

export default CustomFeed