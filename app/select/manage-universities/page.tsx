"use client"
import { UniversityManagement } from "@/app/components/Select/ManageUniversities/UniversityManagement"

export default function ManageUniversitiesPage() {
  return (
    <div className="w-screen p-5 mt-32 min-h-screen bg-gray-50">
      <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <UniversityManagement />
      </div>
    </div>
  )
}