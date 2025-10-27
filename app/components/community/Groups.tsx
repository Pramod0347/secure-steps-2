import Image from "next/image";
// import Pixel from "@/app/assets/lenders/Pixel.png";
import previous from "@/app/assets/Previous.png";
import next from "@/app/assets/Next.png";
import peops from "@/app/assets/groups/peps.png";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Group {
  id: string;
  name: string;
  slug: string;
  banner: string;
  logo: string;
  description: string;
  privacy: string;
  membersCount: number;
  creatorUsername: string;
}

interface PaginationInfo {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    pages: 1,
    page: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGroups(pagination.page);
  }, [pagination.page]);

  const fetchGroups = async (page: number) => {
    try {
      const NextUrl = process.env.NEXTAUTH_URL || window.location.origin;
      setLoading(true);
      const response = await fetch(`${NextUrl}/api/community/group?page=${page}&limit=10`);
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      const data = await response.json();
      setGroups(data.groups);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setError('Error fetching groups. Please try again later.');
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
    if (pagination.page < pagination.pages) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <div className="md:px-32 px-2 mb-20 pt-5 flex jakartha flex-col gap-6 jakartha">
      <div className="grid mt-6 md:mt-20 grid-cols-1 md:grid-cols-3 gap-2 md:gap-12">
        {groups.map((group) => (
          <div
            key={group.id}
            className="px-2.5 h-fit py-2.5 w-full overflow-hidden rounded-[28px] border hover:shadow-xl"
          >
            <Link href={`/community/group/${group.id}`} className="flex flex-col gap-4">
              <Image
                className="w-full md:h-full h-[120px] object-cover rounded-2xl"
                src="https://placehold.co/600x400/png"
                alt={"image"}
                width={500}
                height={300}
              />
              <div className="md:p-3 flex flex-col justify-between">
                <div className="flex md:flex-row flex-col md:items-center gap-4 justify-start">
                  <Image
                    src={"https://placehold.co/600x400.png"}
                    className="rounded-[24px] w-[43px] h-[43px] "
                    alt="image"
                    width={40}
                    height={40}
                  />
                  <div className="flex flex-col items-start justify-center gap-2">
                    <h1 className="md:text-xl text-[10px] text-black font-semibold">
                      {group.name}
                    </h1>
                    <div className="flex gap-2 items-center justify-start">
                      <Image
                        src={peops}
                        className="w-2/3 h-fit"
                        alt=""
                        width={50}
                        height={50}
                      />
                      <h4 className="text-[#E50914] whitespace-nowrap md:text-base text-[11px] font-medium">
                        {group.membersCount} {group.membersCount === 1 ? 'Member' : 'Members'}
                      </h4>
                    </div>
                  </div>
                </div>
                <button className="bg-black hover:bg-gray-700 text-[#EFEFEF] text-sm px-4 py-2.5 md:py-4 mt-2 md:mt-8 rounded-full">
                  Join
                </button>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-10 mt-20">
        <button
          onClick={handlePrev}
          disabled={pagination.page === 1}
          className={`${pagination.page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Image src={previous} className="w-8 h-full" alt="Previous" width={32} height={32} />
        </button>

        <div className="flex items-center gap-3">
          {Array.from({ length: pagination.pages }).map((_, index) => (
            <span
              key={index}
              onClick={() => setPagination(prev => ({ ...prev, page: index + 1 }))}
              className={`w-3 h-3 rounded-full cursor-pointer ${
                pagination.page === index + 1
                  ? "bg-black"
                  : "bg-[#EAEAEA] hover:bg-gray-500"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={pagination.page === pagination.pages}
          className={`${pagination.page === pagination.pages ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Image src={next} className="w-8 h-full" alt="Next" width={32} height={32} />
        </button>
      </div>
    </div>
  );
};

export default Groups;

