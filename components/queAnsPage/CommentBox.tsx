"use client";

import React, { useEffect, useState } from "react";

import {
    Form,
    FormControl,
    FormLabel,
    FormField,
    FormItem,
    FormMessage,
    FormDescription,
  } from "@/components/ui/form";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentType } from "@/schemas/comment";


import { addDoc, collection, getDocs, query, serverTimestamp, where, onSnapshot , orderBy } from "firebase/firestore";
import { db, auth } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

type Input = z.infer<typeof CommentType>;

type Props = {
    postTitleWithSpaces: string;
    answerId: string;
    toggleCommentInputVisibility: () => void;
};

type CommentType = {
    // id: string;
    comment: string;
    name: string;
    profilePic: string;
    createdAt: string;
}

type ReplyType = {
    // id: string;
    reply: string;
    name: string;
    profilePic: string;
    createdAt: string;

}

type CommentTypeWithId = CommentType & {id: string};

const CommentBox = ({postTitleWithSpaces , answerId , toggleCommentInputVisibility}: Props) => {


    const [user , loading ] = useAuthState(auth);

    const [comments , setComments] = useState<CommentTypeWithId[]>([]);

    

    const form = useForm<Input>({
        resolver: zodResolver(CommentType),
        defaultValues: {
          comment: "",
        },
      });

      async function createCommentPost(data: Input) {

        //fetch the question document is the first part
        const queRef = collection(db, 'questions');
        const q = query(queRef , where('title', '==', postTitleWithSpaces));
        const snapshot = await getDocs(q);

        if(!snapshot.empty)
        {
            const doc = snapshot.docs[0];      // Get the first (and should be only) document that matches the query

            // Use the id of the question document and the answerId to create the comment post in the 'comments' subcollection
            const docRef = await addDoc(collection(db, 'questions' , doc.id , 'answers', answerId, "comments"), {
                comment: data.comment,
                uid: user?.uid,
                name: user?.displayName,
                profilePic: user?.photoURL,
                createdAt: serverTimestamp(),

            });

            console.log("Comment written with : " , docRef);

            form.reset();

        }
        else{
            console.log("No such document");
        }
      }

    const onSubmit = (data: Input) => {
        console.log(data);
        console.log(postTitleWithSpaces);

        createCommentPost(data);
    }

    //fetching all the comments
    useEffect(() => {
      const fetchComments = async () => {
        const queRef = collection(db, "questions");
        const q = query(queRef, where("title", "==", postTitleWithSpaces));
        const snapshot = await getDocs(q);
    
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
    
          // Listener for the comments
          const commentsRef = collection(
            db,
            "questions",
            doc.id,
            "answers",
            answerId,
            "comments"
          );
          const qComments = query(commentsRef, orderBy("createdAt", "desc"));
          const commentsUnsub = onSnapshot(qComments, (snapshot) => {
            const comments = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...(doc.data() as CommentType),
            }));
    
            setComments(comments as CommentTypeWithId[]);
          });
    
          // Cleanup function to unsubscribe from the listeners when the component unmounts
          return () => {
            commentsUnsub();
          };
        } else {
          console.log("No such document!");
        }
      };
    
      fetchComments();
    }, [postTitleWithSpaces, answerId]);

    
    //for displaying the reply input

    // const [replyInputVisibility, setReplyInputVisibility] = useState(comments.map(() => false));
    //not working with above method

    const [replyIndex, setReplyIndex] = useState<number | null>(null);

    
    // const toggleReplyInputVisibility = (index: number) => {
    //   setReplyInputVisibility(prevVisibility =>
    //       prevVisibility.map((isVisible, i) => (i === index ? !isVisible : isVisible))
    //   );
    // };

    const toggleReplyInputVisibility = (index: number) => {
      setReplyIndex(prevIndex => (prevIndex === index ? null : index));
    };



  return (
    <div className="rounded-3xl border border-gray-300 p-4 cursor-pointer">
      <Form {...form}>
        <form
        className="relative space-y-3 overflow-hidden"
        onSubmit={form.handleSubmit(onSubmit)}
        >
            <FormField
                control={form.control}
                name="comment"
                render={({field}) => (
                    <FormItem>
                        <FormControl>
                            <Input
                            type="text"
                            placeholder="Add a comment"
                            autoComplete="off"
                            className="w-full rounded-md border border-gray-300 p-2"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            <div className=" flex items-end justify-end gap-2">
                <Button
                variant="outline"
                onClick={toggleCommentInputVisibility}
                className=" rounded-3xl"
                >
                  Cancel

                </Button>
                <Button
                type="submit"
                variant="outline"
                className=" rounded-3xl"
                >
                    Comment
                </Button>
            </div>

        </form>

      </Form>

          {/* displaying comments */}
      <div className=" mt-4">
        {comments.map((comment , index) => (
          <div key={comment.id} className=" p-4 rounded-3xl border border-gray-300 my-1">
          <div className="flex  space-x-2">
            <img
              src={comment.profilePic}
              alt="Profile Pic"
              className="h-8 w-8 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold">{comment.name}</p>
              <p className="text-sm">{comment.comment}</p>
              <div>
                <button
                onClick={() => toggleReplyInputVisibility(index)} 
                className=" text-xs text-blue-500 hover:underline">
                  Reply
                </button>
                    
                    {/* displaying the reply input */}
                    {replyIndex === index && (
                    <input
                      type="text"
                      placeholder="Add a reply"
                      className="w-full rounded-3xl border border-gray-300 p-2 mt-2"
                    />
        )}

              </div>
            </div>
    
          </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CommentBox;
