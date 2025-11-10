"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { ImageUpload } from "./ImageUpload"
import { FacilitiesList } from "./FacilitiesList"
import { CourseForm, type Course } from "./CourseForm"
import { CourseCard } from "./CourseCard"
import { FAQForm, type FAQ } from "./FAQForm"
import { CareerOutcomesForm, CareerOutcome } from "./CareerOutcomesForm"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Save } from "lucide-react"
import { toast } from "sonner"
import { GalleryUpload } from "./GalleryUpload"

interface University {
  id?: string
  name: string
  description: string
  location: string
  country: string
  website: string
  established: number
  banner: string
  logoUrl: string | null
  imageUrls: string[]
  facilities: string[]
  courses: Course[]
  faqs: FAQ[]
  careerOutcomes: CareerOutcome[]
  youtubeLink?: string
}

const FORM_STORAGE_KEY = "universityFormData"

const initialUniversityState: University = {
  name: "",
  description: "",
  location: "",
  country: "",
  website: "",
  established: new Date().getFullYear(),
  banner: "",
  logoUrl: null,
  imageUrls: [],
  facilities: [],
  courses: [],
  faqs: [],
  careerOutcomes: [],
  youtubeLink: "",
}

export function UniversityForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [universities, setUniversities] = useState<University[]>([])
  const [currentUniversity, setCurrentUniversity] = useState<University>(initialUniversityState)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [hasAnyCourses, setHasAnyCourses] = useState(false)

  useEffect(() => {
    const storedData = localStorage.getItem(FORM_STORAGE_KEY)
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setUniversities(parsedData.universities || [])
      setCurrentUniversity(parsedData.currentUniversity || initialUniversityState)
      setHasAnyCourses(parsedData.currentUniversity?.courses?.length > 0 || false)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({ universities, currentUniversity }))
  }, [universities, currentUniversity])

  const handleImageUpload = async (file: File, type: "banner" | "logo" | "gallery" | "course" | "career-icon"): Promise<string> => {
    if (!file) {
      throw new Error("No file provided")
    }

    const toastId = `upload-${type}-${Date.now()}`

    try {
      toast.loading("Preparing upload...", { id: toastId })

      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "image")

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
  }

  const handleImageRemove = useCallback(async (imageUrl: string) => {
    try {
      const response = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete image from storage")
      }

      toast.success("Image removed successfully")
    } catch (error) {
      console.error("Error removing image:", error)
      toast.error("Failed to remove image")
      throw error
    }
  }, [])

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

      const cleanedCourses = (currentUniversity.courses || []).map((course) => {
        const cleanedCourse: any = {
          name: course.name,
          description: course.description || undefined,
          fees: course.fees,
          duration: course.duration,
          degreeType: course.degreeType,
          ieltsScore: course.ieltsScore,
          ranking: course.ranking,
          intake: course.intake || [],
          // Only include websiteLink if it's a non-empty string
          ...(course.websiteLink && course.websiteLink.trim() ? { websiteLink: course.websiteLink } : {}),
          // Only include image if it exists
          ...(course.image ? { image: course.image } : {}),
        }
        return cleanedCourse
      })

      const universityData = {
        name: currentUniversity.name,
        description: currentUniversity.description,
        location: currentUniversity.location,
        country: currentUniversity.country,
        website: currentUniversity.website,
        established: new Date(currentUniversity.established, 0).toISOString(),
        banner: currentUniversity.banner,
        logoUrl: currentUniversity.logoUrl || undefined, // Convert null to undefined
        imageUrls: currentUniversity.imageUrls || [],
        facilities: currentUniversity.facilities || [],
        courses: cleanedCourses,
        // Only include youtubeLink if it has a value
        ...(currentUniversity.youtubeLink && currentUniversity.youtubeLink.trim() 
          ? { youtubeLink: currentUniversity.youtubeLink } 
          : {}),
      }

      console.log("Submitting university data:", universityData)

      const response = await fetch("/api/universities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(universityData),
      })

      if (!response.ok) {
        const error = await response.json()
        // Show detailed error message including validation details
        const errorMessage = error.message || error.error || "Failed to create university"
        const errorDetails = error.details ? `\nDetails: ${JSON.stringify(error.details, null, 2)}` : ""
        throw new Error(`${errorMessage}${errorDetails}`)
      }

      const newUniversity = await response.json()
      console.log("University created:", newUniversity)

      setUniversities((prev) => [...prev, newUniversity])
      toast.success("University created successfully!")

      setCurrentUniversity(initialUniversityState)
      setHasAnyCourses(false)
    } catch (error) {
      console.error("Error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create university")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCourseAdd = (course: Course) => {
    setCurrentUniversity((prev) => ({
      ...prev,
      courses: [...prev.courses, course],
    }))
    setHasAnyCourses(true)
    toast.success("Course added successfully")
  }

  const handleCourseRemove = async (index: number) => {
    const courseToRemove = currentUniversity.courses[index]
    if (courseToRemove.image) {
      try {
        await handleImageRemove(courseToRemove.image)
      } catch (error) {
        console.error("Failed to remove course image:", error)
        toast.error("Failed to remove course image")
        return
      }
    }

    setCurrentUniversity((prev) => {
      const newCourses = prev.courses.filter((_, i) => i !== index)
      setHasAnyCourses(newCourses.length > 0)
      return {
        ...prev,
        courses: newCourses,
      }
    })
    toast.success("Course removed")
  }

  const handleFAQsChange = (faqs: FAQ[]) => {
    setCurrentUniversity((prev) => ({
      ...prev,
      faqs,
    }))
  }

  const handleCareerOutcomesChange = (careerOutcomes: CareerOutcome[]) => {
    setCurrentUniversity((prev) => ({
      ...prev,
      careerOutcomes,
    }))
  }

  const handleCareerIconUpload = async (file: File): Promise<string> => {
    return await handleImageUpload(file, "career-icon")
  }

  const handleCareerIconRemove = async (imageUrl: string): Promise<void> => {
    await handleImageRemove(imageUrl)
  }

  const handleClearForm = () => {
    if (window.confirm("Are you sure you want to clear all form data?")) {
      setCurrentUniversity(initialUniversityState)
      setHasAnyCourses(false)
      localStorage.removeItem(FORM_STORAGE_KEY)
      toast.success("Form data cleared")
    }
  }

  const handleAddUniversity = async () => {
    // Validate before submitting
    if (!currentUniversity.banner) {
      toast.error("Please upload a banner image")
      return
    }

    if (!currentUniversity.logoUrl) {
      toast.error("Please upload a logo image")
      return
    }

    if (currentUniversity.courses.length === 0) {
      toast.error("Please add at least one course")
      return
    }

    setIsSubmitting(true)

    try {
      // Clean and prepare data for submission
      // Clean courses: remove id and handle empty websiteLink
      const cleanedCourses = (currentUniversity.courses || []).map((course) => {
        const cleanedCourse: any = {
          name: course.name,
          description: course.description || undefined,
          fees: course.fees,
          duration: course.duration,
          degreeType: course.degreeType,
          ieltsScore: course.ieltsScore,
          ranking: course.ranking,
          intake: course.intake || [],
          // Only include websiteLink if it's a non-empty string
          ...(course.websiteLink && course.websiteLink.trim() ? { websiteLink: course.websiteLink } : {}),
          // Only include image if it exists
          ...(course.image ? { image: course.image } : {}),
        }
        return cleanedCourse
      })

      // Extract career outcome data if available
      const careerOutcomeData = currentUniversity.careerOutcomes?.[0]?.data || null
      const hasCareerOutcomeData = careerOutcomeData && (
        (careerOutcomeData.salaryChartData && careerOutcomeData.salaryChartData.length > 0) ||
        careerOutcomeData.employmentRateMeterData ||
        (careerOutcomeData.courseTimelineData && careerOutcomeData.courseTimelineData.length > 0)
      )

      const universityData = {
        name: currentUniversity.name,
        description: currentUniversity.description,
        location: currentUniversity.location,
        country: currentUniversity.country,
        website: currentUniversity.website,
        established: new Date(currentUniversity.established, 0).toISOString(),
        banner: currentUniversity.banner,
        logoUrl: currentUniversity.logoUrl || undefined, // Convert null to undefined
        imageUrls: currentUniversity.imageUrls || [],
        facilities: currentUniversity.facilities || [],
        courses: cleanedCourses,
        // Only include youtubeLink if it has a value
        ...(currentUniversity.youtubeLink && currentUniversity.youtubeLink.trim() 
          ? { youtubeLink: currentUniversity.youtubeLink } 
          : {}),
        ...(hasCareerOutcomeData ? { careerOutcomeData } : {}),
      }

      console.log("Submitting university data:", universityData)

      const response = await fetch("/api/universities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(universityData),
      })

      if (!response.ok) {
        const error = await response.json()
        // Show detailed error message including validation details
        const errorMessage = error.message || error.error || "Failed to create university"
        const errorDetails = error.details ? `\nDetails: ${JSON.stringify(error.details, null, 2)}` : ""
        throw new Error(`${errorMessage}${errorDetails}`)
      }

      const newUniversity = await response.json()
      console.log("University created:", newUniversity)

      setUniversities((prev) => [...prev, newUniversity])
      toast.success("University created successfully!")

      setCurrentUniversity(initialUniversityState)
      setHasAnyCourses(false)
    } catch (error) {
      console.error("Error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create university")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    setIsSavingDraft(true)
    try {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({ universities, currentUniversity }))
      toast.success("Draft saved successfully")
    } catch (error) {
      console.error("Error saving draft:", error)
      toast.error("Failed to save draft")
    } finally {
      setIsSavingDraft(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border shadow-md p-4 md:p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">New University</h2>
          <div className="space-x-2">
            <Button type="button" onClick={handleSaveDraft} disabled={isSavingDraft} variant="outline">
              {isSavingDraft ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Draft
            </Button>
            <Button
              type="button"
              onClick={handleClearForm}
              variant="outline"
              className="text-[#da212f] hover:text-[#da212f]/90"
            >
              Clear Form
            </Button>
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <ImageUpload
              type="banner"
              label="University Banner"
              onChange={async (file) => {
                if (file) {
                  try {
                    const url = await handleImageUpload(file, "banner")
                    setCurrentUniversity((prev) => ({ ...prev, banner: url || "" }))
                  } catch (error) {
                    // Error is already handled in handleImageUpload
                  }
                }
              }}
              onRemove={async () => {
                if (currentUniversity.banner) {
                  await handleImageRemove(currentUniversity.banner)
                  setCurrentUniversity((prev) => ({ ...prev, banner: "" }))
                }
              }}
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
                    setCurrentUniversity((prev) => ({ ...prev, logoUrl: url }))
                  } catch (error) {
                    // Error is already handled in handleImageUpload
                  }
                }
              }}
              onRemove={async () => {
                if (currentUniversity.logoUrl) {
                  await handleImageRemove(currentUniversity.logoUrl)
                  setCurrentUniversity((prev) => ({ ...prev, logoUrl: null }))
                }
              }}
              value={null}
              currentUrl={currentUniversity.logoUrl || undefined}
              onProgress={(progress) => setUploadProgress((prev) => ({ ...prev, logo: progress }))}
            />
          </div>

          <GalleryUpload
            images={currentUniversity.imageUrls}
            onChange={(images) => setCurrentUniversity((prev) => ({ ...prev, imageUrls: images }))}
            onFileUpload={(file) => handleImageUpload(file, "gallery")}
            onRemove={async (imageUrl) => {
              try {
                await handleImageRemove(imageUrl)
                setCurrentUniversity((prev) => ({
                  ...prev,
                  imageUrls: prev.imageUrls.filter((url) => url !== imageUrl),
                }))
              } catch (error) {
                console.error("Error removing image:", error)
                toast.error("Failed to remove image")
              }
            }}
            maxImages={10}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="University Name"
              placeholder="Enter university name"
              value={currentUniversity.name}
              onChange={(e) => setCurrentUniversity((prev) => ({ ...prev, name: e.target.value }))}
              required
            />

            <Input
              label="Website"
              type="url"
              placeholder="Enter university website"
              value={currentUniversity.website}
              onChange={(e) => setCurrentUniversity((prev) => ({ ...prev, website: e.target.value }))}
              required
            />

            <Input
              label="Location"
              placeholder="Enter university location"
              value={currentUniversity.location}
              onChange={(e) => setCurrentUniversity((prev) => ({ ...prev, location: e.target.value }))}
              required
            />

            <Input
              label="Country"
              placeholder="Enter university country"
              value={currentUniversity.country}
              onChange={(e) => setCurrentUniversity((prev) => ({ ...prev, country: e.target.value }))}
              required
            />

            <Input
              label="Established Year"
              placeholder="Enter university established year"
              type="number"
              min={1800}
              max={new Date().getFullYear()}
              value={currentUniversity.established}
              onChange={(e) => setCurrentUniversity((prev) => ({ ...prev, established: Number(e.target.value) }))}
              required
            />

            <Input
              label="YouTube Link"
              placeholder="Enter YouTube link"
              type="text"
              value={currentUniversity.youtubeLink}
              onChange={(e) => setCurrentUniversity((prev) => ({ ...prev, youtubeLink: e.target.value }))}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3c387e] focus-visible:ring-offset-2"
              value={currentUniversity.description}
              placeholder="Enter university description"
              onChange={(e) => setCurrentUniversity((prev) => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>
        </div>

        {/* Facilities Section */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-900">Facilities</h3>
          </div>
          <FacilitiesList
            facilities={currentUniversity.facilities}
            onChange={(facilities) => setCurrentUniversity((prev) => ({ ...prev, facilities }))}
          />
        </div>


        {/* Career Outcomes Section */}
        <div className="space-y-6">
          <CareerOutcomesForm
            careerOutcomeData={currentUniversity.careerOutcomes?.[0]?.data ?? null}
            onChange={(updatedData) => handleCareerOutcomesChange([{
              ...currentUniversity.careerOutcomes?.[0],
              data: updatedData
            }])}
            disabled={isSubmitting}
          />
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">

          <FAQForm
            faqs={currentUniversity.faqs}
            onChange={handleFAQsChange}
            disabled={isSubmitting}
          />
        </div>

        {/* Courses Section */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-900">Courses</h3>
          </div>
          <CourseForm
            onAddCourse={handleCourseAdd}
            disabled={isSubmitting}
            onImageUpload={(file) => handleImageUpload(file, "course")}
            onRemove={handleImageRemove}
            isFirstCourse={!hasAnyCourses}
          />

          {currentUniversity.courses.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Added Courses</h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentUniversity.courses.map((course, index) => (
                  <CourseCard key={index} {...course} image={course.image} onDelete={() => handleCourseRemove(index)} />
                ))}
              </div>
            </div>
          )}
        </div>



        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6 border-t">
          <Button 
            type="button" 
            onClick={handleAddUniversity} 
            disabled={isSubmitting}
            className="flex-1 bg-[#da212f] hover:bg-[#da212f]/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating University...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add University
              </>
            )}
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1 bg-[#da212f] hover:bg-[#da212f]/90">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating University...
              </>
            ) : (
              "Create University"
            )}
          </Button>
        </div>
      </form>

      {/* Universities List */}
      {universities.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Added Universities</h2>
          {universities.map((university, index) => (
            <div key={university.id || index} className="bg-white rounded-lg border shadow-md p-4">
              <h3 className="text-xl font-semibold">{university.name}</h3>
              <p className="text-gray-600">
                {university.location}, {university.country}
              </p>
              <div className="flex gap-4 text-sm text-gray-500 mt-2">
                <span>Courses: {university.courses?.length || 0}</span>
                <span>FAQs: {university.faqs?.length || 0}</span>
                <span>Career Outcomes: {university?.careerOutcomes?.length} || 0</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}