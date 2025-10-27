/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Image from "next/image";
// import Link from "next/link";
import previous from "@/app/assets/Previous.png";
import next from "@/app/assets/Next.png";
import RegisterCardIcon from "@/app/assets/groups/RegisterCardIcon.png";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  eventType: string;
  registrationType: string;
  ticketPrice: number;
  currency: string;
  startTime: string;
  endTime: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    pageSize: 6,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {  isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchEvents(pagination.page);
  }, [pagination.page]);

  
  const fetchEvents = async (page: number) => {
    try {
      const NextUrl = process.env.NEXTAUTH_URL || window.location.origin;
      setLoading(true);
      const response = await fetch(`${NextUrl}/api/community/group/event?page=${page}&limit=${pagination.pageSize}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data.events);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Error fetching events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleNext = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handleRegister = async (eventId: string) => {
    try {

      if (!isAuthenticated) {
        toast.error("Authedication failed.");
        setTimeout(() => {
          router.push("/auth/signin");
          throw new Error('Authedication failed.');
        }, 500)
      }

      const NextUrl = process.env.NEXTAUTH_URL || window.location.origin;
      const response = await fetch(`${NextUrl}/api/community/group/event/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) {
        throw new Error('Failed to register for the event');
      }

      // Refresh the events list after successful registration
      fetchEvents(pagination.page);
    } catch (error) {
      console.error('Error registering for event:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="grid mt-24 md:px-20 md:grid-cols-2 2xl:grid-cols-2 gap-10">
        {events.map((event) => (
          <div
            key={event.id}
            className="grid-cols-2 w-[85%] mx-auto cursor-pointer flex flex-col md:flex-row items-center px-4 md:p-4 py-5 rounded-[16px] shadow-sm hover:shadow-lg"
          >
            <Image
              className="md:w-1/2 w-full md:h-[90%] h-[60%] object-cover rounded-2xl"
              src="https://placehold.co/600x400/png"
              alt={event.title}
              width={400}
              height={300}
            />

            <div className="flex flex-col md:px-3 py-1 items-start justify-between 2xl:py-7 h-full">
              <h1 className="text-xl 2xl:text-[20px] text-[#B81D24] font-semibold">
                {event.title}
              </h1>

              <div className="flex 2xl:grid 2xl:grid-cols-4 text-[12px] xl:text-[14px] 2xl:text-[12px] lg:text-[10px] my-[4%] text-[#52525B] gap-1 items-center justify-start">
                <button className="px-2.5 2x:text-[12px] py-0.5 border hover:bg-gray-200 rounded-lg">
                  {event.eventType}
                </button>
                <button className="px-2.5 2x:text-[12px] py-0.5 border hover:bg-gray-200 rounded-lg">
                  {event.registrationType}
                </button>
              </div>

              <h2 className="text-[#6D6D6D] md:text-[10px] text-sm lg:text-[12px] 2xl:text-[14px]">
                {event.description}
              </h2>

              {/* <p className="text-[#6D6D6D] md:text-[10px] text-sm lg:text-[12px] 2xl:text-[14px] mt-2">
                Price: {event.ticketPrice} {event.currency}
              </p>

              <p className="text-[#6D6D6D] md:text-[10px] text-sm lg:text-[12px] 2xl:text-[14px]">
                {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
              </p> */}

              <button
                onClick={() => handleRegister(event.id)}
                className="bg-black hover:bg-gray-700 font-medium text-[#EFEFEF] text-sm xl:text-[16px] px-4 py-4 md:py-[6px] xl:py-[8px] 2x:py-[12px] mt-8 w-[100%] xl:w-[100%] 2xl:w-[100%] rounded-lg flex gap-2 justify-center items-center"
              >
                <Image
                  src={RegisterCardIcon}
                  alt="RegisterIcon"
                  width={16}
                  height={16}
                />
                <p>Register</p>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-10 my-20 mt-32">
        <button
          onClick={handlePrev}
          disabled={pagination.page === 1}
          className={`${pagination.page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Image src={previous} className="w-8 h-full" alt="Previous" width={32} height={32} />
        </button>

        <div className="flex items-center gap-3">
          {Array.from({ length: pagination.totalPages }).map((_, index) => (
            <span
              key={index}
              onClick={() => setPagination(prev => ({ ...prev, page: index + 1 }))}
              className={`w-3 h-3 rounded-full cursor-pointer ${pagination.page === index + 1
                  ? "bg-black"
                  : "bg-[#EAEAEA] hover:bg-gray-500"
                }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={pagination.page === pagination.totalPages}
          className={`${pagination.page === pagination.totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Image src={next} className="w-8 h-full" alt="Next" width={32} height={32} />
        </button>
      </div>
    </>
  );
};

export default Events;

