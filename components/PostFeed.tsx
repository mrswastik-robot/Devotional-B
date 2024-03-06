"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import Post from "./Post";
import { postData } from "@/lib/data";

import { db } from "@/utils/firebase";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import algoliasearch from "algoliasearch/lite";
// import algoliasearch from "algoliasearch";
import { InstantSearch, SearchBox, Hits, Highlight } from "react-instantsearch";
import { Search } from "lucide-react";
import { set } from "date-fns";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { triggerSearch } from "@/store/slice";

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
  ansNumbers: number;
  // Add any other fields as necessary
};

const PostFeed = (props: Props) => {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const collectionRef = collection(db, "questions");
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, async (snapshot) => {
      const postsData = [];

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

      setPosts(postsData);
    });

    return () => {
      unsub();
    };
  }, []);

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
          <ul className=" flex flex-col col-span-2 space-y-1">
            {posts.map((post, index) => (
              <li key={index}>
                <Post post={post} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PostFeed;
