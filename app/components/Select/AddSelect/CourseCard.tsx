// 2. Updated CourseCard component with better error handling
"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";

interface CourseCardProps {
  id?: string; // Make sure ID is included
  name: string;
  description?: string;
  fees: string;
  duration: string;
  degreeType?: string;
  ieltsScore?: string;
  ranking?: string;
  intake?: string[];
  websiteLink?: string;
  image: string | File | null;
  onDelete?: (courseId: string) => void; // Update to pass courseId
}

export function CourseCard({
  id,
  name,
  description,
  fees,
  duration,
  degreeType,
  ieltsScore,
  ranking,
  intake,
  image,
  onDelete,
}: CourseCardProps) {
  const imageUrl =
    typeof image === "string" 
      ? image 
      : image instanceof File 
      ? URL.createObjectURL(image) 
      : "/placeholder.svg";

  const handleDelete = () => {
    if (!id) {
      console.error("Course ID is missing");
      return;
    }
    
    onDelete?.(id);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border group">
      <div className="relative aspect-video">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {onDelete && id && (
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4 text-[#da212f]" />
          </button>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-bold text-lg line-clamp-1">{name}</h3>

        {description && <p className="text-sm text-gray-600 line-clamp-2">{description}</p>}

        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Fees:</span>
            <span className="font-medium">${Number.parseFloat(fees).toLocaleString()}</span>
          </div>

          {/* <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span >{duration}</span>
          </div> */}

          {degreeType && (
            <div className="flex justify-between">
              <span className="text-gray-600">Degree:</span>
              <span>{degreeType}</span>
            </div>
          )}

          {ieltsScore && (
            <div className="flex justify-between">
              <span className="text-gray-600">IELTS:</span>
              <span>{ieltsScore}</span>
            </div>
          )}

          {ranking && (
            <div className="flex justify-between">
              <span className="text-gray-600">Ranking:</span>
              <span>{ranking}</span>
            </div>
          )}
        </div>

        {intake && intake.length > 0 && (
          <div className="pt-2">
            <p className="text-sm text-gray-600 mb-1">Intake Months:</p>
            <div className="flex flex-wrap gap-1">
              {intake.map((month, index) => (
                <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  {month}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}