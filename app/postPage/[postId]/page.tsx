"use client";

import React, { useEffect, useState } from "react";

import { postData } from "@/lib/data";
import QuePost from "@/components/queAnsPage/QuePost";
import { Tiptap as TipTap } from "@/components/TipTap";
import AnsPost from "@/components/queAnsPage/AnsPost";
import RecentFeed from "@/components/queAnsPage/RecentFeed";

import { auth, db , storage} from "@/utils/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { ref , uploadBytes, uploadBytesResumable , getDownloadURL} from "firebase/storage";


import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Tiptap } from "@/components/TipTap";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnswerDescriptionType } from "@/schemas/answer";

type Input = z.infer<typeof AnswerDescriptionType>;

type Props = {
  params: {
    postId: string;
  };

  // post: {
  //   id: string;
  //   title: string;
  //   name: string;
  //   description: string;
  //   profilePic: string;
  //   postImage: string;
  //   likes: number;
  //   comments: number;
  //   shares: number;
  // };
};

type QuestionType = {
  id: string;
  title: string;
  name: string;
  description: string;
  profilePic: string;
  postImage: string;
  likes: number;
  comments: number;
  shares: number;
  questionImageURL: string;
  // Add any other fields as necessary
};

type AnswerType = {
  // id: string;
  name: string;
  description: string;
  profilePic: string;
  // postImage: string;
  likes: number;
  comments: number;
  shares: number;
  answerImageURL: string;
  // Add any other fields as necessary
};

const PostPage = ({ params: { postId } }: Props) => {
  // console.log(postId);
  // const queObject = postData.filter((post) => post.id === postId)[0];

  const [queObject, setQueObject] = useState<QuestionType>({} as QuestionType); //postData.filter((post) => post.id === postId)[0
  const [answers, setAnswers] = useState<AnswerType[]>([] as AnswerType[]);

  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  const uploadImage = () => {
    if(imageUpload == null) return;

    const storageRef = ref(storage, `answers/${imageUpload.name}`);

    const uploadTask = uploadBytesResumable(storageRef, imageUpload);

    uploadTask.on('state_changed', 
    (snapshot:any) => {
      // You can use this to display upload progress
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
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
  );

  }

  const form = useForm<Input>({
    resolver: zodResolver(AnswerDescriptionType),
    defaultValues: {
      description: "",
      answerImageURL: "",
    },
  });

  //creating answer post for the question
  async function createAnswerPost(data: Input) {
    const docRef = await addDoc(
      collection(db, "questions", postId, "answers"),
      {
        description: data.description,
        uid: user?.uid,
        name: user?.displayName,
        profilePic: user?.photoURL,
        createdAt: serverTimestamp(),
        answerImageURL: imageUrl,
      }
    );

    console.log("Document written with ID: ", docRef.id);
  }

  function onSubmit(data: Input) {
    console.log(data);

    createAnswerPost(data);
    form.reset();
  }

  //fetching question and answers to display on the page
  useEffect(() => {
    // Listener for the question
    const queRef = doc(db, "questions", postId);
    const queUnsub = onSnapshot(queRef, (doc) => {
      if (doc.exists()) {
        setQueObject(doc.data() as QuestionType);
      } else {
        console.log("No such document!");
      }
    });

    // Listener for the answers
    const ansRef = collection(db, "questions", postId, "answers");
    const q = query(ansRef, orderBy('createdAt', 'desc')); // Order by 'createdAt' in descending order
    const ansUnsub = onSnapshot(q, (snapshot) => {
      const answers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as AnswerType),
      }));

      setAnswers(answers);
    });


    // Cleanup function to unsubscribe from the listeners when the component unmounts
    return () => {
      queUnsub();
      ansUnsub();
    };
  }, [postId]);

  const [description, setDescription] = useState("");

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-7 gap-y-4 md:gap-x-4 pb-6">
      <div className=" md:col-span-5 ">
        <div>
          <QuePost post={queObject} />
        </div>

        {/* TipEditor */}
        <div>
          {/* <TipTap setDescription={setDescription} /> */}
          {/* <TipTap /> */}
          <Form {...form}>
            <form
              className=" relative space-y-3 overflow-hidden"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/* TipTap Editor */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Write an answer...</FormLabel> */}
                    <FormControl>
                      <Controller
                        control={form.control}
                        name="description"
                        render={({ field }) => <Tiptap {...field} />}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className=" w-full">
                Post
              </Button>
            </form>
          </Form>
        </div>

        <div>
                        {/* <input type="file" onChange={(event) => {setImageUpload(event.target.files[0])}}/> */}
                        <input type="file" onChange={(event) => {
                          if(event.target.files) {
                            setImageUpload(event.target.files[0]);
                          }
                        }}/>
                        <Button onClick={uploadImage}>Upload Image</Button>
          </div>

        {/* Answers to the question */}
        <div>
          <AnsPost answers={answers} />
        </div>
      </div>

      <div className=" col-span-2 overflow-hidden h-fit rounded-lg border border-gray-300 ">
        <RecentFeed />
      </div>
    </div>
  );
};

export default PostPage;
