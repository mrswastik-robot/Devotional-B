import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";

type Props = {
    user: any;
};

const ProfileCard = ({user}: Props) => {

  const otherUser:boolean=false;
  return (
    <div>
      <div className="flex justify-center mx-auto bg-[#FFFFFF] dark:bg-[#262626] p-5 rounded-lg">

        <div>
        <Image
          src={user?.photoURL || '/nodp.webp'}
          width={300}
          height={300}
          className=" w-[7rem] h-[7rem] rounded-full"
          alt="Profile Pic"
        />
        {/* <p className=" mt-4 text-sm">Write a description about yourself ...</p> */}
        </div>


        <div className="space-y-5 mx-5">
          <h1 className="text-4xl font-bold">{user?.displayName}</h1>
          <div className=" flex gap-x-2 mt-4 text-base">
          <p>{0} Followers</p>
            <svg
              viewBox="0 0 48 48"
              className=" mt-2 w-3 h-3"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M24 36C30.6274 36 36 30.6274 36 24C36 17.3725 30.6274 12 24 12C17.3726 12 12 17.3725 12 24C12 30.6274 17.3726 36 24 36Z"
                  fill="#333333"
                ></path>{" "}
              </g>
            </svg>

            <p>{0} Following</p>
          </div>

          {otherUser&&
          <Button variant='outline' className=" mt-4 rounded-3xl">Follow</Button>
          }

        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
