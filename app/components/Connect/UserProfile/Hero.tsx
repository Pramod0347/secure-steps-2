import React from 'react';
import Image from 'next/image';
import BannerPlaceHolder from "@/app/assets/Connect/banner-placeholder.jpg";
import AvatarPlaceHolder from "@/app/assets/Connect/banner-placeholder.jpg";
// import AvatarPlaceHolder from "@/app/assets/Connect/avatar.avif";

interface HeroProps {
  user: {
    name: string;
    avatarUrl: string | null;
    banner: string | null;
    followersCount: number;
    followingCount: number;
    bio: string | null;
    header:string | null;
  };
  isEditing: boolean;
  editedUser: {
    name: string;
    bio: string | null;
  } | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleEdit: () => void;
  handleSave: () => void;
}

const Hero: React.FC<HeroProps> = ({ user, isEditing, editedUser, handleChange }) => {
  return (
    <div className="relative w-screen ">
      {/* Banner Section */}
      <div className="relative w-full h-[50vh] md:h-[60vh]">
        <Image 
          src={user.banner || "https://images.unsplash.com/photo-1495465798138-718f86d1a4bc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} 
          alt="Profile Banner" 
          className="w-full h-full object-cover"
          width={1350}
          height={400}
          priority
        />
      </div>

      {/* Content Section */}
      <div className="relative bg-white px-5">
        {/* Avatar Section - Positioned to overlap banner */}
        <div className="absolute w-40 h-40 px-5  -top-16 left-4 md:left-20">
          <div className="relative w-full h-full md:w-32 md:h-32 rounded-full overflow-hidden ">
            <Image 
              src={user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
              alt="Profile Picture" 
              className="w-full h-full object-cover bg-red-500"
              width={400}
              height={400}
            />
          </div>
        </div>

        {/* Profile Information */}
        <div className="pt-20 px-4 md:px-20">
          {/* Name and University Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="font-semibold text-[32px] md:text-[50px]">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedUser?.name || ''}
                  onChange={handleChange}
                  className="bg-gray-100 px-2 py-1 rounded"
                />
              ) : (
                user.name
              )}
            </h1>
            <div className="flex flex-row items-center mt-2 md:mt-0 gap-2">
              <Image 
                src="https://img.icons8.com/color/48/000000/university.png" 
                alt="UniversityImg" 
                className="w-8 h-8 md:w-12 md:h-12"
                width={48}
                height={48}
              />
              <p className="text-sm md:text-xl tracking-wide">Universities</p>
            </div>
          </div>

          {/* Followers and Bio Section */}
          <div className="mt-4 md:w-[60%]">
            <h2 className="text-sm md:text-[22px] flex gap-2 font-normal">
              <span className="text-[#E50914]">{user.followersCount || 20} followers</span> •{" "}
              <span className="text-[#838383]">{user.followingCount || 500}+ connections</span>
            </h2>
            <h3 className="text-xs md:text-[21px] mt-4 text-[#838383] md:leading-[27px]">
              {isEditing ? (
                <textarea
                  name="bio"
                  value={editedUser?.bio || "Showcase your interests and passions here..."}
                  onChange={handleChange}
                  className="w-full bg-gray-100 px-2 py-1 rounded"
                  rows={4}
                />
              ) : (
                'Write a short bio about yourself here. Include your passions, skills, and what motivates you. This is where you can let others know more about your journey and aspirations.'
                  )
              //  : (
              //   user.header || 'Write a short bio about yourself here. Include your passions, skills, and what motivates you. This is where you can let others know more about your journey and aspirations.'
              //     )
              }
            </h3>
          </div>

          {/* Action Buttons */}
          {/* <div className="flex items-center gap-4 mt-6 mb-8">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded-xl"
              >
                Save Changes
              </button>
            ) : (
              <>
                <button className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-xl text-sm md:text-base">
                  <SendIcon />
                  <span>Message</span>
                </button>
                <button className="border border-[#E50914] text-[#E50914] px-6 py-2 rounded-xl text-sm md:text-base">
                  Follow
                </button>
                <button className="p-2 text-gray-400 border-[1.5px] border-gray-300 rounded-full hover:bg-gray-100">
                  <DotMenuIcon className="text-base md:text-xl" />
                </button>
              </>
            )}
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm md:text-base"
              >
                Edit Profile
              </button>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Hero;