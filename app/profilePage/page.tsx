"use client";

import ProfileCard from "@/components/profilePage/ProfileCard";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


import { auth , db } from '@/utils/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { collection, query , where , onSnapshot, orderBy, and, startAfter, limit, getDocs , doc , getDoc, deleteDoc, collectionGroup} from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Post from '@/components/Post';
import Loader from '@/components/ui/Loader';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast";
import { FaChevronDown } from "react-icons/fa6";


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
  const [answers, setAnswers] = useState<PostType[]>([]);
  const [answerLastDoc, setAnswerLastDoc] = useState<any>(null);
  const [answerStart, setAnswerStart] = useState<boolean>(true);
  const [answerMorePosts, setAnswerMorePosts] = useState(false);
  const [ savedPosts , setSavedPosts] = useState<PostType[]>([]);
  const [lastPost, setLastPost] = useState<PostType | null>(null);
  const [savedStart, setSavedStart] = useState<boolean>(true);
  const [savedMorePosts, setSavedMorePosts] = useState(false);

  // console.log(user);
  const [postType, setPostType] = useState("normal");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isAnswers, setIsAnswers] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [questions, setQuestions] = useState<PostType[]>([]);
  const [anonymousQuestions, setAnonymousQuestions] = useState<PostType[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [LastDoc, setLastDoc] = useState<any>(null);
  const [anonymousMorePosts, setAnonymousMorePosts] = useState(false);
  const [anonymousLastdoc, setAnonymousLastdoc] = useState<any>(null);
  const [start, setStart] = useState<boolean>(true);
  const [anonymousStart, setAnonymousStart] = useState<boolean>(true);
  const [morePosts, setMorePosts] = useState(false);
  const [sortType, setSortType] = useState("recent")
  const [reload, setReload] = useState(false);
  const {toast} = useToast();
  
  //savedPosts

  const [loadMore, setLoadMore] = useState<boolean>(false);

  const handleDelete = async(postId:string)=>{
    try {
      // Delete the post from the 'questions' collection
      const postRef = doc(db, 'questions', postId);
      await deleteDoc(postRef);
      toast({
        title:'Deleted Sucessfully',
        variant:'default',
      })
      // Remove the deleted post from the state
      if (postType === 'normal') {
        setQuestions((prevQuestions) => prevQuestions.filter((post) => post.id !== postId));
      } else {
        setAnonymousQuestions((prevQuestions) => prevQuestions.filter((post) => post.id !== postId));
      }
  
      
    } catch (error) {
      toast({
        title:'Something went wrong',
        variant:'destructive',
      })
      console.error('Error deleting post: ', error);
    }
  }

  useEffect(() => {
    //console.log("heyyyyyyyyyyy");
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
                orderBy("createdAt", `${sortType=='recent'?"desc":"asc"}`),
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
                orderBy("createdAt", `${sortType=='recent'?"desc":"asc"}`),
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
          } else if(postType==="anonymous") {
            if (anonymousStart) {
              q = query(
                questionsRef,
                and(
                  where("uid", "==", user.uid),
                  where("anonymity", "==", true)
                ),
                orderBy("createdAt", `${sortType=='recent'?"desc":"asc"}`),
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
                orderBy("createdAt", `${sortType=='recent'?"desc":"asc"}`),
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
          else if(postType=="saved"){
            
              if(savedStart){
                if (!user) return;
                console.log(user.uid);
                try {
                  let postQuery = query(
                    collection(db, 'users', user.uid, 'savedPosts'),
                    orderBy("createdAt", `${sortType=='recent'?"desc":"asc"}`),
                    limit(5) // Adjust the limit based on your preference
                  );
                  const postSnapshot = await getDocs(postQuery);
                  //console.log(postQuery);
                  if (!postSnapshot.empty) {
                    const newPosts = postSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as PostType));
                    setSavedPosts((prevPosts) => [...prevPosts, ...newPosts]);
                    const slp=newPosts[newPosts.length - 1];
                    if (slp) setSavedMorePosts(true);
              else setSavedMorePosts(false);
              setLastPost(slp);
              setSavedStart(false);
                  }

                } catch (error) {
                  console.error('Error fetching saved posts:', error);
                }
              }
              else{
                try {
                  // Set up the query for the next batch
                  let postQuery = query(
                    collection(db, 'users', user.uid, 'savedPosts'),
                    orderBy("createdAt", `${sortType=='recent'?"desc":"asc"}`),
                    startAfter(lastPost ? lastPost.createdAt : null), // If there is a last post, start the query after it
                    limit(5) // Adjust the limit based on your preference
                  );
            
                  const postSnapshot = await getDocs(postQuery);
            
                  if (!postSnapshot.empty) {
                    const newPosts = postSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as PostType));
                    setSavedPosts((prevPosts) => [...prevPosts, ...newPosts]);
                    const lsp=newPosts[newPosts.length - 1];
                    if (lsp) setSavedMorePosts(true);
              else setSavedMorePosts(false);
              setLastPost(lsp);

                  }
                } catch (error) {
                  console.error('Error loading more posts:', error);
                }
              }
          }
          else if(postType=="answers"){
            const questionsRef = collection(db, 'questions');
            const questionQuery = query(questionsRef,
            orderBy("createdAt", `${sortType=='recent'?"desc":"asc"}`),);
            const questionSnapshot = await getDocs(questionQuery);
            let count = 0;
            const questionDoc = questionSnapshot.docs;
              const totalPost=questionDoc.length;
            if(answerStart){

            if (!questionSnapshot.empty) {
              
              let totalAnswers: any[] | ((prevState: PostType[]) => PostType[])=[];
              count=0;
              while(count<totalPost&&totalAnswers.length<=7){
              // Reference the 'answers' subcollection directly
              
              const answersCollectionRef = collection(questionDoc[count].ref, 'answers');
      
              const q = query(
                answersCollectionRef,
                // where("uid", "==", user.uid),
                orderBy("createdAt", `${sortType=='recent'?"desc":"asc"}`),
              );
      
              const snapshot = await getDocs(q);
      
              // Update state with the fetched answers
              totalAnswers=
                snapshot.docs.map(
                  (doc) => ({ id: doc.id, ...doc.data() } as PostType)
                )
      
            //   const lstdoc = snapshot.docs[snapshot.docs.length - 1];
            // // if (lstdoc) setAnswerMorePosts(true);
            // // else setAnswerMorePosts(false);
            // // setAnswerLastDoc(lstdoc);
            setAnswerStart(false);
            count++;
            }
            if(count<totalPost)setAnswerMorePosts(true)
            else setAnswerMorePosts(false);
            setAnswers(
              totalAnswers
            );

          }
          }
            else{

              if (!questionSnapshot.empty) {
                let intCount=0;
                // Reference the 'answers' subcollection directly
                  let totalAnswers:any =[];
              while((count||0)<totalPost&&totalAnswers.length<=7&&intCount<7){
                const answersCollectionRef = collection(questionDoc[count||0].ref, 'answers');
        
                const moreQ = query(
                  answersCollectionRef,
                  where("uid", "==", user.uid),
                  orderBy("createdAt", `${sortType=='recent'?"desc":"asc"}`),
                );
        
                const moreSnapshot = await getDocs(moreQ);
        
                // Update state with the fetched answers
                totalAnswers=moreSnapshot.docs.map(
                    (doc) => ({ id: doc.id, ...doc.data() } as PostType)
                  )
                 intCount++;
              }
              if(count<totalPost)setAnswerMorePosts(true)
            else setAnswerMorePosts(false);
              setAnswers((prevAnswers) => [
                ...prevAnswers,
                ...totalAnswers,
              ]);

              }

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
    }, [user, loading, router, postType, loadMore, reload]);

    //fetching the savedPosts from the 'users' collection
    // Fetching the savedPosts from the 'users' collection


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
      setIsSaved(true);
      setSavedStart(true);
      // setStart(false);
    }

    const handleLoadMore = () => {
      setLoadMore((prev)=>!prev)
    };

    const handleSortChange = ()=>{
      setStart(true);
      setAnonymousStart(true);
      setQuestions([]);
      setAnonymousQuestions([]);
      setAnswers([]);
      setAnswerStart(true);
      setSavedPosts([]);
      setSavedStart(true);
      setReload((prev)=>!prev)
    }
    

  function handleToggleSwithFollowers(){
    toast({
      title:'Feature Coming Soon',
      variant:'default',
    })
    setPostType('followers')
  }

  function handleToggleSwithFollowing(){
    toast({
      title:'Feature Coming Soon',
      variant:'default',
    })
    setPostType('following');
  }

  function handleToggleSwithAnswers(){
    setAnswerStart(true);
    setIsAnswers(true);
    setPostType('answers')
  }

  console.log("Hd ", savedPosts);

  return (
    <div className='mt-0'>
        <ProfileCard user={user}/>
        {/* <div className='toggleSwitch flex items-center justify-center mt-5'>
        <label className="inline-flex items-center cursor-pointer">
  <input type='checkbox' checked={isAnonymous} onChange={handleToggleSwitch} className="sr-only peer"/>
  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{isAnonymous ? 'Anonymous Posts' : 'Normal Posts'}</span>
</label>
      </div> */}
      <div className='toggleSwitch mt-2 overflow-auto'>
          <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid gap-2 grid-cols-6 w-[650px]">
        <TabsTrigger value="posts" onClick={handleToggleSwitchNormal} >Posts</TabsTrigger>
        <TabsTrigger value="answers" onClick={handleToggleSwithAnswers}>Answers</TabsTrigger>
        <TabsTrigger value="anonymous" onClick={handleToggleSwitchAnonymous}>Anonymous</TabsTrigger>
        <TabsTrigger value="saved" onClick={handleToggleSwithcSaved}>Saved Posts</TabsTrigger>
        <TabsTrigger value="followers" onClick={handleToggleSwithFollowers}>Followers</TabsTrigger>
        <TabsTrigger value="following" onClick={handleToggleSwithFollowing}>Following</TabsTrigger>
      </TabsList>
    </Tabs>
    </div>
    {(postType=='normal'||postType=='anonymous'||postType=='answers')&&
      <div className="border-y-[1px] border-black border-opacity-15 py-2 flex justify-between items-center">
        <div className="font-[600] opacity-80 ml-2">
        {postType=='normal'?<div>Normal</div>:postType=='anonymous'?<div>Anonymous</div>:postType=='answers'?<div>Answers</div>:<div>Coming Soon</div>}
        </div>
        <div className="mr-2">

        <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="font-[600] flex items-center gap-1 cursor-pointer opacity-75 rounded-md p-1 hover:bg-slate-200">{`${sortType=='recent'?"Most Recent":"Oldest"}`}<span><FaChevronDown/></span></div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-20">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={()=>{setSortType('recent');handleSortChange()}}>
            Most Recent
         
          </DropdownMenuItem>
          <DropdownMenuItem onClick={()=>{setSortType('oldest');handleSortChange()}}>
            Oldest
            
          </DropdownMenuItem>
          </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>

        </div>
      </div>
}
      <div>
        {
          <div>
            {postType=='anonymous' ? (
              <div>
                {anonymousQuestions?.length === 0
                  ? !loadingPosts && (
                      <div className="flex items-center justify-center flex-col mt-5 w-full">
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
                      <div key={index} className=" my-1">
                        <Post post={post} isProfile={true} handleDelete={handleDelete} />
                      </div>
                    ))}
              </div>
            ) : postType=='normal'? 
            <div>
              {
            questions?.length === 0 ? (
              !loadingPosts && (
                <div className="flex items-center justify-center flex-col mt-5 w-full">
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
                <div key={index} className=" my-1">
                  <Post post={post} isProfile={true} handleDelete={handleDelete} />
                </div>
              ))
            )
              }
            </div>
            :<div>
              {
                postType=='saved'?<div>
                   {
            savedPosts?.length === 0 ? (
              !loadingPosts && (
                <div className="flex items-center justify-center flex-col mt-5 w-full">
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
              savedPosts && postType === "saved" &&
              savedPosts.map((post, index) => (
                // <Post key={index} post={post} />
                <div key={index} className=" my-1">
                  <Post post={post} />
                </div>
              ))
            )
              }
                </div>:<div>
                  {
                    postType=='answers'?
                    
                    <div>
              {
            answers?.length === 0 ? (
              !loadingPosts && (
                <div className="flex items-center justify-center flex-col mt-5 w-full">
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
              answers && postType === "answers" &&
              answers.map((post, index) => (
                // <Post key={index} post={post} />
                <div key={index} className=" my-1">
                  <Post post={post} isProfile={true} handleDelete={handleDelete} />
                </div>
              ))
            )
              }
            </div>
                    :<div>{
                      // <NetworkList/> Will make a new component for followers and following list till then displaying no posts found.
                      <div className="flex items-center justify-center flex-col mt-5 w-full">
          <Image
            src="/trash.png"
            width={300}
            height={300}
            className=" w-[10rem] h-[9rem] rounded-full"
            alt="Profile Pic"
          />
          <h1 className=" text-2xl text-zinc-500">No posts yet</h1>
        </div>
                      }</div>
                  }
                </div>
              }
            </div>
            }
          </div>
        }

      </div>
      <div>
      {(postType=='normal'||postType=='anonymous'||postType=='answers'||postType=='saved')&& //will change this once lazy loading is available for all the tabs.
      <div className="flex items-center justify-center">
        {loadingPosts ? (
          <div>
            <Loader />
          </div>
        ) : (
          <div className="mt-2 mb-5">
            {isAnonymous ? (
              anonymousMorePosts ? (
                <Button onClick={handleLoadMore}>LoadMore...</Button>
              ) : (
                <div>No More Posts...</div>
              )
            ):(
              isAnswers?(
                answerMorePosts ? (
                  <Button onClick={handleLoadMore}>LoadMore...</Button>
                ) : (
                  <div>No More Posts...</div>
                )
              ):(
               isSaved?(
                savedMorePosts?(
                  <Button onClick={handleLoadMore}>LoadMore...</Button>
                ):(
                  <div>No More Posts...</div>
                )
               ):(
                morePosts ? (
                  <Button onClick={handleLoadMore}>LoadMore</Button>
                ) :
                 (
                  <div>No More Posts...</div>
                )
               )
              )

            )}
          </div>
        )}
      </div>
      }
      </div>
    </div>
  );
};

export default ProfilePage;
