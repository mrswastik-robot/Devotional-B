"use client";


import React, { ChangeEvent, useEffect, useState } from "react";
import Post from "./Post";
import { postData } from "@/lib/data";
        
import { Button } from './ui/button';
import Loader from './ui/Loader';        

import { db } from "@/utils/firebase";
import { collection, getDocs, limit, onSnapshot, orderBy, query, startAfter } from 'firebase/firestore'

import algoliasearch from "algoliasearch/lite";
// import algoliasearch from "algoliasearch";
import { InstantSearch, SearchBox, Hits, Highlight } from "react-instantsearch";
import { Search } from "lucide-react";
import { set } from "date-fns";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { triggerSearch } from "@/store/slice";

type Props = {
  newPost:boolean
}

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
  // Add any other fields as necessary
};

const PostFeed = (props: Props) => {

  const [posts , setPosts] = useState<PostType[]>([]);
  const limitValue:number=7;
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loadMore, setLoadMore] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [reload, setReload] = useState(false);
  const [addFirst, setAddFirst] = useState(false);

  useEffect(() => {
    
    setIsLoading(true);
    const collectionRef = collection(db, 'questions');

    let q;
    if(lastDoc){
    q = query(collectionRef, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(limitValue));
    }
    else{
      q=query(collectionRef, orderBy('createdAt', 'desc'), limit(limitValue));
    }

    const unsub = onSnapshot(q, async(snapshot) => {
      const postsData:any = [];


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
        } as PostType;

        postsData.push(questionData);
      }

      
      const lastDocument = snapshot.docs[snapshot.docs.length - 1];
      setLoadMore(lastDocument);

      if(addFirst&&lastDoc==null){
        setPosts(postsData)
        setAddFirst(false);
      }
      else{
      setPosts((prevPosts)=>[...prevPosts, ...postsData]);
      }
      setIsLoading(false);
      setPageLoaded(true);
    })


    return () => {
      unsub();
    };
  }, [lastDoc, reload]);

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

  useEffect(() => {
    //console.log("In Post", props.newPost);
    setAddFirst(true);
    setLastDoc(null);
    setReload((prev)=>!prev);
  }, [props.newPost])

  const loadMoreData = ()=>{
    setLastDoc(loadMore);
  }

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

  return (
    <div className=" w-[100%]">
      <div className="relative">
        {searchResult && searchResult.length > 0 ? (
          <ul className="flex flex-col space-y-1">
            {searchResult.map((hit: any) => (
              <li key={hit.objectID}>
                <Post post={transformHitToPost(hit)} />
              </li>
            ))}
          </ul>
        ) : (
              <div className=' w-[100%]'>
            <ul className=' flex flex-col col-span-2 space-y-6'>
              {posts.map((post, index) => (
                <li key={index}>
                  <Post post={post} />
                </li>
              ))}
            </ul>
            <div className='w-[100%] lg:ml-64 md:ml-80 xl:ml-96'>
            { isLoading?<Loader/>:pageLoaded&&
            <div className='mt-4'>
            <Button>
            <button onClick={loadMoreData}>LoadMore...</button>
            </Button>
            </div>
            }
            </div>
            </div>
        )}
      
    </div>
    </div>
  );
};

export default PostFeed;
