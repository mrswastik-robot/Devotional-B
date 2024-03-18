"use client";

import React, { useEffect, useState } from "react";

import { postData } from "@/lib/data";
import QuePost from "@/components/queAnsPage/QuePost";
import { Tiptap as TipTap } from "@/components/TipTap";
import AnsPost from "@/components/queAnsPage/AnsPost";
import RecentFeed from "@/components/queAnsPage/RecentFeed";

import { auth, db, storage } from "@/utils/firebase";
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
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

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
import { Switch } from "@/components/ui/switch";

import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useRouter } from "next/navigation";

// import { Tiptap } from "@/components/TipTap";
import { Tiptap } from "@/components/TipTapAns";
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
  createdAt: string;
  anonymity: boolean;
  hashtags: Array<string>;
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
  createdAt: string;
  anonymity: boolean;
  // Add any other fields as necessary
};

const PostPage = ({ params: { postId } }: Props) => {
  // console.log(postId);
  // const queObject = postData.filter((post) => post.id === postId)[0];

  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(true);

  const [queObject, setQueObject] = useState<QuestionType>({} as QuestionType); //postData.filter((post) => post.id === postId)[0
  const [answers, setAnswers] = useState<AnswerType[]>([] as AnswerType[]);

  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [progress , setProgress] = useState<number | null>(0);

  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  const uploadImage = (file: any) => {
    if (file == null) return;

    const storageRef = ref(storage, `answers/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot: any) => {
        // You can use this to display upload progress
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setProgress(progress);
      },
      (error: any) => {
        // Handle unsuccessful uploads
        console.log("Upload failed", error);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          // Save the URL to state or wherever you want to keep it
          setImageUrl(downloadURL);
        });
      }
    );
  };

  const form = useForm<Input>({
    resolver: zodResolver(AnswerDescriptionType),
    defaultValues: {
      description: "",
      answerImageURL: "",
      anonymity: false,
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
        anonymity: data.anonymity,
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
    const q = query(ansRef, orderBy("createdAt", "desc")); // Order by 'createdAt' in descending order
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

        <div className=" mt-7">
          {isCommentBoxOpen ? (
            <div
              className="rounded-3xl border border-gray-300 p-4 cursor-pointer"
              onClick={() => setIsCommentBoxOpen(false)}
            >
              Write a comment...
            </div>
          ) : (
            <div className=" rounded-3xl border border-gray-300 p-4 cursor-pointer">
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
                            render={({ field }) => <Tiptap {...field} setImageUpload={setImageUpload} uploadImage={uploadImage} progress={progress}/>}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* anonymity toggle */}
                  <FormField
                    control={form.control}
                    name="anonymity"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Answer Anonymously
                          </FormLabel>
                          <FormDescription>
                            Answer question without revealing your identity.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className=" space-x-2 flex items-end justify-end ">
                    
                    <Button variant="outline" className=" rounded-3xl"
                    onClick={() => {setIsCommentBoxOpen(true); form.reset(); setImageUrl(null);}}
                    >
                      Cancel
                    </Button>

                    <Button type="submit" variant="outline" className=" rounded-3xl ">
                      Post
                    </Button>
                  </div>
                  
                </form>
              </Form>
            </div>
          )}
        </div>

        {/* <div>
                        <input type="file" onChange={(event) => {
                          if(event.target.files) {
                            setImageUpload(event.target.files[0]);
                          }
                        }}/>
                        <Button onClick={uploadImage}>Upload Image</Button>
          </div> */}

        {/* Answers to the question */}
        <div>
          {/* <AnsPost answers={answers} /> */}
        </div>
      </div>

      <div className=" col-span-2 overflow-hidden h-fit rounded-lg border border-gray-300 ">
        <RecentFeed />
      </div>
    </div>
  );
};

export default PostPage;
