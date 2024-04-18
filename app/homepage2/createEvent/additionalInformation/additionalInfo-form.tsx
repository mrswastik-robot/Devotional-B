"use client";

import React, { use, useState } from "react";
import { useRouter } from "next/navigation";

import { X } from "lucide-react";

import { db, storage } from "@/utils/firebase";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { z } from "zod";
import { EventType } from "@/schemas/event";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

type Input = z.infer<typeof EventType>;

type Props = {};

// type EventType = {
//   id: string;
//   title: string;
//   description: string;
//   eventImageURL: string;
//   dateOfEvent: string;
//   locationOfEvent: string;
//   durationOfEvent: number;
//   registrationLink: string;
//   uid: string;
//   createdAt: string;
//   name: string;
//   profilePic: string;
//   sponsors: string[];
// };

const AdditionalForm = (props: Props) => {
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm<Input>({
    // resolver: zodResolver(EventType),
    defaultValues: {
       sponsors: [],
       locationOfEvent: "",
    },
  });

  const [sponsors, setSponsors] = useState<string[]>([]);
  const [sponsorInput, setSponsorInput] = useState<string>("");

  const [landmark, setLandmark] = useState<string>("");

  const eventId = useSelector((state: RootState) => state.eventID.event_id);
  console.log(eventId);

  async function updateEvent( eventId: string,data: Input )
  {
    const eventRef =  doc(db, "events", eventId);

    console.log(landmark);
    console.log(sponsors);

    // Append the landmark to the location of the event
    const locationOfEvent = data.locationOfEvent + ", " + landmark;
    console.log(locationOfEvent);

    try {
      // Get the current document
      const docSnap = await getDoc(eventRef);
  
      // Check if the sponsors field exists
      if (docSnap.exists() && docSnap.data().sponsors) {
        // If the sponsors field exists, update it
        console.log(docSnap.data().title)
        await updateDoc(eventRef, {
          sponsors: arrayUnion(...sponsors),
          locationOfEvent: docSnap.data().locationOfEvent + ", " + landmark,
        });
      } else {
        // If the sponsors field doesn't exist, set it

        //just a waste of space and time , the code is not ever going to reach here

        // await updateDoc(eventRef, {
        //   sponsors: sponsors,
        //   locationOfEvent: docSnap?.data()?.locationOfEvent + ", " + landmark,
        // });
      }
  
      console.log("Update successful");
      toast({
        title: "Event Updated",
        description: "Event has been updated successfully.",
      });

      router.push("/homepage2");


    } catch (error) {
      console.error("Error updating document: ", error);
    }

  }

  function onSubmit(data: Input) {
    if (eventId === null) {
      toast({
        title: "Event ID is null",
        description: "Event ID is null. Please try again.",
      });
      console.log("Event ID is null");
      return;
    }

    // locationOfEvent: data.locationOfEvent + ", " + landmark;

    updateEvent(eventId, data);
    
  }

  return (
    <div className="">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex-col space-y-7"
        >
          {/* Location of the Event */}
          <FormField
            control={form.control}
            name="locationOfEvent"
            render={({ field }) => (
                <FormItem>
                  <FormLabel>Landmark</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Any Landmark near location of the Event."
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                    />
                  </FormControl>
                  <div className="text-[12px] opacity-70">Optional*</div>
                  <FormMessage />
                </FormItem>
            )}
          />

          {/* //spnosors section */}
          <FormField
            control={form.control}
            name="sponsors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sponsors</FormLabel>
                <FormControl>
                  <div className=" flex gap-2">
                    <Input
                      placeholder="Sponsors"
                      value={sponsorInput}
                      onChange={(e) => setSponsorInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setSponsors((prev) => [...prev, sponsorInput]);
                          setSponsorInput("");
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        setSponsors((prev) => [...prev, sponsorInput]);
                        setSponsorInput("");
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </FormControl>

                <div className=" flex gap-2">
                  {sponsors.map((sponsor, index) => (
                    <div
                      key={index}
                      className=" flex gap-1 p-2 rounded-3xl bg-[#F6F6F7]"
                    >
                      <p>{sponsor}</p>
                      <button
                        type="button"
                        onClick={() => {
                          const newSponsors = [...sponsors];
                          newSponsors.splice(index, 1);
                          setSponsors(newSponsors);
                        }}
                      >
                        <X />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="text-[12px] opacity-70">
                  Add sponsors for the event.
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className=" w-full my-4" type="submit">
            Update
          </Button>

        </form>
      </Form>
    </div>
  );
};

export default AdditionalForm;
