import React from 'react';
import Image from 'next/image';
import { FaArrowRight as RightArrowIcon } from "react-icons/fa";

interface AboutProps {
  user: {
    bio: string | null;
    department: string | null;
    program: string | null;
    graduationYear: string | null;
  };
  isEditing: boolean;
  editedUser: {
    bio: string | null;
    department: string | null;
    program: string | null;
    graduationYear: string | null;
  } | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const About: React.FC<AboutProps> = ({ user, isEditing, editedUser, handleChange }) => {
  return (
    <div className="jakartha flex flex-col gap-4  w-screen h-full px-5">
      <div className="md:flex-row flex-col flex px-4 md:px-20">
        <div className="flex flex-col items-center md:gap-0 gap-2 md:items-start">
          <h1 className="text-[20px] md:text-[33px] font-semibold">About</h1>
          <h2 className="md:w-[70%] my-4 w-full text-xs md:text-left text-center md:text-[22px] md:leading-[27px] font-normal">
            {isEditing ? (
              <textarea
                name="bio"
                value={editedUser?.bio || ''}
                onChange={handleChange}
                className="w-full bg-gray-100 px-2 py-1 rounded"
              />
            ) : (
              user.bio || 'Our goal is simple - making our customers’ financial portfolios look good while providing optimal services. Check out our Linkedin to learn so much more about us!'
            )}
          </h2>
        </div>
        <div className="flex items-center justify-center md:mt-0 mt-2 gap-2">
          <Image 
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
            alt="Mutual Connections" 
            className="md:w-1/4 w-1/5"
            width={100}
            height={100}
          />
          <h1 className="text-xs md:text-base whitespace-nowrap text-[#E50914]">
            See your mutual connections
          </h1>
        </div>
      </div>

      <hr className="w-[80%] mx-auto" />

      

      <div className="flex cursor-pointer gap-2 md:text-base text-xs w-full items-center justify-center text-[#18181899]">
        <h1>Show all details</h1>
        <RightArrowIcon />
      </div>
    </div>
  );
};

export default About;

