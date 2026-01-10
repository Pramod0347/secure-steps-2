const UniversityCardSkeleton: React.FC = () => {
    return (
      <div className="relative flex overflow-hidden rounded-3xl h-[420px] 2xl:h-[480px] w-full max-w-[380px] sm:max-w-[420px] xl:max-w-[400px] 2xl:max-w-[480px] bg-gray-100 animate-pulse">
        <div className="absolute inset-0 bg-gray-200 rounded-3xl" />
        
        {/* Wishlist button skeleton */}
        <div className="absolute left-5 top-5 z-10">
          <div className="w-12 h-12 bg-gray-300 rounded-2xl" />
        </div>
        
        {/* Courses badge skeleton */}
        <div className="absolute right-5 top-5 z-10">
          <div className="w-[100px] h-[60px] bg-gray-300 rounded-2xl" />
        </div>
        
        {/* Bottom content skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4 z-10">
          {/* University name */}
          <div className="space-y-2">
            <div className="h-6 bg-gray-300 rounded-md w-4/5" />
            <div className="h-6 bg-gray-300 rounded-md w-3/5" />
          </div>
          
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 rounded w-16" />
              <div className="h-4 bg-gray-300 rounded w-24" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 rounded w-20" />
              <div className="h-4 bg-gray-300 rounded w-28" />
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="h-12 bg-gray-300 rounded-xl" />
            <div className="h-12 bg-gray-400 rounded-xl" />
          </div>
        </div>
      </div>
    );
  };

  export default UniversityCardSkeleton;