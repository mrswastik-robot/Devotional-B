"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";

import { postData } from "@/lib/data";
import QuePost from "@/components/queAnsPage/QuePost";
import { Tiptap as TipTap } from "@/components/TipTap";
import AnsPost from "@/components/queAnsPage/AnsPost";
import RecentFeed from "@/components/queAnsPage/RecentFeed";
import imageCompression from 'browser-image-compression';
import Image from "next/image";

import { auth, db, storage } from "@/utils/firebase";
import {
  collection,
  doc as docc,
  getDoc,
  getDocs,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  where,
  increment,
  updateDoc,
  setDoc,
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
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

type Input = z.infer<typeof AnswerDescriptionType>;

type Props = {
  params: {
    postTitle: string;
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
  keywords: string;
  anonymity: boolean;
  hashtags: Array<string>;
  uid: string;
  // Add any other fields as necessary
};

type AnswerType = {
  id: string;
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
  uid: string;
  // Add any other fields as necessary
};

const PostPage = ({ params: { postTitle } }: Props) => {
  // console.log(postId);
  // const queObject = postData.filter((post) => post.id === postId)[0];

  const postTitleWithSpaces = decodeURIComponent(postTitle as string).split("-").join(" ");

  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(true);

  const [queObject, setQueObject] = useState<QuestionType>({} as QuestionType); //postData.filter((post) => post.id === postId)[0
  const [answers, setAnswers] = useState<AnswerType[]>([] as AnswerType[]);

  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [progress , setProgress] = useState<number | null>(0);
  const [ansLoading, setAnsLoading] = useState(false);

  //need the actual postId of the question to send to the PostVoteClient
  const [postId , setPostId] = useState<string>("");

  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  //console.log("UserU: ", user);
  const [previewImg, setPreviewImg] = useState<any>(null);

  const uploadImage = async(file: any) => {
    if (file == null) return;

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          const imageUrl = event.target.result;
          setPreviewImg(imageUrl);
        } else {
          console.error('Error reading file:', file);
          setPreviewImg(null);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImg(null);
    }

    const storageRef = ref(storage, `answers/${file.name}`);

    try {
      // Set compression options
    const options = {
      maxSizeMB: 1, // Max size in megabytes
      maxWidthOrHeight: 800, // Max width or height
      useWebWorker: true, // Use web worker for better performance (optional)
    };
  
      // Compress the image
      const compressedFile = await imageCompression(file, options);

    const uploadTask = uploadBytesResumable(storageRef, compressedFile);

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
    }catch(err){
      console.log("Error compressing and uploading Image...")
    }
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
    // Fetch the question document from Firestore using the title
    const queRef = collection(db, "questions");
    const q = query(queRef, where("title", "==", postTitleWithSpaces));
    const snapshot = await getDocs(q);
  
    if (!snapshot.empty) {
      const doc = snapshot.docs[0]; // Get the first (and should be only) document that matches the query
  
      // Use the id of the question document to create the answer post in the 'answers' subcollection
      const questionId = doc.id;
      console.log("Ques Id ", doc.id);
      const docRef = await addDoc(collection(db, "questions", doc.id, "answers"), {
        description: data.description,
        uid: user?.uid,
        name: user?.displayName,
        profilePic: user?.photoURL,
        createdAt: serverTimestamp(),
        answerImageURL: imageUrl,
        anonymity: data.anonymity,
      });
  
      console.log("Document written with ID: ", docRef.id);

      // create a notification for the question owner
      const notificationCollection = collection(db, "notifications");
      const newNotificationRef = docc(notificationCollection);
      await setDoc(newNotificationRef, {
        type: "answer",
        questionId: questionId,
        questionTitle: queObject.title,
        questionUid: queObject.uid,
        answerId: docRef.id,
        answerDescription: data.description,
        answerUid: user?.uid,
        answerName: user?.displayName,
        answerProfilePic: user?.photoURL,
        createdAt: serverTimestamp(),
        read: false,
      });


      // Generate Keywords and Hashtags for the answer
      try {
        console.log("keyword Gen.....")
        const docRef = await addDoc(collection(db, 'keywords'), {
          prompt: `Generate some keywords and hashtags on topic ${data.description}`,
        });
        console.log('Keyword Document written with ID: ', docRef.id);
    
        // Listen for changes to the document
        const unsubscribe = onSnapshot(docc(db, 'keywords', docRef.id), async(snap) => {
          const data = snap.data();
          if (data && data.response) {
            console.log('RESPONSE: ' + data.response);
            const keywordsString = `${data.response}`;
  
            const questionDocRef = docc(db, 'questions', questionId);
            await updateDoc(questionDocRef, {
            answerKeywords: keywordsString, // Add your keywords here
        });
          }
        });
    
        // Stop listening after some time (for demonstration purposes)
        setTimeout(() => unsubscribe(), 60000);
      } catch (error) {
        console.error('Error adding document: ', error);
      }

      // Increment the ansNumbers field of the question
    // await updateDoc(docRef, {
    //   ansNumbers: increment(1),
    // });

      //set the postId to the id of the question so that finally it can be sent to PostVoteClient for voting system.
      setPostId(doc.id);
      console.log(postId)

      //reset the form and image
        form.reset();
        setImageUrl(null);
        setProgress(0);

    } else {
      console.log("No such document!");
    }
  }

  function onSubmit(data: Input) {
    console.log(data);

    createAnswerPost(data);
    setIsCommentBoxOpen(true);
    // form.reset();     //won't reset from here
  }

  //fetching question and answers to display on the page
  useEffect(() => {
    // Listener for the question
    const queRef = collection(db, "questions");
    const q = query(queRef, where("title", "==", postTitleWithSpaces));
    const queUnsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setQueObject({ id: doc.id, ...doc.data() } as QuestionType);
  
        // Listener for the answers
        const ansRef = collection(db, "questions", doc.id, "answers");
        const qAns = query(ansRef, orderBy("createdAt", "desc")); // Order by 'createdAt' in descending order
        const ansUnsub = onSnapshot(qAns, (snapshot) => {
          const answers = snapshot.docs.map((doc) => ({
            ...(doc.data() as AnswerType),
            id: doc.id,
          }));
  
          setAnswers(answers);
        });
  
        // Cleanup function to unsubscribe from the listeners when the component unmounts
        return () => {
          queUnsub();
          ansUnsub();
        };
      } else {
        console.log("No such document!");
        router.push("/404");
      }
    });
  }, [postTitleWithSpaces, postTitle]);

  const [description, setDescription] = useState("");
  //console.log("Keywords ", queObject.keywords);

  return (

    <>

      <Head>
        <title>{queObject.title}</title>
        <meta name="keywords" content={queObject.keywords} />
        <meta name="description" content="This is a dynamic description" />
      </Head>

    <div className="grid md:grid-cols-2 lg:grid-cols-7 gap-y-4 md:gap-x-4 pb-6 font-dmsans">
      <div className=" md:col-span-5 col-span-2 order-first">
      <div className={`${ansLoading?"overflow-auto":""} max-h-screen`}>
        <div>
          <QuePost post={queObject} />
        </div>

        <div className=" mt-3">
          {isCommentBoxOpen ? (
            <div
              className="rounded-3xl border border-gray-300 p-4 cursor-pointer mx-2 md:mx-0 my-6"
              onClick={() => setIsCommentBoxOpen(false)}
            >
              Write a Answer...
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
                  {(progress||0)>0&&<span className='pt-3'>{`${Math.ceil((progress||0))} % Uploaded`}</span>}
                        <div>
                            {
                              previewImg&&<div className="w-full flex items-center justify-center">
                                <Image src={previewImg} alt="previewImage" width={250} height={250}/>
                              </div>
                            }
                          </div>
                  {/* anonymity toggle */}
                  <FormField
                    control={form.control}
                    name="anonymity"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg  border-[1.6px] border-[#d3d7dd] p-2">                        <div className="">
                          <FormLabel className={`text-base ${user?.isAnonymous?"opacity-50":""}`}>
                            Answer Anonymously
                          </FormLabel>
                          {/* <FormDescription>
                            Answer question without revealing your identity.
                          </FormDescription> */}
                        </div>
                        <div className="h-full">
                        <FormControl>
                          <Switch className=""
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={user?.isAnonymous}
                          />
                        </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className=" space-x-2 flex items-end justify-end ">
                    
                    <Button variant="outline" className=" rounded-3xl"
                    onClick={() => {setIsCommentBoxOpen(true); form.reset(); setImageUrl(null);}}
                    >
                      Cancel
                    </Button>

                    <Button type="submit" variant="outline" className=" rounded-3xl "
                    >
                      Post
                    </Button>
                  </div>
                  
                </form>
              </Form>
            </div>
          )}
        </div>

        <div className="">
          <AnsPost answers={answers} postTitleWithSpaces={postTitleWithSpaces} postId={queObject.id} />
        </div>
      </div>
</div>
      
      <div className=" sm:block hidden col-span-2 sticky overflow-hidden h-fit rounded-lg border border-gray-300 order-last ">
      <div>
        <RecentFeed />
      </div>
      {/* <Separator className="h-2"/>
      <div className="bg-[#FFFFFF] dark:bg-[#262626] order-last">
        <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left font-[590] text-base text-black dark:text-white">HashTags</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
          <TableRow className="">
            <div className="bg-[#FFFFFF] dark:bg-[#262626] p-3">
            {queObject.keywords?queObject.keywords:"No tags Available"}
            </div>
          </TableRow>
      </TableBody>
      </Table>
        </div> */}
      </div>
    </div>
    </>
  );
};

export default PostPage;
