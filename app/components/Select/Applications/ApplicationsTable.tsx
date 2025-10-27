"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import type { Application } from "./ApplicationsManagement"
import { Button } from "@/components/ui/button"

interface ApplicationTableProps {
  applications: Application[]
  isLoading: boolean
  onStatusChange: (applicationId: string, newStatus: Application["status"]) => void
  onDelete: (applicationId: string) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function ApplicationTable({
  applications,
  isLoading,
  onStatusChange,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}: ApplicationTableProps) {
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  const handleStatusChange = async (applicationId: string, newStatus: Application["status"]) => {
    setUpdatingStatus(applicationId)
    try {
      await onStatusChange(applicationId, newStatus)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleDelete = async (applicationId: string) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      await onDelete(applicationId)
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Student
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              University
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Course
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Applied At
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            Array(5)
              .fill(0)
              .map((_, index) => (
                <tr key={`skeleton-${index}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-5 w-28 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                </tr>
              ))
          ) : applications.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                No applications found
              </td>
            </tr>
          ) : (
            applications.map((application) => (
              <tr key={application.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={application.user.image || "/placeholder.svg"}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{application.user.name}</div>
                      <div className="text-sm text-gray-500">{application.user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{application.university.name}</div>
                  <div className="text-sm text-gray-500">{application.university.country}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{application.course.name}</div>
                  <div className="text-sm text-gray-500">{application.course.degreeType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={application.status}
                    onChange={(e) => handleStatusChange(application.id, e.target.value as Application["status"])}
                    disabled={updatingStatus === application.id}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="DEFERRED">Deferred</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(application.appliedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    onClick={() => handleDelete(application.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {!isLoading && applications.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} variant="outline">
              Previous
            </Button>
            <Button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <Button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </Button>
                <Button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
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
  )
}

