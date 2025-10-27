"use client"

import { useState } from "react"
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import type { UniversityInterface } from "./UniversityManagement"
import { ConfirmDialog } from "./ConfirmDialog"
import { Button } from "@/components/ui/button"

interface UniversityTableProps {
  universities: UniversityInterface[]
  isLoading: boolean
  selectedUniversities: string[]
  onSelectUniversity: (id: string, isSelected: boolean) => void
  onSelectAll: (isSelected: boolean) => void
  onEdit: (university: UniversityInterface) => void
  onDelete: (university: UniversityInterface) => void
  onDeleteSelected: () => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function UniversityTable({
  universities,
  isLoading,
  selectedUniversities,
  onSelectUniversity,
  onSelectAll,
  onEdit,
  onDelete,
  onDeleteSelected,
  currentPage,
  totalPages,
  onPageChange,
}: UniversityTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [universityToDelete, setUniversityToDelete] = useState<UniversityInterface | null>(null)

  const isAllSelected = universities.length > 0 && selectedUniversities.length === universities.length
  const isAnySelected = selectedUniversities.length > 0

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-12 px-6 py-3 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#3B367D] border-gray-300 rounded focus:ring-[#3B367D]"
                      checked={isAllSelected}
                      onChange={(e) => onSelectAll(e.target.checked)}
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  University
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Courses
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Established
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
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
                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                    </tr>
                  ))
              ) : universities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    No universities found
                  </td>
                </tr>
              ) : (
                universities.map((university) => {
                  const isSelected = selectedUniversities.includes(university.id)

                  return (
                    <tr
                      key={university.id}
                      className={`${isSelected ? "bg-gray-50" : ""}`}
                      onMouseEnter={() => setHoveredRow(university.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-[#3B367D] border-gray-300 rounded focus:ring-[#3B367D]"
                            checked={isSelected}
                            onChange={(e) => onSelectUniversity(university.id, e.target.checked)}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {university.logoUrl && (
                            <div className="flex-shrink-0 h-10 w-10 mr-4">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={university.logoUrl || "/placeholder.svg"}
                                alt={university.name}
                              />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium truncate max-w-[200px] text-gray-900">{university.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-[120px]">{university.website}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{university.country}</div>
                        <div className="text-sm text-gray-500 truncate max-w-[180px]">{university.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{university.courses.length}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(university.established).getFullYear()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {isSelected && (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => onEdit(university)}
                              className="text-[#3B367D] hover:text-[#3B367D]/80 p-1 rounded-full hover:bg-gray-100"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <Button
                              onClick={() => {
                                setUniversityToDelete(university)
                                setIsDeleteDialogOpen(true)
                              }}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && universities.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              Next
            </button>
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
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-400 hover:bg-gray-50"
                    }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${page === currentPage ? "z-10 bg-red-600 text-white" : "text-gray-500 hover:bg-gray-50"
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-400 hover:bg-gray-50"
                    }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete University"
        message={`Are you sure you want to delete ${universityToDelete?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={async () => {
          if (universityToDelete) {
            await onDelete(universityToDelete)
            setIsDeleteDialogOpen(false)
            setUniversityToDelete(null)
          }
        }}
        onCancel={() => {
          setIsDeleteDialogOpen(false)
          setUniversityToDelete(null)
        }}
      />
    </div>
  )
}

