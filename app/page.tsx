"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState , Suspense } from "react";

import imageCompression from 'browser-image-compression';

import {Home as HomeIcon , Search } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

import CustomFeed from "@/components/CustomFeed";
import RightHandFeed from "@/components/RightHandFeed/RightHandFeed";
import TopFeedCard from "@/components/TopFeedCard";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";

import {useForm} from "react-hook-form";
import { Controller } from "react-hook-form";

import { Tiptap } from "@/components/TipTapAns";
import { z } from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import { QuestionType } from "@/schemas/question";

import { auth , db , storage } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter , useSearchParams } from "next/navigation";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref , uploadBytes, uploadBytesResumable , getDownloadURL} from "firebase/storage";
import { DialogClose } from "@radix-ui/react-dialog";

import algoliasearch from "algoliasearch/lite";
// import algoliasearch from "algoliasearch";
import { InstantSearch , SearchBox , Hits, Highlight } from "react-instantsearch";
import Post from "@/components/Post";

type Input = z.infer<typeof QuestionType>;


export default function Home() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const isGuest = searchParams.get('isGuest');
  const [user, loading] = useAuthState(auth);
  const [newPost, setNewPost] = useState(false);

  //system image upload stuff
  const [imageUpload , setImageUpload] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [progress , setProgress] = useState<number | null>(0);

  const uploadImage = async(file: any) => {
    if(file == null) return;

    const storageRef = ref(storage, `questions/${file.name}`);

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

  useEffect(() => {
    if(!user)
      router.push('/auth');
  }, [user, loading ,])
  
  
  //algolsearchClientff
  
  const [searchClient, setSearchClient] = useState<any>(null);
  useEffect(() => {
    setSearchClient(algoliasearch('8XQGGZTFH3', 'bd743f217017ce1ea457a8febb7404ef'))
  } , [])

  // const client = algoliasearch('8XQGGZTFH3', 'bd743f217017ce1ea457a8febb7404ef')




  const [description, setDescription] = useState("");
  // console.log(description);

  const form = useForm<Input>({
    // mode: "onSubmit",
    // mode: "onChange",
    resolver: zodResolver(QuestionType),
    defaultValues: {
      title: "",
      description: "",
      questionImageURL: "",
      anonymity: false,
    },
  });

  async function createQuestionPost(data: Input) {

    const docRef = await addDoc(collection(db, "questions"), {
      title: data.title,
      description: data.description,
      uid: user?.uid,
      profilePic: user?.photoURL,
      name: user?.displayName,
      createdAt: serverTimestamp(),
      questionImageURL: imageUrl,
      anonymity: data.anonymity,
      // ansNumbers: 0,
    });

    console.log("Document written with ID: ", docRef.id);
    console.log(data);
  }

  function onSubmit(data: Input) {
    // console.log(data);

    createQuestionPost(data);
    setNewPost((prev)=>!prev);
    
  }

  const [searchTerm , setSearchTerm] = useState("");

  function transformHitToPost(hit: any) {
    return {
      id: hit.objectID, // Algolia provides an unique objectID for each record
      title: hit.title,
      name: hit.name,
      description: hit.description,
      profilePic: hit.profilePic,
      postImage: hit.postImage,
      likes: hit.likes,
      comments: hit.comments,
      shares: hit.shares,
      questionImageURL: hit.questionImageURL,
      createdAt: hit.createdAt,
      anonymity: hit.anonymity,
      // ansNumbers: hit.ansNumbers,
      // add other necessary fields
    };
  }

  const searchClasses = {
    root: 'flex flex-col space-y-2 ',
    form: 'flex flex-col space-y-2 ',
    input: 'w-full border border-gray-300 rounded-lg p-2 pl-10',
    // submit: 'bg-emerald-500 text-white rounded-lg p-2',
    submit: 'hidden',
    reset: 'hidden',
    // loadingIndicator: 'text-red-500',
    // submitIcon: 'h-5 w-5',
    // resetIcon: 'h-5 w-5',
    // loadingIcon: 'h-5 w-5',
  };

  // form.watch();

  return (
    <Suspense>
    <>
    {/* <h1 className='font-bold text-3xl md:text-4xl'>Your feed</h1> */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-y-4 md:gap-x-4 pb-6'>
        
        {/* <TopFeedCard /> */}
      
        
      <div className=" col-span-5 ">
        {/* {
          searchClient && (
            <InstantSearch searchClient={searchClient} indexName="search_questions" >

              <div className="relative">
              <SearchBox classNames={searchClasses} searchAsYouType={true} placeholder="Search ..." />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-700" />

              </div>

              
              <Hits  hitComponent={({hit}) => <Post post={transformHitToPost(hit)} />} />
              
            </InstantSearch>
          )
        } */}
        <CustomFeed newPost = {newPost}/>
        </div>
        {/* <CustomFeed /> */}


        {/* subreddit info */}
        <div className='col-span-4 lg:col-span-2 lg:sticky lg:top-24 overflow-hidden h-fit rounded-lg  order-first md:order-last space-y-3'>
          {/* <div className='bg-emerald-100 dark:bg-red-500 px-6 py-4'>
            <p className='font-semibold py-3 flex items-center gap-1.5'>
              <HomeIcon className='h-4 w-4' />
              Home
            </p>
          </div> */}
          <dl className='rounded-md divide-y divide-gray-100 border bg-[#FFFFFF] dark:bg-[#262626] border-gray-100  px-6 py-4 text-sm leading-6'>
            <div className='flex rounded-md justify-between md:min-h-[7.5rem] gap-x-4 py-3'>
              {
                isGuest === 'true' ? (
                  <p className=" text-zinc-500">
                    You are currently logged in as a Guest. To post question you need to have an account.
                  </p>
                ) : (
                <p className='text-zinc-500 font-semibold'>
                  Your personal Devotional frontpage. Come here to check in with your
                  favorite communities.
              </p>
                )
              }
            </div>

            <div>
              <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="default"  className=" w-full" disabled={isGuest === 'true'}>Ask Question</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[925px] ">
                    <DialogHeader>
                      <DialogTitle>Post Question</DialogTitle>
                      <DialogDescription>
                        Create your question here. Click post when you are done.
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
                                <Input className="" placeholder="Title for the question ..." {...field}/>
                              </FormControl>
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
                                <FormControl>
                                  <Controller
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                      <Tiptap {...field} setImageUpload={setImageUpload} uploadImage={uploadImage} progress={progress} />
                                    )}
                                    
                                   /> 
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                            )}
                          />

                          {/* anonymity toggle */}
                          <FormField
                            control={form.control}
                            name="anonymity"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Post Anonymously
                                  </FormLabel>
                                  {/* <FormDescription>
                                    Post question without revealing your identity.
                                  </FormDescription> */}
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
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
          </dl>

          {/* <RightHandFeed />           */}
          <div className='col-span-4 lg:col-span-2 overflow-hidden h-fit rounded-lg border border-gray-100 order-last'>
            <RightHandFeed />
          </div>

        </div>
        
      </div>
    </>
    </Suspense>
  );
}
