"use client"

import React from 'react'
import { useState } from 'react'

import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

type Props = {}

const PostVoteClient = (props: Props) => {
    const [currentVote, setCurrentVote] = useState<'UP' | 'DOWN' | null>(null)
    const [votesAmt, setVotesAmt] = useState<number>(0)

    const vote = (type: 'UP' | 'DOWN') => {
        if (currentVote === type) {
            setCurrentVote(null)
            setVotesAmt(votesAmt - 1)
        } else {
            setCurrentVote(type)
            setVotesAmt(votesAmt + 1)
        }
    }

  return (
    <div>
        <div className='flex flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0'>
      {/* upvote */}
      <Button
        onClick={() => vote('UP')}
        size='sm'
        variant='ghost'
        aria-label='upvote'>
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700', {
            'text-emerald-500 fill-emerald-500': currentVote === 'UP',
          })}
        />
      </Button>

      {/* score */}
      <p className='text-center py-2 font-medium text-sm text-zinc-900'>
        {votesAmt}
      </p>

      {/* downvote */}
      <Button
        onClick={() => vote('DOWN')}
        size='sm'
        className={cn({
          'text-emerald-500': currentVote === 'DOWN',
        })}
        variant='ghost'
        aria-label='downvote'>
        <ArrowBigDown
          className={cn('h-5 w-5 text-zinc-700', {
            'text-red-500 fill-red-500': currentVote === 'DOWN',
          })}
        />
      </Button>
    </div>
    </div>
  )
}

export default PostVoteClient