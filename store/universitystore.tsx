import { CareerOutcome } from "@/app/lib/types/universities"
import { create } from "zustand"
import { devtools, persist, createJSONStorage } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

// Types
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
  universityId: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface UniversityInterface {
  id: string
  slug?: string
  name: string
  description: string
  location: string
  country: string
  website: string
  established: Date
  banner: string
  youtubeLink?: string
  logoUrl: string | null
  imageUrls: string[]
  facilities: string[]
  courses: CourseInterface[]
  careerOutcomes:CareerOutcome[]
  faqs:[]
  qsRanking?: string
  createdAt: Date
  updatedAt: Date
}

export interface FilterValues {
  country?: string
  universityName?: string
  fees?: string
}

interface PaginationData {
  total: number
  pages: number
  page: number
  limit: number
}

interface UniversityCache {
  data: UniversityInterface[]
  pagination: PaginationData
  timestamp: number
  searchQuery: string
  filters: FilterValues
}

interface ApiResponse {
  universities: UniversityInterface[]
  pagination: PaginationData
}

interface UniversityState {
  // Cache storage
  cache: Record<string, UniversityCache>

  // Current state
  universities: UniversityInterface[]
  pagination: PaginationData | null
  isLoading: boolean
  error: string | null

  // Search and filter state
  currentSearchQuery: string
  currentFilters: FilterValues
  currentPage: number

  // Individual university cache
  universityDetails: Record<string, UniversityInterface>

  // Cache settings
  cacheTimeout: number

  // Loading states
  isInitialLoading: boolean
  isFetchingPage: boolean
  isRefreshing: boolean

  // Hydration and initialization
  _hasHydrated: boolean

  // Request tracking
  activeRequests: string[]
  lastSuccessfulFetch: Record<string, number>

  // Actions
  setUniversities: (universities: UniversityInterface[], pagination: PaginationData) => void
  setLoading: (loading: boolean, loadingType?: "initial" | "page" | "refresh") => void
  setError: (error: string | null) => void
  setSearchQuery: (query: string) => void
  setFilters: (filters: FilterValues) => void
  setCurrentPage: (page: number) => void
  setHydrated: () => void

  // Cache management
  getCachedData: (searchQuery: string, filters: FilterValues, page: number) => UniversityCache | null
  setCachedData: (
    searchQuery: string,
    filters: FilterValues,
    page: number,
    data: UniversityInterface[],
    pagination: PaginationData,
  ) => void
  clearCache: () => void
  clearExpiredCache: () => void

  // University details
  getUniversityById: (id: string) => UniversityInterface | null
  setUniversityDetails: (university: UniversityInterface) => void

  // MAIN FETCH FUNCTION
  fetchUniversities: (
    searchQuery?: string,
    filters?: FilterValues,
    page?: number,
    options?: { forceRefresh?: boolean; silent?: boolean },
  ) => Promise<void>
  fetchUniversityById: (id: string, forceRefresh?: boolean) => Promise<UniversityInterface | null>

  // Utility functions
  invalidateCache: (searchQuery?: string, filters?: FilterValues) => void
  getLoadingState: () => {
    isLoading: boolean
    isInitialLoading: boolean
    isFetchingPage: boolean
    isRefreshing: boolean
  }
  reset: () => void
  hasDataForQuery: (searchQuery: string, filters: FilterValues, page: number) => boolean
  updateUniversityOptimistic: (id: string, updates: Partial<UniversityInterface>) => void
  revertOptimisticUpdate: (id: string) => void

  // Debug functions
  debugCacheState: () => void
  debugStoreState: () => void
}

// Enhanced API fetcher with better error handling
const fetcher = async (url: string): Promise<any> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000)

  try {
    console.log("🌐 API REQUEST:", url)

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    clearTimeout(timeoutId)

    console.log("📡 Response status:", response.status, "for URL:", url)

    if (!response.ok) {
      if (response.status === 404) {
        console.log("❌ Resource not found (404)")
        return null
      } else if (response.status === 401) {
        console.warn("⚠️ Authentication required")
        return null
      } else if (response.status >= 500) {
        throw new Error("Server error occurred. Please try again later.")
      } else if (response.status === 429) {
        throw new Error("Too many requests. Please wait a moment.")
      } else {
        throw new Error(`Request failed with status ${response.status}`)
      }
    }

    const data = await response.json()
    console.log("✅ API SUCCESS:", data)
    return data
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out. Please check your connection.")
      }
      throw error
    }

    throw new Error("An unexpected error occurred")
  }
}

// Cache key generation
const generateCacheKey = (searchQuery: string, filters: FilterValues, page: number): string => {
  const normalizedQuery = (searchQuery || "").trim().toLowerCase()

  const filterEntries = Object.entries(filters || {})
    .filter(([_, value]) => value && typeof value === "string" && value.trim())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${String(value).trim().toLowerCase()}`)

  const normalizedFilters = filterEntries.join("|")
  const validPage = Math.max(1, Math.floor(page))

  return `q:${normalizedQuery}|f:${normalizedFilters}|p:${validPage}`
}

// Build API URL
const buildApiUrl = (searchQuery: string, filters: FilterValues, page: number): string => {
  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : process.env.NEXTAUTH_URL || "http://localhost:3000"

  const url = new URL(`${baseUrl}/api/universities`)

  const validPage = Math.max(1, Math.floor(page))
  const validLimit = 9

  url.searchParams.append("page", validPage.toString())
  url.searchParams.append("limit", validLimit.toString())

  const trimmedQuery = (searchQuery || "").trim()
  if (trimmedQuery) {
    url.searchParams.append("query", trimmedQuery)
  }

  if (filters?.country?.trim()) {
    url.searchParams.append("country", filters.country.trim())
  }
  if (filters?.universityName?.trim()) {
    url.searchParams.append("name", filters.universityName.trim())
  }
  if (filters?.fees?.trim()) {
    url.searchParams.append("fees", filters.fees.trim())
  }

  return url.toString()
}

export const useUniversityStore = create<UniversityState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state - CHANGED activeRequests FROM SET TO ARRAY
        cache: {},
        universities: [],
        pagination: null,
        isLoading: false,
        error: null,
        currentSearchQuery: "",
        currentFilters: {},
        currentPage: 1,
        universityDetails: {},
        cacheTimeout: 30 * 60 * 1000, // 30 minutes
        isInitialLoading: false,
        isFetchingPage: false,
        isRefreshing: false,
        _hasHydrated: false,
        activeRequests: [], // CHANGED FROM SET TO ARRAY
        lastSuccessfulFetch: {},

        // IMPROVED: Better loading state management
        setLoading: (loading, loadingType = "initial") =>
          set((state) => {
            console.log("⏳ SETTING LOADING:", loading, loadingType)

            // Always set the main loading state
            state.isLoading = loading

            if (!loading) {
              // When stopping loading, clear all loading states
              state.isInitialLoading = false
              state.isFetchingPage = false
              state.isRefreshing = false
            } else {
              // When starting loading, set the appropriate type
              switch (loadingType) {
                case "initial":
                  state.isInitialLoading = true
                  break
                case "page":
                  state.isFetchingPage = true
                  break
                case "refresh":
                  state.isRefreshing = true
                  break
              }
            }
          }),

        // Rest of the setters (same as before)
        setUniversities: (universities, pagination) =>
          set((state) => {
            console.log("📝 SETTING UNIVERSITIES:", universities.length, "items")
            state.universities = universities
            state.pagination = pagination
            state.isLoading = false
            state.isInitialLoading = false
            state.isFetchingPage = false
            state.isRefreshing = false
            state.error = null
          }),

        setError: (error) =>
          set((state) => {
            console.log("❌ SETTING ERROR:", error)
            state.error = error
            state.isLoading = false
            state.isInitialLoading = false
            state.isFetchingPage = false
            state.isRefreshing = false
          }),

        setSearchQuery: (query) =>
          set((state) => {
            const trimmedQuery = (query || "").trim()
            if (state.currentSearchQuery !== trimmedQuery) {
              console.log("🔍 SETTING SEARCH QUERY:", trimmedQuery)
              state.currentSearchQuery = trimmedQuery
            }
          }),

        setFilters: (filters) =>
          set((state) => {
            const filtersChanged = JSON.stringify(state.currentFilters) !== JSON.stringify(filters || {})
            if (filtersChanged) {
              console.log("🔧 SETTING FILTERS:", filters)
              state.currentFilters = { ...filters }
            }
          }),

        setCurrentPage: (page) =>
          set((state) => {
            const validPage = Math.max(1, Math.floor(page))
            if (state.currentPage !== validPage) {
              console.log("📄 SETTING PAGE:", validPage)
              state.currentPage = validPage
            }
          }),

        setHydrated: () =>
          set((state) => {
            console.log("🔄 STORE HYDRATED")
            state._hasHydrated = true
          }),

        // Cache functions (same as before)
        hasDataForQuery: (searchQuery, filters, page) => {
          const state = get()
          const cacheKey = generateCacheKey(searchQuery, filters, page)
          const cached = state.cache[cacheKey]

          if (!cached) {
            console.log("❌ NO CACHE for:", cacheKey)
            return false
          }

          const now = Date.now()
          const isExpired = now - cached.timestamp > state.cacheTimeout

          if (isExpired) {
            console.log("⏰ CACHE EXPIRED for:", cacheKey)
            return false
          }

          console.log("✅ VALID CACHE EXISTS for:", cacheKey, `(${cached.data.length} items)`)
          return true
        },

        getCachedData: (searchQuery, filters, page) => {
          const state = get()
          const cacheKey = generateCacheKey(searchQuery, filters, page)
          const cached = state.cache[cacheKey]

          if (!cached) {
            console.log("❌ CACHE MISS for:", cacheKey)
            return null
          }

          const now = Date.now()
          const isExpired = now - cached.timestamp > state.cacheTimeout

          if (isExpired) {
            console.log("⏰ REMOVING EXPIRED CACHE for:", cacheKey)
            set((state) => {
              delete state.cache[cacheKey]
              delete state.lastSuccessfulFetch[cacheKey]
            })
            return null
          }

          console.log("🎯 CACHE HIT - USING CACHED DATA for:", cacheKey, `(${cached.data.length} items)`)
          return cached
        },

        setCachedData: (searchQuery, filters, page, data, pagination) =>
          set((state) => {
            const cacheKey = generateCacheKey(searchQuery, filters, page)
            console.log("💾 CACHING DATA for:", cacheKey, `(${data.length} items)`)

            state.cache[cacheKey] = {
              data: [...data],
              pagination: { ...pagination },
              timestamp: Date.now(),
              searchQuery: searchQuery || "",
              filters: { ...filters },
            }

            state.lastSuccessfulFetch[cacheKey] = Date.now()
          }),

        clearCache: () =>
          set((state) => {
            console.log("🗑️ CLEARING ALL CACHE")
            state.cache = {}
            state.lastSuccessfulFetch = {}
          }),

        clearExpiredCache: () =>
          set((state) => {
            const now = Date.now()
            const { cacheTimeout } = get()
            let removedCount = 0

            Object.keys(state.cache).forEach((key) => {
              if (now - state.cache[key].timestamp > cacheTimeout) {
                delete state.cache[key]
                delete state.lastSuccessfulFetch[key]
                removedCount++
              }
            })

            if (removedCount > 0) {
              console.log("🧹 REMOVED", removedCount, "expired cache entries")
            }
          }),

        // University details
        getUniversityById: (id) => {
          const state = get()
          return state.universityDetails[id] || null
        },

        setUniversityDetails: (university) =>
          set((state) => {
            console.log("💾 CACHING UNIVERSITY DETAILS:", university.name)
            console.log("💾 University careerOutcomes being cached:", university.careerOutcomes)
            console.log("💾 University careerOutcomes length:", university.careerOutcomes?.length)
            state.universityDetails[university.id] = university
            console.log("💾 Cached university careerOutcomes:", state.universityDetails[university.id].careerOutcomes)
          }),

        // IMPROVED: Main fetch function with better loading state management
        fetchUniversities: async (searchQuery = "", filters = {}, page = 1, options = {}) => {
          const { forceRefresh = false, silent = false } = options
          const state = get()

          // Don't fetch during SSR
          if (typeof window === "undefined") {
            console.log("⏸️ SKIPPING FETCH - SSR")
            return
          }

          const cacheKey = generateCacheKey(searchQuery, filters, page)
          console.log("🎯 FETCH REQUEST for:", cacheKey, { forceRefresh, silent })

          // Check cache FIRST unless explicitly forcing refresh
          if (!forceRefresh) {
            const cached = state.getCachedData(searchQuery, filters, page)
            if (cached) {
              console.log("🚀 USING CACHED DATA - NO SERVER CALL for:", cacheKey)
              set((state) => {
                state.universities = [...cached.data]
                state.pagination = { ...cached.pagination }
                state.currentSearchQuery = searchQuery
                state.currentFilters = { ...filters }
                state.currentPage = page
                state.isLoading = false
                state.isInitialLoading = false
                state.isFetchingPage = false
                state.isRefreshing = false
                state.error = null
              })
              return
            }
          }

          // Check for active request to prevent duplicates - USING ARRAY INSTEAD OF SET
          if (state.activeRequests.includes(cacheKey)) {
            console.log("⏳ REQUEST ALREADY IN PROGRESS for:", cacheKey)
            return
          }

          // Rate limiting
          const lastFetch = state.lastSuccessfulFetch[cacheKey]
          if (lastFetch && Date.now() - lastFetch < 3000 && !forceRefresh) {
            console.log("🚫 RATE LIMITED - too soon since last fetch for:", cacheKey)
            return
          }

          console.log("🌐 MAKING SERVER CALL for:", cacheKey)

          // Add to active requests - USING ARRAY PUSH
          set((state) => {
            state.activeRequests.push(cacheKey)
          })

          try {
            // IMPROVED: Determine loading type based on current state
            let loadingType: "initial" | "page" | "refresh" = "initial"

            if (forceRefresh) {
              loadingType = "refresh"
            } else if (state.universities.length > 0) {
              loadingType = "page"
            } else {
              loadingType = "initial"
            }

            // Set loading state if not silent
            if (!silent) {
              set((state) => {
                state.setLoading(true, loadingType)
                state.error = null
                state.currentSearchQuery = searchQuery
                state.currentFilters = { ...filters }
                state.currentPage = page
              })
            } else {
              set((state) => {
                state.currentSearchQuery = searchQuery
                state.currentFilters = { ...filters }
                state.currentPage = page
              })
            }

            const url = buildApiUrl(searchQuery, filters, page)
            const response: ApiResponse = await fetcher(url)

            if (!response || !response.universities || !Array.isArray(response.universities)) {
              throw new Error("Invalid response format")
            }

            console.log("✅ SERVER FETCH SUCCESS for:", cacheKey, response.universities.length, "universities")

            // Update store with new data
            set((state) => {
              state.universities = [...response.universities]
              state.pagination = { ...response.pagination }
              state.isLoading = false
              state.isInitialLoading = false
              state.isFetchingPage = false
              state.isRefreshing = false
              state.error = null
            })

            // Cache the data immediately
            state.setCachedData(searchQuery, filters, page, response.universities, response.pagination)

            // Cache individual university details
            response.universities.forEach((university: UniversityInterface) => {
              state.setUniversityDetails(university)
            })
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to fetch universities"
            console.error("❌ FETCH ERROR for:", cacheKey, errorMessage)

            set((state) => {
              state.error = errorMessage
              state.isLoading = false
              state.isInitialLoading = false
              state.isFetchingPage = false
              state.isRefreshing = false
            })

            // If network error and we have cached data, use it
            if (errorMessage.includes("timed out") || errorMessage.includes("network")) {
              const cached = state.getCachedData(searchQuery, filters, page)
              if (cached) {
                console.log("🔄 USING CACHED DATA due to network error")
                set((state) => {
                  state.universities = [...cached.data]
                  state.pagination = { ...cached.pagination }
                  state.error = "Showing cached results (network error)"
                })
              }
            }
          } finally {
            // Remove from active requests - USING ARRAY FILTER
            set((state) => {
              state.activeRequests = state.activeRequests.filter((req) => req !== cacheKey)
            })
          }
        },

        // ENHANCED: Fetch individual university by slug with multiple endpoint attempts
        fetchUniversityById: async (slug, forceRefresh = false) => {
          const state = get()

          if (typeof window === "undefined" || !slug || typeof slug !== "string") {
            return null
          }

          console.log("🎯 FETCH UNIVERSITY BY SLUG:", slug, { forceRefresh })

          // Check cache first unless forcing refresh
          if (!forceRefresh) {
            const cached = state.getUniversityById(slug)
            if (cached) {
              console.log("✅ Using cached university details for:", slug, cached.name)
              return cached
            }

            // Also check if it exists in the main universities array
            const foundInMain = state.universities.find(
              (uni) =>
                uni.id === slug ||
                uni.slug === slug ||
                uni.name.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase() ||
                uni.name.toLowerCase().replace(/[^a-z0-9]/g, "-") === slug.toLowerCase(),
            )
            if (foundInMain) {
              console.log("✅ Found university in main array:", foundInMain.name)
              state.setUniversityDetails(foundInMain)
              return foundInMain
            }
          }

          // Check for active request to prevent duplicates - USING ARRAY INCLUDES
          const requestKey = `university-${slug}`
          if (state.activeRequests.includes(requestKey)) {
            console.log("⏳ UNIVERSITY REQUEST ALREADY IN PROGRESS for:", slug)
            return null
          }

          try {
            // Add to active requests - USING ARRAY PUSH
            set((state) => {
              state.activeRequests.push(requestKey)
            })

            const baseUrl = window.location.origin

            // Try multiple endpoints - PRIORITIZING SLUG-BASED QUERIES
            const endpoints = [
              `${baseUrl}/api/universities?slug=${encodeURIComponent(slug)}`,
              `${baseUrl}/api/universities/${encodeURIComponent(slug)}`,
              `${baseUrl}/api/universities?id=${encodeURIComponent(slug)}`,
            ]

            for (const url of endpoints) {
              try {
                console.log("🌐 Trying university endpoint:", url)
                const result = await fetcher(url)

                if (result) {
                  let university: UniversityInterface | null = null

                  // Handle different response formats
                  if (result.university) {
                    university = result.university
                  } else if (
                    result.universities &&
                    Array.isArray(result.universities) &&
                    result.universities.length > 0
                  ) {
                    university = result.universities[0]
                  } else if (result.id) {
                    university = result
                  }

                  if (university && university.id) {
                    console.log("✅ Successfully fetched university:", university.name)
                    console.log("✅ University careerOutcomes in store:", university.careerOutcomes)
                    console.log("✅ University careerOutcomes length:", university.careerOutcomes?.length)
                    console.log("✅ University careerOutcomes type:", typeof university.careerOutcomes)
                    console.log("✅ University careerOutcomes isArray:", Array.isArray(university.careerOutcomes))
                    state.setUniversityDetails(university)
                    return university
                  }
                }
              } catch (endpointError) {
                console.log("❌ Error with endpoint:", url, endpointError)
                continue // Try next endpoint
              }
            }

            console.log("❌ All university endpoints failed for:", slug)
            return null
          } catch (error) {
            console.error("❌ Failed to fetch university:", error)
            return null
          } finally {
            // Remove from active requests - USING ARRAY FILTER
            set((state) => {
              state.activeRequests = state.activeRequests.filter((req) => req !== requestKey)
            })
          }
        },

        // Rest of the functions remain the same...
        invalidateCache: (searchQuery, filters) =>
          set((state) => {
            if (searchQuery !== undefined && filters !== undefined) {
              const keysToRemove: string[] = []
              Object.entries(state.cache).forEach(([key, value]) => {
                if (value.searchQuery === searchQuery && JSON.stringify(value.filters) === JSON.stringify(filters)) {
                  keysToRemove.push(key)
                }
              })
              keysToRemove.forEach((key) => {
                delete state.cache[key]
                delete state.lastSuccessfulFetch[key]
              })
              console.log("🗑️ INVALIDATED", keysToRemove.length, "specific cache entries")
            } else {
              console.log("🗑️ CLEARING ALL CACHE")
              state.cache = {}
              state.lastSuccessfulFetch = {}
            }
          }),

        getLoadingState: () => {
          const state = get()
          return {
            isLoading: state.isLoading,
            isInitialLoading: state.isInitialLoading,
            isFetchingPage: state.isFetchingPage,
            isRefreshing: state.isRefreshing,
          }
        },

        reset: () =>
          set((state) => {
            console.log("🔄 RESETTING STORE")
            state.cache = {}
            state.universities = []
            state.pagination = null
            state.isLoading = false
            state.error = null
            state.currentSearchQuery = ""
            state.currentFilters = {}
            state.currentPage = 1
            state.universityDetails = {}
            state.isInitialLoading = false
            state.isFetchingPage = false
            state.isRefreshing = false
            state.activeRequests = [] // RESET TO EMPTY ARRAY
            state.lastSuccessfulFetch = {}
          }),

        updateUniversityOptimistic: (id, updates) =>
          set((state) => {
            const universityIndex = state.universities.findIndex((u) => u.id === id)
            if (universityIndex !== -1) {
              state.universities[universityIndex] = { ...state.universities[universityIndex], ...updates }
            }

            if (state.universityDetails[id]) {
              state.universityDetails[id] = { ...state.universityDetails[id], ...updates }
            }
          }),

        revertOptimisticUpdate: (id) =>
          set((state) => {
            console.warn("⚠️ Optimistic update revert not implemented for ID:", id)
          }),

        debugCacheState: () => {
          const state = get()
          console.log("🔍 Cache Debug:", {
            cacheKeys: Object.keys(state.cache),
            cacheCount: Object.keys(state.cache).length,
            universityDetailsCount: Object.keys(state.universityDetails).length,
            activeRequests: state.activeRequests, // NOW ARRAY
            lastFetchTimes: state.lastSuccessfulFetch,
          })
        },

        debugStoreState: () => {
          const state = get()
          console.log("🔍 Store Debug:", {
            hasHydrated: state._hasHydrated,
            universitiesCount: state.universities.length,
            universityDetailsCount: Object.keys(state.universityDetails).length,
            isLoading: state.isLoading,
            isInitialLoading: state.isInitialLoading,
            isFetchingPage: state.isFetchingPage,
            isRefreshing: state.isRefreshing,
            error: state.error,
            currentQuery: state.currentSearchQuery,
            currentFilters: state.currentFilters,
            currentPage: state.currentPage,
          })
        },
      })),
      {
        name: "university-store",
        storage: createJSONStorage(() => {
          try {
            return localStorage
          } catch (error) {
            console.error("❌ localStorage not available:", error)
            // Fallback to memory storage
            const memoryStorage = new Map()
            return {
              getItem: (key: string) => memoryStorage.get(key) || null,
              setItem: (key: string, value: string) => {
                try {
                  memoryStorage.set(key, value)
                } catch (e) {
                  console.warn("⚠️ Memory storage failed:", e)
                }
              },
              removeItem: (key: string) => memoryStorage.delete(key),
            }
          }
        }),
        partialize: (state) => {
          try {
            // Limit cache entries to prevent quota exceeded error
            const cacheEntries = Object.entries(state.cache || {})
            const recentCache = cacheEntries
              .sort(([,a], [,b]) => b.timestamp - a.timestamp)
              .slice(0, 10) // Reduced from 30 to 10 most recent searches
            
            const limitedCache = Object.fromEntries(recentCache)
            
            // Keep only 20 most recent university details (reduced from 50)
            const universityEntries = Object.entries(state.universityDetails || {})
            const limitedUniversityDetails = Object.fromEntries(universityEntries.slice(-20))
            
            // Keep only recent lastSuccessfulFetch entries
            const fetchEntries = Object.entries(state.lastSuccessfulFetch || {})
            const limitedFetchEntries = Object.fromEntries(fetchEntries.slice(-10))
            
            const dataToStore = {
              cache: limitedCache,
              universityDetails: limitedUniversityDetails,
              currentFilters: state.currentFilters,
              currentSearchQuery: state.currentSearchQuery,
              currentPage: state.currentPage,
              lastSuccessfulFetch: limitedFetchEntries,
            }
            
            // Additional safety check - if data is still too large, store minimal data
            const serialized = JSON.stringify(dataToStore)
            if (serialized.length > 4000000) { // ~4MB limit (localStorage is usually 5-10MB)
              console.warn("⚠️ Data too large, storing minimal cache")
              return {
                cache: Object.fromEntries(recentCache.slice(0, 3)), // Only 3 most recent
                universityDetails: Object.fromEntries(universityEntries.slice(-5)), // Only 5 most recent
                currentFilters: state.currentFilters,
                currentSearchQuery: state.currentSearchQuery,
                currentPage: state.currentPage,
                lastSuccessfulFetch: Object.fromEntries(fetchEntries.slice(-3)),
              }
            }
            
            return dataToStore
          } catch (error) {
            console.error("❌ Error in partialize:", error)
            // Return minimal data on error
            return {
              cache: {},
              universityDetails: {},
              currentFilters: state.currentFilters || {},
              currentSearchQuery: state.currentSearchQuery || "",
              currentPage: state.currentPage || 1,
              lastSuccessfulFetch: {},
            }
          }
        },
        onRehydrateStorage: () => {
          console.log("🔄 STARTING REHYDRATION...")
          return (state, error) => {
            if (error) {
              console.error("❌ REHYDRATION ERROR:", error)
              return
            }

            if (state) {
              // Set hydration flag
              state._hasHydrated = true

              // Reset transient state
              state.isLoading = false
              state.isInitialLoading = false
              state.isFetchingPage = false
              state.isRefreshing = false
              state.error = null
              state.activeRequests = [] // RESET TO EMPTY ARRAY

              console.log("✅ STORE REHYDRATED with", Object.keys(state.cache || {}).length, "cached entries")

              // Clean expired cache immediately
              const now = Date.now()
              let removedCount = 0
              Object.keys(state.cache).forEach((key) => {
                if (now - state.cache[key].timestamp > state.cacheTimeout) {
                  delete state.cache[key]
                  delete state.lastSuccessfulFetch[key]
                  removedCount++
                }
              })

              if (removedCount > 0) {
                console.log("🧹 REMOVED", removedCount, "expired cache entries during rehydration")
              }

              console.log("🚀 STORE READY with", Object.keys(state.cache || {}).length, "valid cache entries")
            }
          }
        },
        version: 15,
        migrate: (persistedState: any, version: number) => {
          console.log("🔄 MIGRATING STORE from version", version, "to 15")
          return {
            ...persistedState,
            isLoading: false,
            isInitialLoading: false,
            isFetchingPage: false,
            isRefreshing: false,
            error: null,
            _hasHydrated: false,
            activeRequests: [], // MIGRATE TO ARRAY
            cacheTimeout: 30 * 60 * 1000,
            cache: persistedState?.cache || {},
            universityDetails: persistedState?.universityDetails || {},
            lastSuccessfulFetch: persistedState?.lastSuccessfulFetch || {},
          }
        },
      },
    ),
    { name: "university-store" },
  ),
)

// Selectors and Actions (same as before)
export const useUniversitySelectors = () => {
  const universities = useUniversityStore((state) => state.universities)
  const pagination = useUniversityStore((state) => state.pagination)
  const error = useUniversityStore((state) => state.error)
  const currentSearchQuery = useUniversityStore((state) => state.currentSearchQuery)
  const currentFilters = useUniversityStore((state) => state.currentFilters)
  const currentPage = useUniversityStore((state) => state.currentPage)
  const hasHydrated = useUniversityStore((state) => state._hasHydrated)
  const universityDetails = useUniversityStore((state) => state.universityDetails)

  const isLoading = useUniversityStore((state) => state.isLoading)
  const isInitialLoading = useUniversityStore((state) => state.isInitialLoading)
  const isFetchingPage = useUniversityStore((state) => state.isFetchingPage)
  const isRefreshing = useUniversityStore((state) => state.isRefreshing)

  return {
    universities,
    pagination,
    isLoading,
    isInitialLoading,
    isFetchingPage,
    isRefreshing,
    error,
    currentSearchQuery,
    currentFilters,
    currentPage,
    hasHydrated,
    universityDetails,
  }
}

export const useUniversityActions = () => {
  const fetchUniversities = useUniversityStore((state) => state.fetchUniversities)
  const fetchUniversityById = useUniversityStore((state) => state.fetchUniversityById)
  const setSearchQuery = useUniversityStore((state) => state.setSearchQuery)
  const setFilters = useUniversityStore((state) => state.setFilters)
  const setCurrentPage = useUniversityStore((state) => state.setCurrentPage)
  const clearCache = useUniversityStore((state) => state.clearCache)
  const clearExpiredCache = useUniversityStore((state) => state.clearExpiredCache)
  const invalidateCache = useUniversityStore((state) => state.invalidateCache)
  const getUniversityById = useUniversityStore((state) => state.getUniversityById)
  const getCachedData = useUniversityStore((state) => state.getCachedData)
  const hasDataForQuery = useUniversityStore((state) => state.hasDataForQuery)
  const reset = useUniversityStore((state) => state.reset)
  const updateUniversityOptimistic = useUniversityStore((state) => state.updateUniversityOptimistic)
  const setHydrated = useUniversityStore((state) => state.setHydrated)

  return {
    fetchUniversities,
    fetchUniversityById,
    setSearchQuery,
    setFilters,
    setCurrentPage,
    clearCache,
    clearExpiredCache,
    invalidateCache,
    getUniversityById,
    getCachedData,
    hasDataForQuery,
    reset,
    updateUniversityOptimistic,
    setHydrated,
  }
}
