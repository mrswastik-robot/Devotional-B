"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
// import { useRouter } from "next/router";        this won't work as we are using next/navigation in Next.js 14
import { usePathname, useRouter } from "next/navigation";

import { Book, HomeIcon, Search, User } from "lucide-react";
import { Home } from "lucide-react";
import { Bell } from "lucide-react";
import { NotebookTabs } from "lucide-react";
import { SquarePen } from "lucide-react";
import { UserRoundPlus } from "lucide-react";
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import AskQuestion from "./AskQuestion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "./ui/input";
import { ThemeToggler } from "./ThemeToggler";
import { Button } from "./ui/button";

import { auth } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { useDispatch , useSelector } from "react-redux";
import { setSearchText , triggerSearch } from "@/store/slice";
import { RootState } from "@/store/store";
//for event search
import { setEventSearchText , triggerEventSearch } from "@/store/slice";

import { useTheme } from "next-themes";


// import AskQuestion from "./AskQuestion";
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
import imageCompression from 'browser-image-compression';


import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

import {useForm} from "react-hook-form";
import { Controller } from "react-hook-form";

import { Tiptap } from "@/components/TipTapAns";
import { z } from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import { QuestionType } from "@/schemas/question";

import { db , storage } from "@/utils/firebase";
import { useSearchParams } from "next/navigation";

import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where , getDocs, writeBatch, limit, startAfter, getDoc } from "firebase/firestore";
import { ref , uploadBytes, uploadBytesResumable , getDownloadURL} from "firebase/storage";
import { DialogClose } from "@radix-ui/react-dialog";
import MobileSidebar from "./MobileSidebar";

import { useToast } from "./ui/use-toast";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { LuXCircle } from "react-icons/lu";
import logo from '../public/logo.png'

type Input = z.infer<typeof QuestionType>;

type Props = {
  // searchState: any;
  // setSearchState: any;
  // searchClient: any;
};

const Navbar = ({}: Props) => {

  //for searching stuff through the search bar in the navbar
  // const searchClient = useSelector((state: RootState) => state.search.searchClient);
  // const searchClient = algoliasearch('8XQGGZTFH3', 'bd743f217017ce1ea457a8febb7404ef');
  // const searchClient = useMemo(() => algoliasearch('8XQGGZTFH3', 'bd743f217017ce1ea457a8febb7404ef'), []);
  const router = useRouter();

  const { toast } = useToast();

  const searchParams = useSearchParams();
  const isGuest = searchParams.get('isGuest');
  const [newPost, setNewPost] = useState(false);
  //const [user, loading] = useAuthState(auth);
  const [imageUpload , setImageUpload] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectC, setSelectC] = useState<any>([]);
  const [progress , setProgress] = useState<number | null>(0);
  const [previewImg, setPreviewImg] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>('');

  //for real-time notifications
  const [notifications , setNotifications] = useState<any[]>([]);
  const [limitCount, setLimitCount] = useState(6); // Number of notifications to fetch at a time
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [showLoadMoreButton , setShowLoadMoreButton] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  //for algolia search
  const dispatch = useDispatch();
  const searchText = useSelector((state: RootState) => state.search.searchText);
  const eventSearchText = useSelector((state: RootState) => state.eventSearch.searchText);
  
  //different search box for events search through algolia
  const [hideQueSearch, setHideQueSearch] = useState(false);

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

  const handleSelectChange = (newValue: string | undefined) => {
    // setSelectedCategory(newValue);
    if(!selectC.includes(newValue)){
    setSelectC((prev:any)=>{
      return [...prev, newValue]
    })
  }
    //console.log(selectC);
  };

  const delCategories = (category:string)=>{
    let newCategory=selectC.filter((cat:any)=>{
      console.log(cat, " ", category);
      return cat!=category;
    })
  setSelectC(newCategory);
  }

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
  

  //just for that ' askQuestion ' button in the navbar

  async function createQuestionPost(data: Input) {

    const docRef = await addDoc(collection(db, "questions"), {
      title: data.title,
      description: data.description,
      uid: user?.uid,
      profilePic: user?.photoURL,
      name: name||user?.displayName,
      createdAt: serverTimestamp(),
      questionImageURL: imageUrl,
      category: selectC,
      anonymity: data.anonymity,
      // ansNumbers: 0,
    });

    const quesId = docRef.id;

    toast({
      title: "Question Posted",
      description: "Try refreshing in case you don't see your question",
    })

    try {
      console.log("keyword Gen.....")
      const docRef = await addDoc(collection(db, 'keywords'), {
        prompt: `Generate some keywords and hashtags on topic ${data.title} and give it to me in "**Keywords:**["Keyword1", "Keyword2",...] **Hashtags:**["Hashtag1", "Hashtag2",...]" this format`,
      });
      console.log('Keyword Document written with ID: ', docRef.id);
  
      // Listen for changes to the document
      const unsubscribe = onSnapshot(doc(db, 'keywords', docRef.id), async(snap) => {
        const data = snap.data();
        if (data && data.response) {
          console.log('RESPONSE: ' + data.response);
          const keywordsStr = `${data.response}`;

          const cleanedString = keywordsStr.replace(/\*|\`/g, '');

          const splitString = cleanedString.split("Keywords:");
          const keywordsString = splitString[1].split("Hashtags:")[0].trim();
          const hashtagsString = splitString[1].split("Hashtags:")[1].trim();

          const keywordsArray = JSON.parse(keywordsString);
          const hashtagsArray = JSON.parse(hashtagsString);

          const questionDocRef = doc(db, 'questions', quesId);
          await updateDoc(questionDocRef, {
          keywords: keywordsArray,
          hashtags: hashtagsArray
      });
        }
      });
  
      // Stop listening after some time (for demonstration purposes)
      setTimeout(() => unsubscribe(), 60000);
    } catch (error) {
      console.error('Error adding document: ', error);
    }

    console.log("Document written with ID: ", docRef.id);
    console.log(data);
  }

  function onSubmit(data: Input) {
    // console.log(data);

    createQuestionPost(data);
    setNewPost((prev)=>!prev);
    
  }

  const handleSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    dispatch(setSearchText(e.target.value));
  }

  //event
  const handleEventSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    dispatch(setEventSearchText(e.target.value));
  }

  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }

  const [clicked, setClicked] = useState("");

  const [user, loading] = useAuthState(auth);

  const signoutHandler = ()=>{
    auth.signOut();
    if(user?.isAnonymous){
    router.push("/auth");
    }
  }

  const guestHandler = ()=>{
    if(user?.isAnonymous){
    auth.signOut();
    router.push("/auth");
    }
  }

  const [name, setName] = useState<string>(user?.displayName||"Loading...");

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const following = userData?.following?.length;
          const followers = userData?.followers?.length;
          const realName = userData?.name;
          // Assuming followers and following fields exist in user data
          setName(realName);
          // setFollowersCount(followers || 0);
          // setFollowingCount(following || 0);
        }
      }
    };

    fetchUserData();
  }, [user?.uid]);

  //fetching real-time notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      const notificationsRef = collection(db, "notifications");
      const q1 = query(
        notificationsRef,
        where("questionUid", "==", user?.uid),
        where("answerUid", "<", user?.uid),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
      
      const q2 = query(
        notificationsRef,
        where("questionUid", "==", user?.uid),
        where("answerUid", "!=", user?.uid), // Filter out notifications where the answer is from the user
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      const unsubscribe1 = onSnapshot(q1, (snapshot) => {
        const newNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setNotifications(newNotifications);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]); // Update last visible notification
      });

      const unsubscribe2 = onSnapshot(q2, (snapshot) => {
        const newNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setNotifications(newNotifications);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]); // Update last visible notification
      });

      // Clean up the listeners when the component unmounts
      return () => {
        unsubscribe1();
        unsubscribe2();
      };
    };

    fetchNotifications();
  }, [user, limitCount]);

  const loadMoreNotifications = () => {

    setShowLoadMoreButton(false);

    if (lastVisible) {
      const notificationsRef = collection(db, "notifications");
      const nextQ1 = query(
        notificationsRef,
        where("questionUid", "==", user?.uid),
        where("answerUid", "<", user?.uid),
        orderBy("createdAt", "desc"),
        limit(limitCount),
        startAfter(lastVisible)
      );
      
      const nextQ2 = query(
        notificationsRef,
        where("questionUid", "==", user?.uid),
        where("answerUid", "!=", user?.uid), // Filter out notifications where the answer is from the user
        orderBy("createdAt", "desc"),
        limit(limitCount),
        startAfter(lastVisible)
      );

      const unsubscribeNext1 = onSnapshot(nextQ1, (snapshot) => {
        const newNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setNotifications((prevNotifications) => [...prevNotifications, ...newNotifications]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]); // Update last visible notification
      });

      const unsubscribeNext2 = onSnapshot(nextQ2, (snapshot) => {
        const newNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setNotifications((prevNotifications) => [...prevNotifications, ...newNotifications]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]); // Update last visible notification
      });

      // Clean up the listeners when the component unmounts
      return () => {
        unsubscribeNext1();
        unsubscribeNext2();
      };
    }
  };

//clear notifications
const clearNotifications = async () => {
  const batch = writeBatch(db);

  // Get all the notifications documents for the current user
  if(user){
    const notificationsSnapshot = await getDocs(query(collection(db, "notifications"), where("questionUid", "==", user.uid)));
  

  // Add each document to the batch to be deleted
  notificationsSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // Commit the batch
  await batch.commit();

}
  // Clear the notifications state
  setNotifications([]);
};

  const pathname = usePathname();

  useEffect(() => {
    if(pathname === '/homepage2') {
      setHideQueSearch(true);
    } else {
      setHideQueSearch(false);
    }
  }, [pathname]);

  if (pathname === "/auth") {
    return null;
  }

  
    


  return (
    <div className="fixed top-0 max-w-full inset-x-0 h-fit bg-[#FFFFFF] dark:bg-[#020817] border-b border-zinc-300 z-[10] py-2 font-dmsans">

      {/* mobile Navbar */}
      <div className=" md:hidden flex justify-between px-2">
        <MobileSidebar />
        <Link
        href={`/`}
        className=" my-auto"
        >
          <p className=" text-lg font-bold my-auto font-dmsans">
          <Image src={logo} alt="logo" width={150} height={55} />
          </p>
        </Link>
        <Link
        href={`/profilePage`}
        >
          <Image
          src={user?.photoURL || "/nodp.webp"}
          alt="profile picture"
          width={40}
          height={40}
          className=" rounded-full"

          />
        </Link>
      </div>


      <div className=" sm:block hidden container max-w-7xl h-full mx-auto md:flex items-center justify-between ">
        {/* logo */}
        <div className=" flex gap-[1rem]">
          <Link href="/" className="flex gap-2 items-center">
            <p className="hidden text-zinc-700 dark:text-emerald-100 text-xl font-bold md:block mr-[4rem]">
              <Image src={logo} alt="logo" width={160} height={60} />
            </p>
          </Link>

          {/* search bar */}
        { !hideQueSearch && <div className=" relative ml-5">
          {/* <Input className=" pl-10 w-[40rem]" placeholder="Search" /> */}
          <input type="text" 
            value={searchText}
            onChange={handleSearchText} 
            placeholder="Search" 
            className="w-[37rem] text-sm border border-gray-300 rounded-md p-2 pl-8" 
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  dispatch(triggerSearch());
                }
            }}
          />
          <Search className=" absolute left-2 top-1/2 transform text-gray-400 -translate-y-1/2 h-4 w-4" />
        </div>
        }

        {/* ye upar wala que search ka input tha , ab neeche event search ka input bana rhe */}

        { hideQueSearch && <div className=" relative ml-5">
          {/* <Input className=" pl-10 w-[40rem]" placeholder="Search" /> */}
          <input type="text" 
            value={eventSearchText}
            onChange={handleEventSearchText}
            placeholder="Search Events" 
            className="w-[37rem] text-sm border border-gray-300 rounded-md p-2 pl-8" 
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  dispatch(triggerEventSearch());
                }
            }}
          />
          <Search className=" absolute left-2 top-1/2 transform text-gray-400 -translate-y-1/2 h-4 w-4" />
        </div>
        }


        </div>

        <div className="flex ">
        <div>
              <Dialog>
                {
                  isGuest === 'true'||user?.isAnonymous==true?
                  <Button variant="outline"  className=" rounded-3xl w-full" onClick={guestHandler}>Ask Question</Button>:
                  <DialogTrigger asChild>
                    <Button variant="outline"  className=" rounded-3xl w-full">Ask Question</Button>
                  </DialogTrigger>
  }
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
                              <div className="text-[12px] opacity-70">This is the title, write your question here.</div>
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
                          <div>
                          <div className="text-sm font-medium mb-2">Category</div>
                          <Select value={selectedCategory} onValueChange={handleSelectChange} >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Categories</SelectLabel>
          <SelectItem value="How To">How To</SelectItem>
          <SelectItem value="Help">Help</SelectItem>
          <SelectItem value="Mystery/Haunted/Ghost">Mystery/Haunted/Ghost</SelectItem>
          <SelectItem value="Astrology/Remedies/Occult">Astrology/Remedies/Occult</SelectItem>
          <SelectItem value="GemStones/Rudraksha">GemStones/Rudraksha</SelectItem>
          <SelectItem value="Others">Others</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <div className="flex">
                              {
                                selectC.map((category:string, index:number)=>{
                                  return <span className='bg-slate-300 text-slate-800 rounded-xl p-1 text-sm flex mr-1 mt-3' key={index}>{category} <span onClick={()=>{delCategories(category)}} className="mt-[0.27rem] ml-1 cursor-pointer text-slate-800 hover:text-slate-900"><LuXCircle /></span></span>
                                })
                              }
                            </div>
                            <div className="text-[12px] opacity-70 mt-[0.45rem]">This is the category, you can choose multiple categories for your Question.</div>
                          </div>
                          <FormField
                            control={form.control}
                            name="anonymity"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Post Anonymously
                                    <div className="text-[12px] font-normal opacity-70">Hide your details while posting question</div>
                                  </FormLabel>
                                  {/* <FormDescription>
                                    Post question without revealing your identity.
                                  </FormDescription> */}
                                </div>
                                <div className="mb-5">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                </div>
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

            <div className=" ml-5 flex">
          <Button variant="ghost" className="hover:bg-transparent" onClick={() => setClicked("home")}>
            <Link href="/">
            <Home
              className={`h-5 w-5 ${clicked === 'home' ? "" : ""}`}
            />
            </Link>
          </Button>
          
          {/* Notification Drop-down */}
          <div className="ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hover:bg-transparent focus-visible:ring-0.1" onClick={() => setClicked("notification")}>
                <Bell
                  className={`h-5 w-5 ${clicked === 'notification' ? "" : ""}`}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto overflow-auto px-2 break-words">
              <DropdownMenuLabel className=" justify-between flex gap-8">
                {notifications.length === 0 ? "No new notifications" : "Notifications"}
                {notifications.length > 0 && (
                  <button onClick={clearNotifications}>
                    Clear
                  </button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="max-h-[21rem] max-w-[22rem] overflow-y-auto overflow-x-hidden">
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id}>
                    <Link href={`/${encodeURIComponent(notification.questionTitle.split(" ").join("-"))}`} className=" flex gap-2">
                      <Image
                      src={notification.answerProfilePic || "/nodp.webp"}
                      alt="profile picture"
                      width={24}
                      height={24}
                      className=" h-8 w-8 rounded-full my-auto"
                      />
                      <span className="flex flex-col overflow-hidden">
                        <div>
                        <span className="font-bold">{notification.answerName}</span> 
                        <span className="text-sm"> commented on </span>
                        </div>
                        <span className=" font-bold underline overflow-hidden text-ellipsis whitespace-nowrap max-h-[2.4em] max-w-[15rem]">{notification.questionTitle}s</span>
                      </span>
                    </Link>
                    <Separator orientation="horizontal" className=" absolute bottom-0 w-full" />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {notifications.length>0&& showLoadMoreButton &&
              <div className="cursor-pointer w-full flex justify-center text-sm" onClick={loadMoreNotifications}>Load More</div>
              }
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
          
        </div>

        <div className="flex gap-4 ml-5">
          {/* <ThemeToggler className=" mr-4" /> Theme option added on dropdown menu  */}

          {(user) ? (<div>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Avatar className='cursor-pointer'>
              <div className=" relative w-full h-full aspect-square">
                <Image
                  fill
                  src={user?.photoURL || "/nodp.webp"}
                  alt="profile picture"
                  referrerPolicy="no-referrer"
                />
              </div>
              <AvatarFallback>SP</AvatarFallback>
            </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>{`${user.isAnonymous?"Guest":name}`}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
              <Link href="/profilePage">
                <DropdownMenuItem>
                
                  Profile
                
                </DropdownMenuItem>
                </Link>
                
                <Link href="/settings">
                <DropdownMenuItem>
                  Settings
                </DropdownMenuItem>
                </Link>
                <div className="mt-1 ml-2 mb-2">
                <div className="flex items-center justify-between pr-1 space-x-2">
                <Label htmlFor="airplane-mode" className="font-normal">Dark Mode</Label>
                <Switch id="airplane-mode" onCheckedChange={toggleTheme} checked={theme==='dark'}/>
                </div>
                </div>
                </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signoutHandler}>
                {`${user.isAnonymous?"Sign Up":"Log Out"}`}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
            {/* Old comp */}
            {/* <Link href="/profilePage">
            <Avatar>
              <div className=" relative w-full h-full aspect-square">
                <Image
                  fill
                  src={user?.photoURL || "/nodp.webp"}
                  alt="profile picture"
                  referrerPolicy="no-referrer"
                />
              </div>
              <AvatarFallback>SP</AvatarFallback>
            </Avatar>
            </Link> */}
            </div>
          ) : (
            <Link href="/auth">
              <Button variant="default" className=" rounded-3xl">Sign In</Button>
            </Link>
          )}
          

        </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
