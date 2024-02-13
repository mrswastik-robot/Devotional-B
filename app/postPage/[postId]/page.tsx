"use client"

import React, { useState } from 'react'

import { postData } from '@/lib/data'
import QuePost from '@/components/queAnsPage/QuePost'
import {Tiptap as TipTap} from '@/components/TipTap'
type Props = {
    params: {
        postId: string
    }
}

const PostPage = ({params: {postId}}: Props) => {

    // console.log(params.postId)
  const queObject = postData.filter((post) => post.id === postId)

  const [description , setDescription] = useState('')

  return (
    <div>
      
      <div>
        {
        queObject.map((post, index) => (
            <QuePost key={index} post={post} />
        ))
      }
      </div>

      <div>
        <TipTap setDescription={setDescription}/>
      </div>
     
    </div>
  )
}

export default PostPage