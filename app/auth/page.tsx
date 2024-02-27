"use client";

import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

import React, { useEffect , useState } from "react";
import { useRouter , usePathname , useSearchParams } from "next/navigation";

import { auth, db } from "@/utils/firebase";
import { collection , doc ,setDoc } from "firebase/firestore";
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

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {};

const LoginPage = (props: Props) => {
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
      .then(async(userCredential) => {
        const user = userCredential.user;
        // console.log(user);

        // Send email verification
        await sendEmailVerification(user)
        .then(() => {
          console.log('Verification email sent.');
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
        photoURL: "https://avatars.githubusercontent.com/u/107865087?v=4" // Set photoURL to a default image URL
      });

        
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const signInWithEmail = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  }


  //signin anonymously
  const signingInAnonymously = async (e:React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // guests should not be able to post questions
    // const isGuest = true;
    
    // Generate a unique 4-digit number
  const uniqueNumber = Math.floor(1000 + Math.random() * 9000);

    await signInAnonymously(auth)
      .then(async(userCredential) => {
        const user = userCredential.user;
        // console.log(user);
        // Update user's profile
        await updateProfile(user, {
          // displayName: anonymousUserName, // Set displayName to anonymousUser
          displayName: `Guest${uniqueNumber}`, // Set displayName to "Guest1234"
          photoURL: "https://images.rawpixel.com/image_png_social_square/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png" // Set photoURL to a default image URL
        });
        router.push('/?isGuest=true');
      })
      .catch((error) => {
        console.log(error);
      });
  }


  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user , loading , router]);

  return (
    <div className="min-h-[75%] bg-gray-100 text-gray-900 flex justify-center shadow-lg">
      <div className="max-w-screen-xl m-0 sm:m-0 bg-white shadow sm:rounded-xl flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            <h1 className="  text-center text-3xl font-extralight">
              Devotional-B
            </h1>
          </div>
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Sign up</h1>
            <div className="w-full flex-1 mt-8">
              <div className="flex flex-col items-center">
                <button
                  className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                  onClick={signInWithGoogle}
                >
                  <div className="bg-white p-2 rounded-full">
                    <svg className="w-4" viewBox="0 0 533.5 544.3">
                      <path
                        d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                        fill="#4285f4"
                      />
                      <path
                        d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                        fill="#34a853"
                      />
                      <path
                        d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                        fill="#fbbc04"
                      />
                      <path
                        d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                        fill="#ea4335"
                      />
                    </svg>
                  </div>
                  <span className="ml-4">Sign Up with Google</span>
                </button>

                <button
                  className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5"
                  onClick={signInWithFacebook}
                >
                  <div className="bg-white p-1 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className=" w-6 h-6"
                      x="0px"
                      y="0px"
                      width="100"
                      height="100"
                      viewBox="0 0 48 48"
                    >
                      <linearGradient
                        id="Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1"
                        x1="9.993"
                        x2="40.615"
                        y1="9.993"
                        y2="40.615"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0" stop-color="#2aa4f4"></stop>
                        <stop offset="1" stop-color="#007ad9"></stop>
                      </linearGradient>
                      <path
                        fill="url(#Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1)"
                        d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"
                      ></path>
                      <path
                        fill="#fff"
                        d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"
                      ></path>
                    </svg>
                  </div>
                  <span className="ml-4">Sign Up with Facebook</span>
                </button>
              </div>

              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Or sign up with e-mail
                </div>
              </div>

              <div className="mx-auto max-w-xs">
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className=" flex gap-2">

                <button className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  onClick={signUpWithEmail}
                  >
                  <svg
                    className="w-6 h-6 -ml-2"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  <span className="ml-3">Sign Up</span>
                </button>

                <button className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  onClick={signInWithEmail}
                  >
                  <svg
                    className="w-6 h-6 -ml-2"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  <span className="ml-3">Sign In</span>
                </button>
                </div>


                {/* sign in anonymously button */}
                {/* <Dialog>
                    <DialogTrigger asChild>
                      <Button className=" w-full mt-6 bg-[#581C87]">Continue as a Guest</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Welcome to the Devotional-B</DialogTitle>
                        <DialogDescription>
                          No hassle of creating account. Just enter your name and start using the app ...
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={signingInAnonymously}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              autoComplete="off"
                              className="col-span-3"
                              onChange={(e) => setAnonymousUserName(e.target.value)}
                            />
                          </div>
                          
                        </div>
                        <DialogFooter>
                          <Button type="submit">Enter</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog> */}

                  <Button type="submit" onClick={signingInAnonymously} className=" w-full mt-6 bg-[#581C87]">Continue as a Guest</Button>


              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex rounded-r-xl">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
            }}
          ></div>
          
            {/* <h1>No hassle of loggin In</h1>
            <Button onClick={signInWithGoogle}>Sign In as Guest</Button>
           */}
        </div>
        
        

      </div>
    </div>
  );
};

export default LoginPage;
