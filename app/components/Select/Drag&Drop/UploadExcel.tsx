"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback, useRef, Suspense, lazy } from "react"
import * as XLSX from "xlsx"
import { Copy, Check, Upload, Loader2, ToggleRight, ToggleLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { useVirtualizer } from "@tanstack/react-virtual"

// Define worker for heavy processing
const workerCode = `
  self.onmessage = function(e) {
    const { action, data } = e.data;
    
    if (action === 'processSheet') {
      const { rawData, columnMap, sheetName } = data;
      const results = processSheetData(rawData, columnMap, sheetName);
      self.postMessage({ action: 'sheetProcessed', results });
    }
  };

  function processSheetData(rawData, columnMap, sheetName) {
    // Implementation of sheet processing logic
    const universityStartRows = [];
    const universities = new Map();
    
    // Find university boundaries
    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const universityName = getValue(row, "UNIVERSITY_NAME", columnMap);
      
      if (universityName && universityName !== "") {
        universityStartRows.push({ index: i, name: universityName });
      }
    }
    
    // Process each university
    for (let i = 0; i < universityStartRows.length; i++) {
      const currentUniv = universityStartRows[i];
      const endRow = i < universityStartRows.length - 1 ? universityStartRows[i + 1].index : rawData.length;
      const universityRow = rawData[currentUniv.index];
      const universityName = currentUniv.name;
      
      // Extract university metadata
      const location = getValue(universityRow, "PLACE", columnMap);
      const country = getValue(universityRow, "COUNTRY", columnMap);
      const websiteRaw = getValue(universityRow, "WEBSITE", columnMap);
      const website = formatUrl(websiteRaw) || "https://example.com";
      const year = getValue(universityRow, "YEAR", columnMap);
      const logo = getValue(universityRow, "LOGO", columnMap);
      const youtubeLink = getValue(universityRow, "YOUTUBE_LINK", columnMap);
      
      // Format established date
      let establishedDate;
      try {
        if (year) {
          const yearNumber = typeof year === "string" ? Number.parseInt(year, 10) : year;
          if (!isNaN(yearNumber)) {
            establishedDate = new Date(yearNumber, 0, 1).toISOString();
          } else {
            establishedDate = new Date().toISOString();
          }
        } else {
          establishedDate = new Date().toISOString();
        }
      } catch (err) {
        establishedDate = new Date().toISOString();
      }
      
      // Create university object
      const university = {
        id: \`univ_\${(universities.size + 1).toString().padStart(3, "0")}\`,
        name: universityName,
        description: \`\${universityName} is a prestigious institution located in \${location || country || "Unknown"}.\`,
        location: location || "",
        country: country || "Unknown",
        website: website,
        established: establishedDate,
        banner: "https://ik.imagekit.io/99y1fc9mh/Subtract.png?updatedAt=1741879095068",
        logoUrl: logo || "https://ik.imagekit.io/99y1fc9mh/Subtract.png?updatedAt=1741879095068",
        imageUrls: ["https://ik.imagekit.io/99y1fc9mh/Subtract.png?updatedAt=1741879095068"],
        facilities: ["Library", "Sports Complex", "Cafeteria", "Research Centers", "Student Housing"],
        youtubeLink: youtubeLink || "",
        courses: [],
      };
      
      // Process courses - IMPROVED COURSE EXTRACTION
      for (let rowIndex = currentUniv.index; rowIndex < endRow; rowIndex++) {
        const row = rawData[rowIndex];
        
        // Check for course name in this row
        const courseName = getValue(row, "COURSE", columnMap);
        
        // Skip rows without course names
        if (!courseName || courseName.trim() === "") continue;
        
        // Get IELTS score - this is often a key identifier for different courses
        const ieltsScore = getValue(row, "IELTS", columnMap);
        
        // Create a unique identifier for the course using name and IELTS score
        const courseKey = \`\${courseName}_\${ieltsScore}\`.toLowerCase();
        
        // Check if this exact course already exists in this university
        const courseExists = university.courses.some(c => 
          \`\${c.name}_\${c.ieltsScore}\`.toLowerCase() === courseKey
        );
        
        if (!courseExists) {
          // Parse intake months
          const intakeValue = getValue(row, "INTAKE", columnMap);
          const intakeMonths = intakeValue
            ? intakeValue.split(/[,&]/).map(month => month.trim()).filter(Boolean)
            : [];
            
          // Get course website
          const courseWebsiteLinkRaw = getValue(row, "WEBSITE_LINK", columnMap) || website || "";
          const courseWebsiteLink = formatUrl(courseWebsiteLinkRaw) || website || "https://example.com";
          
          // Add course with all available data
          university.courses.push({
            id: \`\${university.id}_course_\${(university.courses.length + 1).toString().padStart(3, "0")}\`,
            name: courseName,
            description: \`\${courseName} program at \${universityName} is designed to provide students with comprehensive knowledge and practical skills in their field of study.\`,
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7B725451B4-42E1-4758-950E-F4995689EEBA%7D-tKppHzZnq4met3MGDBdRzBZzosM8cS.png",
            fees: getValue(row, "FEES", columnMap) || "",
            duration: getValue(row, "DURATION", columnMap) || "",
            degreeType: getValue(row, "DEGREE_TYPE", columnMap) || "",
            ieltsScore: ieltsScore || "",
            ranking: getValue(row, "RANKING", columnMap) || "",
            intake: intakeMonths,
            websiteLink: courseWebsiteLink,
          });
        }
      }
      
      universities.set(universityName, university);
    }
    
    return Array.from(universities.values());
  }
  
  function getValue(row, columnKey, columnMap) {
    const mappedColumn = columnMap[columnKey];
    if (mappedColumn && row[mappedColumn] !== undefined) {
      return String(row[mappedColumn] || "").trim();
    }
    return "";
  }
  
  function formatUrl(url) {
    if (!url || url.trim() === "") return "";
    
    if (url.match(/^https?:\\/\\//i)) {
      return url.trim();
    }
    
    if (url.match(/^www\\./i) || url.match(/\\.[a-z]{2,}$/i)) {
      return \`https://\${url.trim()}\`;
    }
    
    return "";
  }
`

// Create a blob URL for the worker
const workerBlob = new Blob([workerCode], { type: "application/javascript" })
const workerUrl = URL.createObjectURL(workerBlob)

// Lazy load components for better initial load performance
const JsonViewer = lazy(() => import("./JsonViewer").then((module) => ({ default: module.default })))

interface FormattedData {
  id: string
  name: string
  description: string
  location: string
  country: string
  website: string
  established: string
  banner: string
  logoUrl: string
  imageUrls: string[]
  facilities: string[]
  youtubeLink?: string
  courses: {
    id: string
    name: string
    description: string
    image: string
    fees: string
    duration: string
    degreeType: string
    ieltsScore: string
    ranking: string
    intake: string[]
    websiteLink: string
  }[]
}

// Define the two mapping formats
const MAPPING_FORMATS = {
  DEFAULT: "default",
  ALTERNATIVE: "alternative",
}

// Create a lightweight version of university data for selection UI
interface UniversityListItem {
  id: string
  name: string
  courseCount: number
}

export default function UploadExcel() {
  // Use refs for large data to avoid re-renders
  const jsonDataRef = useRef<FormattedData[] | null>(null)
  const [universityList, setUniversityList] = useState<UniversityListItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [universityFilter, setUniversityFilter] = useState("")
  const [courseFilter, setCourseFilter] = useState("")
  const [showOnlyUniversities, setShowOnlyUniversities] = useState(false)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [copied, setCopied] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResults, setUploadResults] = useState<any>(null)
  const [mappingFormat, setMappingFormat] = useState<string>(MAPPING_FORMATS.DEFAULT)
  const [processingLog, setProcessingLog] = useState<string[]>([])
  const [showLog, setShowLog] = useState(false)
  const [selectedUniversities, setSelectedUniversities] = useState<Record<string, boolean>>({})
  const [selectAll, setSelectAll] = useState(false)
  const [availableSheets, setAvailableSheets] = useState<string[]>([])
  const [selectedSheets, setSelectedSheets] = useState<string[]>([])
  const [currentWorkbook, setCurrentWorkbook] = useState<XLSX.WorkBook | null>(null)
  const [processingStatus, setProcessingStatus] = useState({
    isProcessing: false,
    progress: 0,
    total: 0,
    currentSheet: "",
    currentUniversity: "",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(100)
  const [showJsonViewer, setShowJsonViewer] = useState(false)

  // Create worker ref
  const workerRef = useRef<Worker | null>(null)

  // Helper function to add to the processing log
  const addToLog = useCallback((message: string) => {
    setProcessingLog((prev) => [...prev, message])
  }, [])

  // Initialize worker
  useEffect(() => {
    workerRef.current = new Worker(workerUrl)

    workerRef.current.onmessage = (e) => {
      const { action, results } = e.data

      if (action === "sheetProcessed") {
        // Handle processed sheet data
        handleProcessedSheetData(results)

        setProcessingStatus((prev) => ({
          ...prev,
          progress: prev.progress + 1,
        }))
      }
    }

    return () => {
      workerRef.current?.terminate()
      URL.revokeObjectURL(workerUrl)
    }
  }, [])

  // Handle processed sheet data
  const handleProcessedSheetData = useCallback(
    (universities: FormattedData[]) => {
      // Update the ref with new data
      if (!jsonDataRef.current) {
        jsonDataRef.current = universities
      } else {
        // Merge with existing data
        const existingMap = new Map(jsonDataRef.current.map((u) => [u.name, u]))

        universities.forEach((university) => {
          if (existingMap.has(university.name)) {
            // Merge courses
            const existing = existingMap.get(university.name)!
            const existingCourseNames = new Set(existing.courses.map((c) => c.name))

            university.courses.forEach((course) => {
              if (!existingCourseNames.has(course.name)) {
                existing.courses.push(course)
              }
            })
          } else {
            existingMap.set(university.name, university)
          }
        })

        jsonDataRef.current = Array.from(existingMap.values())
      }

      // Update the lightweight list for UI
      const newList = jsonDataRef.current.map((u) => ({
        id: u.id,
        name: u.name,
        courseCount: u.courses.length,
      }))

      setUniversityList(newList)

      // Initialize selection state
      const initialSelected = newList.reduce(
        (acc, university) => {
          acc[university.id] = false
          return acc
        },
        {} as Record<string, boolean>,
      )

      setSelectedUniversities(initialSelected)
      setSelectAll(false)

      // Complete processing
      if (processingStatus.progress >= processingStatus.total - 1) {
        setProcessingStatus((prev) => ({
          ...prev,
          isProcessing: false,
        }))
      }
    },
    [processingStatus.progress, processingStatus.total],
  )

  // Use memoization for filtered university list
  const filteredUniversityList = useMemo(() => {
    if (universityFilter === "") return universityList

    return universityList.filter((university) => university.name.toLowerCase().includes(universityFilter.toLowerCase()))
  }, [universityList, universityFilter])

  // Initialize a ref for the virtualized list container
  const parentRef = useRef<HTMLDivElement>(null)

  // Setup virtualizer for university selection list
  const rowVirtualizer = useVirtualizer({
    count: filteredUniversityList.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36, // Approximate height of each university row
    overscan: 10, // Number of items to render before/after the visible area
  })

  // Memoize selected universities count to avoid recalculation
  const selectedCount = useMemo(() => {
    return Object.values(selectedUniversities).filter(Boolean).length
  }, [selectedUniversities])

  // Effect to handle select all/none efficiently
  useEffect(() => {
    if (universityList.length === 0) return

    // Only update if selectAll changes
    if (selectAll) {
      const allSelected = universityList.reduce(
        (acc, university) => {
          acc[university.id] = true
          return acc
        },
        {} as Record<string, boolean>,
      )

      setSelectedUniversities(allSelected)
    } else if (selectedCount === universityList.length) {
      // If all items were previously selected and selectAll is now false,
      // deselect all items
      const noneSelected = universityList.reduce(
        (acc, university) => {
          acc[university.id] = false
          return acc
        },
        {} as Record<string, boolean>,
      )

      setSelectedUniversities(noneSelected)
    }
  }, [selectAll, universityList, selectedCount])

  // Function to validate and format URLs
  const formatUrl = useCallback((url: string): string => {
    if (!url || url.trim() === "") return ""

    // Check if URL already has a protocol
    if (url.match(/^https?:\/\//i)) {
      return url.trim()
    }

    // Check for common URL patterns without protocol
    if (url.match(/^www\./i) || url.match(/\.[a-z]{2,}$/i)) {
      return `https://${url.trim()}`
    }

    return "" // Return empty string if URL doesn't look valid
  }, [])

  // Helper function to get values using column mapping
  const getValue = useCallback(
    (row: Record<string, any>, columnKey: string, columnMap: Record<string, string>): string => {
      const mappedColumn = columnMap[columnKey]
      if (mappedColumn && row[mappedColumn] !== undefined) {
        return String(row[mappedColumn] || "").trim()
      }
      return ""
    },
    [],
  )

  // Handle file upload with debouncing to prevent UI blocking
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setError(null)
      setProcessingLog([])
      setAvailableSheets([])
      setSelectedSheets([])
      jsonDataRef.current = null
      setUniversityList([])

      const files = event.target.files
      if (!files || !files[0]) {
        setError("No file selected")
        return
      }

      const file = files[0]
      addToLog(`Reading file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`)

      // Use a separate worker for file reading to prevent UI blocking
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          if (!e.target?.result) {
            setError("Failed to read file")
            return
          }

          addToLog("Parsing Excel file...")

          // Read the workbook but delay processing to not block the UI
          const data = new Uint8Array(e.target.result as ArrayBuffer)

          // Use a setTimeout to prevent UI blocking during XLSX parsing
          setTimeout(() => {
            try {
              const workbook = XLSX.read(data, { type: "array" })
              setCurrentWorkbook(workbook)

              // Get all sheet names and set them as available
              const sheetNames = workbook.SheetNames
              setAvailableSheets(sheetNames)
              setSelectedSheets(sheetNames) // By default, select all sheets

              addToLog(`Found ${sheetNames.length} sheets: ${sheetNames.join(", ")}`)
            } catch (err) {
              console.error("Error parsing Excel file:", err)
              setError(`Error parsing Excel file: ${err instanceof Error ? err.message : "Unknown error"}`)
            }
          }, 100)
        } catch (err) {
          console.error("Error reading file:", err)
          setError(`Error reading file: ${err instanceof Error ? err.message : "Unknown error"}`)
        }
      }

      reader.onerror = (err) => {
        console.error("Error reading file:", err)
        setError("Error reading file")
      }

      reader.readAsArrayBuffer(file)
    },
    [addToLog, setError],
  )

  // Process a single sheet with chunked processing
  const processSheet = useCallback(
    (
      workbook: XLSX.WorkBook,
      sheetName: string,
      allUniversitiesMap: Map<string, FormattedData>,
      onComplete: () => void,
    ) => {
      addToLog(`Processing sheet: ${sheetName}`)

      try {
        const worksheet = workbook.Sheets[sheetName]

        // Convert to JSON with headers
        const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "" }) as Array<Record<string, any>>

        if (rawData.length === 0) {
          addToLog(`No data found in sheet: ${sheetName}`)
          onComplete()
          return
        }

        // Get headers from the first row
        const headers = Object.keys(rawData[0])
        addToLog(`Sheet ${sheetName} headers: ${headers.join(", ")}`)

        // Map columns based on the selected format
        const columnMap: Record<string, string> = {}

        if (mappingFormat === MAPPING_FORMATS.DEFAULT) {
          // Default format - expected column headers and their fallback positions
          const EXPECTED_COLUMNS = [
            { key: "UNIVERSITY_NAME", name: "Name ( University)", position: 0 },
            { key: "PLACE", name: "Place - Country and city", position: 1 },
            { key: "COUNTRY", name: "Country", position: 2 },
            { key: "WEBSITE", name: "Website link of the Uni", position: 9 },
            { key: "YEAR", name: "Year of Establishment", position: 10 },
            { key: "LOGO", name: "Logo", position: 11 },
            { key: "YOUTUBE_LINK", name: "Youtube Link", position: 12 },
            { key: "COURSE", name: "Course (create drop down)", position: 2 },
            { key: "FEES", name: "Fees", position: 3 },
            { key: "DURATION", name: "Course Duration", position: 4 },
            { key: "DEGREE_TYPE", name: "Degree type", position: 5 },
            { key: "IELTS", name: "IELTS Score", position: 6 },
            { key: "RANKING", name: "Ranking", position: 7 },
            { key: "INTAKE", name: "Intake", position: 8 },
            { key: "WEBSITE_LINK", name: "Website link of the Uni", position: 9 },
          ]

          // First try to match by exact column name
          EXPECTED_COLUMNS.forEach((col) => {
            // Try exact match first
            let headerIndex = headers.findIndex(
              (header) => header.toLowerCase().trim() === col.name.toLowerCase().trim(),
            )

            // If exact match fails, try partial match
            if (headerIndex === -1) {
              headerIndex = headers.findIndex((header) =>
                header.toLowerCase().includes(col.name.toLowerCase().split(" ")[0]),
              )
            }

            if (headerIndex !== -1) {
              columnMap[col.key] = headers[headerIndex]
            }
          })

          // For columns not found by name, use position-based mapping
          EXPECTED_COLUMNS.forEach((col) => {
            if (!columnMap[col.key] && col.position < headers.length) {
              columnMap[col.key] = headers[col.position]
            }
          })
        } else {
          // Alternative format - direct position-based mapping exactly matching the Excel format
          addToLog("Using alternative column mapping format")
          if (headers.length >= 1) columnMap["UNIVERSITY_NAME"] = headers[0] // A: Name (University)
          if (headers.length >= 2) columnMap["PLACE"] = headers[1] // B: Location
          if (headers.length >= 3) columnMap["COURSE"] = headers[2] // C: Course
          if (headers.length >= 4) columnMap["FEES"] = headers[3] // D: Fees
          if (headers.length >= 5) columnMap["DURATION"] = headers[4] // E: Duration
          if (headers.length >= 6) columnMap["DEGREE_TYPE"] = headers[5] // F: Degree Type
          if (headers.length >= 7) columnMap["IELTS"] = headers[6] // G: IELTS Score
          if (headers.length >= 8) columnMap["RANKING"] = headers[7] // H: Ranking
          if (headers.length >= 9) columnMap["INTAKE"] = headers[8] // I: Intake
          if (headers.length >= 10) columnMap["WEBSITE_LINK"] = headers[9] // J: WebsiteLink
          if (headers.length >= 11) columnMap["YEAR"] = headers[10] // K: Year
          if (headers.length >= 12) columnMap["LOGO"] = headers[11] // L: Logo
          if (headers.length >= 13) columnMap["COUNTRY"] = headers[2] // M: Country (fallback)
          if (headers.length >= 14) columnMap["WEBSITE"] = headers[9] // N: Website (fallback to website link)
          if (headers.length >= 15) columnMap["YOUTUBE_LINK"] = headers[14] // O: YouTube Link
        }

        // Log the column mapping for debugging
        addToLog(`Column mapping for sheet ${sheetName}: ${JSON.stringify(columnMap)}`)

        // STEP 1: Identify university boundaries
        // We'll create a map of row indices where each university starts
        const universityStartRows: { index: number; name: string }[] = []

        // Scan all rows to find where universities start
        for (let i = 0; i < rawData.length; i++) {
          const row = rawData[i]
          const universityName = getValue(row, "UNIVERSITY_NAME", columnMap)

          // If this row has a university name, it's the start of a new university
          if (universityName && universityName !== "") {
            universityStartRows.push({ index: i, name: universityName })
            addToLog(`Found university at row ${i} in sheet ${sheetName}: ${universityName}`)
          }
        }

        // STEP 2: Process each university block in chunks
        const processUniversityChunk = (startIdx: number, chunkSize: number) => {
          const endIdx = Math.min(startIdx + chunkSize, universityStartRows.length)

          for (let i = startIdx; i < endIdx; i++) {
            const currentUniv = universityStartRows[i]
            // Determine the end row for this university (either the next university start or the end of data)
            const endRow = i < universityStartRows.length - 1 ? universityStartRows[i + 1].index : rawData.length

            // Get the university data from its first row
            const universityRow = rawData[currentUniv.index]
            const universityName = currentUniv.name

            setProcessingStatus((prev) => ({
              ...prev,
              currentUniversity: universityName,
            }))

            addToLog(
              `Processing university: ${universityName} (rows ${currentUniv.index} to ${endRow - 1}) from sheet ${sheetName}`,
            )

            // Extract university metadata
            const location = getValue(universityRow, "PLACE", columnMap)
            const country = getValue(universityRow, "COUNTRY", columnMap)
            const websiteRaw = getValue(universityRow, "WEBSITE", columnMap)
            // Format the university website URL properly
            const website = formatUrl(websiteRaw) || "https://example.com"

            const year = getValue(universityRow, "YEAR", columnMap)
            const logo = getValue(universityRow, "LOGO", columnMap)
            const youtubeLink = getValue(universityRow, "YOUTUBE_LINK", columnMap)

            // Format the established date
            let establishedDate
            try {
              if (year) {
                const yearNumber = typeof year === "string" ? Number.parseInt(year, 10) : year
                if (!isNaN(yearNumber)) {
                  establishedDate = new Date(yearNumber, 0, 1).toISOString()
                } else {
                  establishedDate = new Date().toISOString()
                }
              } else {
                establishedDate = new Date().toISOString()
              }
            } catch (err) {
              console.error("Error parsing date:", err)
              establishedDate = new Date().toISOString()
            }

            // Check if this university already exists in our map (from another sheet)
            let universityData: FormattedData
            if (allUniversitiesMap.has(universityName)) {
              // University already exists, use existing data
              universityData = allUniversitiesMap.get(universityName)!
              addToLog(`Found existing university: ${universityName} - adding courses from sheet ${sheetName}`)
            } else {
              // Create new university object
              universityData = {
                id: `univ_${(allUniversitiesMap.size + 1).toString().padStart(3, "0")}`,
                name: universityName,
                description: `${universityName} is a prestigious institution located in ${location || country || "Unknown"}.`,
                location: location || "",
                country: country || "Unknown",
                website: website,
                established: establishedDate,
                banner: "https://ik.imagekit.io/99y1fc9mh/Subtract.png?updatedAt=1741879095068",
                logoUrl: "https://ik.imagekit.io/99y1fc9mh/Subtract.png?updatedAt=1741879095068",
                imageUrls: ["https://ik.imagekit.io/99y1fc9mh/Subtract.png?updatedAt=1741879095068"],
                facilities: ["Library", "Sports Complex", "Cafeteria", "Research Centers", "Student Housing"],
                youtubeLink: youtubeLink || "",
                courses: [],
              }
              addToLog(`Created new university: ${universityName}`)
            }

            // IMPROVED COURSE EXTRACTION
            // Process all rows for this university to extract courses
            let courseCount = 0
            for (let rowIndex = currentUniv.index; rowIndex < endRow; rowIndex++) {
              const row = rawData[rowIndex]

              // Check for course name in this row
              const courseName = getValue(row, "COURSE", columnMap)

              // Skip rows without course names
              if (!courseName || courseName.trim() === "") continue

              // Get IELTS score - this is often a key identifier for different courses
              const ieltsScore = getValue(row, "IELTS", columnMap)

              // Create a unique identifier for the course using name and IELTS score
              const courseKey = `${courseName}_${ieltsScore}`.toLowerCase()

              // Check if this exact course already exists in this university
              const courseExists = universityData.courses.some(
                (c) => `${c.name}_${c.ieltsScore}`.toLowerCase() === courseKey,
              )

              if (!courseExists) {
                // Parse intake months
                const intakeValue = getValue(row, "INTAKE", columnMap)
                const intakeMonths = intakeValue
                  ? intakeValue
                      .split(/[,&]/)
                      .map((month: string) => month.trim())
                      .filter(Boolean)
                  : []

                // Get and properly format course-specific website link
                const courseWebsiteLinkRaw = getValue(row, "WEBSITE_LINK", columnMap) || website || ""
                const courseWebsiteLink = formatUrl(courseWebsiteLinkRaw) || website || "https://example.com"

                // Add the course
                universityData.courses.push({
                  id: `${universityData.id}_course_${(universityData.courses.length + 1).toString().padStart(3, "0")}`,
                  name: courseName,
                  description: `${courseName} program at ${universityName} is designed to provide students with comprehensive knowledge and practical skills in their field of study.`,
                  image:
                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7B725451B4-42E1-4758-950E-F4995689EEBA%7D-tKppHzZnq4met3MGDBdRzBZzosM8cS.png",
                  fees: getValue(row, "FEES", columnMap) || "",
                  duration: getValue(row, "DURATION", columnMap) || "",
                  degreeType: getValue(row, "DEGREE_TYPE", columnMap) || "",
                  ieltsScore: ieltsScore || "",
                  ranking: getValue(row, "RANKING", columnMap) || "",
                  intake: intakeMonths,
                  websiteLink: courseWebsiteLink,
                })

                courseCount++
                addToLog(`Added course: ${courseName} to ${universityName} from sheet ${sheetName}`)
              }
            }

            addToLog(`Total courses added for ${universityName}: ${courseCount}`)

            // Add/update the university in our map
            allUniversitiesMap.set(universityName, universityData)
          }

          // If there are more universities to process, schedule the next chunk
          if (endIdx < universityStartRows.length) {
            setTimeout(() => {
              processUniversityChunk(endIdx, chunkSize)
            }, 0)
          } else {
            // All universities processed, call the completion callback
            onComplete()
          }
        }

        // Start processing universities in chunks of 10
        processUniversityChunk(0, 10)
      } catch (err) {
        console.error(`Error processing sheet ${sheetName}:`, err)
        addToLog(`ERROR processing sheet ${sheetName}: ${err instanceof Error ? err.message : "Unknown error"}`)
        onComplete()
      }
    },
    [mappingFormat, getValue, formatUrl, addToLog],
  )

  // Process selected sheets using chunked processing
  const processSelectedSheets = useCallback(() => {
    if (!currentWorkbook || selectedSheets.length === 0) {
      setError("No sheets selected for processing")
      return
    }

    try {
      setProcessingLog([])
      addToLog(`Processing ${selectedSheets.length} sheets: ${selectedSheets.join(", ")}`)

      // Reset processing status
      setProcessingStatus({
        isProcessing: true,
        progress: 0,
        total: selectedSheets.length,
        currentSheet: selectedSheets[0],
        currentUniversity: "",
      })

      // Initialize the universities map
      const allUniversitiesMap = new Map<string, FormattedData>()

      // Process sheets one by one to avoid blocking the UI
      const processNextSheet = (index: number) => {
        if (index >= selectedSheets.length) {
          // All sheets processed, finalize
          const formattedData = Array.from(allUniversitiesMap.values())
          jsonDataRef.current = formattedData

          // Update the lightweight list for UI
          const newList = formattedData.map((u) => ({
            id: u.id,
            name: u.name,
            courseCount: u.courses.length,
          }))

          setUniversityList(newList)

          // Initialize selection state
          const initialSelected = newList.reduce(
            (acc, university) => {
              acc[university.id] = false
              return acc
            },
            {} as Record<string, boolean>,
          )

          setSelectedUniversities(initialSelected)
          setSelectAll(false)

          addToLog(`Total universities across all sheets: ${formattedData.length}`)
          addToLog(
            `Total courses across all sheets: ${formattedData.reduce((total, univ) => total + univ.courses.length, 0)}`,
          )

          setProcessingStatus((prev) => ({
            ...prev,
            isProcessing: false,
          }))

          return
        }

        const sheetName = selectedSheets[index]

        setProcessingStatus((prev) => ({
          ...prev,
          progress: index,
          currentSheet: sheetName,
        }))

        // Process the current sheet
        processSheet(currentWorkbook, sheetName, allUniversitiesMap, () => {
          // When sheet is processed, move to the next one
          setTimeout(() => {
            processNextSheet(index + 1)
          }, 10) // Small delay to keep UI responsive
        })
      }

      // Start processing with the first sheet
      processNextSheet(0)
    } catch (err) {
      console.error("Error processing sheets:", err)
      setError(`Error processing sheets: ${err instanceof Error ? err.message : "Unknown error"}`)
      addToLog(`ERROR: ${err instanceof Error ? err.message : "Unknown error"}`)
      setProcessingStatus((prev) => ({ ...prev, isProcessing: false }))
    }
  }, [currentWorkbook, selectedSheets, processSheet, addToLog, setError])

  // Helper function to add to the processing log

  const handleDownload = useCallback(() => {
    if (!jsonDataRef.current) return

    const dataStr = JSON.stringify(jsonDataRef.current, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = "universities.json"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [])

  // Handle "Select All" checkbox change
  const handleSelectAllChange = useCallback((checked: boolean) => {
    setSelectAll(checked)
  }, [])

  // Handle individual university checkbox change with batching
  const handleUniversitySelectionChange = useCallback(
    (universityId: string, checked: boolean) => {
      setSelectedUniversities((prev) => ({
        ...prev,
        [universityId]: checked,
      }))

      // Check if all are now selected or not
      if (universityList.length > 0) {
        const allSelected = universityList.every((university) =>
          universityId === university.id ? checked : selectedUniversities[university.id] || false,
        )

        setSelectAll(allSelected)
      }
    },
    [universityList, selectedUniversities],
  )

  // Handle sheet selection
  const handleSheetSelectionChange = useCallback(() => {
    if (!availableSheets.length || !currentWorkbook) return

    // Process only the selected sheets
    processSelectedSheets()
  }, [availableSheets, currentWorkbook, processSelectedSheets])

  const handleUploadSelectedUniversities = useCallback(async () => {
    if (!jsonDataRef.current || jsonDataRef.current.length === 0) {
      setError("No data available to upload")
      return
    }

    // Filter the data to only include selected universities
    const selectedUniversityIds = Object.entries(selectedUniversities)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id)

    if (selectedUniversityIds.length === 0) {
      setError("No universities selected for upload")
      toast.error("No universities selected")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Filter to only selected universities
      const dataToUpload = jsonDataRef.current
        .filter((university) => selectedUniversityIds.includes(university.id))
        .map((university) => {
          // Create a copy without the client-side ID
          const { id, ...universityWithoutId } = university

          // Process courses to remove client-side IDs and ensure valid websiteLinks
          const courses = university.courses.map((course) => {
            const { id: courseId, image, ...courseWithoutId } = course

            // Ensure websiteLink is a valid URL
            let websiteLink = courseWithoutId.websiteLink
            if (!websiteLink || !websiteLink.match(/^https?:\/\//i)) {
              // If not valid, use university website or a default
              websiteLink = university.website || "https://example.com"
            }

            return {
              ...courseWithoutId,
              websiteLink,
            }
          })

          return {
            ...universityWithoutId,
            courses,
          }
        })

      // Upload in batches to prevent timeout
      const BATCH_SIZE = 10
      const batches = []

      for (let i = 0; i < dataToUpload.length; i += BATCH_SIZE) {
        batches.push(dataToUpload.slice(i, i + BATCH_SIZE))
      }

      let successCount = 0
      let failedCount = 0
      const errors: string[] = []

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i]

        try {
          // Make the API call to upload batch
          const response = await fetch("/api/universities/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(batch),
          })

          const result = await response.json()

          if (response.ok) {
            successCount += result.details?.success || batch.length
          } else {
            failedCount += result.details?.failed || batch.length
            if (result.details?.errors) {
              errors.push(...result.details.errors)
            }
          }
        } catch (err) {
          failedCount += batch.length
          errors.push(`Batch ${i + 1} failed: ${err instanceof Error ? err.message : "Unknown error"}`)
        }

        // Update progress
        setUploadResults({
          message: `Uploading batch ${i + 1}/${batches.length}`,
          details: {
            success: successCount,
            failed: failedCount,
            errors,
          },
        })
      }

      // Final update
      setUploadResults({
        message: "Upload complete",
        details: {
          success: successCount,
          failed: failedCount,
          errors,
        },
      })

      if (failedCount === 0) {
        toast.success(`Successfully uploaded ${successCount} universities`)
      } else {
        toast.error(`Upload completed with ${failedCount} errors`)
      }
    } catch (err) {
      console.error("Error uploading universities:", err)
      setError(`Failed to upload universities: ${err instanceof Error ? err.message : "Unknown error"}`)
      toast.error("Upload Error")
    } finally {
      toast.dismiss()
      setIsUploading(false)
    }
  }, [jsonDataRef, selectedUniversities, setError, toast])

  const toggleCollapse = useCallback((id: string) => {
    setCollapsed((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }, [])

  const handleCopy = useCallback(async () => {
    if (!jsonDataRef.current) return

    try {
      // Copy in chunks to handle very large data
      const stringifyInChunks = (data: any) => {
        return JSON.stringify(data, null, 2)
      }

      await navigator.clipboard.writeText(stringifyInChunks(jsonDataRef.current))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
      toast.error("Failed to copy data to clipboard")
    }
  }, [jsonDataRef, toast])

  // Memoized rendering function for virtual list items
  const renderVirtualRow = useCallback(
    ({ index }: { index: number }) => {
      if (!filteredUniversityList) return null

      const university = filteredUniversityList[index]
      if (!university) return null

      return (
        <div className="flex items-center space-x-2 py-2">
          <Checkbox
            id={`univ-${university.id}`}
            checked={selectedUniversities[university.id] || false}
            onCheckedChange={(checked) => handleUniversitySelectionChange(university.id, checked === true)}
          />
          <label htmlFor={`univ-${university.id}`} className="text-sm truncate" title={university.name}>
            {university.name} ({university.courseCount} courses)
          </label>
        </div>
      )
    },
    [filteredUniversityList, selectedUniversities, handleUniversitySelectionChange],
  )

  // Get paginated data for JSON viewer
  const getPaginatedData = useCallback(() => {
    if (!jsonDataRef.current) return []

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    // Filter data if needed
    let filteredData = jsonDataRef.current

    if (universityFilter || courseFilter) {
      filteredData = jsonDataRef.current.filter((university) => {
        const matchesUniversity = university.name.toLowerCase().includes(universityFilter.toLowerCase())
        if (showOnlyUniversities) return matchesUniversity

        const matchesCourse = university.courses.some((course) =>
          course.name.toLowerCase().includes(courseFilter.toLowerCase()),
        )

        return matchesUniversity || matchesCourse
      })
    }

    // Return paginated slice
    return filteredData.slice(startIndex, endIndex)
  }, [jsonDataRef, currentPage, itemsPerPage, universityFilter, courseFilter, showOnlyUniversities])

  // Calculate total pages
  const totalPages = useMemo(() => {
    if (!jsonDataRef.current) return 1

    let count = jsonDataRef.current.length

    if (universityFilter || courseFilter) {
      count = jsonDataRef.current.filter((university) => {
        const matchesUniversity = university.name.toLowerCase().includes(universityFilter.toLowerCase())
        if (showOnlyUniversities) return matchesUniversity

        const matchesCourse = university.courses.some((course) =>
          course.name.toLowerCase().includes(courseFilter.toLowerCase()),
        )

        return matchesUniversity || matchesCourse
      }).length
    }

    return Math.ceil(count / itemsPerPage)
  }, [jsonDataRef, itemsPerPage, universityFilter, courseFilter, showOnlyUniversities])

  // Render JSON data with pagination
  const renderJsonData = useCallback(() => {
    const data = getPaginatedData()
    if (data.length === 0) {
      return <div className="p-4 text-center text-gray-500">No data to display</div>
    }

    return (
      <div className="p-4 bg-white font-mono text-sm overflow-x-auto max-h-[500px] overflow-y-auto">
        {data.map((university, index) => (
          <div key={university.id} className="mb-2">
            <pre className="whitespace-pre-wrap break-words">{JSON.stringify(university, null, 2)}</pre>
            {index < data.length - 1 && <div className="my-2">,</div>}
          </div>
        ))}
      </div>
    )
  }, [getPaginatedData])

  return (
    <div className="p-8 mt-32 w-[70%] mx-auto">
      <h1 className="text-2xl font-bold mb-4">Universities Data Converter</h1>
      <p className="text-gray-600 mb-4">Upload your Excel file to convert university course data to JSON format</p>

      <div className="mb-6">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() =>
            setMappingFormat(
              mappingFormat === MAPPING_FORMATS.DEFAULT ? MAPPING_FORMATS.ALTERNATIVE : MAPPING_FORMATS.DEFAULT,
            )
          }
        >
          {mappingFormat === MAPPING_FORMATS.DEFAULT ? (
            <ToggleLeft className="h-5 w-5" />
          ) : (
            <ToggleRight className="h-5 w-5 text-green-600" />
          )}
          <span>
            {mappingFormat === MAPPING_FORMATS.DEFAULT
              ? "Use Default Column Names"
              : "Use Fixed Column Positions (A-N)"}
          </span>
        </Button>
        <p className="text-sm text-gray-500 mt-1">
          {mappingFormat === MAPPING_FORMATS.DEFAULT
            ? "Using column names with fallback to positions"
            : "Using A=University, B=Location, C=Country, D=Website, etc."}
        </p>
      </div>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4 block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-black file:text-white
          hover:file:bg-gray-800"
        disabled={processingStatus.isProcessing}
      />

      {/* Processing Status */}
      {processingStatus.isProcessing && (
        <div className="mb-4 p-4 border rounded bg-blue-50">
          <h3 className="font-medium mb-2">Processing Data</h3>
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>
              Processing sheet {processingStatus.progress + 1} of {processingStatus.total}:{" "}
              {processingStatus.currentSheet}
            </span>
          </div>
          {processingStatus.currentUniversity && (
            <div className="text-sm text-blue-600 mb-2">Current university: {processingStatus.currentUniversity}</div>
          )}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(processingStatus.progress / processingStatus.total) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Sheet Selection Section */}
      {availableSheets.length > 0 && !processingStatus.isProcessing && (
        <div className="mb-4 p-4 border rounded bg-gray-50">
          <h3 className="font-medium mb-2">Available Sheets</h3>
          <div className="flex flex-wrap gap-4 mb-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all-sheets"
                checked={selectedSheets.length === availableSheets.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedSheets([...availableSheets])
                  } else {
                    setSelectedSheets([])
                  }
                }}
              />
              <label htmlFor="select-all-sheets" className="text-sm font-medium">
                Select All Sheets
              </label>
            </div>

            {availableSheets.map((sheet) => (
              <div key={sheet} className="flex items-center space-x-2">
                <Checkbox
                  id={`sheet-${sheet}`}
                  checked={selectedSheets.includes(sheet)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedSheets((prev) => (prev.includes(sheet) ? prev : [...prev, sheet]))
                    } else {
                      setSelectedSheets((prev) => prev.filter((s) => s !== sheet))
                    }
                  }}
                />
                <label htmlFor={`sheet-${sheet}`} className="text-sm">
                  {sheet}
                </label>
              </div>
            ))}
          </div>
          <Button size="sm" onClick={handleSheetSelectionChange} disabled={selectedSheets.length === 0}>
            Process Selected Sheets
          </Button>
        </div>
      )}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {processingLog.length > 0 && (
        <div className="mb-4">
          <Button variant="outline" size="sm" onClick={() => setShowLog(!showLog)} className="mb-2">
            {showLog ? "Hide Processing Log" : "Show Processing Log"}
          </Button>

          {showLog && (
            <div className="p-3 bg-gray-100 rounded border text-xs font-mono h-40 overflow-y-auto">
              {processingLog.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {universityList.length > 0 && (
        <div>
          <div className="flex flex-col space-y-4 mb-4">
            <div className="flex items-center space-x-4">
              <Input
                placeholder="Filter by university name..."
                value={universityFilter}
                onChange={(e) => setUniversityFilter(e.target.value)}
                className="max-w-sm"
              />
              <Input
                placeholder="Filter by course name..."
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="max-w-sm"
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="universities-only"
                  checked={showOnlyUniversities}
                  onCheckedChange={(checked) => setShowOnlyUniversities(checked === true)}
                />
                <label htmlFor="universities-only" className="text-sm text-gray-700">
                  Show only universities
                </label>
              </div>
            </div>
          </div>

          {/* University Selection Section - Using Virtualization */}
          <div className="mb-6 p-4 border rounded bg-gray-50">
            <h3 className="font-medium mb-3">Select Universities to Upload</h3>

            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="select-all-universities"
                checked={selectAll}
                onCheckedChange={(checked) => handleSelectAllChange(checked === true)}
              />
              <label htmlFor="select-all-universities" className="font-medium">
                Select All Universities ({selectedCount}/{universityList.length})
              </label>
            </div>

            {/* Virtualized list for university selection */}
            <div
              ref={parentRef}
              className="max-h-60 overflow-y-auto border border-gray-200 rounded p-2"
              style={{ height: "250px" }}
            >
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                  <div
                    key={virtualRow.index}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {renderVirtualRow({ index: virtualRow.index })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Generated JSON:</h2>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="ml-2">{copied ? "Copied!" : "Copy"}</span>
              </Button>
              <Button onClick={handleDownload}>Download JSON</Button>
              <Button
                onClick={handleUploadSelectedUniversities}
                disabled={isUploading || selectedCount === 0}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    <span>Upload Selected ({selectedCount})</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {uploadResults && (
            <div className="mb-4 p-4 border rounded bg-gray-50">
              <h3 className="font-semibold mb-2">Upload Results</h3>
              <div className="flex space-x-4">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded">
                  Success: {uploadResults.details.success}
                </div>
                {uploadResults.details.failed > 0 && (
                  <div className="bg-red-100 text-red-800 px-3 py-1 rounded">
                    Failed: {uploadResults.details.failed}
                  </div>
                )}
              </div>
              {uploadResults.details.errors?.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium text-sm">Errors:</p>
                  <ul className="text-sm text-red-600 list-disc list-inside">
                    {uploadResults.details.errors.slice(0, 5).map((error: string, index: number) => (
                      <li key={index}>{error}</li>
                    ))}
                    {uploadResults.details.errors.length > 5 && (
                      <li>...and {uploadResults.details.errors.length - 5} more errors</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* JSON Viewer with pagination */}
          <div className="mb-4">
            <Button variant="outline" onClick={() => setShowJsonViewer(!showJsonViewer)} className="mb-2">
              {showJsonViewer ? "Hide JSON Data" : "Show JSON Data"}
            </Button>
          </div>

          {showJsonViewer && (
            <div className="border rounded overflow-hidden">
              <div className="p-2 bg-gray-100 border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="text-sm border rounded p-1"
                  >
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                  </select>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                    First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    Last
                  </Button>
                </div>
              </div>

              <Suspense fallback={<div className="p-4 text-center">Loading JSON viewer...</div>}>
                {renderJsonData()}
              </Suspense>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
