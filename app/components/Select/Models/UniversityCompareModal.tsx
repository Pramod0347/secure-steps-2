'use client'

import React, { useState, useEffect, useCallback } from 'react';
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { TbCurrencyDollar as DollarIcon } from "react-icons/tb";
import { IoStar as RatingStar } from "react-icons/io5";
import PlaceHolder from "@/app/assets/Placehoder-Img.png";
import { debounce } from 'lodash';

export interface Course {
  id: string;
  name: string;
  description: string | null;
  fees: string;
  duration: string;
  degreeType: string;
  ieltsScore: string;
  ranking: string;
  intake: string[];
  websiteLink: string | null;
}

export interface University {
  id: string;
  name: string;
  description: string;
  location: string;
  country: string;
  website: string;
  established: Date;
  banner: string;
  logoUrl: string | null;
  imageUrls: string[];
  facilities: string[];
  courses: Course[];
}

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUniversity: University;
}

const UniversityCompareModal: React.FC<CompareModalProps> = ({ isOpen, onClose, selectedUniversity }) => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [compareUniversity, setCompareUniversity] = useState<University | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchUniversities = useCallback(debounce(async (query: string) => {
    setLoading(true);
    try {
      const NextUrl = process.env.NEXTAUTH_URL || window.location.origin;
      const response = await fetch(`${NextUrl}/api/universities?name=${query}`);
      const data = await response.json();
      const filteredUniversities = data.universities.filter(
        (uni: University) => uni.id !== selectedUniversity.id
      );
      setUniversities(filteredUniversities);
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
    setLoading(false);
  }, 300), [selectedUniversity.id]);

  useEffect(() => {
    if (searchTerm) {
      fetchUniversities(searchTerm);
    } else {
      setUniversities([]);
    }
  }, [searchTerm, fetchUniversities]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCompareUniversity(null);
  };

  const calculateFeesRange = (university: University) => {
    const fees = university.courses.map(course => {
      const feeValue = parseFloat(course.fees.replace(/[^0-9.]/g, ''));
      return isNaN(feeValue) ? 0 : feeValue;
    });
    
    const min = Math.min(...fees);
    const max = Math.max(...fees);
    return `${min.toLocaleString()} - ${max.toLocaleString()}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed  inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white mt-10 rounded-[5px] max-w-4xl w-[90vw] h-[65vh] max-h-[80vh] my-8 overflow-hidden flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="md:text-2xl text-lg font-bold">Compare Universities</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IoClose size={24} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 no-scrollbar overflow-y-auto">
          {/* Selected University */}
          <UniversityCard university={selectedUniversity} calculateFeesRange={calculateFeesRange} />

          {/* Compare University Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="md:text-xl text-lg font-semibold">Compare With</h3>
              <input
                type="text"
                placeholder="Search university to compare..."
                className="w-full p-3 border rounded-lg"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            {compareUniversity ? (
              <UniversityCard 
                university={compareUniversity} 
                calculateFeesRange={calculateFeesRange} 
                onClose={() => {
                  setCompareUniversity(null);
                  setSearchTerm('');
                }}
              />
            ) : (
              <UniversityList 
                universities={universities} 
                loading={loading} 
                searchTerm={searchTerm} 
                onSelect={setCompareUniversity} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface UniversityCardProps {
  university: University;
  calculateFeesRange: (university: University) => string;
  onClose?: () => void;
}

const UniversityCard: React.FC<UniversityCardProps> = ({ university, calculateFeesRange, onClose }) => (
  <div className="space-y-6">
    <div className="relative rounded-2xl overflow-hidden">
      <Image
        src={university.banner || PlaceHolder}
        alt={university.name}
        width={400}
        height={300}
        className="w-full h-48 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute bottom-4 left-4 text-white">
        <h4 className="text-lg font-bold">{university.name}</h4>
        <div className="flex items-center gap-2">
          <RatingStar className="text-yellow-500" />
          <span>{university.courses[0]?.ranking || 'N/A'}</span>
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white/10 backdrop-blur-sm p-2 rounded-full"
        >
          <IoClose className="text-white" />
        </button>
      )}
    </div>
    <div className="space-y-4 text-xs md:text-base">
      <InfoRow label="Location" value={`${university.location}, ${university.country}`} />
      <InfoRow label="Established" value={new Date(university.established).getFullYear().toString()} />
      <InfoRow 
        label="Tuition Range" 
        value={calculateFeesRange(university)} 
        icon={<DollarIcon />} 
      />
      <InfoRow 
        label="Total Courses" 
        value={university.courses.length.toString()} 
      />
    </div>
  </div>
);

interface InfoRowProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, icon }) => (
  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
    <span className="font-medium">{label}</span>
    <div className="flex items-center gap-1">
      {icon}
      <span>{value}</span>
    </div>
  </div>
);

interface UniversityListProps {
  universities: University[];
  loading: boolean;
  searchTerm: string;
  onSelect: (university: University) => void;
}

const UniversityList: React.FC<UniversityListProps> = ({ universities, loading, searchTerm, onSelect }) => (
  <div className="space-y-4">
    {loading ? (
      <div className="text-center py-8">Loading...</div>
    ) : searchTerm ? (
      universities.length > 0 ? (
        universities.map((university) => (
          <div
            key={university.id}
            onClick={() => onSelect(university)}
            className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <Image
              src={university.banner || PlaceHolder}
              alt={university.name}
              width={80}
              height={80}
              className="rounded-lg object-cover"
            />
            <div>
              <h4 className="font-medium">{university.name}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <RatingStar className="text-yellow-500" />
                <span>{university.courses[0]?.ranking || 'N/A'}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          No universities found
        </div>
      )
    ) : (
      <div className="text-center py-8 text-gray-500">
        Search for a university to compare
      </div>
    )}
  </div>
);

export default UniversityCompareModal;