"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useAuth } from "@/app/context/AuthContext"
import { Search, Bookmark, CheckCircle2 } from "lucide-react"
import type { CourseInterface } from "@/store/universitystore"

interface CourseSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  courses: CourseInterface[]
  universityName: string
  onCourseSelect: (courseId: string, courseName: string) => Promise<void>
}

export default function CourseSelectionModal({
  isOpen,
  onClose,
  courses,
  universityName,
  onCourseSelect,
}: CourseSelectionModalProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleCourses, setVisibleCourses] = useState<CourseInterface[]>([])
  const [page, setPage] = useState(1)
  const { isAuthenticated } = useAuth()

  const ITEMS_PER_PAGE = 6

  // Filter courses based on search query - memoized for performance
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) {
      return courses
    }

    const query = searchQuery.toLowerCase()
    return courses.filter(
      (course) =>
        course.name.toLowerCase().includes(query) ||
        (course.description && course.description.toLowerCase().includes(query)),
    )
  }, [courses, searchQuery])

  // Calculate total pages once
  const totalPages = useMemo(() => 
    Math.ceil(filteredCourses.length / ITEMS_PER_PAGE), 
    [filteredCourses.length, ITEMS_PER_PAGE]
  )

  // Update visible courses when page or filtered courses change
  const updateVisibleCourses = useCallback(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE
    setVisibleCourses(filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE))
  }, [filteredCourses, page, ITEMS_PER_PAGE])

  useEffect(() => {
    updateVisibleCourses()
  }, [updateVisibleCourses])

  // Reset pagination when search query changes
  useEffect(() => {
    setPage(1)
  }, [searchQuery])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCourseId("")
      setSearchQuery("")
      setPage(1)
      // Initialize with first page of courses
      setVisibleCourses(courses.slice(0, ITEMS_PER_PAGE))
    }
  }, [isOpen, courses, ITEMS_PER_PAGE])

  const handleSubmit = async () => {
    if (!selectedCourseId) {
      toast.error("Please select a course")
      return
    }

    if (!isAuthenticated) {
      toast.error("Please login to add to wishlist")
      onClose()
      return
    }

    // Find the selected course to get its name
    const selectedCourse = courses.find(course => course.id === selectedCourseId)
    
    if (!selectedCourse) {
      toast.error("Course not found")
      return
    }

    setIsSubmitting(true)
    try {
      await onCourseSelect(selectedCourseId, selectedCourse.name)
      toast.success("Course added to wishlist successfully!")
      onClose()
    } catch (error) {
      console.error("Error adding course to wishlist:", error)
      toast.error("Failed to add course to wishlist")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1)
    }
  }

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-full h-auto max-h-[80vh] my-8 overflow-x-hidden">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg font-bold flex items-center">
            <Bookmark className="mr-2 h-4 w-4 text-[#DA202E]" />
            Select a Course to Wishlist
          </DialogTitle>
        </DialogHeader>

        <div className="py-1">
          <h3 className="font-medium mb-2">{universityName}</h3>

          {/* Search input */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-10 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Dynamic height ScrollArea */}
          <ScrollArea className="h-[30vh] md:h-[40vh] rounded-md border">
            <div className="p-2">
              <RadioGroup value={selectedCourseId} onValueChange={setSelectedCourseId}>
                {visibleCourses.length > 0 ? (
                  visibleCourses.map((course) => (
                    <div 
                      key={course.id} 
                      className={`flex items-start space-x-3 mb-2 pb-2 border-b last:border-0 p-2 rounded-md hover:bg-slate-50 transition-colors ${selectedCourseId === course.id ? 'bg-slate-50 ring-1 ring-slate-200' : ''}`}
                      onClick={() => setSelectedCourseId(course.id)}
                    >
                      <RadioGroupItem 
                        value={course.id} 
                        id={course.id} 
                        className="mt-1 border-[#DA202E] text-[#DA202E]"
                        style={{ 
                          '--tw-ring-color': '#DA202E',
                          '--tw-ring-opacity': 1
                        } as React.CSSProperties}
                      />
                      <div className="grid gap-1 w-full">
                        <Label htmlFor={course.id} className="font-medium">
                          {course.name}
                        </Label>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {course.description || "No description available"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground flex flex-col items-center justify-center">
                    <Search className="h-8 w-8 mb-2 text-slate-300" />
                    <p>
                      {searchQuery ? "No courses match your search" : "No courses available"}
                    </p>
                  </div>
                )}
              </RadioGroup>
            </div>
          </ScrollArea>

          {/* Pagination controls */}
          {filteredCourses.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between mt-3 text-sm">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrevPage} 
                disabled={page === 1}
                className="h-8"
              >
                Previous
              </Button>
              <span className="font-medium">
                Page {page} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextPage} 
                disabled={page === totalPages}
                className="h-8"
              >
                Next
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-end space-x-2 mt-3 pt-2 border-t">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isSubmitting} 
            className="h-9"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedCourseId || isSubmitting}
            style={{
              backgroundColor: '#DA202E', 
              color: 'white',
              borderColor: '#DA202E'
            }}
            className="h-9 hover:bg-opacity-90"
          >
            {isSubmitting ? (
              "Adding..."
            ) : (
              <>
                <CheckCircle2 className="mr-1 h-4 w-4" />
                Add to Wishlist
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}