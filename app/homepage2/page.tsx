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

import { db } from "@/utils/firebase";
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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import algoliasearch from "algoliasearch/lite";
// import algoliasearch from "algoliasearch";
import { InstantSearch, SearchBox, Hits, Highlight } from "react-instantsearch";
import { Search } from "lucide-react";
import { add, set } from "date-fns";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { triggerSearch } from "@/store/slice";


import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/utils/firebase";
import { doc  } from "firebase/firestore";

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

export default function MusicPage() {

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
 
 
   //algolia stuff
 
   // const [searchText, setSearchText] = useState<string>('');
   const [searchResult, setSearchResult] = useState<any>(null);
 
   const { searchText, searchTriggered } = useSelector(
     (state: RootState) => state.search
   );
   const dispatch = useDispatch();
 
   const searchClient = algoliasearch(
     "8XQGGZTFH3",
     "bd743f217017ce1ea457a8febb7404ef"
   );
 
   const searchIndex = searchClient.initIndex("search_questions");
 
   // const handleSearchText = (e: ChangeEvent<HTMLInputElement>) => {
   //   e.preventDefault();
   //   setSearchText(e.target.value);
   // }
 
   const handleSearch = async (queryText: string) => {
     try {
       const result = await searchIndex.search(queryText);
       // console.log(result);
       setSearchResult(result.hits);
     } catch (error) {
       console.log(error);
       setSearchResult(null);
     }
   };
 
//    useEffect(() => {
//      //console.log("In Post", props.newPost);
//      setAddFirst(true);
//      setLastDoc(null);
//      setReload((prev) => !prev);
//    }, [props.newPost]);
 
   const loadMoreData = () => {
     setLastDoc(loadMore);
   };
 
   useEffect(() => {
     if (searchText === "") {
       setSearchResult(null);
     }
   }, [searchText]);
 
   useEffect(() => {
     if (searchTriggered) {
       handleSearch(searchText);
       dispatch(triggerSearch());
     }
   }, [searchTriggered]);
 
 
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
   

   //console.log("Postsssss: ", posts)
 
   //returning the searched results from algoia
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
       uid: hit.uid
       // ansNumbers: hit.ansNumbers,
       // add other necessary fields
     };
   }
   //old homepage stuff ends

  return (
    <>
      <div className="w-full">
        <div className="border-t w-full">
          <div className="bg-background w-full">
            <div className="grid lg:grid-cols-5 w-full">
            <Sidebar playlists={playlists} selectChange={handleSelectChange} currentC={selectedCategory||"all"} className="hidden lg:block" />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
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
                        <Button className="">
                          <PlusCircleIcon className="hidden lg:block mr-2 h-4 w-4" />
                          Ask Question
                        </Button>
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
                          <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 pb-4 gap-y-[5.5rem]">
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