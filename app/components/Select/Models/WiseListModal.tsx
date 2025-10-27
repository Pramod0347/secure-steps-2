"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"
import { X, Trash, GraduationCap, BookOpen } from "lucide-react"
import type { CourseInterface } from "@/store/universitystore"

interface WiseListModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenApplicationModal: (universityId: string, courses: CourseInterface[], universityName: string) => void
}

// Updated interface to match the API response structure
interface FavCourseItem {
  id: string
  userId: string
  courseId: string
  courseName: string
  universityId: string
  universityName: string
  course?: {
    id: string
    name: string
    fees: number
    duration: string
    degreeType: string
  }
}

const WiseListModal: React.FC<WiseListModalProps> = ({ isOpen, onClose, onOpenApplicationModal }) => {
  const [wiseListItems, setWiseListItems] = useState<FavCourseItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchWiseList()
    }
  }, [isOpen, user?.id])

  const fetchWiseList = async () => {
    if (!user?.id) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/auth/fav-courses?userId=${user.id}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch wiselist")
      }
      
      const data = await response.json()
      setWiseListItems(data)
      
    } catch (err) {
      console.error("Error fetching wiselist:", err)
      setError("Failed to load your WiseList. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromWiseList = async (itemId: string, courseId: string) => {
    try {
      // Remove from local state first for immediate UI update
      setWiseListItems(prev => prev.filter(item => item.id !== itemId))
      
      // Send DELETE request to API
      const response = await fetch(`/api/auth/fav-courses`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          courseId: courseId
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to remove from wiselist")
      }
      
    } catch (err) {
      console.error("Error removing from wiselist:", err)
      // Restore the item if the API call fails
      fetchWiseList()
    }
  }

  const handleApplyClick = (universityId: string, universityName: string) => {
    // Get course data for this university
    const universityWiseCourses = wiseListItems
      .filter(item => item.universityId === universityId)
    
    // Format courses to match CourseInterface - including all required properties
    const formattedCourses: CourseInterface[] = universityWiseCourses.map(item => ({
      id: item.courseId,
      name: item.courseName,
      description: item.course?.name || null,
      fees: item.course?.fees?.toString() || "0",
      duration: item.course?.duration || "",
      degreeType: item.course?.degreeType || "",
      ieltsScore: "",
      ranking: "",
      intake: [], // Empty array as default
      websiteLink: null,
      universityId: item.universityId, // Adding missing universityId
      image: undefined, // Optional property
      createdAt: new Date(), // Adding missing createdAt
      updatedAt: new Date(), // Adding missing updatedAt
    }))
    
    // Close this modal
    onClose()
    
    // Open application modal with selected university details
    onOpenApplicationModal(universityId, formattedCourses, universityName)
  }

  // If the modal is not open, don't render anything
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-[5px] shadow-xl w-full max-w-4xl max-h-[80vh] my-8 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#DA202E]" />
            My WiseList
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-black transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DA202E]"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : wiseListItems.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-500">Your WiseList is empty</p>
              <p className="mt-2 text-gray-400">Add courses to your WiseList to track and compare them later</p>
            </div>
          ) : (
            // Group wiseListItems by universityId
            Object.values(wiseListItems.reduce((acc, item) => {
              if (!acc[item.universityId]) {
                acc[item.universityId] = {
                  universityId: item.universityId,
                  universityName: item.universityName,
                  courses: []
                };
              }
              acc[item.universityId].courses.push(item);
              return acc;
            }, {} as Record<string, { universityId: string; universityName: string; courses: FavCourseItem[] }>))
            .map((group) => (
              <div 
                key={group.universityId} 
                className="border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b">
                  <h3 className="font-bold text-lg">{group.universityName}</h3>
                  <button 
                    onClick={() => handleApplyClick(group.universityId, group.universityName)}
                    className="px-4 py-1.5 bg-[#DA202E] text-white text-sm rounded-md hover:bg-opacity-90 transition-colors flex items-center gap-1.5"
                  >
                    <BookOpen className="w-4 h-4" />
                    Apply Now
                  </button>
                </div>
                <div className="space-y-3">
                  {group.courses.map(item => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between py-2 hover:bg-gray-50 px-2 rounded-md"
                    >
                      <div>
                        <p className="font-medium">{item.courseName}</p>
                        {item.course && (
                          <div className="text-sm text-gray-500">
                            <span>{item.course.degreeType} • </span>
                            <span>{item.course.duration} • </span>
                            <span>₹{item.course.fees.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => removeFromWiseList(item.id, item.courseId)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove from WiseList"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        
        
      </div>
    </div>
  )
}

export default WiseListModal