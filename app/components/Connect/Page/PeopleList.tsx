/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import Image from "next/image";
import Link from "next/link";
import PersonImage from "@/app/assets/Connect/personimage.webp";
import previous from "@/app/assets/Previous.png";
import next from "@/app/assets/Next.png";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";

interface User {
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  banner: string | null;
  bio: string | null;
  role: string;
  universityId: string | null;
  department: string | null;
  countryCode: string;
  followersCount: number;
  followingCount: number;
  score: number;
}


const PeopleList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  // const [total, setTotal] = useState(0);
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const NextUrl = process.env.NEXTAUTH_URL || window.location.origin;;
        const response = await fetch(`${NextUrl}/api/connect`, {
          method: 'GET',
          headers: {
            "x-user-id": user?.id || "", // Provide a fallback value
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data.users);
        // setTotal(data.total);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Function to truncate text
  // const truncateBio = (text: string | null, maxLength: number) => {
  //   if (!text) return "UI is the saddle, the stirrups, & the reins. UX is the feeling you get being able to ride the horse.";
  //   return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  // };


  // Calculate total pages
  const totalPages = Math.ceil(users.length / itemsPerPage);

  // Get paginated data
  const paginatedData = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers for navigation
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="md:px-32 px-3 mb-20 pt-16 md:pt-32 flex items-center flex-col gap-4 jakartha">
      <div className="w-full">
        <h1 className="md:text-[40px] text-[32px] font-bold">Lorem ipsum</h1>
        <p className="text-[#BDBDBD] text-[12px] md:text-lg">
          Turpis facilisis tempor pulvinar in lobortis ornare magna.
        </p>
      </div>

      <div className="md:grid hidden w-[90%] place-content-center grid-cols-3">
        {paginatedData.map((user) => (
          <div className="mt-28" key={user.id}>
            <Link href={`/connect/${user.id}`} className="px-2 relative py-2 w-[90%] h-[110%] flex flex-col rounded-xl border shadow-xl">
              <div className=" w-[100%] relative h-[60%] ">
                <div className="w-[100%] relative h-[170px] rounded-[19px] parent-card overflow-hidden">
                  <div className="w-[50px] h-[36px] bg-white absolute top-[-1px] right-[-1px] rounded-bl-[9px] invert-curve-top"></div>
                  <div className="w-[130px] h-[27px] bg-white absolute left-[-10px] bottom-[-4px] rounded-tr-[9px] invert-curve-bottom"></div>
                  <Image
                    src={user.avatarUrl || PersonImage}
                    alt={user.name}
                    className=""
                  />
                </div>
                <p className="font-bold -bottom-1 z-[9999999] absolute left-5 w-[100px]  text-[16px] text-[#4F4F4F]">{user.name}</p>
              </div>

              <div className="flex flex-col gap-4 mt-5 ">
                <div className="flex flex-col justify-between items-center gap-1 px-2 py-1">
                  <p className="flex px-4 mb-2 text-center text-[13px] text-[#3B3F5C] items-center">
                    {user.bio
                      ? `${user.bio.slice(0, 100)}${user.bio.length > 100 ? "..." : ""}`
                      : "UI is the saddle, the stirrups, & the reins. UX is the feeling you get being able to ride the horse.".slice(0, 100) + "..."}
                  </p>
                  <button className="bg-black w-fit text-white rounded-[6px] py-2 px-14">
                    Follow
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Mobile view */}
      <div className="grid md:w-[90%] md:hidden w-full -mt-10 place-content-center grid-cols-1">
        {paginatedData.map((user) => (
          <div className="mt-20" key={user.id}>
            <div className="px-2 py-2 md:w-[90%] h-[140%] flex md:flex-col rounded-xl border shadow-xl">
              <div className="relative w-[50%] md:h-[60%]">
                <div className="w-[100%] md:h-[170px] h-full rounded-[19px] relative parent-card md:overflow-hidden">
                  <div className="w-[50px] h-[36px] bg-white absolute top-[-1px] right-[-1px] hidden md:block rounded-bl-[9px] invert-curve-top"></div>
                  <div className="w-[130px] h-[27px] bg-white absolute left-[-10px] hidden md:block bottom-[-4px] rounded-tr-[9px] invert-curve-bottom"></div>
                  <Image
                    src={user.avatarUrl || PersonImage}
                    alt={user.name}
                    className="h-[100%] md:object-none object-cover rounded-md"
                  />
                </div>
              </div>

              <Link href={`/profile/${user.id}`} className="w-[50%] flex flex-col gap-4 justify-center">
                <div className="flex flex-col justify-between items-center gap-1 px-2 py-1">
                  {/* Bio Section */}
                  <p
                    className="flex md:px-4 text-center text-[10px] md:text-[13px] text-[#3B3F5C] items-center overflow-hidden whitespace-nowrap text-ellipsis"
                    style={{ maxWidth: "150px" }} // Adjust the width based on your card design
                  >
                    {user.bio
                      ? `${user.bio.slice(0, 50)}${user.bio.length > 50 ? "..." : ""}`
                      : "UI is the saddle, the stirrups, & the reins. UX is the feeling you get being able to ride the horse.".slice(0, 50) + "..."}
                  </p>

                  {/* User Name */}
                  <p className="font-bold text-[14px] text-[#4F4F4F]">{user.name}</p>

                  {/* Follow Button */}
                  <button className="bg-black w-fit text-white md:text-base text-[9px] rounded-[6px] py-2 px-8 md:px-14">
                    Follow
                  </button>
                </div>
              </Link>

            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-10 mt-20">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Image src={previous} className="w-8 h-full" alt="Previous" />
        </button>

        <div className="flex items-center gap-3">
          {Array.from({ length: totalPages }).map((_, index) => (
            <span
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`w-3 h-3 rounded-full cursor-pointer ${currentPage === index + 1
                ? "bg-black"
                : "bg-[#EAEAEA] hover:bg-gray-500"
                }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Image src={next} className="w-8 h-full" alt="Next" />
        </button>
      </div>
    </div>
  );
};

export default PeopleList;