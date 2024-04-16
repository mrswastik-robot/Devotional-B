
import { createSlice , PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "./store";


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
interface PostState {
    posts : PostType[];
}

const initialState: PostState = {
    posts: []
}

//for storing cache using Redux

export const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPosts: (state , action: PayloadAction<PostType[]>) => {
            state.posts = action.payload;
        },
        addPosts: (state , action: PayloadAction<PostType[]>) => {
            state.posts = [...state.posts, ...action.payload];
        },
    }
});


//for algolia search through navbar component

export const searchSlice = createSlice({
    name: "search",
    initialState: {
        searchText: "",
        searchTriggered: false,
    },
    reducers: {
        setSearchText: (state, action) => {
        state.searchText = action.payload;
        },
        triggerSearch: (state) => {
            state.searchTriggered = !state.searchTriggered;
        }
    },
    });
    

//for algolia search but for events

export const eventSearchSlice = createSlice({
    name: "eventSearch",
    initialState: {
        searchText: "",
        searchTriggered: false,
    },
    reducers: {
        setSearchText: (state, action) => {
        state.searchText = action.payload;
        },
        triggerSearch: (state) => {
            state.searchTriggered = !state.searchTriggered;
        }
    },
    });


//algolia search
export const { setSearchText , triggerSearch } = searchSlice.actions;
export const searchReducer = searchSlice.reducer;

//caching
export const {setPosts , addPosts} = postsSlice.actions;
export const postsReducer = postsSlice.reducer;
export const selectPosts = (state: RootState) => state.posts.posts;

//algoia search for events
export const { setSearchText: setEventSearchText , triggerSearch: triggerEventSearch } = eventSearchSlice.actions;
export const eventSearchReducer = eventSearchSlice.reducer;