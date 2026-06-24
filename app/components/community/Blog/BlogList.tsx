"use client"

import { useState, useEffect, useCallback } from "react"
import { Loader2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import BlogCard from "./BlogCard"
import { useAuth } from "@/app/context/AuthContext"
import Link from "next/link"

// Define the expected structure of blog data
interface Blog {
    id?: string
    title?: string
    url: string
    fileName: string
    uploadDate: string
    summary?: string
    coverImage?: string | null
    published?: boolean
    // Add any other fields that might be in the API response
    size?: number
    originalFileName?: string
}

export default function BlogList() {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
    const [showPdfDialog, setShowPdfDialog] = useState(false)

    const { user, isAuthenticated } = useAuth()

    // Fetch blogs from the server
    const fetchBlogs = useCallback(async () => {
        try {
            setLoading(true)

            // Use the specified API endpoint
            const response = await fetch("/api/community/blog")

            if (!response.ok) {
                throw new Error(`Failed to fetch blogs: ${response.status}`)
            }

            const data = await response.json()

            // Check if data exists and is not empty
            if (!data || (Array.isArray(data) && data.length === 0)) {
                setBlogs([])
                return
            }

            const processedBlogs: Blog[] = Array.isArray(data)
                ? data.map((blog: Blog) => ({
                    ...blog,
                    url: blog.url || "",
                    fileName: blog.fileName || blog.title || "Untitled Blog",
                    uploadDate: blog.uploadDate || new Date().toISOString(),
                }))
                : []

            setBlogs(processedBlogs)
            setError(null)
        } catch (error) {
            console.error("Error fetching blogs:", error)
            setError("Failed to load blogs. Please try again later.")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchBlogs()
    }, [fetchBlogs])

    const openPdf = (blog: Blog) => {
        setSelectedBlog(blog)
        setShowPdfDialog(true)
    }

    // Format the title from filename
    const formatTitle = (fileName: string) => {
        if (!fileName) return "Untitled Blog"

        return fileName
            .replace(/\.pdf$/i, "")
            .replace(/-/g, " ")
            .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading blogs...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="py-10 text-center text-red-500">
                <p>{error}</p>
                <Button variant="outline" className="mt-4" onClick={fetchBlogs}>
                    Try Again
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-8 h-full mt-10 w-full mb-10">

            {blogs.length === 0 ? (
                <div className="rounded-lg bg-muted/20 py-16 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="mt-4 text-xl text-muted-foreground">No blogs available</p>
                </div>
            ) : (
                <>
                    <div className="flex flex-row items-start justify-between w-[90%] mx-auto ">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-2">
                        Blogs we have
                        </h1>
                        {isAuthenticated && user?.role === "ADMIN" && (
                            <Link
                                href="/community/blog-management"
                                className="px-3 sm:px-4 lg:px-6 py-2 text-sm lg:text-base bg-[#5D4A9C] text-white rounded-lg hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                            >
                                {/* <Building2 className="w-5 h-5" /> */}
                                <span className="hidden sm:inline">Manage Blogs</span>
                            </Link>
                        )}
                    </div>
                    <div className="w-[90%] mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">

                        {blogs.map((blog, index) => (
                            <BlogCard
                                key={blog.url || `blog-${index}`}
                                url={blog.url || ""}
                                fileName={blog.title || "Untitled Blog"}
                                uploadDate={blog.uploadDate || new Date().toISOString()}
                                thumbnail={blog.coverImage || null}
                                onClick={() => openPdf(blog)}
                                onPreview={() => openPdf(blog)}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* PDF Viewer Dialog */}
            <Dialog open={showPdfDialog} onOpenChange={setShowPdfDialog}>
                <DialogContent className="h-[90vh] w-[90vw] max-w-5xl p-0">
                    {selectedBlog && (
                        <iframe
                            src={`${selectedBlog.url}#toolbar=0`}
                            title={formatTitle(selectedBlog.fileName)}
                            className="h-full w-full"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
