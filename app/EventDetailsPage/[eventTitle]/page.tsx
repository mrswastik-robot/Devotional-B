
"use client";

import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import parse from 'html-react-parser';

import { Avatar, AvatarFallback , AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {Button} from '@/components/ui/button'

import { CalendarCheck2, HistoryIcon } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { History } from 'lucide-react';
import { FileBadge } from 'lucide-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { useRouter } from 'next/navigation';


type Props = {
  params: {
    eventTitle: string
  }
}

type EventDetailsType = {
  title: string
  description: string
  eventImageURL: string
  dateOfEvent: string
  locationOfEvent: string
  durationOfEvent: number
  registrationLink: string
  uid: string
  createdAt: string
  name: string
  profilePic: string
}

const EventDetailsPage = ({ params: { eventTitle } }: Props) => {

  const router = useRouter();

  const eventTitleDecoded = decodeURIComponent(eventTitle as string).split("-").join(" ");
  console.log(eventTitleDecoded);


  //fetching evenDetails from the database based on the eventTitle

  const [eventObject , setEventObject] = useState<EventDetailsType>({} as EventDetailsType);

  useEffect(() => {
    const eventRef = collection(db, 'events');
    const q = query(eventRef, where('title', '==', eventTitleDecoded));

    const eventsUnsub = onSnapshot(q, (snapshot) => {
      if(!snapshot.empty)
        {
          const doc = snapshot.docs[0];
          const data = doc.data() as EventDetailsType;
          setEventObject(data);

          return () => {
            eventsUnsub();
          }
        }
        else
        {
          console.log('No such event found');
          router.push('/404'); 
        }
    }
    )
  }
  ,[eventTitleDecoded])

  let dateString;
  if (eventObject.dateOfEvent) {
    const date = eventObject.dateOfEvent.toDate();
    dateString = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }


  return (
    <div className=' grid md:grid-cols-2 lg:grid-cols-7 gap-y-4 md:gap-x-4 pb-6 font-dmsans'>
        <div className=' md:col-span-5 col-span-2 order-first  '>

          <div className=' w-full  bg-white dark:bg-[#262626] rounded-md shadow break-words overflow-hidden mt-1 font-dmsans'>

            <div className=''>
                <div>
                  {
                    eventObject.eventImageURL ? 
                    <Image src={eventObject.eventImageURL} width={1920} height={1080} alt='Conference' />
                    :
                    <Image src='https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F723807029%2F1879204942643%2F1%2Foriginal.20240320-051010?w=940&auto=format%2Ccompress&q=75&sharp=10&s=5758072329789ed48407ed8022bcbe72' width={1920} height={1080} alt='Conference' />

                  }
                </div>
                <div className=' max-w-[70%]'>
                    <div className='p-4 space-y-7'>
                        <h1 className='text-3xl font-bold'>{eventObject.title}</h1>
                    </div>
                </div>
            </div>

            <div className=' max-w-[70%] p-4 gap-3'>
                <div className=' '>
                    <div className=' flex gap-3 '>
                        <Image
                        src={eventObject.profilePic}
                        width={10}
                        height={10}
                        alt='Conference'
                        className=' w-10 h-10 mt-2 rounded-full'
                        />
                        <div className=' space-y-1'>
                            <div className=' text-gray-700 flex gap-2 py-4'>
                                <p>By <span className='text-black font-bold'>{eventObject.name}</span></p>
                            </div>
                            
                        </div>
                    </div>

                    
                    

                </div>
            </div>

            <div className=' p-4 space-y-3 mt-4'>
                <h1 className=' font-bold'>Date and Time</h1>
                <div className=' flex gap-3'>
                    <CalendarCheck2 size={24} />
                    {dateString && <p className=' font-semibold text-gray-900 text-sm'>{dateString}</p>}
                </div>
            </div>

            <h1 className=' font-bold px-4 my-3 mt-7'>Location</h1>
            <div className=' px-4 flex gap-x-5'>
                <div className=' mt-2'>
                    <MapPin size={24} />
                </div>
                <div className=' flex-col gap-y-3'>
                    <p className=' font-bold text-base'>{eventObject.locationOfEvent}</p>
                    <p className=' text-sm'>2 Gangadhar Chetty Road Bengaluru, KA 560042</p>
                    <div className=' flex gap-1'>
                        <p className=' text-base font-bold text-blue-400 hover:underline cursor-pointer'>Show Map</p>
                        <ChevronDown className='text-blue-400' size={24} />
                    </div>
                </div>
            </div>

            {/* Description of the Event */}
            <div className='font-bold px-4 my-3 mt-7'>
                <div className=' px-4'>
                    <p className=' text-base'>{eventObject.description && parse(eventObject.description)}</p>
                </div>
            </div>


            
            <div className='p-4 mt-4'>
              <div className=' flex gap-4'>
                <h1 className=' text-xl font-bold'>Registration Link :</h1>
                <p className=' text-blue-400 underline cursor-pointer mt-1'>{eventObject.registrationLink}</p>
              </div>
            </div>

            <div className=' p-4 my-7 max-w-[80%]'>
                <h1 className=' font-bold text-2xl mb-4 '>Tags</h1>

                <div>
                    <div className=' space-y-2'>
                        <Button className=' bg-[#F1F2F2] text-black rounded-3xl'>
                            Pilot Training
                        </Button>
                        <Button className=' bg-[#F1F2F2] text-black rounded-3xl ml-2'>
                            Aviation
                        </Button>
                        <Button className=' bg-[#F1F2F2] text-black rounded-3xl ml-2'>
                            Career
                        </Button>
                        <Button className=' bg-[#F1F2F2] text-black rounded-3xl ml-2'>
                            Training
                        </Button>
                        <Button className=' bg-[#F1F2F2] text-black rounded-3xl ml-2'>
                            BAA Training
                        </Button>
                        <Button className=' bg-[#F1F2F2] text-black rounded-3xl'>
                            Pilot Training
                        </Button>
                        <Button className=' bg-[#F1F2F2] text-black rounded-3xl ml-2'>
                            Aviation
                        </Button>
                        <Button className=' bg-[#F1F2F2] text-black rounded-3xl ml-2'>
                            Career
                        </Button>
                        <Button className=' bg-[#F1F2F2] text-black rounded-3xl ml-2'>
                            Training
                        </Button>
                        <Button className=' bg-[#F1F2F2] text-black rounded-3xl ml-2'>
                            BAA Training
                        </Button>
                        <Button className=' bg-[#F1F2F2] text-black rounded-3xl'>
                            Pilot Training
                        </Button>
                        <Button className=' bg-[#F1F2F2] text-black rounded-3xl ml-2'>
                            Aviation
                        </Button>
                        <Button className=' bg-[#F1F2F2] text-black rounded-3xl ml-2'>
                            Career
                        </Button>
                        <Button className=' bg-[#F1F2F2] text-black rounded-3xl ml-2'>
                            Training
                        </Button>
                        <Button className=' bg-[#F1F2F2] text-black rounded-3xl ml-2'>
                            BAA Training
                        </Button>
                    </div>
                </div>

            </div>

            </div>

            <div className=' mt-3 p-4'>
              <div
                className="rounded-3xl border border-gray-300 p-4 cursor-pointer mx-2 md:mx-0 my-6"
                // onClick={() => setIsCommentBoxOpen(false)}
              >
                Write a Answer...
              </div>
            </div>


        </div>

        <div className=' sm:block hidden col-span-2 sticky overflow-hidden h-fit rounded-lg border border-gray-300 order-last'>
        <Card x-chunk="dashboard-01-chunk-5">
            <CardHeader>
              <CardTitle>Sponsors</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/02.png" alt="Avatar" />
                  <AvatarFallback>JL</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Jackson Lee
                  </p>
                  <p className="text-sm text-muted-foreground">
                    jackson.lee@email.com
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/03.png" alt="Avatar" />
                  <AvatarFallback>IN</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Isabella Nguyen
                  </p>
                  <p className="text-sm text-muted-foreground">
                    isabella.nguyen@email.com
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/04.png" alt="Avatar" />
                  <AvatarFallback>WK</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    William Kim
                  </p>
                  <p className="text-sm text-muted-foreground">
                    will@email.com
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/05.png" alt="Avatar" />
                  <AvatarFallback>SD</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Sofia Davis
                  </p>
                  <p className="text-sm text-muted-foreground">
                    sofia.davis@email.com
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  )
}

export default EventDetailsPage