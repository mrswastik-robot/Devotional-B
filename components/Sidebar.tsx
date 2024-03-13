"use client";

import Image from "next/image";
import Link from "next/link";
import React , {use, useState} from "react";

import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Bell, Home, Newspaper, PencilLine, UserRoundPlus } from "lucide-react";
import { auth } from "@/utils/firebase";


//for ask question dialog
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
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import imageCompression from 'browser-image-compression';

import { usePathname, useRouter } from "next/navigation";
import {useForm} from "react-hook-form";
import { Controller } from "react-hook-form";

import { Tiptap } from "@/components/TipTapAns";
import { z } from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import { QuestionType } from "@/schemas/question";

import { db , storage  } from "@/utils/firebase";
import { useSearchParams } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref , uploadBytes, uploadBytesResumable , getDownloadURL} from "firebase/storage";
import { DialogClose } from "@radix-ui/react-dialog";

import { useToast } from "./ui/use-toast";

type Input = z.infer<typeof QuestionType>;


type Props = {};

const Sidebar = (props: Props) => {

    const [user , loading] = useAuthState(auth);
    const { theme, setTheme } = useTheme();
    const {toast} = useToast();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  //for 'ask question' dialog
  const searchParams = useSearchParams();
  const isGuest = searchParams.get('isGuest');
  const [newPost, setNewPost] = useState(false);

  const [imageUpload , setImageUpload] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [progress , setProgress] = useState<number | null>(0);

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

    toast({
        title: "Question Posted",
        description: "Your question has been posted successfully",
    })
    

    console.log("Document written with ID: ", docRef.id);
    console.log(data);
  }

  function onSubmit(data: Input) {
    // console.log(data);

    createQuestionPost(data);
    setNewPost((prev)=>!prev);
    
  }

  return (
    <div
      className=" space-y-4 py-4 flex flex-col h-full bg-[#FFFFFF] dark:bg-[#181818] text-black dark:text-white"
    //   data-aos="fade-right"
    //   data-aos-easing="linear"
    //   data-aos-duration="1000"
    >
      <div className=" px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-2 mb-14">
          <div className=" relative ">
            {/* <Image src="/scholar.svg" fill alt="logo" /> */}
            <p className=" text-xl font-extrabold">Devotional-B</p>
          </div>
        </Link>

        <div className="  space-y-1">
          <div>
            <ul className="flex flex-col space-y-9 justify-center mt-6 ">

            {/* ask question dialog */}
            <div>
              <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline"  className=" gap-2 rounded-3xl w-full" disabled={isGuest === 'true'}>
                        <PencilLine />
                        Ask Question
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[925px] max-h-[55rem] overflow-y-scroll ">
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
                          
                          {(progress||0)>0&&<span className='pt-3'>{`${Math.ceil((progress||0))} % Uploaded`}</span>}
                          {/* "0" to make upload percentage invisible when no image is selected */}
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



              <li className="cursor-pointer  hover:text-gray-600 hover:font-bold">
                <Link className=" flex gap-2" href="/">
                    <Home />
                    Home
                </Link>
              </li>

              <li className="cursor-pointer  hover:text-gray-600 hover:font-bold">
                <button className=" flex gap-2" onClick={() => toast({title: "Feature coming soon ...", variant:"feature"})}>
                    <Bell />
                    <p>Notifications</p>
                </button>
              </li>
              <li className="cursor-pointer  hover:text-gray-600 hover:font-bold">
                <button className=" flex gap-2" onClick={() => toast({title: "Feature coming soon ...", variant:"feature"})}>
                    <UserRoundPlus />
                    <p>Following</p>
                </button>
              </li>
              <li className="cursor-pointer  hover:text-gray-600 hover:font-bold">
                <button className=" flex gap-2" onClick={() => toast({title: "Feature coming soon ...", variant:"feature"})}>
                    <Newspaper />
                    <p>Newsletter</p>
                </button>
              </li>

              <li>
              <div className="flex items-center space-x-2">
                <Switch id="airplane-mode" onCheckedChange={toggleTheme} checked={theme==='dark'}/>
                <Label htmlFor="airplane-mode">Dark Mode</Label>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="absolute w-full bottom-4 flex items-center justify-center mt-10 right-4">
          <button className=" text-red-500 rounded-3xl w-[80%] border border-gray-300" onClick={() => auth.signOut()}>Sign Out</button>
        </div>

      </div>
    </div>
  );
};

export default Sidebar;