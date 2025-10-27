import React from "react";
import pro1 from "@/app/assets/groups/leader1.png";
import pro2 from "@/app/assets/groups/leader2.png";
import pro3 from "@/app/assets/groups/leader3.png";
import pro4 from "@/app/assets/groups/leader4.png";
import { RiSendPlaneFill as SendIcon } from "react-icons/ri";
import { BsFillPersonFill as ProfileIcon } from "react-icons/bs";
import { MdLocationOn as LocationIcon } from "react-icons/md";
import { IoIosArrowDown as ArrowDownIcon } from "react-icons/io";
import Image from "next/image";

interface User {
  id: number;
  name: string;
  location: string;
  profilePic: string;
}

const users: User[] = [
  { id: 1, name: "Sanjai", location: "Location Here", profilePic:  pro1.src },
  { id: 2, name: "Kayla", location: "Location Here", profilePic: pro2.src },
  { id: 3, name: "Shanny", location: "Location Here", profilePic: pro3.src },
  { id: 4, name: "Lia", location: "Location Here", profilePic: pro4.src },  
  { id: 5, name: "Steve", location: "Location Here", profilePic: pro3.src},
  { id: 6, name: "Cecile", location: "Location Here", profilePic:  pro2.src },
];

const Leaderboard: React.FC = () => {
  return (
    <div className="md:px-40 px-6 py-6 flex  md:mt-24 flex-col gap-4 w-full">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex md:items-center w-full md:flex-row  flex-col   justify-between py-3 "
        >
          {/* Profile Details */}
          <div className="flex items-center gap-4">
            <Image 
              src={user.profilePic}
              alt={user.name}
              width={64}
              height={64}
              className="md:w-16 md:h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="md:text-[30px] text-[20px] inter font-normal">{user.name}</h3>
              <p className="md:text-[17px] text-xs text-[#E50914] flex flex-row items-center">
                <LocationIcon/>
                {user.location}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 md:mt-0 mt-2">

            <div className="md:px-6 px-4 py-2 border   md:text-base text-sm cursor-pointer border-[#3C3C3C] rounded-xl text-[#3C3C3C] hover:bg-gray-100 flex flex-row items-center gap-1">
              <ProfileIcon/>
              <p>View Profile</p>
            </div>

            <div className="md:px-6 px-5 py-2 flex flex-row cursor-pointer md:text-base text-sm items-center gap-1 bg-black text-white rounded-xl hover:bg-gray-800">
              <SendIcon/> 
              <p>Message</p>
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-center mt-4 cursor-pointer">
        <div className="px-6 py-2 flex flex-row items-center gap-1 text-[25px] bg-gray-200 rounded-[21px] hover:bg-gray-300">
          <p>More</p>
          <ArrowDownIcon className="text-[30px] mt-2"/>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
