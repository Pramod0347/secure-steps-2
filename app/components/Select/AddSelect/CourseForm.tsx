"use client"

import { useState, useRef, useEffect } from "react"
import { ImageUpload } from "./ImageUpload"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

export interface Course {
  id?: string
  name: string
  description: string
  fees: string
  duration: string
  degreeType: string
  ieltsScore: string
  ranking: string
  intake: string[]
  websiteLink: string
  image: string | null
}

interface CourseFormProps {
  onAddCourse: (course: Course) => void
  disabled?: boolean
  onImageUpload: (file: File) => Promise<string>
  onRemove: (imageUrl: string) => Promise<void>
  isFirstCourse: boolean
  editingCourse?: Course | null
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const IELTS_SCORES = ["5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0"]

const initialCourseState: Course = {
  name: "",
  description: "",
  fees: "",
  duration: "",
  degreeType: "",
  ieltsScore: "",
  ranking: "",
  intake: [],
  websiteLink: "",
  image: null,
}

export function CourseForm({
  onAddCourse,
  disabled,
  onImageUpload,
  onRemove,
  isFirstCourse,
  editingCourse,
}: CourseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [course, setCourse] = useState<Course>(initialCourseState)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const imageUploadRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingCourse) {
      setCourse(editingCourse)
    } else {
      resetForm()
    }
  }, [editingCourse])

  const resetForm = () => {
    setCourse(initialCourseState)
    if (imageUploadRef.current) {
      imageUploadRef.current.value = ""
    }
    setUploadProgress(0)
  }

  const handleImageChange = async (file: File | null) => {
    if (!file) {
      setCourse((prev) => ({ ...prev, image: null }))
      return
    }

    setIsUploadingImage(true)
    const toastId = toast.loading("Uploading image...")

    try {
      const imageUrl = await onImageUpload(file)
      setCourse((prev) => ({ ...prev, image: imageUrl }))
      toast.success("Image uploaded successfully", { id: toastId })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image", { id: toastId })
      if (imageUploadRef.current) {
        imageUploadRef.current.value = ""
      }
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleImageRemove = async () => {
    if (!course.image) return

    const toastId = toast.loading("Removing image...")

    try {
      await onRemove(course.image)
      setCourse((prev) => ({ ...prev, image: null }))
      if (imageUploadRef.current) {
        imageUploadRef.current.value = ""
      }
      setUploadProgress(0)
      toast.success("Image removed successfully", { id: toastId })
    } catch (error) {
      console.error("Error removing image:", error)
      toast.error("Failed to remove image", { id: toastId })
    }
  }

  const handleAddOrUpdateCourse = () => {
    if (isFirstCourse) {
      if (
        !course.name ||
        !course.fees ||
        !course.duration ||
        !course.degreeType ||
        !course.ieltsScore ||
        !course.ranking
      ) {
        toast.error("Please fill in all required fields")
        return
      }

      // if (!course.image) {
      //   toast.error("Please upload a course image")
      //   return
      // }
    }

    if (isUploadingImage) {
      toast.error("Please wait for image upload to complete")
      return
    }

    setIsSubmitting(true)
    try {
      // Create a clean course object without empty id for new courses
      const courseToSubmit = editingCourse 
        ? { ...course } // Keep the id for updates
        : { ...course, id: undefined } // Remove id for new courses

      onAddCourse(courseToSubmit)
      resetForm()
      toast.success(editingCourse ? "Course updated successfully" : "Course added successfully")
    } catch (error) {
      console.error("Error:", error)
      toast.error(editingCourse ? "Failed to update course" : "Failed to add course")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddIntake = (month: string) => {
    if (!course.intake.includes(month)) {
      setCourse((prev) => ({
        ...prev,
        intake: [...prev.intake, month],
      }))
    }
  }

  const handleRemoveIntake = (indexToRemove: number) => {
    setCourse((prev) => ({
      ...prev,
      intake: prev.intake.filter((_, index) => index !== indexToRemove),
    }))
  }

  return (
    <div className="space-y-4 border p-4 rounded-lg">
      <h3 className="text-lg font-semibold">{editingCourse ? "Edit Course" : "Add Course"}</h3>

      {isFirstCourse && !editingCourse && (
        <p className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">* Required fields for the first course</p>
      )}

      <div className="space-y-2">
        {course.image ? (
          <div className="relative w-full h-48">
            <Image
              src={course.image || "/placeholder.svg"}
              alt="Course image"
              fill
              className="object-cover rounded-lg"
            />
            <Button
              type="button"
              onClick={handleImageRemove}
              className="absolute top-2 right-2 bg-white text-black hover:bg-gray-200"
            >
              Remove Image
            </Button>
          </div>
        ) : (
          <ImageUpload
            value={null}
            onChange={handleImageChange}
            onRemove={handleImageRemove}
            onError={(error) => toast.error(error)}
            label={`Course Image${isFirstCourse && !editingCourse ? " *" : ""}`}
            type="course"
            currentUrl={course.image || ""}
            ref={imageUploadRef}
            onProgress={setUploadProgress}
          />
        )}

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-[#da212f] h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={`Course Name${isFirstCourse && !editingCourse ? " *" : ""}`}
          placeholder="Enter course name"
          value={course.name}
          onChange={(e) => setCourse((prev) => ({ ...prev, name: e.target.value }))}
          // required={isFirstCourse && !editingCourse}
        />

        <Input
          label={`Fees${isFirstCourse && !editingCourse ? " *" : ""}`}
          type="number"
          placeholder="Enter course fees"
          value={course.fees}
          onChange={(e) => setCourse((prev) => ({ ...prev, fees: e.target.value }))}
          // required={isFirstCourse && !editingCourse}
        />

        <Input
          label={`Duration${isFirstCourse && !editingCourse ? " *" : ""}`}
          placeholder="e.g. 4 years"
          value={course.duration}
          onChange={(e) => setCourse((prev) => ({ ...prev, duration: e.target.value }))}
          // required={isFirstCourse && !editingCourse}
        />

        <Input
          label={`Degree Type${isFirstCourse && !editingCourse ? " *" : ""}`}
          placeholder="e.g. Bachelor's"
          value={course.degreeType}
          onChange={(e) => setCourse((prev) => ({ ...prev, degreeType: e.target.value }))}
          // required={isFirstCourse && !editingCourse}
        />

        <div className="space-y-1.5">
          <label htmlFor="ieltsScore" className="block text-sm font-medium text-gray-700">
            IELTS Score{isFirstCourse && !editingCourse && " *"}
          </label>
          <select
            id="ieltsScore"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3c387e] focus-visible:ring-offset-2"
            value={course.ieltsScore}
            onChange={(e) => setCourse((prev) => ({ ...prev, ieltsScore: e.target.value }))}
            // required={isFirstCourse && !editingCourse}
          >
            <option value="">Select IELTS Score</option>
            {IELTS_SCORES.map((score) => (
              <option key={score} value={score}>
                {score}
              </option>
            ))}
          </select>
        </div>

        <Input
          label={`Ranking${isFirstCourse && !editingCourse ? " *" : ""}`}
          placeholder="Enter course ranking"
          value={course.ranking}
          onChange={(e) => setCourse((prev) => ({ ...prev, ranking: e.target.value }))}
          // required={isFirstCourse && !editingCourse}
        />

        <Input
          label="Website Link"
          type="url"
          placeholder="Enter course website"
          value={course.websiteLink}
          onChange={(e) => setCourse((prev) => ({ ...prev, websiteLink: e.target.value }))}
        />

        <div className="space-y-1.5">
          <label htmlFor="intakeMonths" className="block text-sm font-medium text-gray-700">
            Intake Months
          </label>
          <select
            id="intakeMonths"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3c387e] focus-visible:ring-offset-2"
            onChange={(e) => handleAddIntake(e.target.value)}
            value=""
          >
            <option value="">Add Intake Month</option>
            {MONTHS.filter((month) => !course.intake.includes(month)).map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="courseDescription" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="courseDescription"
          className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3c387e] focus-visible:ring-offset-2"
          placeholder="Enter course description"
          value={course.description}
          onChange={(e) => setCourse((prev) => ({ ...prev, description: e.target.value }))}
        />
      </div>

      {course.intake.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {course.intake.map((month, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-200 px-3 py-1.5 rounded-lg text-sm">
              {month}
              <button
                type="button"
                onClick={() => handleRemoveIntake(index)}
                className="text-gray-500 hover:text-[#da212f] transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        onClick={handleAddOrUpdateCourse}
        disabled={isSubmitting || disabled || isUploadingImage}
        className="w-full bg-[#da212f] hover:bg-[#da212f]/90"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {editingCourse ? "Updating Course..." : "Adding Course..."}
          </>
        ) : editingCourse ? (
          "Update Course"
        ) : (
          "Add Course"
        )}
      </Button>
    </div>
  )
}