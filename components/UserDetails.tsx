import { useState, useEffect } from 'react';
import { db } from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import { Separator } from './ui/separator';

type UserDetail = {
  name: string;
  email: string;
  profilePic: string;
};

const UserDetails = ({ uid }: { uid: string }) => {
  const [userDetail, setUserDetails] = useState<UserDetail | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log(userData);
          // Assuming the user document structure has 'name' and 'email' fields
          setUserDetails({
            name: userData.name,
            email: userData.email,
            profilePic: userData.profilePic
          });
        } else {
          console.log('User document not found');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [uid]);

  return (
    <div>
      {userDetail ? (
        <div>
        <div className="flex mx-auto bg-[#FFFFFF] dark:bg-[#262626] p-3 rounded-lg">
  
          <div>
          <Image
            src={userDetail.profilePic || '/nodp.webp'}
            width={100}
            height={100}
            className="w-[3rem] h-[3rem] rounded-full"
            alt="Profile Pic"
          />
          {/* <p className=" mt-4 text-sm">Write a description about yourself ...</p> */}
          </div>
  
  
          <div className="space-y-2 mx-5">
            <h1 className=" text-base font-bold">{userDetail.name||"Unknown"}</h1>
  
          </div>
        </div>
        <Separator className='h-1'/>
      </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default UserDetails;
