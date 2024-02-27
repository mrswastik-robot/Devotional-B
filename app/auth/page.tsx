"use client";

import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { auth, db } from "@/utils/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signInAnonymously,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type Props = {};

const LoginPage = (props: Props) => {
  const router = useRouter();

  const [user, loading] = useAuthState(auth);

  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const [anonymousUserName, setAnonymousUserName] = useState("");

  //gogle sign in
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        // console.log(user);
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //facebook sign in
  const signInWithFacebook = async () => {
    await signInWithPopup(auth, facebookProvider)
      .then((result) => {
        const user = result.user;
        // console.log(user);
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //email signup and signin
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const signUpWithEmail = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        // console.log(user);

        // Send email verification
        await sendEmailVerification(user)
          .then(() => {
            console.log("Verification email sent.");
          })
          .catch((error) => {
            console.log(error);
          });

        //setting 'name' to email and 'profilePic' to url
        //  const docRef = doc(collection(db , "questions"));
        //  await setDoc(docRef , {
        //   name: user.email,
        //   profilePic: "https://avatars.githubusercontent.com/u/107865087?v=4"
        //  })

        //above solution not worth it , will remove the code soon

        // Update user's profile
        await updateProfile(user, {
          displayName: email, // Set displayName to email
          photoURL: "https://avatars.githubusercontent.com/u/107865087?v=4", // Set photoURL to a default image URL
        });

        router.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const signInWithEmail = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);

        router.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //signin anonymously
  const signingInAnonymously = async (
    e: React.SyntheticEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    // guests should not be able to post questions
    // const isGuest = true;

    // Generate a unique 4-digit number
    const uniqueNumber = Math.floor(1000 + Math.random() * 9000);

    await signInAnonymously(auth)
      .then(async (userCredential) => {
        const user = userCredential.user;
        // console.log(user);
        // Update user's profile
        await updateProfile(user, {
          // displayName: anonymousUserName, // Set displayName to anonymousUser
          displayName: `Guest${uniqueNumber}`, // Set displayName to "Guest1234"
          photoURL:
            "https://images.rawpixel.com/image_png_social_square/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png", // Set photoURL to a default image URL
        });
        router.push("/?isGuest=true");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, loading, router]);

  return (
    <>
    <div className=" absolute bg-login-bg bg-cover bg-no-repeat left-0 top-0 h-full w-full "></div>
    <div
      
      className="bg-[#F8FAFC]   h-full w-full items-center justify-center flex shadow-lg rounded-3xl"
    >
      <div className="relative p-4 md:w-[70%] w-full h-full md:mt-[15%] md:h-auto">
        <div className="relative bg-white rounded-lg shadow">
          

          <div className="p-5">
            <h3 className="text-2xl mb-0.5 font-medium"></h3>
            <p className="mb-4 text-sm font-normal text-gray-800"></p>

            <div className="text-center">
              <p className="mb-3 text-2xl font-semibold leading-5 text-slate-900">
                Devotional-B
              </p>
              <p className="mt-2 text-sm leading-4 text-slate-600">
                You must be logged in to perform this action.
              </p>
            </div>

            <div className=" md:flex md:flex-col-2 w-full mt-7">
            <div className="mt-7 flex flex-col gap-4 w-full p-4">
              <p className=" text-sm text-zinc-400">
                By continiuing you indicate that you agree to Devotional-B <span className=" text-blue-500">Terms of Service</span> and <span className=" text-blue-500">Privacy Policy</span>.
              </p>
              <button className=" md:mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={signInWithGoogle}
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="h-[18px] w-[18px] "
                />
                Continue with Google
              </button>

              <button className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={signInWithFacebook}
              >
                <img
                  src="https://www.svgrepo.com/show/489934/facebook.svg"
                  alt="Google"
                  className="h-[18px] w-[18px] "
                />
                Continue with Facebook
              </button>
            </div>

            <div className="md:hidden flex w-full items-center gap-2 py-6 text-sm text-slate-600">
              <div className="h-px w-full bg-slate-200"></div>
              OR
              <div className="h-px w-full bg-slate-200"></div>
            </div>

            <Separator orientation="vertical" className="h-[14rem] sm:block hidden" />

            <div className="w-full p-4 md:mt-7">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="mb-3 mt-2 text-sm text-gray-500">
                
                  Reset your password?
                
              </p>

              <div className=" flex gap-2">

              <button
                // type="submit"
                className="inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-400"
                onClick={signUpWithEmail}
              >
                Sign Up
              </button>

              <button
                // type="submit"
                className="inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-400"
                onClick={signInWithEmail}
              >
                Sign In
              </button>

              </div>
              
            </div>
            </div>

            <div className="mt-6 text-center text-sm text-slate-600">
              Dont want to have an account?
              <button className="font-medium text-[#4285f4] ml-1 underline"
              onClick={signingInAnonymously}
              >
                 Continue as Guest
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* </div> */}
    </>
  );
};

export default LoginPage;
