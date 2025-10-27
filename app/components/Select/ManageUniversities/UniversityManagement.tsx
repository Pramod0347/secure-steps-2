"use client"

import { useState, useEffect, useCallback } from "react"
import { UniversityTable } from "./UniversityTable"
import { UniversityForm } from "../../Select/AddSelect/UniversityForm"
import { EditUniversityForm } from "./EditUniversityForm"
import { Tabs } from "./Tabs"
import { ConfirmDialog } from "./ConfirmDialog"
import { Search, Plus } from "lucide-react"
import { toast } from "sonner"
import { ApplicationManagement } from "../Applications/ApplicationsManagement"
import { FAQ } from "../AddSelect/FAQForm"
import { CareerOutcome } from "../AddSelect/CareerOutcomesForm"

export interface CourseInterface {
  id: string
  name: string
  description: string | null
  fees: string
  duration: string
  degreeType: string
  ieltsScore: string
  ranking: string
  intake: string[]
  websiteLink: string | null
  image?: string
}

export interface UniversityInterface {
  id: string
  name: string
  description: string
  location: string
  country: string
  website: string
  established: Date
  banner: string
  logoUrl: string | null
  imageUrls: string[]
  facilities: string[]
  courses: CourseInterface[]
  faqs?: FAQ[]
  careerOutcomes?: CareerOutcome[]
  youtubeLink?: string
}

interface ApiResponse {
  universities: UniversityInterface[]
  pagination: {
    total: number
    pages: number
    page: number
    limit: number
  }
}

export function UniversityManagement() {
  const [activeTab, setActiveTab] = useState("list")
  const [universities, setUniversities] = useState<UniversityInterface[]>([])
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([])
  const [universityToEdit, setUniversityToEdit] = useState<UniversityInterface | null>(null)
  const [universityToDelete, setUniversityToDelete] = useState<UniversityInterface | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isEditFormDirty, setIsEditFormDirty] = useState(false)
  const [showExitConfirmation, setShowExitConfirmation] = useState(false)

  const fetchUniversities = useCallback(async (page: number, query = ""): Promise<void> => {
    setIsLoading(true)
    try {
      const NextUrl = process.env.NEXTAUTH_URL || window.location.origin
      const url = new URL(`${NextUrl}/api/universities`)
      url.searchParams.append("page", page.toString())
      url.searchParams.append("limit", "10")

      if (query.trim()) {
        url.searchParams.append("query", query.trim())
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()

      if (data.universities) {
        setUniversities(data.universities)
        setTotalPages(data.pagination.pages)
        setCurrentPage(data.pagination.page)
      }
    } catch (error) {
      console.error("Error fetching universities:", error)
      toast.error("Failed to load universities")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      void fetchUniversities(1, searchQuery)
    }, 300)

    return () => clearTimeout(debounceTimeout)
  }, [searchQuery, fetchUniversities])

  useEffect(() => {
    if (activeTab === "list") {
      void fetchUniversities(currentPage, searchQuery)
    }
  }, [activeTab, fetchUniversities, currentPage, searchQuery])

  const handleAddUniversity = () => {
    setActiveTab("add")
  }

  const handleEditUniversity = (university: UniversityInterface) => {
    setUniversityToEdit(university)
    setActiveTab("edit")
    setIsEditFormDirty(false)
  }

  const handleDeleteUniversity = (university: UniversityInterface) => {
    setUniversityToDelete(university)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!universityToDelete) return

    try {
      const response = await fetch(`/api/universities/${universityToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete university")
      }

      setUniversities(universities.filter((u) => u.id !== universityToDelete.id))
      setSelectedUniversities(selectedUniversities.filter((id) => id !== universityToDelete.id))
      toast.success("University deleted successfully")
    } catch (error) {
      console.error("Error deleting university:", error)
      toast.error("Failed to delete university")
    } finally {
      setIsDeleteDialogOpen(false)
      setUniversityToDelete(null)
    }
  }

  const handleSelectUniversity = (id: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedUniversities([...selectedUniversities, id])
    } else {
      setSelectedUniversities(selectedUniversities.filter((uniId) => uniId !== id))
    }
  }

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedUniversities(universities.map((uni) => uni.id))
    } else {
      setSelectedUniversities([])
    }
  }

  const handleDeleteSelected = () => {
    if (selectedUniversities.length === 0) return

    const universityToDelete = universities.find((u) => u.id === selectedUniversities[0])
    if (universityToDelete) {
      setUniversityToDelete(universityToDelete)
      setIsDeleteDialogOpen(true)
    }
  }

  const handlePageChange = (page: number) => {
    void fetchUniversities(page, searchQuery)
  }

  const handleTabChange = (newTab: string) => {
    if (activeTab === "edit" && isEditFormDirty && newTab !== "edit") {
      setShowExitConfirmation(true)
    } else {
      setActiveTab(newTab)
    }
  }

  const handleCloseEditTab = () => {
    if (isEditFormDirty) {
      setShowExitConfirmation(true)
    } else {
      setActiveTab("list")
      setUniversityToEdit(null)
      setIsEditFormDirty(false)
    }
  }

  const tabs = [
    { id: "list", label: "Universities" },
    { id: "add", label: "Add University" },
    { id: "applications", label: "Applications" },
    ...(universityToEdit ? [{ id: "edit", label: "Edit University" }] : []),
  ]

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Universities</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-500" />
            </div>
            <input
              type="text"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#3B367D] focus:border-[#3B367D] block w-full pl-10 p-2.5"
              placeholder="Search universities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {activeTab === "list" && (
            <button
              onClick={handleAddUniversity}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#DA202E] text-white rounded-lg hover:bg-[#DA202E]/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add University</span>
            </button>
          )}
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} onClose={handleCloseEditTab} />

      <div className="bg-white rounded-lg shadow">
        {activeTab === "list" && (
          <UniversityTable
            universities={universities}
            isLoading={isLoading}
            selectedUniversities={selectedUniversities}
            onSelectUniversity={handleSelectUniversity}
            onSelectAll={handleSelectAll}
            onEdit={handleEditUniversity}
            onDelete={handleDeleteUniversity}
            onDeleteSelected={handleDeleteSelected}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {activeTab === "add" && (
          <div className="p-4">
            <UniversityForm />
          </div>
        )}

        {activeTab === "applications" && (
          <div className="p-4">
            <ApplicationManagement />
          </div>
        )}

        {activeTab === "edit" && universityToEdit && (
          <div className="p-4">
            <EditUniversityForm
              university={universityToEdit}
              onUniversityUpdated={() => {
                setActiveTab("list")
                void fetchUniversities(currentPage, searchQuery)
                setUniversityToEdit(null)
              }}
              setIsEditFormDirty={setIsEditFormDirty}
            />
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete University"
        message={`Are you sure you want to delete ${universityToDelete?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteDialogOpen(false)
          setUniversityToDelete(null)
        }}
      />

      <ConfirmDialog
        isOpen={showExitConfirmation}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to leave?"
        confirmLabel="Leave"
        cancelLabel="Stay"
        onConfirm={ async () => {
          setActiveTab("list")
          setUniversityToEdit(null)
          setIsEditFormDirty(false)
          setShowExitConfirmation(false)
        }}
        onCancel={() => setShowExitConfirmation(false)}
      />
    </div>
  )
}

