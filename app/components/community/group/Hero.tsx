// Hero.tsx
import React from "react";
import { MdGroupAdd as InviteIcon } from "react-icons/md";
import { RiSendPlaneFill as SendIcon } from "react-icons/ri";
// import { HiOutlineDotsHorizontal as SettingIcon } from "react-icons/hi";
import Image from "next/image";
import SettingsMenu from "../Models/SettingsMenu";

interface GroupData {
    id: string;
    name: string;
    banner: string;
    logo: string;
    description: string;
    followersCount: number;
    membersCount: number;
    creatorUsername: string;
}

interface HeroProps {
    groupData: GroupData;
}

const Hero = ({ groupData }: HeroProps) => {
    return (
        <div className="jakartha">
            <div className="md:-mt-72">
                <Image 
                    src={"https://placehold.co/600x400/png"}
                    alt=""
                    width={1920}
                    height={1080}
                    className="md:h-[100vh] h-[50vh] object-cover"
                />
                <Image 
                    src={"https://placehold.co/600x400/png"}
                    alt=""
                    width={300}
                    height={300}
                    className="w-[279px] h-[279px] md:ml-20 md:pl-0 pl-2 -mt-32 ml-52 md:-mt-32 rounded-full border-1 border-red-400 z-[9999]"
                />
            </div>
            <div className=" flex flex-col items-start md:px-20 px-10 justify-center gap-1">
                <div className="w-full flex justify-between items-center">
                    <h1 className="font-semibold text-[26px] whitespace-nowrap md:text-[48px]">
                        {groupData.name}
                    </h1>
                    <div className="flex text-sm md:text-base items-center gap-1 cursor-pointer px-8 rounded-full h-fit py-2.5 bg-black text-white">
                        <InviteIcon className="scale-x-[-1]" />
                        <p>Invite</p>
                    </div>
                </div>

                <h2 className="md:mt-4 mt-2 text-sm md:text-[20px] font-normal">
                    <span className="text-[#E50914]">{groupData.followersCount}K followers</span> •{" "}
                    <span className="text-[#838383]">{groupData.membersCount}+ connections</span>
                </h2>

                <h3 className="md:w-[60%] text-xs md:text-[20px] mt-4 text-[#838383] md:leading-[27px]">
                    {groupData.description}
                </h3>

                <div className="flex text-sm md:text-base items-center justify-center mt-4 gap-4">
                    {/* Discussion Btn */}
                    <div className="flex cursor-pointer md:w-[150px] flex-row gap-1 items-center bg-black text-white py-2.5 px-4 md:px-6 md:py-2 rounded-xl">
                        <SendIcon />
                        <p>Discussion</p>
                    </div>

                    {/* Follow Btn */}
                    <button className="cursor-pointer md:w-[150px] bg-transparent text-[#E50914] border-[#E50914] border rounded-xl py-2.5 px-6 md:py-2">
                        <p>Follow</p>
                    </button>

                    {/* menu btn */}
                    <div className="p-2 text-sm md:text-[20px] cursor-pointer hover:bg-gray-100 border-[1.5px] rounded-full border-gray-300 text-gray-400">
                    <SettingsMenu groupId={groupData.id} />

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;