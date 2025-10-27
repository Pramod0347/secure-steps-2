const UniversityCardSkeleton: React.FC = () => {
    return (
      <div className="relative flex overflow-hidden rounded-[30px] h-[384px] w-full max-w-[410px] mx-auto 2xl:h-[464px] bg-gray-100 animate-pulse">
        <div className="absolute inset-0 bg-gray-300 rounded-[30px]" />
        <div className="absolute right-4 top-4 z-10">
          <div className="w-[140px] h-[60px] bg-gray-400 rounded-2xl" />
        </div>
        <div className="absolute bottom-4 w-full px-4 z-10 space-y-3">
          <div className="h-5 bg-gray-400 rounded-md w-3/4" />
          <div className="flex justify-between w-full">
            <div className="space-y-1">
              <div className="h-3 bg-gray-400 rounded w-16" />
              <div className="h-3 bg-gray-400 rounded w-24" />
            </div>
            <div className="space-y-1">
              <div className="h-3 bg-gray-400 rounded w-24" />
              <div className="h-3 bg-gray-400 rounded w-28" />
            </div>
          </div>
          <div className="flex justify-between w-full pt-2">
            <div className="h-[30px] bg-gray-400 rounded-[6px] w-[120px]" />
            <div className="h-[30px] bg-gray-400 rounded-[6px] w-[120px]" />
          </div>
        </div>
      </div>
    );
  };

  export default UniversityCardSkeleton;