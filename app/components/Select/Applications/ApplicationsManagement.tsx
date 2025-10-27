"use client"

import { useState, useEffect, useCallback } from "react"
import { ApplicationTable } from "./ApplicationsTable"
import { toast } from "sonner"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export interface Application {
  id: string
  userId: string
  universityId: string
  courseId: string
  status: "PENDING" | "APPROVED" | "REJECTED" | "IN_REVIEW" | "DEFERRED"
  appliedAt: string
  loanRequired: boolean
  documents: string[]
  additionalNotes?: string
  user: {
    id: string
    name: string
    email: string
    image: string
  }
  university: {
    id: string
    name: string
    location: string
    country: string
    logoUrl: string
    slug: string
  }
  course: {
    id: string
    name: string
    degreeType: string
    duration: string
    fees: string
  }
}

interface ApiResponse {
  applications: Application[]
  pagination: {
    total: number
    pages: number
    page: number
    limit: number
  }
}

export function ApplicationManagement() {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchApplications = useCallback(async (page: number, query = ""): Promise<void> => {
    setIsLoading(true)
    try {
      const NextUrl = process.env.NEXTAUTH_URL || window.location.origin
      const url = new URL(`${NextUrl}/api/applications`)
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

      if (data.applications) {
        setApplications(data.applications)
        setTotalPages(data.pagination.pages)
        setCurrentPage(data.pagination.page)
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
      toast.error("Failed to load applications")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      void fetchApplications(1, searchQuery)
    }, 300)

    return () => clearTimeout(debounceTimeout)
  }, [searchQuery, fetchApplications])

  const handleStatusChange = async (applicationId: string, newStatus: Application["status"]) => {
    try {
      const response = await fetch(`/api/applications?id=${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update application status")
      }

      const updatedApplication: Application = await response.json()
      setApplications((apps) => apps.map((app) => (app.id === applicationId ? updatedApplication : app)))
      toast.success("Application status updated successfully")
    } catch (error) {
      console.error("Error updating application status:", error)
      toast.error("Failed to update application status")
    }
  }

  const handleDeleteApplication = async (applicationId: string) => {
    try {
      const response = await fetch(`/api/applications?id=${applicationId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete application")
      }

      setApplications((apps) => apps.filter((app) => app.id !== applicationId))
      toast.success("Application deleted successfully")
    } catch (error) {
      console.error("Error deleting application:", error)
      toast.error("Failed to delete application")
    }
  }

  const handlePageChange = (page: number) => {
    void fetchApplications(page, searchQuery)
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Applications</h1>

        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-500" />
          </div>
          <Input
            type="text"
            className="pl-10 p-2.5"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <ApplicationTable
          applications={applications}
          isLoading={isLoading}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteApplication}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}

