"use client";

import ProfileCard from "@/components/profilePage/ProfileCard";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


import { auth , db } from '@/utils/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { collection, query , where , onSnapshot, orderBy, and, startAfter, limit, getDocs , doc , getDoc} from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Post from '@/components/Post';
import Loader from '@/components/ui/Loader';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"


type Props = {};

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
  // Add any other fields as necessary
};

const ProfilePage = (props: Props) => {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  // console.log(user);
  const [postType, setPostType] = useState("normal");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [questions, setQuestions] = useState<PostType[]>([]);
  const [anonymousQuestions, setAnonymousQuestions] = useState<PostType[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [LastDoc, setLastDoc] = useState<any>(null);
  const [anonymousMorePosts, setAnonymousMorePosts] = useState(false);
  const [anonymousLastdoc, setAnonymousLastdoc] = useState<any>(null);
  const [start, setStart] = useState<boolean>(true);
  const [anonymousStart, setAnonymousStart] = useState<boolean>(true);
  const [morePosts, setMorePosts] = useState(false);
  
  //savedPosts
  const [ savedPosts , setSavedPosts] = useState<PostType[]>([]);

  const [loadMore, setLoadMore] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          router.push("/auth");
        } else {
          setLoadingPosts(true);
          const questionsRef = collection(db, "questions");
          let q;

          if (postType === "normal") {
            if (start) {
              q = query(
                questionsRef,
                and(
                  where("uid", "==", user.uid),
                  where("anonymity", "==", false)
                ),
                orderBy("createdAt", "desc"),
                limit(7)
              );
              const snapshot = await getDocs(q);
              setQuestions(
                snapshot.docs.map(
                  (doc) => ({ id: doc.id, ...doc.data() } as PostType)
                )
              );
              const lastdoc = snapshot.docs[snapshot.docs.length - 1];
              if (lastdoc) setMorePosts(true);
              else setMorePosts(false);
              setLastDoc(lastdoc);
              setStart(false);
            } else {
              const moreQ = query(
                questionsRef,
                and(
                  where("uid", "==", user.uid),
                  where("anonymity", "==", false)
                ),
                orderBy("createdAt", "desc"),
                startAfter(LastDoc),
                limit(7)
              );

              const moreSnapshot = await getDocs(moreQ);
              setQuestions((prevQuestions) => [
                ...prevQuestions,
                ...moreSnapshot.docs.map(
                  (doc) => ({ id: doc.id, ...doc.data() } as PostType)
                ),
              ]);
              const lastdoc = moreSnapshot.docs[moreSnapshot.docs.length - 1];
              if (lastdoc) setMorePosts(true);
              else setMorePosts(false);
              setLastDoc(lastdoc);
            }
          } else {
            if (anonymousStart) {
              q = query(
                questionsRef,
                and(
                  where("uid", "==", user.uid),
                  where("anonymity", "==", true)
                ),
                orderBy("createdAt", "desc"),
                limit(7)
              );
              const snapshot = await getDocs(q);
              setAnonymousQuestions(
                snapshot.docs.map(
                  (doc) => ({ id: doc.id, ...doc.data() } as PostType)
                )
              );
              const lastdoc = snapshot.docs[snapshot.docs.length - 1];
              if (lastdoc) setAnonymousMorePosts(true);
              else setAnonymousMorePosts(false);
              setAnonymousLastdoc(lastdoc);
              setAnonymousStart(false);
            } else {
              const moreQ = query(
                questionsRef,
                and(
                  where("uid", "==", user.uid),
                  where("anonymity", "==", true)
                ),
                orderBy("createdAt", "desc"),
                startAfter(anonymousLastdoc),
                limit(7)
              );

              const moreSnapshot = await getDocs(moreQ);
              setAnonymousQuestions((prevQuestions) => [
                ...prevQuestions,
                ...moreSnapshot.docs.map(
                  (doc) => ({ id: doc.id, ...doc.data() } as PostType)
                ),
              ]);
              const lastdoc = moreSnapshot.docs[moreSnapshot.docs.length - 1];
              if (lastdoc) setAnonymousMorePosts(true);
              else setAnonymousMorePosts(false);
              setAnonymousLastdoc(lastdoc);
            }
          }
        }
        setLoadingPosts(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingPosts(false);
      }
      };
    
      fetchData();
    }, [user, loading, router, postType, loadMore]);

    //fetching the savedPosts from the 'users' collection
    // Fetching the savedPosts from the 'users' collection
useEffect(() => {
  const fetchSavedPosts = async () => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const savedPostIds = userData.savedPosts;
      const savedPostsPromises = savedPostIds.map((postId: string) => {
        const postRef = doc(db, 'questions', postId); // Replace 'questions' with the name of your posts collection
        return getDoc(postRef);
      });

      const savedPostsDocs = await Promise.all(savedPostsPromises);
      const savedPosts = savedPostsDocs.map((doc) => ({ id: doc.id, ...doc.data() } as PostType));
      setSavedPosts(savedPosts);
    }
  };

  fetchSavedPosts();
}, [user]);


    const handleToggleSwitchNormal = () => {
      setStart(true);
      //setAnonymousStart(true);
      setIsAnonymous(false);
      setPostType('normal');
    };

    const handleToggleSwitchAnonymous = () => {
      setAnonymousStart(true);
      setIsAnonymous(true);
      setPostType('anonymous');
    };

    const handleToggleSwithcSaved = () => {
      setPostType('saved');
      setIsAnonymous(false);
      // setStart(false);
    }

    const handleLoadMore = () => {
      setLoadMore((prev)=>!prev)
    };
    

  return (
    <div className=' mt-4'>
        <ProfileCard user={user}/>
        {/* <div className='toggleSwitch flex items-center justify-center mt-5'>
        <label className="inline-flex items-center cursor-pointer">
  <input type='checkbox' checked={isAnonymous} onChange={handleToggleSwitch} className="sr-only peer"/>
  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{isAnonymous ? 'Anonymous Posts' : 'Normal Posts'}</span>
</label>
      </div> */}
      <div className='toggleSwitch w-full flex items-center justify-center mt-5'>
          <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid mx-auto  gap-3 grid-cols-3 w-[500px]">
        <TabsTrigger value="account" onClick={handleToggleSwitchNormal} >Normal Posts</TabsTrigger>
        <TabsTrigger value="password" onClick={handleToggleSwitchAnonymous}>Anonymous Posts</TabsTrigger>
        <TabsTrigger value="saved" onClick={handleToggleSwithcSaved}>Saved Posts</TabsTrigger>
      </TabsList>
      <TabsContent value="saved" className="min-w-full">
      { savedPosts.length !== 0 ? (
        savedPosts.map((post, index) => (
          <div key={index} className=" my-5">
            <Post post={post} />
          </div>
        ))
      ) : (
        <div className=" absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 ">
          <Image
            src="/trash.png"
            width={300}
            height={300}
            className=" w-[10rem] h-[9rem] rounded-full"
            alt="Profile Pic"
          />
          <h1 className=" text-2xl text-zinc-500">No posts yet</h1>
        </div>
      )}
      </TabsContent>
    </Tabs>
    </div>

      <div>
        {
          <div>
            {isAnonymous ? (
              <div>
                {anonymousQuestions?.length === 0
                  ? !loadingPosts && (
                      <div className=" absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 ">
                        <Image
                          src="/trash.png"
                          width={300}
                          height={300}
                          className=" w-[10rem] h-[9rem] rounded-full"
                          alt="Profile Pic"
                        />
                        <h1 className=" text-2xl text-zinc-500">
                          No posts yet
                        </h1>
                      </div>
                    )
                  : anonymousQuestions &&
                    anonymousQuestions.map((post, index) => (
                      // <Post key={index} post={post} />
                      <div key={index} className=" my-7">
                        <Post post={post} />
                      </div>
                    ))}
              </div>
            ) : questions?.length === 0 ? (
              !loadingPosts && (
                <div className=" absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 ">
                  <Image
                    src="/trash.png"
                    width={300}
                    height={300}
                    className=" w-[10rem] h-[9rem] rounded-full"
                    alt="Profile Pic"
                  />
                  <h1 className=" text-2xl text-zinc-500">No posts yet</h1>
                </div>
              )
            ) : (
              questions && postType === "normal" &&
              questions.map((post, index) => (
                // <Post key={index} post={post} />
                <div key={index} className=" my-5">
                  <Post post={post} />
                </div>
              ))
            )}
          </div>
        }

      </div>
      <div className="flex items-center justify-center">
        {loadingPosts ? (
          <div>
            <Loader />
          </div>
        ) : (
          <div className=" mb-7">
            {isAnonymous ? (
              anonymousMorePosts ? (
                <Button onClick={handleLoadMore}>LoadMore...</Button>
              ) : (
                <div>No More Posts...</div>
              )
            ) : morePosts ? (
              postType != 'saved' &&<Button onClick={handleLoadMore}>LoadMore</Button>
            ) : (
              <div>No More Posts...</div>
            )}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default ProfilePage;
