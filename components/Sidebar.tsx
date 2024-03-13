"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";


type Props = {};

const Sidebar = (props: Props) => {

    const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <div
      className=" space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white"
    //   data-aos="fade-right"
    //   data-aos-easing="linear"
    //   data-aos-duration="1000"
    >
      <div className=" px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-2 mb-14">
          <div className=" relative ">
            {/* <Image src="/scholar.svg" fill alt="logo" /> */}
            <p className=" text-xl font-extrabold">Devotional-B</p>
          </div>
        </Link>

        <div className="  space-y-1">
          <div>
            <ul className="flex flex-col space-y-9 justify-center mt-6 ">
              <li className="cursor-pointer  hover:text-gray-600 hover:font-bold">
                <Link href="/">Home</Link>
              </li>
              <li className="cursor-pointer  hover:text-gray-600 hover:font-bold">
                <p>Notifications</p>
              </li>
              <li className="cursor-pointer  hover:text-gray-600 hover:font-bold">
                <p >Followings </p>
              </li>
              
              <li className="cursor-pointer  hover:text-gray-600 hover:font-bold">
                <p> Newsletter </p>
              </li>

              <li>
              <div className="flex items-center space-x-2">
                <Switch id="airplane-mode" onCheckedChange={toggleTheme} checked={theme==='dark'}/>
                <Label htmlFor="airplane-mode">Dark Mode</Label>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;