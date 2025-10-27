"use client"

import { useState, useEffect } from "react"
import { Loader2, FileText, X, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import BlogCard from "./BlogCard"
import { useAuth } from "@/app/context/AuthContext"
import Link from "next/link"

// Define the expected structure of blog data
interface Blog {
    url: string
    fileName: string
    uploadDate: string
    // Add any other fields that might be in the API response
    size?: number
    id?: string
    originalFileName?: string
}

export default function BlogList() {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
    const [showPdfDialog, setShowPdfDialog] = useState(false)
    const [previewBlog, setPreviewBlog] = useState<Blog | null>(null)
    const [showPreviewDialog, setShowPreviewDialog] = useState(false)

    const { user, isAuthenticated } = useAuth()

    // Fetch blogs from the server
    const fetchBlogs = async () => {
        try {
            setLoading(true)

            // Use the specified API endpoint
            const response = await fetch("/api/community/blog")

            if (!response.ok) {
                throw new Error(`Failed to fetch blogs: ${response.status}`)
            }

            const data = await response.json()
            console.log("Fetched blogs:", data) // Debug log

            // Check if data exists and is not empty
            if (!data || (Array.isArray(data) && data.length === 0)) {
                setBlogs([])
                return
            }

            // Process the data based on its structure
            let processedBlogs: Blog[] = []

            if (Array.isArray(data)) {
                // If data is already an array, use it directly
                processedBlogs = data.map((blog: any) => ({
                    url: blog.url || "",
                    fileName: blog.fileName || "Untitled Blog",
                    uploadDate: blog.uploadDate || new Date().toISOString(),
                    // Include any other fields from the API
                    ...blog,
                }))
            } else if (data && typeof data === "object") {
                // If data is an object, try to extract blogs array
                if (Array.isArray(data.blogs)) {
                    processedBlogs = data.blogs.map((blog: any) => ({
                        url: blog.url || "",
                        fileName: blog.fileName || "Untitled Blog",
                        uploadDate: blog.uploadDate || new Date().toISOString(),
                        ...blog,
                    }))
                } else {
                    // Try to convert object to array if it has blog-like properties
                    const keys = Object.keys(data)
                    if (keys.length > 0 && data[keys[0]] && typeof data[keys[0]] === "object") {
                        processedBlogs = Object.values(data).map((blog: any) => ({
                            url: blog.url || "",
                            fileName: blog.fileName || "Untitled Blog",
                            uploadDate: blog.uploadDate || new Date().toISOString(),
                            ...blog,
                        }))
                    }
                }
            }

            console.log("Processed blogs:", processedBlogs) // Debug processed blogs
            setBlogs(processedBlogs)
            setError(null)
        } catch (error) {
            console.error("Error fetching blogs:", error)
            setError("Failed to load blogs. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    const openPdf = (blog: Blog) => {
        setSelectedBlog(blog)
        setShowPdfDialog(true)
    }

    const previewPdf = (blog: Blog) => {
        setPreviewBlog(blog)
        setShowPreviewDialog(true)
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
                                fileName={blog.fileName || "Untitled Blog"}
                                uploadDate={blog.uploadDate || new Date().toISOString()}
                                onClick={() => openPdf(blog)}
                                onPreview={() => previewPdf(blog)}
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

            {/* PDF Preview Dialog */}
            <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
                <DialogContent className="h-[80vh] w-[90vw] max-w-5xl p-0">
                    <div className="relative h-full w-full">
                        {previewBlog && (
                            <iframe
                                src={`${previewBlog.url}#toolbar=0`}
                                title={formatTitle(previewBlog.fileName)}
                                className="h-full w-full"
                            />
                        )}
                        <Button
                            variant="outline"

                            className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white"
                            onClick={() => setShowPreviewDialog(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
