
"use client";

import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import parse from 'html-react-parser';

import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from '@/components/ui/use-toast';

import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback , AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CalendarCheck2, HistoryIcon } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { History } from 'lucide-react';
import { FileBadge } from 'lucide-react';
import { Timestamp, addDoc, collection, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db , auth , storage } from '@/utils/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { z } from 'zod';
import { eventCommentSchema } from '@/schemas/eventComment';
import { zodResolver } from '@hookform/resolvers/zod';

import { Tiptap } from '@/components/TipTapAns';

import imageCompression from 'browser-image-compression';
import { get } from 'http';
import { useAuthState } from 'react-firebase-hooks/auth';
import EventCommentPost from '@/components/eventDetailsPage/eventCommentPost';



type Props = {
  params: {
    eventTitle: string
  }
}

type Input = z.infer<typeof eventCommentSchema>;

type EventDetailsType = {
  title: string
  description: string
  eventImageURL: string
  dateOfEvent: Timestamp
  locationOfEvent: string
  durationOfEvent: number
  registrationLink: string
  uid: string
  hashtags: Array<string>
  createdAt: string
  name: string
  profilePic: string
}

type EventCommentType = {
  eventId: string
  eventTitle: string
  comment: string
  uid: string
  name: string
  profilePic: string
  createdAt: string
  imageUrl: string
}

const EventDetailsPage = ({ params: { eventTitle } }: Props) => {

  const router = useRouter();

  const { toast } = useToast();

  const [user , loading] = useAuthState(auth);

  const eventTitleDecoded = decodeURIComponent(eventTitle as string).split("-").join(" ");
  console.log(eventTitleDecoded);


  //fetching evenDetails from the database based on the eventTitle

  const [eventObject , setEventObject] = useState<EventDetailsType>({} as EventDetailsType);
  const [eventComment , setEventComment] = useState<EventCommentType[]>([] as EventCommentType[]);


  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [progress , setProgress] = useState<number | null>(0);
  const [previewImg, setPreviewImg] = useState<any>(null);



  //fetching the event details from the database and all the comments related to that event at the same time
  useEffect(() => {
    const eventRef = collection(db, 'events');
    const q = query(eventRef, where('title', '==', eventTitleDecoded));

    const eventsUnsub = onSnapshot(q, (snapshot) => {
      if(!snapshot.empty)
        {
          const doc = snapshot.docs[0];
          const data = doc.data() as EventDetailsType;
          setEventObject(data);

          //listener for the comments of the event
          const eventCommentsRef = collection(db, 'eventsComments');
          const q = query(eventCommentsRef, where('eventId', '==', doc.id));
          const commentsUnsub = onSnapshot(q, (snapshot) => {
            const comments = snapshot.docs.map((doc) => {
              const data = doc.data() as EventCommentType;
              return {
                eventId: data.eventId,
                eventTitle: data.eventTitle,
                comment: data.comment,
                uid: data.uid,
                name: data.name,
                profilePic: data.profilePic,
                createdAt: data.createdAt,
                imageUrl: data.imageUrl
              }
            })
            setEventComment(comments);
          })

          return () => {
            eventsUnsub();
            commentsUnsub();
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




  //comment section for the event
  const form = useForm<Input>({
    resolver: zodResolver(eventCommentSchema),
    defaultValues: {
      comment: "",
    },
  });


  const uploadImage = async(file: any) => {
    if (file == null) return;

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          const imageUrl = event.target.result;
          setPreviewImg(imageUrl);
        } else {
          console.error('Error reading file:', file);
          setPreviewImg(null);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImg(null);
    }

    const storageRef = ref(storage, `events/${file.name}`);

    try {
      // Set compression options
    const options = {
      maxSizeMB: 1, // Max size in megabytes
      maxWidthOrHeight: 800, // Max width or height
      useWebWorker: true, // Use web worker for better performance (optional)
    };
  
      // Compress the image
      const compressedFile = await imageCompression(file, options);

    const uploadTask = uploadBytesResumable(storageRef, compressedFile);

    uploadTask.on(
      "state_changed",
      (snapshot: any) => {
        // You can use this to display upload progress
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setProgress(progress);
      },
      (error: any) => {
        // Handle unsuccessful uploads
        console.log("Upload failed", error);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          // Save the URL to state or wherever you want to keep it
          setImageUrl(downloadURL);
        });
      }
    );
    }catch(err){
      console.log("Error compressing and uploading Image...")
    }
  };

  async function createEventComment(data: Input) {

    const eventRef = collection(db, 'events');
    const q = query(eventRef, where('title', '==', eventTitleDecoded));
    const snapshot = await getDocs(q);

    if(!snapshot.empty)
      {
        const doc = snapshot.docs[0];

        const eventId = doc.id;
        const docRef = await addDoc(collection(db, "eventsComments"),{
          eventId: eventId,
          eventTitle: eventTitleDecoded,
          comment: data.comment,
          uid: user?.uid,
          name: user?.displayName,
          profilePic: user?.photoURL,
          createdAt: new Date(),
          imageUrl: imageUrl
        })

        console.log("Document written with ID: ", docRef.id);

        toast({
          title: "Comment Posted",
        })
        form.reset();
        setImageUrl(null);
        setProgress(0);
        setPreviewImg(null);

      }
      else
      {
        console.log('No such event found');
        router.push('/404');
      }
  }    

  function onSubmit(data: Input) {
    createEventComment(data);
    setIsCommentBoxOpen(true);
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
                        {eventObject.hashtags?(
                          eventObject.hashtags.map((hashtag, index)=>{
                            return <Button key={index} className=' bg-[#F1F2F2] text-black rounded-3xl ml-2'>
                            {hashtag}
                            </Button>
                          })
                        ):<div>No Tags Found...</div>
                        }
                    </div>
                </div>

            </div>

            </div>

            {/* Comment box for the event */}
            <div className=" mt-3">
          {isCommentBoxOpen ? (
            <div
              className="rounded-3xl border border-gray-300 p-4 cursor-pointer mx-2 md:mx-0 my-6"
              onClick={() => setIsCommentBoxOpen(false)}
            >
              Write a Comment...
            </div>
          ) : (
            <div className=" rounded-3xl border border-gray-300 p-4 cursor-pointer">
              <Form {...form}>
                <form
                  className=" relative space-y-3 overflow-hidden"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  {/* TipTap Editor */}
                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel>Write an answer...</FormLabel> */}
                        <FormLabel>Comment Box</FormLabel>
                                <div className={`${isFocused?"border-black border-[2.3px]": "border-[2px] border-[#d3d7dd]"} rounded-lg`} onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                >
                        <FormControl>
                          <Controller
                            control={form.control}
                            name="comment"
                            render={({ field }) => <Tiptap {...field} setImageUpload={setImageUpload} uploadImage={uploadImage} progress={progress}/>}
                          />
                        </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  

                  <div className=" space-x-2 flex items-end justify-end ">
                    
                    <Button variant="outline" className=" rounded-3xl"
                    onClick={() => {setIsCommentBoxOpen(true); form.reset(); setImageUrl(null);}}
                    >
                      Cancel
                    </Button>

                    <Button type="submit" variant="outline" className=" rounded-3xl "
                    >
                      Post
                    </Button>
                  </div>
                  
                </form>
              </Form>
            </div>
          )}
        </div>

        <div>
              {eventComment.map((comment, index) => (
              <EventCommentPost key={index} eventComment={comment} />
            ))}
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