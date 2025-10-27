"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUpload } from "../AddSelect/ImageUpload"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Course } from "../AddSelect/CourseForm"
import { Modal } from "../../ui/Modal"

interface CourseEditModalProps {
  isOpen: boolean
  onClose: () => void
  course: Course | null
  onSave: (course: Course) => void
  onImageUpload: (file: File) => Promise<string>
  onRemove: (imageUrl: string) => Promise<void>
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

export function CourseEditModal({ isOpen, onClose, course, onSave, onImageUpload, onRemove }: CourseEditModalProps) {
  const [editedCourse, setEditedCourse] = useState<Course>({
    id: "",
    name: "",
    description: "",
    fees: "",
    duration: "",
    degreeType: "",
    ieltsScore: "",
    ranking: "",
    intake: [] as string[],
    websiteLink: "",
    image: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)

  useEffect(() => {
    if (course) {
      setEditedCourse({
        id: course.id || "",
        name: course.name || "",
        description: course.description || "",
        fees: course.fees || "",
        duration: course.duration || "",
        degreeType: course.degreeType || "",
        ieltsScore: course.ieltsScore || "",
        ranking: course.ranking || "",
        intake: course.intake || [],
        websiteLink: course.websiteLink || "",
        image: course.image || null,
      })
    } else {
      setEditedCourse({
        id: "",
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
      })
    }
  }, [course])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)
      try {
        await onSave(editedCourse)
        toast.success(course ? "Course updated successfully" : "Course added successfully")
        onClose()
      } catch (error) {
        console.error("Error saving course:", error)
        toast.error("Failed to save course")
      } finally {
        setIsSubmitting(false)
      }
    },
    [editedCourse, onSave, onClose, course],
  )

  const handleImageChange = useCallback(
    async (file: File | null) => {
      if (!file) {
        setEditedCourse((prev) => ({ ...prev, image: null }))
        return
      }

      const toastId = toast.loading("Uploading image...")

      try {
        const imageUrl = await onImageUpload(file)
        setEditedCourse((prev) => ({ ...prev, image: imageUrl }))
        toast.success("Image uploaded successfully", { id: toastId })
      } catch (error) {
        console.error("Error uploading image:", error)
        toast.error("Failed to upload image", { id: toastId })
      }
    },
    [onImageUpload],
  )

  const handleImageRemove = useCallback(async () => {
    if (!editedCourse.image) return

    const toastId = toast.loading("Removing image...")

    try {
      await onRemove(editedCourse.image)
      setEditedCourse((prev) => ({ ...prev, image: null }))
      setUploadProgress(0)
      toast.success("Image removed successfully", { id: toastId })
    } catch (error) {
      console.error("Error removing image:", error)
      toast.error("Failed to remove image", { id: toastId })
    }
  }, [editedCourse.image, onRemove])

  const handleAddIntake = useCallback((month: string) => {
    setEditedCourse((prev) => ({
      ...prev,
      intake: [...new Set([...prev.intake, month])],
    }))
  }, [])

  const handleRemoveIntake = useCallback((indexToRemove: number) => {
    setEditedCourse((prev) => ({
      ...prev,
      intake: prev.intake.filter((_, index) => index !== indexToRemove),
    }))
  }, [])

  const availableMonths = useMemo(
    () => MONTHS.filter((month) => !editedCourse.intake.includes(month)),
    [editedCourse.intake],
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={course ? "Edit Course" : "Add Course"}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
        <ImageUpload
          value={null}
          onChange={handleImageChange}
          onRemove={handleImageRemove}
          onError={(error) => toast.error(error)}
          label="Course Image"
          type="course"
          currentUrl={editedCourse.image || ""}
          onProgress={setUploadProgress}
          className="w-[50%] mx-auto"
        />

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-[#da212f] h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Input
            label="Course Name"
            placeholder="Enter course name"
            value={editedCourse.name || ""}
            onChange={(e) => setEditedCourse((prev) => ({ ...prev, name: e.target.value }))}
            required
          />

          <Input
            label="Fees"
            type="number"
            placeholder="Enter course fees"
            value={editedCourse.fees}
            onChange={(e) => setEditedCourse((prev) => ({ ...prev, fees: e.target.value }))}
            required
          />

          <Input
            label="Duration"
            placeholder="e.g. 4 years"
            value={editedCourse.duration}
            onChange={(e) => setEditedCourse((prev) => ({ ...prev, duration: e.target.value }))}
            required
          />

          <Input
            label="Degree Type"
            placeholder="e.g. Bachelor's"
            value={editedCourse.degreeType}
            onChange={(e) => setEditedCourse((prev) => ({ ...prev, degreeType: e.target.value }))}
            required
          />

          <div className="space-y-1.5">
            <label htmlFor="ieltsScore" className="block text-sm font-medium text-gray-700">
              IELTS Score
            </label>
            <select
              id="ieltsScore"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3c387e] focus-visible:ring-offset-2"
              value={editedCourse.ieltsScore}
              onChange={(e) => setEditedCourse((prev) => ({ ...prev, ieltsScore: e.target.value }))}
              required
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
            label="Ranking"
            placeholder="Enter course ranking"
            value={editedCourse.ranking}
            onChange={(e) => setEditedCourse((prev) => ({ ...prev, ranking: e.target.value }))}
            required
          />

          <Input
            label="Website Link"
            type="url"
            placeholder="Enter course website"
            value={editedCourse.websiteLink || ""}
            onChange={(e) => setEditedCourse((prev) => ({ ...prev, websiteLink: e.target.value }))}
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
              {availableMonths.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>

        {editedCourse.intake.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {editedCourse.intake.map((month, index) => (
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

        <div className="space-y-1.5">
          <label htmlFor="courseDescription" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="courseDescription"
            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3c387e] focus-visible:ring-offset-2"
            placeholder="Enter course description"
            value={editedCourse.description}
            onChange={(e) => setEditedCourse((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#DA202E] hover:bg-[#DA202E]/90">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {course ? "Updating..." : "Adding..."}
              </>
            ) : course ? (
              "Update Course"
            ) : (
              "Add Course"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

