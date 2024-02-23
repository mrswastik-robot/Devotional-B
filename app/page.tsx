"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import {Home as HomeIcon } from "lucide-react";
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
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {useForm} from "react-hook-form";
import { Controller } from "react-hook-form";

import { Tiptap } from "@/components/TipTap";
import { z } from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import { QuestionType } from "@/schemas/question";

import { auth , db , storage } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref , uploadBytes, uploadBytesResumable , getDownloadURL} from "firebase/storage";

type Input = z.infer<typeof QuestionType>;


export default function Home() {

  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  const [imageUpload , setImageUpload] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const uploadImage = () => {
    if(imageUpload == null) return;

    const storageRef = ref(storage, `questions/${imageUpload.name}`);

    const uploadTask = uploadBytesResumable(storageRef, imageUpload);

    uploadTask.on('state_changed', 
    (snapshot:any) => {
      // You can use this to display upload progress
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
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
  );

  }

  useEffect(() => {
    if(!user)
      router.push('/auth');
  }, [user, loading])

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
    });

    console.log("Document written with ID: ", docRef.id);
  }

  function onSubmit(data: Input) {
    // console.log(data);

    createQuestionPost(data);
    
  }

  // form.watch();

  return (
    <>
    {/* <h1 className='font-bold text-3xl md:text-4xl'>Your feed</h1> */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-y-4 md:gap-x-4 pb-6'>
        
        {/* <TopFeedCard /> */}
      
        <CustomFeed />

        {/* subreddit info */}
        <div className='col-span-4 lg:col-span-2 overflow-hidden h-fit rounded-lg  order-first md:order-last space-y-5'>
          {/* <div className='bg-emerald-100 dark:bg-red-500 px-6 py-4'>
            <p className='font-semibold py-3 flex items-center gap-1.5'>
              <HomeIcon className='h-4 w-4' />
              Home
            </p>
          </div> */}
          <dl className='rounded-lg divide-y divide-gray-100 border bg-[#FFFFFF] dark:bg-[#1A1A1B] border-gray-300  px-6 py-4 text-sm leading-6'>
            <div className='flex justify-between gap-x-4 py-3'>
              <p className='text-zinc-500'>
                Your personal Devotional frontpage. Come here to check in with your
                favorite communities.
              </p>
            </div>

            <div>
              <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="default"  className=" w-full">Ask Question</Button>
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

                      <Form {...form}>
                        <form
                        className="relative space-y-3 overflow-hidden"
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
                                <Input placeholder="Title for the question ..." {...field}/>
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
                                      <Tiptap {...field} />
                                    )}
                                    
                                   /> 
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                            )}
                          />

                          
                            <Button type="submit" className=" w-full">Post</Button>
                          

                        </form>
                      </Form>

                      <div>
                        {/* <input type="file" onChange={(event) => {setImageUpload(event.target.files[0])}}/> */}
                        <input type="file" onChange={(event) => {
                          if(event.target.files) {
                            setImageUpload(event.target.files[0]);
                          }
                        }}/>
                        <Button onClick={uploadImage}>Upload Image</Button>
                      </div>

                    
                  </DialogContent>
              </Dialog>
              
            </div>
          </dl>

          {/* <RightHandFeed />           */}
          <div className='col-span-4 lg:col-span-2 overflow-hidden h-fit rounded-lg border border-gray-300 order-first md:order-last'>
          <RightHandFeed />
        </div>

        </div>
        
      </div>
    </>
  );
}
