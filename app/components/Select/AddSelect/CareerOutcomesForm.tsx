import React, { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

// Interface definitions matching the schema exactly
export interface SalaryChartData {
  sector: string
  min: number
  max: number
  color: string
  percentage: number
}

export interface EmploymentRateMeterData {
  targetRate: number
  size: number
}

export interface CourseTimelineData {
  course: string
}


// New interface that represents the complete career outcome data structure
export interface CareerOutcomeData {
  salaryChartData: SalaryChartData[]
  employmentRateMeterData: EmploymentRateMeterData | null
  courseTimelineData: CourseTimelineData[]
}

export interface CareerOutcome {
  id: string
  universityId: string
  type: "SALARY_CHART" | "EMPLOYMENT_RATE" | "COURSE_TIMELINE"
  data: CareerOutcomeData
}

interface CareerOutcomesFormProps {
  careerOutcomeData: CareerOutcomeData | null
  onChange: (data: CareerOutcomeData) => void
  disabled?: boolean
}


const defaultSalaryColors = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"
]

export function CareerOutcomesForm({ 
  careerOutcomeData, 
  onChange, 
  disabled = false
}: CareerOutcomesFormProps) {
  // Initialize state with stable default values
  const [salaryChartData, setSalaryChartData] = useState<SalaryChartData[]>([])
  const [employmentRateMeterData, setEmploymentRateMeterData] = useState<EmploymentRateMeterData | null>(null)
  const [courseTimelineData, setCourseTimelineData] = useState<CourseTimelineData[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize state from props - allow re-initialization when data changes
  useEffect(() => {
    console.log("CareerOutcomesForm: Received career outcome data:", careerOutcomeData)
    
    console.log("CareerOutcomesForm: Initializing with data:", {
      salaryChartData: careerOutcomeData?.salaryChartData,
      employmentRateMeterData: careerOutcomeData?.employmentRateMeterData,
      courseTimelineData: careerOutcomeData?.courseTimelineData
    })
    
    if (careerOutcomeData) {
      setSalaryChartData(careerOutcomeData.salaryChartData || [])
      setEmploymentRateMeterData(careerOutcomeData.employmentRateMeterData || null)
      setCourseTimelineData(careerOutcomeData.courseTimelineData || [])
    } else {
      // Set defaults if no data provided
      setSalaryChartData([])
      setEmploymentRateMeterData(null)
      setCourseTimelineData([])
    }
    
    setIsInitialized(true)
  }, [careerOutcomeData])

  // Memoized callback to prevent infinite loops
  const notifyParentOfChanges = useCallback((
    newSalaryData: SalaryChartData[],
    newEmploymentData: EmploymentRateMeterData | null,
    newTimelineData: CourseTimelineData[]
  ) => {
    const newData: CareerOutcomeData = {
      salaryChartData: newSalaryData,
      employmentRateMeterData: newEmploymentData,
      courseTimelineData: newTimelineData
    }
    
    console.log("Notifying parent of career outcome changes:", newData)
    onChange(newData)
  }, [onChange])

  // Salary Chart functions
  const addSalaryChartSector = useCallback(() => {
    const newSalaryData = [...salaryChartData, { 
      sector: "", 
      min: 0, 
      max: 0, 
      color: defaultSalaryColors[salaryChartData.length % defaultSalaryColors.length], 
      percentage: 0 
    }]
    
    setSalaryChartData(newSalaryData)
    notifyParentOfChanges(newSalaryData, employmentRateMeterData, courseTimelineData)
  }, [salaryChartData, employmentRateMeterData, courseTimelineData, notifyParentOfChanges])

  const removeSalaryChartSector = useCallback((index: number) => {
    const newSalaryData = salaryChartData.filter((_, i) => i !== index)
    setSalaryChartData(newSalaryData)
    notifyParentOfChanges(newSalaryData, employmentRateMeterData, courseTimelineData)
  }, [salaryChartData, employmentRateMeterData, courseTimelineData, notifyParentOfChanges])

  const updateSalaryChartSector = useCallback((index: number, field: keyof SalaryChartData, value: any) => {
    const newSalaryData = salaryChartData.map((sector, i) => 
      i === index ? { ...sector, [field]: value } : sector
    )
    setSalaryChartData(newSalaryData)
    notifyParentOfChanges(newSalaryData, employmentRateMeterData, courseTimelineData)
  }, [salaryChartData, employmentRateMeterData, courseTimelineData, notifyParentOfChanges])

  // Employment Rate Meter functions
  const addEmploymentRateMeter = useCallback(() => {
    const newEmploymentData = { targetRate: 85, size: 200 }
    setEmploymentRateMeterData(newEmploymentData)
    notifyParentOfChanges(salaryChartData, newEmploymentData, courseTimelineData)
  }, [salaryChartData, courseTimelineData, notifyParentOfChanges])

  const removeEmploymentRateMeter = useCallback(() => {
    setEmploymentRateMeterData(null)
    notifyParentOfChanges(salaryChartData, null, courseTimelineData)
  }, [salaryChartData, courseTimelineData, notifyParentOfChanges])

  const updateEmploymentRateMeter = useCallback((field: keyof EmploymentRateMeterData, value: number) => {
    const newEmploymentData = employmentRateMeterData ? 
      { ...employmentRateMeterData, [field]: value } : 
      { targetRate: field === 'targetRate' ? value : 85, size: field === 'size' ? value : 200 }
    
    setEmploymentRateMeterData(newEmploymentData)
    notifyParentOfChanges(salaryChartData, newEmploymentData, courseTimelineData)
  }, [employmentRateMeterData, salaryChartData, courseTimelineData, notifyParentOfChanges])

  // Course Timeline functions
  const addTimelineCourse = useCallback(() => {
    const newTimelineData = [...courseTimelineData, { course: "" }]
    setCourseTimelineData(newTimelineData)
    notifyParentOfChanges(salaryChartData, employmentRateMeterData, newTimelineData)
  }, [courseTimelineData, salaryChartData, employmentRateMeterData, notifyParentOfChanges])

  const removeTimelineCourse = useCallback((index: number) => {
    const newTimelineData = courseTimelineData.filter((_, i) => i !== index)
    setCourseTimelineData(newTimelineData)
    notifyParentOfChanges(salaryChartData, employmentRateMeterData, newTimelineData)
  }, [courseTimelineData, salaryChartData, employmentRateMeterData, notifyParentOfChanges])

  const updateTimelineCourse = useCallback((index: number, value: string) => {
    const newTimelineData = courseTimelineData.map((course, i) => 
      i === index ? { course: value } : course
    )
    setCourseTimelineData(newTimelineData)
    notifyParentOfChanges(salaryChartData, employmentRateMeterData, newTimelineData)
  }, [courseTimelineData, salaryChartData, employmentRateMeterData, notifyParentOfChanges])

  // Don't render until initialized to prevent flickering
  if (!isInitialized) {
    return <div className="animate-pulse">Loading career outcomes...</div>
  }

  return (
    <div className="space-y-8">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Career Outcomes</h3>
        <p className="text-sm text-gray-600">
          Configure career outcome data for this university. Each section represents different types of career outcome visualizations.
        </p>
      </div>

      {/* Salary Chart Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-gray-900">Salary Chart Data</h4>
          <Button
            type="button"
            onClick={addSalaryChartSector}
            disabled={disabled}
            size="sm"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Sector
          </Button>
        </div>
        
        {salaryChartData.length === 0 ? (
          <div className="text-center py-4 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            <p>No salary data added yet. Click "Add Sector" to start.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {salaryChartData.map((sector, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3 items-end">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Sector
                    </label>
                    <Input
                      placeholder="e.g., Technology"
                      value={sector.sector}
                      onChange={(e) => updateSalaryChartSector(index, 'sector', e.target.value)}
                      disabled={disabled}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Min Salary
                    </label>
                    <Input
                      type="number"
                      placeholder="40000"
                      value={sector.min}
                      onChange={(e) => updateSalaryChartSector(index, 'min', Number(e.target.value))}
                      disabled={disabled}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Max Salary
                    </label>
                    <Input
                      type="number"
                      placeholder="80000"
                      value={sector.max}
                      onChange={(e) => updateSalaryChartSector(index, 'max', Number(e.target.value))}
                      disabled={disabled}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Percentage %
                    </label>
                    <Input
                      type="number"
                      placeholder="25"
                      min="0"
                      max="100"
                      value={sector.percentage}
                      onChange={(e) => updateSalaryChartSector(index, 'percentage', Number(e.target.value))}
                      disabled={disabled}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Color
                    </label>
                    <input
                      type="color"
                      value={sector.color}
                      onChange={(e) => updateSalaryChartSector(index, 'color', e.target.value)}
                      disabled={disabled}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>
                  <div>
                    <Button
                      type="button"
                      onClick={() => removeSalaryChartSector(index)}
                      disabled={disabled}
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Employment Rate Meter Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-gray-900">Employment Rate Meter</h4>
          {!employmentRateMeterData && (
            <Button
              type="button"
              onClick={addEmploymentRateMeter}
              disabled={disabled}
              size="sm"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Employment Data
            </Button>
          )}
        </div>
        
        {!employmentRateMeterData ? (
          <div className="text-center py-4 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            <p>No employment rate data added yet. Click "Add Employment Data" to start.</p>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Target Rate (%)
                </label>
                <Input
                  type="number"
                  placeholder="85"
                  min="0"
                  max="100"
                  value={employmentRateMeterData.targetRate}
                  onChange={(e) => updateEmploymentRateMeter('targetRate', Number(e.target.value))}
                  disabled={disabled}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Meter Size (px)
                </label>
                <Input
                  type="number"
                  placeholder="200"
                  min="100"
                  max="400"
                  value={employmentRateMeterData.size}
                  onChange={(e) => updateEmploymentRateMeter('size', Number(e.target.value))}
                  disabled={disabled}
                />
              </div>
              <div>
                <Button
                  type="button"
                  onClick={removeEmploymentRateMeter}
                  disabled={disabled}
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Course Timeline Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-gray-900">Course Timeline</h4>
          <Button
            type="button"
            onClick={addTimelineCourse}
            disabled={disabled}
            size="sm"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Course
          </Button>
        </div>
        
        {courseTimelineData.length === 0 ? (
          <div className="text-center py-4 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            <p>No course timeline data added yet. Click "Add Course" to start.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {courseTimelineData.map((course, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="e.g., Computer Science Fundamentals"
                  value={course.course}
                  onChange={(e) => updateTimelineCourse(index, e.target.value)}
                  disabled={disabled}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={() => removeTimelineCourse(index)}
                  disabled={disabled}
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Salary Chart: {salaryChartData.length} sectors</p>
          <p>• Employment Rate: {employmentRateMeterData ? 'Configured' : 'Not set'}</p>
          <p>• Course Timeline: {courseTimelineData.length} courses</p>
        </div>
      </div>
    </div>
  )
}

export default CareerOutcomesForm