"use client";

import React, { ChangeEvent, useEffect, useState } from 'react'
import Post from './Post'
import { postData } from '@/lib/data'

import {db} from '@/utils/firebase'
import { collection, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore'



import algoliasearch from "algoliasearch/lite";
// import algoliasearch from "algoliasearch";
import { InstantSearch , SearchBox , Hits, Highlight } from "react-instantsearch";
import { Search } from "lucide-react";
import { set } from 'date-fns';

type Props = {}

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
}

const PostFeed = (props: Props) => {

  const [posts , setPosts] = useState<PostType[]>([]);

  useEffect(() => {

    const collectionRef = collection(db, 'questions');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsub = onSnapshot(q, async(snapshot) => {
      const postsData =[];

      for (const doc of snapshot.docs) {
        
        // Fetch the 'answers' subcollection for each question
        const answersCollectionRef = collection(doc.ref, 'answers');
        const answersQuery = query(answersCollectionRef);
    
        const answersSnapshot = await getDocs(answersQuery);
        const numAnswers = answersSnapshot.size;
    
        // Add the total number of answers to the question data
        const questionData = { id: doc.id, comments: numAnswers, ...doc.data() } as PostType;
    
        postsData.push(questionData);
      }
 
      setPosts(postsData);
    })

    return () => {
      unsub()
    }
  }, [])


  //algolia stuff

  const [searchText, setSearchText] = useState<string>('');
  const [searchResult , setSearchResult] = useState<any>(null);

  // const [searchClient, setSearchClient] = useState<any>(null);
  // useEffect(() => {
  //   setSearchClient(algoliasearch('8XQGGZTFH3', 'bd743f217017ce1ea457a8febb7404ef'))
  // } , [])

  const searchClient = algoliasearch('8XQGGZTFH3', 'bd743f217017ce1ea457a8febb7404ef')

  
  const searchIndex = searchClient.initIndex('search_questions');

  const handleSearchText = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchText(e.target.value);
  }

  const handleSearch = async(queryText: string) => {

    try {
      const result = await searchIndex.search(queryText);
      // console.log(result);
      setSearchResult(result.hits);
      
    } catch (error) {
      console.log(error);
      setSearchResult(null);
    }
  }

  useEffect(() => {
    if (searchText === '') {
      setSearchResult(null);
    }
  }, [searchText])



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
      ansNumbers: hit.ansNumbers,
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

  return (
    <div className=' w-[100%]'>
        {/* <ul className=' flex flex-col col-span-2 space-y-4'>
          {posts.map((post, index) => (
            <li key={index}>
              <Post post={post} />
            </li>
          ))}
        </ul> */}
        {/* {
          searchClient && (
            <InstantSearch searchClient={searchClient} indexName="search_questions">

              <div className="relative">
              <SearchBox classNames={searchClasses} searchAsYouType={true} placeholder="Search ..." />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-700" />

              </div>

              
              <Hits  hitComponent={({hit}) => <Post post={transformHitToPost(hit)} />} />
              
            </InstantSearch>
          )
        } */}
        <div className="relative">

          <input type="text" 
            value={searchText}
            onChange={handleSearchText} 
            placeholder="Search" 
            className="w-full border border-gray-300 rounded-lg p-2 pl-10" 
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(searchText);
                }
            }}
          />

          {
            searchResult && searchResult.length > 0 ? (
              <ul className="flex flex-col space-y-1">
                {searchResult.map((hit: any) => (
                  <li key={hit.objectID}>
                    <Post post={transformHitToPost(hit)} />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className=' flex flex-col col-span-2 space-y-1'>
          {posts.map((post, index) => (
            <li key={index}>
              <Post post={post} />
            </li>
          ))}
        </ul> 

            )
          }
          </div>        
    </div>
  )
}

export default PostFeed