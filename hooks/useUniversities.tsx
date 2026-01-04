"use client"

import { useEffect, useCallback, useRef, useMemo } from "react"
import {
  useUniversitySelectors,
  useUniversityActions,
  type FilterValues,
  type UniversityInterface,
} from "@/store/universitystore"
import { useAuth } from "@/app/context/AuthContext"

interface UseUniversitiesOptions {
  searchQuery?: string
  filters?: FilterValues
  initialPage?: number
  autoFetch?: boolean
  providedUniversities?: UniversityInterface[]
  providedIsLoading?: boolean
  providedError?: string | null
  enableDebounce?: boolean
  debounceMs?: number
}

interface UseUniversitiesReturn {
  // Data
  universities: UniversityInterface[]
  currentUniversities: UniversityInterface[]
  pagination: any
  totalPages: number

  // Loading states
  isLoading: boolean
  isInitialLoading: boolean
  isFetchingPage: boolean
  isRefreshing: boolean
  showLoader: boolean

  // Error state
  error: string | null

  // Current state
  currentPage: number
  currentSearchQuery: string
  currentFilters: FilterValues

  // Actions
  handlePageChange: (page: number) => void
  handleSearch: (query: string, filters?: FilterValues) => void
  handleFiltersChange: (filters: FilterValues) => void
  refreshData: () => void
  clearError: () => void
  setModalInteraction: (isInteracting: boolean) => void

  // Utility
  hasData: boolean
  isEmpty: boolean
  isUsingProvidedData: boolean
  canLoadMore: boolean
  isHydrated: boolean
}

export const useUniversities = (options: UseUniversitiesOptions = {}): UseUniversitiesReturn => {
  const {
    searchQuery = "",
    filters = {},
    initialPage = 1,
    autoFetch = true,
    providedUniversities,
    providedIsLoading = false,
    providedError = null,
    enableDebounce = true,
    debounceMs = 500,
  } = options

  // Store selectors and actions
  const {
    universities: storeUniversities,
    pagination,
    isLoading: storeIsLoading,
    isInitialLoading,
    isFetchingPage,
    isRefreshing,
    error: storeError,
    currentSearchQuery,
    currentFilters,
    currentPage,
    hasHydrated,
  } = useUniversitySelectors()

  const { fetchUniversities, setSearchQuery, setFilters, setCurrentPage, clearExpiredCache, hasDataForQuery } =
    useUniversityActions()

  // Auth context
  const { isAuthenticated } = useAuth()

  // Refs for tracking
  const isModalInteractionRef = useRef(false)
  const debounceTimeoutRef = useRef<NodeJS.Timeout>()
  const authStateRef = useRef(isAuthenticated)
  const hasInitializedRef = useRef(false)
  const lastFetchParamsRef = useRef<string>("")
  const lastProcessedSearchRef = useRef<string>("")
  const lastProcessedFiltersRef = useRef<string>("")

  // Determine if using provided data
  const isUsingProvidedData = useMemo(() => {
    return Array.isArray(providedUniversities) && providedUniversities.length > 0
  }, [providedUniversities])

  // Select appropriate data source
  const universities = isUsingProvidedData ? providedUniversities! : storeUniversities
  const isLoading = isUsingProvidedData ? providedIsLoading : storeIsLoading
  const error = isUsingProvidedData ? providedError : storeError

  // Computed values
  const totalPages = pagination?.pages || 1
  const hasData = universities.length > 0
  const isEmpty = !isLoading && !hasData && !error
  const canLoadMore = pagination ? currentPage < pagination.pages : false

  // IMPROVED: Show loader logic - show skeleton during initial load or when no data and loading
  const showLoader = useMemo(() => {
    if (isModalInteractionRef.current || isUsingProvidedData) {
      return isUsingProvidedData ? providedIsLoading : false
    }

    // Show loader in these cases:
    // 1. Store hasn't hydrated yet
    // 2. Initial loading (first time loading data)
    // 3. Loading and no data available (prevents flash of "no data" message)
    // 4. Refreshing data
    return !hasHydrated || isInitialLoading || (storeIsLoading && !hasData) || isRefreshing
  }, [isUsingProvidedData, providedIsLoading, hasHydrated, isInitialLoading, storeIsLoading, hasData, isRefreshing])

  const currentUniversities = universities

  // BULLETPROOF fetch function
  const performFetch = useCallback(
    (query: string, filters: FilterValues, page: number, options: any = {}) => {
      if (isUsingProvidedData || isModalInteractionRef.current) {
        return
      }

      // Create unique params string to prevent duplicate calls
      const paramsString = JSON.stringify({ query, filters, page, options })
      if (paramsString === lastFetchParamsRef.current && !options.forceRefresh) {
        return
      }

      // Clear existing debounce
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }

      const doFetch = () => {
        lastFetchParamsRef.current = paramsString
        fetchUniversities(query, filters, page, options)
      }

      // Use debounce for search, immediate for page changes and refreshes
      if (enableDebounce && !options.forceRefresh && !options.immediate) {
        debounceTimeoutRef.current = setTimeout(doFetch, debounceMs)
      } else {
        doFetch()
      }
    },
    [isUsingProvidedData, fetchUniversities, enableDebounce, debounceMs],
  )

  // Action handlers
  const handlePageChange = useCallback(
    (page: number) => {
      if (isUsingProvidedData || isModalInteractionRef.current) return

      const validPage = Math.max(1, Math.floor(page))
      if (validPage === currentPage) return

      setCurrentPage(validPage)
      performFetch(currentSearchQuery, currentFilters, validPage, { immediate: true })
      
      // Scroll to top of page after page change
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    },
    [isUsingProvidedData, currentPage, currentSearchQuery, currentFilters, setCurrentPage, performFetch],
  )

  const handleSearch = useCallback(
    (query: string, newFilters?: FilterValues) => {
      if (isUsingProvidedData || isModalInteractionRef.current) return

      const trimmedQuery = (query || "").trim()
      const filtersToUse = newFilters || currentFilters


      setSearchQuery(trimmedQuery)
      if (newFilters) {
        setFilters(filtersToUse)
      }
      setCurrentPage(1)

      performFetch(trimmedQuery, filtersToUse, 1)
      
      // Scroll to top of page after search/filter change
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    },
    [isUsingProvidedData, currentFilters, setSearchQuery, setFilters, setCurrentPage, performFetch],
  )

  const handleFiltersChange = useCallback(
    (newFilters: FilterValues) => {
      if (isUsingProvidedData || isModalInteractionRef.current) return

      setFilters(newFilters)
      setCurrentPage(1)
      performFetch(currentSearchQuery, newFilters, 1)
      
      // Scroll to top of page after filter change
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    },
    [isUsingProvidedData, currentSearchQuery, setFilters, setCurrentPage, performFetch],
  )

  const refreshData = useCallback(() => {
    if (isUsingProvidedData || isModalInteractionRef.current) return
    performFetch(currentSearchQuery, currentFilters, currentPage, { forceRefresh: true, immediate: true })
  }, [isUsingProvidedData, currentSearchQuery, currentFilters, currentPage, performFetch])

  const clearError = useCallback(() => {
  }, [])

  const setModalInteraction = useCallback((isInteracting: boolean) => {
    isModalInteractionRef.current = isInteracting
  }, [])

  // SINGLE initialization effect - IMPROVED
  useEffect(() => {
    if (isUsingProvidedData || hasInitializedRef.current) {
      return
    }


    hasInitializedRef.current = true

    // Wait for hydration
    if (!hasHydrated) {
      return
    }

    // Sync store state with props
    if (searchQuery !== currentSearchQuery) {
      setSearchQuery(searchQuery)
    }

    if (JSON.stringify(filters) !== JSON.stringify(currentFilters)) {
      setFilters(filters)
    }

    if (initialPage !== currentPage) {
      setCurrentPage(initialPage)
    }

    // Auto-fetch if enabled
    if (autoFetch) {
      // Check if we have cached data first - CRITICAL CHECK
      const hasCachedData = hasDataForQuery(searchQuery, filters, initialPage)

      if (hasCachedData) {
        // Load from cache without making API call
        performFetch(searchQuery, filters, initialPage, { immediate: true, silent: true })
      } else {
        performFetch(searchQuery, filters, initialPage, { immediate: true })
      }
    }
  }, [
    isUsingProvidedData,
    hasHydrated,
    searchQuery,
    filters,
    initialPage,
    autoFetch,
    currentSearchQuery,
    currentFilters,
    currentPage,
    hasDataForQuery,
    setSearchQuery,
    setFilters,
    setCurrentPage,
    performFetch,
  ])

  // Watch for prop changes after initialization and trigger fetch
  useEffect(() => {
    if (isUsingProvidedData || !hasInitializedRef.current || !hasHydrated) {
      return
    }

    // Serialize current props to compare with last processed
    const currentSearchStr = searchQuery || ""
    const currentFiltersStr = JSON.stringify(filters || {})
    
    // Check if we've already processed these exact values
    if (
      currentSearchStr === lastProcessedSearchRef.current &&
      currentFiltersStr === lastProcessedFiltersRef.current
    ) {
      return
    }

    // Check if search query or filters have changed from store state
    const searchChanged = searchQuery !== currentSearchQuery
    const filtersChanged = JSON.stringify(filters || {}) !== JSON.stringify(currentFilters || {})

    if (searchChanged || filtersChanged) {
      // Mark these values as processed to prevent infinite loops
      lastProcessedSearchRef.current = currentSearchStr
      lastProcessedFiltersRef.current = currentFiltersStr
      
      
      // Update store state
      if (searchChanged) {
        setSearchQuery(searchQuery)
      }
      if (filtersChanged) {
        setFilters(filters || {})
      }
      
      // Reset to page 1 when search or filters change
      setCurrentPage(1)
      
      // Trigger fetch with new params
      performFetch(searchQuery, filters || {}, 1, { immediate: true })
      
      // Scroll to top of page after search/filter change
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    }
  }, [
    isUsingProvidedData,
    hasHydrated,
    searchQuery,
    filters,
    currentSearchQuery,
    currentFilters,
    setSearchQuery,
    setFilters,
    setCurrentPage,
    performFetch,
  ])

  // Auth state change effect
  useEffect(() => {
    if (isUsingProvidedData) {
      authStateRef.current = isAuthenticated
      return
    }

    // Only refresh if auth state changed and we have something to refresh
    if (
      authStateRef.current !== isAuthenticated &&
      (hasData || currentSearchQuery || Object.keys(currentFilters).length > 0)
    ) {
      authStateRef.current = isAuthenticated
      performFetch(currentSearchQuery, currentFilters, currentPage, { forceRefresh: true, immediate: true })
    } else {
      authStateRef.current = isAuthenticated
    }
  }, [isAuthenticated, isUsingProvidedData, hasData, currentSearchQuery, currentFilters, currentPage, performFetch])

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  // Periodic cache cleanup
  useEffect(() => {
    if (isUsingProvidedData) return

    const interval = setInterval(
      () => {
        clearExpiredCache()
      },
      15 * 60 * 1000,
    ) // Every 15 minutes

    return () => clearInterval(interval)
  }, [isUsingProvidedData, clearExpiredCache])

  return {
    // Data
    universities,
    currentUniversities,
    pagination,
    totalPages,

    // Loading states
    isLoading,
    isInitialLoading,
    isFetchingPage,
    isRefreshing,
    showLoader,

    // Error state
    error,

    // Current state
    currentPage,
    currentSearchQuery,
    currentFilters,

    // Actions
    handlePageChange,
    handleSearch,
    handleFiltersChange,
    refreshData,
    clearError,
    setModalInteraction,

    // Utility
    hasData,
    isEmpty,
    isUsingProvidedData,
    canLoadMore,
    isHydrated: hasHydrated,
  }
}
