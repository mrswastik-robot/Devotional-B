"use client";  

import {FcGoogle} from 'react-icons/fc'
import { FaFacebookF } from 'react-icons/fa';

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';

import {auth , db} from '@/utils/firebase'
import { signInWithPopup , GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

type Props = {}

const LoginPage = (props: Props) => {

    const router = useRouter();
    const [user , loading] = useAuthState(auth);

    const googleProvider = new GoogleAuthProvider();
    const facebookProvider = new FacebookAuthProvider();

    const signInWithGoogle = async () => {
        await signInWithPopup(auth , googleProvider)
        .then((result) => {
            const user = result.user;
            // console.log(user);
            router.push('/');
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const signInWithFacebook = async () => {
        await signInWithPopup(auth , facebookProvider)
        .then((result) => {
            const user = result.user;
            // console.log(user);
            router.push('/');
        })
        .catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        if(user){
            router.push('/');
        }
    }, [user])

  return (
    <div>
        <div className=" relative group mt-5">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-80 group-hover:opacity-100 transition duration-200"></div>
          <button onClick={signInWithGoogle} className=" relative text-white items-center justify-center bg-black w-[50%] font-medium font-poppins rounded-lg flex align-middle p-4 gap-2">
            <FcGoogle className="text-2xl" />
            Sign in with Google
          </button>

          <button onClick={signInWithFacebook} className=" relative text-white items-center justify-center bg-black w-[50%] font-medium font-poppins rounded-lg flex align-middle p-4 gap-2">
            <FaFacebookF className="text-2xl" />
            Sign in with Facebook
          </button>

        </div>
    </div>
  )
}

export default LoginPage