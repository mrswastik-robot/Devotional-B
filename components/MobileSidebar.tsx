"use client";

import React from "react";

import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Sidebar from "@/components/Sidebar";

import { useState, useEffect } from "react";

const MobileSidebar = () => {
  //to avoid hydration error
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Sheet>
      <SheetTrigger className="font-dmsans">
        <Button variant="ghost" size="icon" className=" md:hidden text-white">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className=" p-0 ">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;