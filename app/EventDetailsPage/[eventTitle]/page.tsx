
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
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@nextui-org/table";
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
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { History } from 'lucide-react';
import { FileBadge } from 'lucide-react';
import { Building } from 'lucide-react';

import { Timestamp, addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db , auth , storage } from '@/utils/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { z } from 'zod';
import { eventCommentSchema } from '@/schemas/eventComment';
import { zodResolver } from '@hookform/resolvers/zod';
import { Clock } from 'lucide-react';

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
  sponsors: Array<string>

  preConferenceDate: Timestamp
  registrationStartDate: Timestamp
  registrationEndDate: Timestamp
  earlyBirdRegistrationFee: number
  lateRegistrationFee: number
  creditPoints: number
  contactNumber: number
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
  const [sponsors, setSponsors] = useState<string[]>([] as string[]);
  const [userData, setUserData] = useState<any>({});



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
                imageUrl: data.imageUrl,
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

  useEffect(()=>{
    console.log("chal bhai");
    console.log(eventObject);
    const fetchUserData = async () => {
      try {
        if(eventObject.uid){
        const userRef = doc(db, "users", eventObject.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("Creator ", userData);
          setUserData(userData);
        }
      }
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };
    fetchUserData();
  }, [eventObject]);

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

          <div className=' w-full  bg-white dark:bg-[#262626] rounded-md shadow break-words overflow-hidden mt-1 font-dmsans p-4'>

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
                        <h1 className='text-[21px] font-bold'>{eventObject.title}</h1>
                    </div>
                </div>
            </div>

            {/* <div className=' max-w-[70%] p-4 gap-3'>
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
            </div> */}

            <div className='md:flex gap-10 md:justify-between flex-row'>

            <div className=' p-4 space-y-3 mt-3'>
                <h1 className=' font-bold'>Date and Time</h1>
                <div className=' flex gap-3'>
                    <CalendarCheck2 size={24} />
                    {dateString && <p className=' font-semibold text-gray-900 text-sm'>{dateString}</p>}
                </div>
            </div>

            <div>
            <h1 className=' font-bold px-4 my-3 mt-6'>Location</h1>
            <div className=' px-4 flex gap-x-5'>
                <div className=' mt-2'>
                    <MapPin size={24} />
                </div>
                <div className=' flex-col gap-y-3'>
                      {
                        eventObject.locationOfEvent && 
                        (() => {
                          const [location, landmark] = eventObject.locationOfEvent.split(', ');
                          return (
                            <>
                              <p className=' font-bold text-base'>{location}</p>
                              <p className=' text-sm'>{landmark}</p>
                            </>
                          )
                        })()
                      }
                    <div className=' flex gap-1'>
                        <p className=' text-base font-bold text-blue-400 hover:underline cursor-pointer'>Show Map</p>
                        <ChevronDown className='text-blue-400' size={24} />
                    </div>
                </div>
            </div>
            </div>

            <div>
              <h1 className='font-bold  px-4 my-3 mt-6 text-base'>Duration of the event</h1>
              <div className='px-4 flex gap-2'><span><Clock/></span><div>{eventObject.durationOfEvent} hours</div></div>
              
            </div>

            </div>

            <div className='p-4 mt-5'>
              <div className=' flex gap-4'>
                <Badge className=' p-2 py-1'>
                <div className=' text-lg font-bold'>Registration Link :</div>
                </Badge>
                <p className=' text-blue-400 underline cursor-pointer text-lg mt-1'>{eventObject.registrationLink}</p>
              </div>
            </div>

            <div className=' p-4 mt-5'>
            <h1 className=' font-bold text-[16px] mb-4 '>Description</h1>
            <div className=' font-medium my-3 mt-6'>
                  <div className=''>
                      <p className=' text-[16px]'>{eventObject.description && parse(eventObject.description)}</p>
                  </div>
            </div>
            </div>

            <div>
            <Table className='p-0 m-0' aria-label="Example static collection table">
      <TableHeader>
        <TableColumn className='text-[18px]'>Event Info</TableColumn>
        <TableColumn className="text-[18px]">Details</TableColumn>

      </TableHeader>
      <TableBody>
        <TableRow key="1">
          <TableCell>Pre-Conference Date :</TableCell>
          <TableCell className='text-blue-400 underline cursor-pointer'>{eventObject.preConferenceDate&&eventObject.preConferenceDate.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>

        </TableRow>
        <TableRow key="2">
          <TableCell>Registration Start Date :</TableCell>
          <TableCell className='text-blue-400 underline cursor-pointer'>{eventObject.registrationStartDate&&eventObject.registrationStartDate.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
        </TableRow>
        <TableRow key="3">
          <TableCell>Registration End Date :</TableCell>
          <TableCell className='text-blue-400 underline cursor-pointer'>{eventObject.registrationEndDate&&eventObject.registrationEndDate.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
     
        </TableRow>
        <TableRow key="4">
          <TableCell>Early Bird Registration Fee :</TableCell>
          <TableCell className='text-blue-400 cursor-pointer'>{`₹ ${eventObject.earlyBirdRegistrationFee}`}</TableCell>

        </TableRow>

        <TableRow key="4">
          <TableCell>Late Registration Fee :</TableCell>
          <TableCell className="text-blue-400 cursor-pointer">{`₹ ${eventObject.lateRegistrationFee}`}</TableCell>

        </TableRow>

        <TableRow key="4">
          <TableCell>Contact Number :</TableCell>
          <TableCell className="text-blue-400 underline cursor-pointer">{eventObject.contactNumber}</TableCell>

        </TableRow>
      </TableBody>
    </Table>
            </div>

            <div className=' p-4 mb-5 mt-2'>
                <h1 className=' font-bold text-[18px] mb-4 '>Tags</h1>

                <div>
                    <div className=' space-y-2'>
                        {eventObject.hashtags?(
                          eventObject.hashtags.map((hashtag, index)=>{
                            return <span key={index} className='text-blue-600 ml-2'>
                            {hashtag}
                            </span>
                          })
                        ):<div>No Tags Found...</div>
                        }
                    </div>
                </div>

            </div>

            </div>

            {/* Comment box for the event */}
            <div className=" mt-3">
          {false ? (
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


       <div className="w-[21.3rem] sticky top-[4.2rem] h-fit">

        <div className='mt-3 sm:block hidden col-span-2 sticky overflow-hidden h-fit rounded-lg border border-gray-300'>
        <Card x-chunk="dashboard-01-chunk-5">
            <CardHeader>
              <CardTitle>Created By</CardTitle>
            </CardHeader>
            <CardContent className="">

            <div className="flex mb-1">
              <div>
            <Image
                        src={userData.profilePic}
                        width={250}
                        height={250}
                        alt='Conference'
                        className=' w-10 h-10 rounded-full'
                        />
            </div>  
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{userData.name}</p>
            <p className="text-sm text-muted-foreground">{userData.email}</p>
          </div>
          <div className="ml-auto font-medium"></div>
        </div>
              
            </CardContent>
          </Card>
        </div>

        <div className='mt-3 sm:block hidden col-span-2 sticky overflow-hidden h-fit rounded-lg border border-gray-300'>
          <Card x-chunk="dashboard-01-chunk-5">
              <CardHeader>
                <CardTitle>Register</CardTitle>
              </CardHeader>
              <CardContent className="">
                <p className=' text-base'>Register for this event on a single click</p>
                <div className=' flex items-end justify-end mt-4'>
                  <Button className=' w-full'>Register</Button>
                </div>
              </CardContent>
          </Card>
        </div>

        <div className='mt-3 sm:block hidden col-span-2 sticky overflow-hidden h-fit rounded-lg border border-gray-300'>
          <Card x-chunk="dashboard-01-chunk-5">
              <CardHeader>
                <CardTitle>Credits</CardTitle>
              </CardHeader>
              <CardContent className="">
                <h1 className=' text-4xl flex items-center justify-center mx-auto'>
                  {
                    eventObject.creditPoints 
                    ?
                    eventObject.creditPoints
                    :
                    0
                  }
                </h1>
              </CardContent>
          </Card>
        </div>

        <div className=' sm:block mt-3 hidden col-span-2 sticky overflow-hidden h-fit rounded-lg border border-gray-300 order-last'>
        <Card x-chunk="dashboard-01-chunk-5">
            <CardHeader>
              <CardTitle>Sponsors</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8 uppercase">

              {eventObject.sponsors?(
                eventObject.sponsors.map((sponsor, index)=>{
                  return <div key={index} className="flex items-center gap-4">
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src="/avatars/01.png" alt="Avatar" />
                    <AvatarFallback><Building/></AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {sponsor}
                    </p>
                  </div>
                </div>
                }
                )
              ):<div>No Sponsors Found...</div>
            }
              
            </CardContent>
          </Card>
        </div>


        </div>
    </div>
  )
}

export default EventDetailsPage