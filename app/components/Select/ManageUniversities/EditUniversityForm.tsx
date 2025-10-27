"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { ImageUpload } from "../AddSelect/ImageUpload"
import { FacilitiesList } from "../AddSelect/FacilitiesList"
import { CourseCard } from "../AddSelect/CourseCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Save, ArrowLeft, Edit, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { GalleryUpload } from "../AddSelect/GalleryUpload"
import type { UniversityInterface } from "./UniversityManagement"
import type { Course } from "../AddSelect/CourseForm"
import { isEqual } from "lodash"
import { CourseEditModal } from "../Models/CourseEditModal"
import CareerOutcomesForm, { CareerOutcomeData } from "../AddSelect/CareerOutcomesForm"
import { FAQ, FAQForm } from "../AddSelect/FAQForm"


interface EditUniversityFormProps {
  university: UniversityInterface
  onUniversityUpdated?: () => void
  setIsEditFormDirty: (isDirty: boolean) => void
}

const FORM_STORAGE_KEY = "editUniversityFormData"

export function EditUniversityForm({ university, onUniversityUpdated, setIsEditFormDirty }: EditUniversityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [currentUniversity, setCurrentUniversity] = useState<any>(university)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [hasAnyCourses, setHasAnyCourses] = useState(university.courses.length > 0)
  const [draftSaveTimeout, setDraftSaveTimeout] = useState<NodeJS.Timeout | null>(null)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [courseSearchQuery, setCourseSearchQuery] = useState("")
  const [isCourseEditModalOpen, setIsCourseEditModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [coursesPerPage] = useState(20)
  const [loadingCourses, setLoadingCourses] = useState<Record<string, boolean>>({})
  const [establishedYear, setEstablishedYear] = useState<string>("")

  const openCourseEditModal = useCallback((course: Course | null) => {
    setEditingCourse(course)
    setIsCourseEditModalOpen(true)
  }, [])

  const closeCourseEditModal = useCallback(() => {
    setEditingCourse(null)
    setIsCourseEditModalOpen(false)
  }, [])



  const handleCourseAdd = useCallback(
    async (course: Course) => {
      setLoadingCourses((prev) => ({ ...prev, [course.id || "new"]: true }))
      try {
        const response = await fetch(`/api/universities/${university.id}/course`, {
          method: course.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(course),
        })

        if (!response.ok) {
          throw new Error("Failed to save course")
        }

        const savedCourse = await response.json()

        setCurrentUniversity((prev: any) => {
          const updatedCourses = course.id
            ? prev.courses.map((c: Course) => (c.id === savedCourse.id ? savedCourse : c))
            : [...prev.courses, savedCourse]
          return { ...prev, courses: updatedCourses }
        })

        setHasAnyCourses(true)
        closeCourseEditModal()
        toast.success(course.id ? "Course updated successfully" : "Course added successfully")
      } catch (error) {
        console.error("Error saving course:", error)
        toast.error("Failed to save course")
        throw error // Propagate the error to the CourseEditModal
      } finally {
        setLoadingCourses((prev) => ({ ...prev, [course.id || "new"]: false }))
      }
    },
    [university.id, closeCourseEditModal],
  )

  const handleCourseRemove = useCallback(
    async (courseId: string) => {
      if (!courseId) {
        toast.error("Course ID is missing");
        return;
      }

      // Show confirmation dialog
      if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
        return;
      }

      setLoadingCourses((prev) => ({ ...prev, [courseId]: true }));

      try {
        // console.log("Removing course:", { courseId, universityId: university.id });

        const response = await fetch(`/api/universities/${university.id}/course/${courseId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        // console.log("Delete response status:", response.status);

        if (!response.ok) {
          let errorMessage = "Failed to delete course";

          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (parseError) {
            console.error("Failed to parse error response:", parseError);
            errorMessage = `HTTP ${response.status}: Failed to delete course`;
          }

          console.error("Delete failed:", errorMessage);
          throw new Error(errorMessage);
        }

        const result = await response.json();
        // console.log("Delete successful:", result);

        // Update local state - remove the course from the current university
        setCurrentUniversity((prev: any) => ({
          ...prev,
          courses: prev.courses.filter((c: Course) => c.id !== courseId),
        }));

        // Update hasAnyCourses based on remaining courses
        const remainingCourses = currentUniversity.courses.filter((c: Course) => c.id !== courseId);
        setHasAnyCourses(remainingCourses.length > 0);

        // Reset pagination if we're on a page that no longer exists
        const totalPages = Math.ceil((remainingCourses.length) / coursesPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }

        toast.success("Course deleted successfully");

      } catch (error) {
        console.error("Error removing course:", error);
        toast.error(error instanceof Error ? error.message : "Failed to delete course");
      } finally {
        setLoadingCourses((prev) => ({ ...prev, [courseId]: false }));
      }
    },
    [university.id, currentUniversity.courses, currentPage, coursesPerPage],
  );


  const initializeFromUniversity = useCallback(() => {
    // Convert Date object to year for the form
    let year = ""
       
    if (university.established instanceof Date) {
      year = university.established.getFullYear().toString()
    } else if (typeof university.established === "string") {
      const date = new Date(university.established)
      if (!isNaN(date.getTime())) {
        year = date.getFullYear().toString()
      } else {
        const parsedYear = Number.parseInt(university.established, 10)
        if (!isNaN(parsedYear)) {
          year = parsedYear.toString()
        }
      }
    } else if (typeof university.established === "number") {
      year = university.established
    }
       
    if (!year) {
      year = new Date().getFullYear().toString()
    }
       
    setEstablishedYear(year)
  
    // Convert the existing careerOutcomes array to the new single CareerOutcomeData structure
    let careerOutcomeData: CareerOutcomeData | null = null
    
    if (university.careerOutcomes && university.careerOutcomes.length > 0) {
      // Take the first career outcome (there should only be one per university)
      const firstOutcome:any = university.careerOutcomes[0]
      
      careerOutcomeData = {
        salaryChartData: firstOutcome.salaryChartData || [],
        employmentRateMeterData: firstOutcome.employmentRateMeter || null,
        courseTimelineData: firstOutcome.courseTimelineData || []
      }
    }
       
    const initializedUniversity = {
      ...university,
      established: university.established,
      careerOutcomeData, // New single career outcome data structure
      faqs: Array.isArray(university.faqs) && university.faqs.length > 0
        ? university.faqs.map((faq: any) => ({
            ...faq,
            id: faq.id ? String(faq.id) : undefined,
          }))
        : [],
    }
       
    console.log("Initialized university with career outcome data:", initializedUniversity.careerOutcomeData)
       
    setCurrentUniversity(initializedUniversity)
  }, [university])


// 3. Replace handleCareerOutcomesChange with handleCareerOutcomeDataChange
const handleCareerOutcomeDataChange = useCallback((careerOutcomeData: CareerOutcomeData) => {
  console.log("Career outcome data changed:", careerOutcomeData)
  
  setCurrentUniversity((prev: any) => ({
    ...prev,
    careerOutcomeData,
  }))
}, [])


useEffect(() => {
  const storedData = localStorage.getItem(`${FORM_STORAGE_KEY}_${university.id}`)
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData)

      // Convert stored careerOutcomes array back to single careerOutcomeData if needed
      let careerOutcomeData = parsedData.careerOutcomeData

      // If stored data still has the old careerOutcomes array format, convert it
      if (!careerOutcomeData && parsedData.careerOutcomes && Array.isArray(parsedData.careerOutcomes) && parsedData.careerOutcomes.length > 0) {
        const firstOutcome = parsedData.careerOutcomes[0]
        careerOutcomeData = {
          salaryChartData: firstOutcome.salaryChartData || [],
          employmentRateMeterData: firstOutcome.employmentRateMeter || null,
          courseTimelineData: firstOutcome.courseTimelineData || []
        }
      }

      // If still no careerOutcomeData, try to extract from university prop
      if (!careerOutcomeData && university.careerOutcomes && university.careerOutcomes.length > 0) {
        const firstOutcome:any = university.careerOutcomes[0]
        careerOutcomeData = {
          salaryChartData: firstOutcome.salaryChartData || [],
          employmentRateMeterData: firstOutcome.employmentRateMeter || null,
          courseTimelineData: firstOutcome.courseTimelineData || []
        }
      }

      const processedData = {
        ...parsedData,
        careerOutcomeData: careerOutcomeData || null,
        faqs: Array.isArray(parsedData.faqs) && parsedData.faqs.length > 0
          ? parsedData.faqs.map((faq: any) => ({
              ...faq,
              id: faq.id ? String(faq.id) : undefined,
            }))
          : Array.isArray(university.faqs) && university.faqs.length > 0
            ? university.faqs.map((faq: any) => ({
                ...faq,
                id: faq.id ? String(faq.id) : undefined,
              }))
            : [],
      }

      console.log("Processed stored data with career outcome data:", processedData.careerOutcomeData)

      setCurrentUniversity(processedData)

      // Set established year from stored data
      if (processedData.established) {
        let year = ""

        if (
          processedData.established instanceof Date ||
          (typeof processedData.established === "string" && processedData.established.includes("-"))
        ) {
          const date = new Date(processedData.established)
          if (!isNaN(date.getTime())) {
            year = date.getFullYear().toString()
          }
        } else if (typeof processedData.established === "string" || typeof processedData.established === "number") {
          const parsedYear = Number.parseInt(String(processedData.established), 10)
          if (!isNaN(parsedYear)) {
            year = parsedYear.toString()
          }
        }

        if (year) {
          setEstablishedYear(year)
        } else {
          initializeFromUniversity()
        }
      } else {
        initializeFromUniversity()
      }
    } catch (error) {
      console.error("Error parsing stored data:", error)
      initializeFromUniversity()
    }
  } else {
    initializeFromUniversity()
  }

  setHasAnyCourses(university.courses.length > 0)
}, [university, initializeFromUniversity])


  // Auto-save draft every 30 seconds
  useEffect(() => {
    const saveDraft = () => {
      try {
        localStorage.setItem(`${FORM_STORAGE_KEY}_${university.id}`, JSON.stringify(currentUniversity))
        console.log("Draft auto-saved")
      } catch (error) {
        console.error("Error auto-saving draft:", error)
      }
    }

    // Clear previous timeout
    if (draftSaveTimeout) {
      clearTimeout(draftSaveTimeout)
    }

    // Set new timeout for auto-save
    const timeout = setTimeout(saveDraft, 30000) // 30 seconds
    setDraftSaveTimeout(timeout)

    return () => {
      if (draftSaveTimeout) {
        clearTimeout(draftSaveTimeout)
      }
    }
  }, [currentUniversity, university.id]) // Remove draftSaveTimeout from dependencies

  useEffect(() => {
    setIsEditFormDirty(true)
  }, []) // Empty dependency array so it only runs once on mount

  const handleImageUpload = useCallback(
    async (file: File, type: "banner" | "logo" | "gallery" | "course" | "career-icon"): Promise<string> => {
      if (!file) {
        throw new Error("No file provided")
      }

      const toastId = `upload-${type}-${Date.now()}`

      try {
        toast.loading("Preparing upload...", { id: toastId })

        const formData = new FormData()
        formData.append("file", file)
        // Map component types to API expected types
        formData.append("type", "image") // Always send "image" for image uploads

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Failed to upload ${type}`)
        }

        const result = await response.json()

        if (!result.url) {
          throw new Error("No URL returned from server")
        }

        console.log(`${type} image uploaded:`, result.url)
        setUploadProgress((prev) => ({ ...prev, [type]: 100 }))
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} image uploaded`, { id: toastId })

        return result.url
      } catch (error) {
        console.error(`Error uploading ${type}:`, error)
        toast.error(error instanceof Error ? error.message : `Failed to upload ${type}`, { id: toastId })
        throw error
      }
    },
    [],
  )

  // Fix the return type to match what CourseEditModal expects
  const handleImageRemove = useCallback(async (imageUrl: string): Promise<void> => {
    try {
      if (!imageUrl) {
        console.warn("No image URL provided for deletion")
        return
      }

      console.log("Removing image from server:", imageUrl)

      const response = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: imageUrl, // Changed from imageUrl to fileUrl to match API expectation
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to delete image" }))
        throw new Error(errorData.error || errorData.message || "Failed to delete image from storage")
      }

      toast.success("Image removed successfully from server")
    } catch (error) {
      console.error("Error removing image from server:", error)
      toast.error("Failed to remove image from server")
    }
  }, []);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
  
    try {
      if (!currentUniversity.banner) {
        throw new Error("Please upload a banner image")
      }
  
      if (!currentUniversity.logoUrl) {
        throw new Error("Please upload a logo image")
      }
  
      if (currentUniversity.courses.length === 0) {
        throw new Error("Please add at least one course")
      }
  
      // Prepare the data to be sent
      const updatedData: any = {}
  
      // Handle each field individually with proper comparison
      Object.keys(currentUniversity).forEach((key) => {
        const typedKey = key as keyof typeof currentUniversity
  
        switch (typedKey) {
          case "courses":
            const changedCourses = currentUniversity.courses.filter((course: Course) => {
              const originalCourse = university.courses.find((c) => c.id === course.id)
              return !originalCourse || !isEqual(course, originalCourse)
            })
            if (changedCourses.length > 0) {
              updatedData.courses = changedCourses
            }
            break
  
          case "established":
            if (establishedYear) {
              const year = Number.parseInt(establishedYear, 10)
              if (!isNaN(year)) {
                let originalYear: number | null = null
  
                if (university.established instanceof Date) {
                  originalYear = university.established.getFullYear()
                } else if (typeof university.established === "string") {
                  const date = new Date(university.established)
                  if (!isNaN(date.getTime())) {
                    originalYear = date.getFullYear()
                  } else {
                    const parsedYear = Number.parseInt(university.established, 10)
                    if (!isNaN(parsedYear)) {
                      originalYear = parsedYear
                    }
                  }
                } else if (typeof university.established === "number") {
                  originalYear = university.established
                }
  
                if (year !== originalYear) {
                  const dateStr = `${year}-01-01`
                  updatedData.established = dateStr
                  console.log("Including established year in update:", dateStr)
                }
              }
            }
            break
  
            case "careerOutcomeData":
              // Handle the new career outcome data structure
              const currentCareerOutcomeData = currentUniversity.careerOutcomeData
              
              // Compare with original data structure
              let originalCareerOutcomeData: CareerOutcomeData | null = null
              if (university.careerOutcomes && university.careerOutcomes.length > 0) {
                const firstOutcome:any = university.careerOutcomes[0]
                originalCareerOutcomeData = {
                  salaryChartData: firstOutcome.salaryChartData || [],
                  employmentRateMeterData: firstOutcome.employmentRateMeter || null,
                  courseTimelineData: firstOutcome.courseTimelineData || []
                }
              }
            
              if (!isEqual(currentCareerOutcomeData, originalCareerOutcomeData)) {
                updatedData.careerOutcomeData = currentCareerOutcomeData
                console.log("Career outcome data changed, including in update:", currentCareerOutcomeData)
              }
              break
  
          case "faqs":
            const currentFaqs = (currentUniversity.faqs || []).map((faq: any) => ({
              ...faq,
              id: faq.id ? String(faq.id) : undefined,
            }))
            const originalFaqs = (university.faqs || []).map((faq: any) => ({
              ...faq,
              id: faq.id ? String(faq.id) : undefined,
            }))
  
            if (currentFaqs.length !== originalFaqs.length ||
              !isEqual(currentFaqs, originalFaqs)) {
              updatedData.faqs = currentFaqs
              console.log("FAQs changed, including in update:", currentFaqs)
            }
            break
  
          case "imageUrls":
          case "facilities":
            if (!isEqual(currentUniversity[typedKey], university[typedKey])) {
              updatedData[typedKey] = currentUniversity[typedKey]
            }
            break
  
          default:
            // Handle other fields (strings, numbers, etc.)
            if (
              typeof currentUniversity[typedKey] === "string" ||
              typeof currentUniversity[typedKey] === "number" ||
              currentUniversity[typedKey] instanceof Date
            ) {
              if (currentUniversity[typedKey as keyof UniversityInterface] !== university[typedKey as keyof UniversityInterface]) {
                const currentValue = currentUniversity[typedKey as keyof UniversityInterface];
                const universityValue = university[typedKey as keyof UniversityInterface];
                
                if (typeof currentValue === "number" || currentValue instanceof Date) {
                  (updatedData as any)[typedKey] = String(currentValue);
                } else {
                  (updatedData as any)[typedKey] = currentValue;
                }
              }
            }
            break
        }
      })
  
      if (Object.keys(updatedData).length === 0) {
        toast.info("No changes detected")
        setIsSubmitting(false)
        return
      }
  
      console.log("Updating university data:", JSON.stringify(updatedData, null, 2))
  
      // API call to update university
      const response = await fetch(`/api/universities/${university.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
  
      console.log("Response status:", response.status)
  
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to update university")
      }
  
      const updatedUniversity = await response.json()
      console.log("University updated successfully:", updatedUniversity)
  
      toast.success("University updated successfully!")
  
      // Clear the draft storage
      localStorage.removeItem(`${FORM_STORAGE_KEY}_${university.id}`)
  
      // Notify parent component
      if (typeof onUniversityUpdated === "function") {
        onUniversityUpdated()
      }
      setIsEditFormDirty(false)
    } catch (error) {
      console.error("Error updating university:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update university")
    } finally {
      setIsSubmitting(false)
    }
  }
  

  const handleSaveDraft = useCallback(() => {
    setIsSavingDraft(true)
    try {
      // Make sure to include the established year in the draft
      const draftData = {
        ...currentUniversity,
        established: establishedYear
          ? new Date(Number.parseInt(establishedYear, 10), 0, 1)
          : currentUniversity.established,
      }

      localStorage.setItem(`${FORM_STORAGE_KEY}_${university.id}`, JSON.stringify(draftData))
      toast.success("Draft saved successfully")
    } catch (error) {
      console.error("Error saving draft:", error)
      toast.error("Failed to save draft")
    } finally {
      setIsSavingDraft(false)
    }
  }, [currentUniversity, university.id, establishedYear])

  const filteredCourses = useMemo(
    () =>
      currentUniversity.courses.filter(
        (course: Course) =>
          course.name.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
          (course.description && course.description.toLowerCase().includes(courseSearchQuery.toLowerCase())),
      ),
    [currentUniversity.courses, courseSearchQuery],
  )

  const indexOfLastCourse = currentPage * coursesPerPage
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Create a wrapper function for ImageUpload onRemove that returns Promise<void>
  const handleBannerRemove = useCallback(async (): Promise<void> => {
    if (currentUniversity.banner) {
      try {
        // Store the URL before updating state
        const urlToRemove = currentUniversity.banner

        // Update state first for immediate UI feedback
        setCurrentUniversity((prev: any) => ({ ...prev, banner: "" }))

        // Then try to remove from server
        await handleImageRemove(urlToRemove)
      } catch (error) {
        console.error("Error removing banner image:", error)
        toast.error("Failed to remove banner image from server, but it was removed from the form")
      }
    }
  }, [currentUniversity.banner, handleImageRemove])

  // Create a wrapper function for ImageUpload onRemove that returns Promise<void>
  const handleLogoRemove = useCallback(async (): Promise<void> => {
    if (currentUniversity.logoUrl) {
      try {
        // Store the URL before updating state
        const urlToRemove = currentUniversity.logoUrl

        // Update state first for immediate UI feedback
        setCurrentUniversity((prev: any) => ({ ...prev, logoUrl: "" }))

        // Then try to remove from server
        await handleImageRemove(urlToRemove)
      } catch (error) {
        console.error("Error removing logo image:", error)
        toast.error("Failed to remove logo image from server, but it was removed from the form")
      }
    }
  }, [currentUniversity.logoUrl, handleImageRemove])

  // Create a wrapper function for GalleryUpload onRemove that returns Promise<void>
  const handleGalleryImageRemove = useCallback(
    async (imageUrl: string): Promise<void> => {
      try {
        // Update state first for immediate UI feedback
        setCurrentUniversity((prev: any) => ({
          ...prev,
          imageUrls: prev.imageUrls.filter((url: string) => url !== imageUrl),
        }))

        // Then try to remove from server
        await handleImageRemove(imageUrl)
      } catch (error) {
        console.error("Error removing gallery image:", error)
        toast.error("Failed to remove gallery image from server, but it was removed from the form")
      }
    },
    [handleImageRemove],
  )

  // 3. Update the handleFAQsChange function to ensure string IDs
  const handleFAQsChange = (faqs: FAQ[]) => {
    console.log("FAQs changed:", faqs)
    // Ensure all FAQ IDs are strings
    const fagsWithStringIds = faqs.map((faq) => ({
      ...faq,
      id: faq.id ? String(faq.id) : undefined,
    }))

    setCurrentUniversity((prev: any) => ({
      ...prev,
      faqs: fagsWithStringIds,
    }))
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border shadow-md p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Edit University</h2>
          <div className="space-x-2">
            <Button type="button" onClick={handleSaveDraft} disabled={isSavingDraft} variant="outline">
              {isSavingDraft ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Draft
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ImageUpload
            type="banner"
            label="University Banner"
            onChange={async (file) => {
              if (file) {
                try {
                  const url = await handleImageUpload(file, "banner")
                  setCurrentUniversity((prev: any) => ({ ...prev, banner: url || "" }))
                } catch (error) {
                  // Error is already handled in handleImageUpload
                }
              }
            }}
            onRemove={handleBannerRemove}
            value={null}
            currentUrl={currentUniversity.banner}
            onProgress={(progress) => setUploadProgress((prev) => ({ ...prev, banner: progress }))}
          />

          <ImageUpload
            type="logo"
            label="University Logo"
            onChange={async (file) => {
              if (file) {
                try {
                  const url = await handleImageUpload(file, "logo")
                  setCurrentUniversity((prev: any) => ({ ...prev, logoUrl: url }))
                } catch (error) {
                  // Error is already handled in handleImageUpload
                }
              }
            }}
            onRemove={handleLogoRemove}
            value={null}
            currentUrl={currentUniversity.logoUrl || undefined}
            onProgress={(progress) => setUploadProgress((prev) => ({ ...prev, logo: progress }))}
          />
        </div>

        <GalleryUpload
          images={currentUniversity.imageUrls}
          onChange={(images) => setCurrentUniversity((prev: any) => ({ ...prev, imageUrls: images }))}
          onFileUpload={(file) => handleImageUpload(file, "gallery")}
          onRemove={handleGalleryImageRemove}
          maxImages={10}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="University Name"
            placeholder="Enter university name"
            value={currentUniversity.name}
            onChange={(e) => setCurrentUniversity((prev: any) => ({ ...prev, name: e.target.value }))}
            required
          />

          <Input
            label="Website"
            type="url"
            placeholder="Enter university website"
            value={currentUniversity.website}
            onChange={(e) => setCurrentUniversity((prev: any) => ({ ...prev, website: e.target.value }))}
            required
          />

          <Input
            label="Location"
            placeholder="Enter university location"
            value={currentUniversity.location}
            onChange={(e) => setCurrentUniversity((prev: any) => ({ ...prev, location: e.target.value }))}
            required
          />

          <Input
            label="Country"
            placeholder="Enter university country"
            value={currentUniversity.country}
            onChange={(e) => setCurrentUniversity((prev: any) => ({ ...prev, country: e.target.value }))}
            required
          />

          <Input
            label="Established Year"
            placeholder="Enter university established year"
            type="number"
            min={1500}
            max={new Date().getFullYear()}
            value={establishedYear}
            onChange={(e) => {
              const year = e.target.value
              setEstablishedYear(year)

              if (year && !isNaN(Number.parseInt(year, 10))) {
                const yearNum = Number.parseInt(year, 10)
                if (yearNum >= 1800 && yearNum <= new Date().getFullYear()) {
                  setCurrentUniversity((prev: any) => ({
                    ...prev,
                    established: new Date(yearNum, 0, 1),
                  }))
                }
              }
            }}
            onBlur={(e) => {
              if (e.target.value === "") {
                // If empty, reset to original value
                const originalYear =
                  university.established instanceof Date
                    ? university.established.getFullYear().toString()
                    : typeof university.established === "string" && !isNaN(Date.parse(university.established))
                      ? new Date(university.established).getFullYear().toString()
                      : university.established || ""

                setEstablishedYear(originalYear)

                if (originalYear) {
                  const yearNum = Number.parseInt(originalYear, 10)
                  if (!isNaN(yearNum)) {
                    setCurrentUniversity((prev: any) => ({
                      ...prev,
                      established: new Date(yearNum, 0, 1),
                    }))
                  }
                }
              }
            }}
            required
          />

          <Input
            label="YouTube Link"
            placeholder="Enter YouTube Link"
            value={currentUniversity.youtubeLink}
            onChange={(e) => setCurrentUniversity((prev: any) => ({ ...prev, youtubeLink: e.target.value }))}

          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B367D] focus-visible:ring-offset-2"
            value={currentUniversity.description}
            placeholder="Enter university description"
            onChange={(e) => setCurrentUniversity((prev: any) => ({ ...prev, description: e.target.value }))}
            required
          />
        </div>

        <FacilitiesList
          facilities={currentUniversity.facilities}
          onChange={(facilities) => setCurrentUniversity((prev: any) => ({ ...prev, facilities }))}
        />

        {/* Career Outcomes Section */}
        <div className="space-y-6">
  <div className="border-b pb-4">
    <h3 className="text-lg font-semibold text-gray-900">Career Outcomes</h3>
  </div>
  <CareerOutcomesForm
    careerOutcomeData={currentUniversity.careerOutcomeData}
    onChange={handleCareerOutcomeDataChange}
    disabled={isSubmitting}
  />
</div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h3>
          </div>
          <FAQForm
            faqs={currentUniversity.faqs}
            onChange={handleFAQsChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Courses</h3>
          <div className="flex items-center space-x-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                value={courseSearchQuery}
                onChange={(e) => setCourseSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => openCourseEditModal(null)} className="bg-[#DA202E] hover:bg-[#DA202E]/90">
              Add Course
            </Button>
          </div>
          {currentCourses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
              {currentCourses.map((course: Course) => (
                <div key={course.id} className="relative group">
                  <CourseCard
                    {...course}
                    image={course.image}
                    onDelete={handleCourseRemove}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {loadingCourses[course.id as string] ? (
                      <Loader2 className="w-8 h-8 animate-spin text-white" />
                    ) : (
                      <>
                        <button
                          onClick={() => openCourseEditModal(course)}
                          className="p-2 bg-white rounded-full mr-2"
                        >
                          <Edit className="w-5 h-5 text-[#3B367D]" />
                        </button>
                        <button
                          onClick={() => handleCourseRemove(course.id as string)}
                          className="p-2 bg-white rounded-full"
                        >
                          <Trash2 className="w-5 h-5 text-[#DA202E]" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {filteredCourses.length > coursesPerPage && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} variant="outline">
                  Previous
                </Button>
                <Button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === Math.ceil(filteredCourses.length / coursesPerPage)}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{Math.ceil(filteredCourses.length / coursesPerPage)}</span>
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <Button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      variant="outline"
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </Button>
                    {(() => {
                      const totalPages = Math.ceil(filteredCourses.length / coursesPerPage)
                      const pageNumbers = []

                      if (totalPages <= 7) {
                        // If total pages is 7 or less, show all pages
                        for (let i = 1; i <= totalPages; i++) {
                          pageNumbers.push(i)
                        }
                      } else {
                        // Always show first 3 pages
                        for (let i = 1; i <= 3; i++) {
                          pageNumbers.push(i)
                        }

                        // Add ellipsis if current page is not in first 3 or last 3 pages
                        if (currentPage > 4) {
                          pageNumbers.push("...")
                        }

                        // Show current page if it's not in first 3 or last 3 pages
                        if (currentPage > 3 && currentPage < totalPages - 2) {
                          pageNumbers.push(currentPage)
                        }

                        // Add ellipsis if there are more pages
                        if (currentPage < totalPages - 3) {
                          pageNumbers.push("...")
                        }

                        // Always show last 2 pages
                        for (let i = totalPages - 1; i <= totalPages; i++) {
                          pageNumbers.push(i)
                        }
                      }

                      return pageNumbers.map((page, i) =>
                        typeof page === "number" ? (
                          <Button
                            key={i}
                            onClick={() => paginate(page)}
                            variant={currentPage === page ? "default" : "outline"}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === page
                              ? "z-10 bg-[#DA202E] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DA202E]"
                              : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                              }`}
                          >
                            {page}
                          </Button>
                        ) : (
                          <span key={i} className="px-4 py-2 text-gray-700">
                            {page}
                          </span>
                        ),
                      )
                    })()}
                    <Button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === Math.ceil(filteredCourses.length / coursesPerPage)}
                      variant="outline"
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        <CourseEditModal
          isOpen={isCourseEditModalOpen}
          onClose={closeCourseEditModal}
          course={editingCourse}
          onSave={handleCourseAdd}
          onImageUpload={(file) => handleImageUpload(file, "course")}
          onRemove={handleImageRemove}
        />

        <div className="flex gap-4">
          <Button type="button" onClick={onUniversityUpdated} variant="outline" className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1 bg-[#DA202E] hover:bg-[#DA202E]/90">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating University...
              </>
            ) : (
              "Update University"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
