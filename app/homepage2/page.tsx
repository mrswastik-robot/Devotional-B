"use client";

import { Metadata } from "next"
import Image from "next/image"
import { PlusCircleIcon } from "lucide-react"

import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area"
import { Separator } from "../../components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs"

import { AlbumArtwork } from "./components/album-artwork"
import { listenNowAlbums, madeForYouAlbums } from "./data/albums"
import { playlists } from "./data/playlists"
import { Sidebar } from "./components/sidebar"

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { postData } from "@/lib/data";

import { Button } from "../../components/ui/button";
import Loader from "../../components/ui/Loader"

import { db , storage} from "@/utils/firebase";
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { ref , uploadBytes, uploadBytesResumable , getDownloadURL} from "firebase/storage";
import imageCompression from 'browser-image-compression';


import styled, { createGlobalStyle } from "styled-components";



import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog";

import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast";


import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/utils/firebase";
import { doc  } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller } from "react-hook-form";
import { Tiptap } from "@/components/TipTapAns";


import { EventType } from "@/schemas/event";

type Input = z.infer<typeof EventType>;

type Props = {
  newPost: boolean;
};

type PostType = {
  id: string;
  name: string;
  title: string;
  description: string;
  profilePic: string;
  postImage: string;
  likes: number;
  shares: number;
  comments: number;
  questionImageURL: string;
  createdAt: string;
  anonymity: boolean;
  ansNumbers: number;
  uid:string;
  // Add any other fields as necessary
};

// export const metadata: Metadata = {
//   title: "Music App",
//   description: "Example music app using the components.",
// }

const CustomContainer = styled.div`
  height: 100%;
  padding-top: 1rem;
  `;

export default function MusicPage() {

  const { toast } = useToast();

  const form = useForm<Input>({
    resolver: zodResolver(EventType),
    defaultValues: {
      title: "",
      description: "",
      eventImageURL: "",
      // dateOfEvent: 0000/00/00,
      locationOfEvent: "",
      durationOfEvent: 0,
      registrationLink: "",
    },
  });

  const [isFocused, setIsFocused] = useState(false);


  //image uploading
  const [imageUpload , setImageUpload] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectC, setSelectC] = useState<any>([]);
  const [progress , setProgress] = useState<number | null>(0);
  const [previewImg, setPreviewImg] = useState<any>(null);


   //old homepage stuff
   const [posts, setPosts] = useState<PostType[]>([]);
   const limitValue: number = 6;
   const [lastDoc, setLastDoc] = useState<any>(null);
   const [loadMore, setLoadMore] = useState<any>(null);
   const [isLoading, setIsLoading] = useState(false);
   const [pageLoaded, setPageLoaded] = useState(false);
   const [reload, setReload] = useState(false);
   const [addFirst, setAddFirst] = useState(false);
   const [morePosts, setMorePosts] = useState(true);
 
   const [selectedCategory, setSelectedCategory] = useState<string | undefined>('all');
 
   const handleSelectChange = (newValue: string | undefined) => {
     setPosts([]);
     setLastDoc(null);
     setMorePosts(true);
     setSelectedCategory(newValue);
     console.log(selectedCategory);
   };
 
   //for automating loadmore lazy load button ...
   const loadMoreButtonRef = useRef<HTMLDivElement>(null);
 
   useEffect(() => {
 
     //old Code
     // setIsLoading(true);
     // console.log(selectedCategory);
     // const collectionRef = collection(db, "questions");
 
     // let q;
     // if (lastDoc) {
     //   q = query(
     //     collectionRef,
     //     orderBy("createdAt", "desc"),
     //     startAfter(lastDoc),
     //     limit(limitValue)
     //   );
     // } else {
     //   q = query(collectionRef, orderBy("createdAt", "desc"), limit(limitValue));
     // }
 
     // const unsub = onSnapshot(q, async (snapshot) => {
     //   const postsData: any = [];
 
     //   for (const doc of snapshot.docs) {
     //     // Fetch the 'answers' subcollection for each question
     //     const answersCollectionRef = collection(doc.ref, "answers");
     //     const answersQuery = query(answersCollectionRef);
 
     //     const answersSnapshot = await getDocs(answersQuery);
     //     const numAnswers = answersSnapshot.size;
 
     //     // Add the total number of answers to the question data
     //     const questionData = {
     //       id: doc.id,
     //       comments: numAnswers,
     //       ...doc.data(),
     //     } as PostType;
 
     //     postsData.push(questionData);
     //   }
 
     //   const lastDocument = snapshot.docs[snapshot.docs.length - 1];
     //   setLoadMore(lastDocument);
       
 
     //   if (addFirst && lastDoc == null) {
     //     setPosts(postsData);
     //     setAddFirst(false);
     //   } else {
     //     setPosts((prevPosts) => [...prevPosts, ...postsData]);
     //   }
     //   setIsLoading(false);
     //   setPageLoaded(true);
     // });
 
     // return () => {
     //   unsub();
     // };
     //old code ends
 
     console.log("Last Doc ", lastDoc);
     setIsLoading(true);
   const collectionRef = collection(db, "questions");
   let q;
 
   if (selectedCategory === "all") {
     if (lastDoc) {
       q = query(
         collectionRef,
         orderBy("createdAt", "desc"),
         startAfter(lastDoc),
         limit(limitValue)
       );
     } else {
       q = query(collectionRef, orderBy("createdAt", "desc"), limit(limitValue));
     }
   } else {
     if (lastDoc) {
       q = query(
         collectionRef,
         where("category", "array-contains", selectedCategory),
         orderBy("createdAt", "desc"),
         startAfter(lastDoc),
         limit(limitValue)
       );
     } else {
       q = query(
         collectionRef,
         where("category", "array-contains", selectedCategory),
         orderBy("createdAt", "desc"),
         limit(limitValue)
       );
     }
   }
   
   //const postLength = 0;
   const unsub = onSnapshot(q, async (snapshot) => {
     const postsData:any = [];
     if(snapshot.docs.length<limitValue){
       console.log("Length ", snapshot.docs.length);
       setMorePosts(false);
     }
     else{
       setMorePosts(true);
     }
     for (const doc of snapshot.docs) {
       // Fetch the 'answers' subcollection for each question
       const answersCollectionRef = collection(doc.ref, "answers");
       const answersQuery = query(answersCollectionRef);
       const answersSnapshot = await getDocs(answersQuery);
       const numAnswers = answersSnapshot.size;
 
       // Add the total number of answers to the question data
       const questionData = {
         id: doc.id,
         comments: numAnswers,
         ...doc.data(),
       };
 
       postsData.push(questionData);
     }
 
     const lastDocument = snapshot.docs[snapshot.docs.length - 1];
     setLoadMore(lastDocument);
 
     if (addFirst && lastDoc == null) {
       setPosts(postsData);
       setAddFirst(false);
     } else {
       setPosts((prevPosts) => [...prevPosts, ...postsData]);
     }
     setIsLoading(false);
     setPageLoaded(true);
   });
 
   return () => {
     unsub();
   };
 
   }, [lastDoc, reload , selectedCategory]);
 
   const categorySelect = async()=>{
     setPosts([]);
     setLastDoc(null);
 
   }


   //image uploading stuff
   const uploadImage = async(file: any) => {
    if(file == null) return;

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

    //uploading compressed file
    const uploadTask = uploadBytesResumable(storageRef, compressedFile);

    uploadTask.on('state_changed', 
    (snapshot:any) => {
      // You can use this to display upload progress
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      setProgress(progress);
    }, 
    (error: any) => {
      // Handle unsuccessful uploads
      console.log('Upload failed', error);
    }, 
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        // Save the URL to state or wherever you want to keep it
        setImageUrl(downloadURL);
      });
    }
  );}catch(err){
    console.error('Error compressing or uploading image:', err);
  }

  }

  function onSubmit(data: Input) {
    eventImageURL: imageUrl;
    console.log(imageUrl)
    console.log(data);

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }
 
 
   
 
   const loadMoreData = () => {
     setLastDoc(loadMore);
   };
 
 
   //useEffect for automting lazyload functionality
   useEffect(() => {
     if(morePosts){
     const observer = new IntersectionObserver(
       (entries) => {
         if (entries[0].isIntersecting) {
           loadMoreData();
         }
       },
       { threshold: 1 } // 1.0 means that when 100% of the target is visible within the element specified by the root option, the callback is invoked.
     );
   
     if (loadMoreButtonRef.current) {
       observer.observe(loadMoreButtonRef.current);
     }
   
     return () => {
       if (loadMoreButtonRef.current) {
         observer.unobserve(loadMoreButtonRef.current);
       }
     };
   }
   }, [loadMoreButtonRef, loadMoreData]);
   

  return (
    <>
      <div className="w-full font-dmsans">
        <div className="border-t w-full">
          <div className="bg-background w-full">
            <div className="grid lg:grid-cols-7 w-full">
            <Sidebar playlists={playlists} selectChange={handleSelectChange} currentC={selectedCategory||"all"} className="hidden lg:block" />
              <div className="col-span-3 lg:col-span-6 lg:border-l">
                <div className="px-4 py-6">
                  <Tabs defaultValue="music" className="h-full space-y-6">
                    <div className="space-between flex items-center">
                      <TabsList>
                        <TabsTrigger value="music" className="relative">
                          Feed Posts
                        </TabsTrigger>
                        {/* <TabsTrigger value="podcasts">Podcasts</TabsTrigger> */}
                        <TabsTrigger value="live" disabled>
                          Recents
                        </TabsTrigger>
                      </TabsList>
                      <div className="ml-auto lg:mr-4">
                      <div>
              <Dialog>
                {
                  
                  <DialogTrigger asChild>
                        <Button className="">
                          <PlusCircleIcon className="hidden lg:block mr-2 h-4 w-4" />
                          Create Event
                        </Button>
                  </DialogTrigger>
  }
                  <DialogContent className="sm:max-w-[925px] max-h-[55rem] overflow-y-scroll ">
                    <DialogHeader>
                      <DialogTitle>Create your Event</DialogTitle>
                      <DialogDescription>
                        Create your Event here. Click submit when you are done.
                      </DialogDescription>
                    </DialogHeader>
                      {/* <Tiptap /> */}
                     {/* <Textarea className="w-full min-h-[500px]" placeholder="What's your question?" /> */}

                      <div className=" border border-gray-300 rounded-3xl p-4 cursor-pointer">
                      <Form {...form}>
                        <form
                        className="relative space-y-3 "
                        onSubmit={form.handleSubmit(onSubmit)}
                        >

                          {/* Title */}
                          <FormField
                          control={form.control}
                          name="title"
                          render = {({field}) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input className="" placeholder="Title for the Event ..." {...field}/>
                              </FormControl>
                              <div className="text-[12px] opacity-70">This is the title, write your question here.</div>
                              <FormMessage/>
                            </FormItem>
                          )}
                          />

                          {/* EventImage */}
                          <FormField
                          control={form.control}
                          name="eventImageURL"
                          render = {({field}) => (
                            <FormItem>
                              <FormLabel>Event Image</FormLabel>
                              <FormControl>
                                <Input type="file" onChange={(event) => {
                                  if(event.target.files) {
                                    setImageUpload(event.target.files[0]);
                                  }
                                }}/>
                              </FormControl>
                              <div className="text-[12px] opacity-70">Upload an image for the Event.</div>
                              <FormMessage/>
                            </FormItem>
                          )}
                          />

                          {/* TipTap Editor */}
                          <FormField
                            control={form.control}
                            name="description"
                            render = {({field}) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <div className={`${isFocused?"border-black border-[2.1px]": "border-[1.2px]"} rounded-lg`} onFocus={() => setIsFocused(true)}
                                  onBlur={() => setIsFocused(false)}
                                  >
                                <FormControl>
                                  <Controller
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                      <Tiptap {...field} setImageUpload={setImageUpload} uploadImage={uploadImage} progress={progress} />
                                    )}
                                   /> 
                                </FormControl>
                                </div>
                                <div className="text-[12px] opacity-70">This is the description, give more details about your question here.</div>
                                <FormMessage/>
                              </FormItem>
                            )}
                          />
                          
                          {(progress||0)>0&&<span className='pt-3'>{`${Math.ceil((progress||0))} % Uploaded`}</span>}
                          {/* "0" to make upload percentage invisible when no image is selected */}
                          {/* anonymity toggle */}
                          <div>
                            {
                              previewImg&&<div className="w-full flex items-center justify-center">
                                <Image src={previewImg} alt="previewImage" width={250} height={250}/>
                              </div>
                            }
                          </div>

                          {/* DateOfEvent */}
                          <FormField
                              control={form.control}
                              name="dateOfEvent"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Date of birth</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            "w-[240px] pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                          date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormDescription>
                                    Your date of birth is used to calculate your age.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                          {/* Location of the Event */}
                          <FormField
                          control={form.control}
                          name="locationOfEvent"
                          render = {({field}) => (
                            <FormItem>
                              <FormLabel>Location of Event</FormLabel>
                              <FormControl>
                                <Input placeholder="Location of the Event ..." {...field}/>
                              </FormControl>
                              <div className="text-[12px] opacity-70">This is the location of the event.</div>
                              <FormMessage/>
                            </FormItem>
                          )}
                          />

                          <FormField
                          control={form.control}
                          name="durationOfEvent"
                          render={({field}) => (
                            <FormItem>
                              <FormLabel>Duration of the Event</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="Duration of the Event" {...field}
                                min={1}
                                max={24}
                                onChange={(e) => {
                                  form.setValue('durationOfEvent', parseInt(e.target.value))
                                }}
                                />
                              </FormControl>
                              <div className="text-[12px] opacity-70">This is the duration of the event.</div>
                              <FormMessage/>
                            </FormItem>
                          )}
                          />

                          <FormField
                          control={form.control}
                          name="registrationLink"
                          render = {({field}) => (
                            <FormItem>
                              <FormLabel>Registration Link</FormLabel>
                              <FormControl>
                                <Input placeholder="Registration Link ..." {...field}/>
                              </FormControl>
                              <div className="text-[12px] opacity-70">This is the registration link for the event.</div>
                              <FormMessage/>
                            </FormItem>
                          )}
                          />
                          

                          <DialogClose asChild>
                              <Button type="submit" 
                                className=" w-full"
                                // disabled={isGuest === 'true'}
                              >
                                Post
                              </Button>
                          </DialogClose>
                            
                          

                        </form>
                      </Form>
                      </div>

                      {/* <div>
                        <input type="file" onChange={(event) => {
                          if(event.target.files) {
                            setImageUpload(event.target.files[0]);
                          }
                        }}/>
                        <Button onClick={uploadImage}>Upload Image</Button>
                        <Progress value={progress} className=" w-[70%]"/>
                      </div> */}

                    
                  </DialogContent>
              </Dialog>
              
            </div>
                      </div>
                    </div>
                    <TabsContent
                      value="music"
                      className="border-none p-0 outline-none"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            Feed
                          </h2>
                          <p className="text-sm text-muted-foreground">
                          Enrich your spiritual journey through TheGodSays. Ask, seek, answer, and grow.
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex flex-col gap-y-[5.5rem]">
                          <div className="grid lg:grid-cols-4 grid-cols-1 gap-4 pb-4 gap-y-[5.5rem]">
                            {posts.map((post, index) => (
                                <div key={index} className="mb-12">
                              <AlbumArtwork
                                post={post}
                              />
                              </div>
                            ))}
                          </div>
                          <div className="mb-5">
                          <div className='w-[100]'>
            { isLoading?<Loader/>:pageLoaded&&
            <div ref={loadMoreButtonRef} className='mt-4'>
              <button onClick={loadMoreData}></button>
            </div>
            }
            </div>
            <div className="w-full text-center mt-0">{!isLoading&&!morePosts&&<div>No more Posts...</div>}</div>
                          </div>
                      </div>
                    </TabsContent>
                    <TabsContent
                      value="podcasts"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            New Posts
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Enrich your spiritual journey through TheGodSays. Ask, seek, answer, and grow.
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </>
  )
}