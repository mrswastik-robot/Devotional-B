import React from 'react'

type Props = {
    params: {
        postId: string
    }
}

const PostPage = ({params: {postId}}: Props) => {

    // console.log(params.postId)

  return (
    <div>
        <h1>Post Page</h1>
        <p>Welcome to the {postId} page</p>
    </div>
  )
}

export default PostPage