import Image from "next/image";
import Link from "next/link";

import {Home as HomeIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

import CustomFeed from "@/components/CustomFeed";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  return (
    <>
    <h1 className='font-bold text-3xl md:text-4xl'>Your feed</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-y-4 md:gap-x-4 py-6'>
      
        <CustomFeed />

        {/* subreddit info */}
        <div className='col-span-4 lg:col-span-2 overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last'>
          {/* <div className='bg-emerald-100 dark:bg-red-500 px-6 py-4'>
            <p className='font-semibold py-3 flex items-center gap-1.5'>
              <HomeIcon className='h-4 w-4' />
              Home
            </p>
          </div> */}
          <dl className='-my-3 divide-y divide-gray-100  px-6 py-4 text-sm leading-6'>
            <div className='flex justify-between gap-x-4 py-3'>
              <p className='text-zinc-500'>
                Your personal Devotional frontpage. Come here to check in with your
                favorite communities.
              </p>
            </div>

            <div>
              <Dialog>
                  <DialogTrigger asChild>
                    <Button  className=" w-full">Ask Question</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[925px] ">
                    <DialogHeader>
                      <DialogTitle>Post Question</DialogTitle>
                      <DialogDescription>
                        Create your question here. Click post when you are done.
                      </DialogDescription>
                    </DialogHeader>
                      <Textarea className="w-full min-h-[500px]" placeholder="What's your question?" />
                    <DialogFooter>
                      <Button type="submit" className=" w-full">Post</Button>
                    </DialogFooter>
                  </DialogContent>
              </Dialog>
              
            </div>
          </dl>
        </div>
      </div>
    </>
  );
}
