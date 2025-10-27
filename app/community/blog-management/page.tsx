"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { FileText, Upload, Trash2, AlertCircle, CheckCircle, X, Loader2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Blog {
  url: string
  fileName: string
  originalFileName: string
  uploadDate: string
  id: string // Unique identifier for the blog
}

export default function BlogManager() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isRenaming, setIsRenaming] = useState<string | null>(null)
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [customFileName, setCustomFileName] = useState("")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

  // Fetch blogs from the server
  const fetchBlogs = async () => {
    try {
      // Fetch blogs from the API
      const response = await fetch("/api/community/blog")

      if (!response.ok) {
        throw new Error(`Failed to fetch blogs: ${response.status}`)
      }

      const data = await response.json()

      console.log("blog data :",data)

      // Transform the data to match our interface
      const transformedBlogs = data.map((blog: any) => ({
        url: blog.url,
        fileName: blog.fileName,
        originalFileName: blog.fileName, // We don't have this info from the API
        uploadDate: blog.uploadDate,
        id: blog.url, // Use URL as ID since it's unique
      }))

      setBlogs(transformedBlogs)
    } catch (error) {
      console.error("Error fetching blogs:", error)
      showNotification("error", "Failed to fetch blogs")
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setCustomFileName(file.name.replace(/\.pdf$/i, ""))
    setShowUploadDialog(true)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      setIsUploading(true)
      const formData = new FormData()

      // Create a new file with the custom filename if it's different
      let fileToUpload = selectedFile
      if (customFileName && customFileName + ".pdf" !== selectedFile.name) {
        fileToUpload = new File([selectedFile], customFileName + ".pdf", {
          type: selectedFile.type,
        })
      }

      formData.append("file", fileToUpload)
      formData.append("type", "pdf")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload blog")
      }

      showNotification("success", "Blog uploaded successfully")
      setShowUploadDialog(false)
      setSelectedFile(null)
      setCustomFileName("")

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // Refresh the blog list
      fetchBlogs()
    } catch (error) {
      console.error("Upload error:", error)
      showNotification("error", error instanceof Error ? error.message : "Failed to upload blog")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (url: string) => {
    try {
      setIsDeleting(url)
      const response = await fetch("/api/upload", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileUrl: url }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete blog")
      }

      // Remove the blog from the list
      setBlogs((prev) => prev.filter((blog) => blog.url !== url))
      showNotification("success", "Blog deleted successfully")
    } catch (error) {
      console.error("Delete error:", error)
      showNotification("error", error instanceof Error ? error.message : "Failed to delete blog")
    } finally {
      setIsDeleting(null)
    }
  }

  const startRenaming = (blogId: string) => {
    setIsRenaming(blogId)
    // Focus the input field after rendering
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus()
      }
    }, 0)
  }

  const handleRename = async (blog: Blog, newFileName: string) => {
    try {
      if (!newFileName.trim()) {
        throw new Error("Filename cannot be empty")
      }

      setIsRenaming(blog.id)

      // Ensure the filename has .pdf extension
      const formattedFileName = newFileName.endsWith(".pdf") ? newFileName : newFileName + ".pdf"

      // Call the rename API
      const response = await fetch("/api/community/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUrl: blog.url,
          newFileName: formattedFileName,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to rename blog")
      }

      // Update the blog in the list
      setBlogs((prev) =>
        prev.map((b) => (b.id === blog.id ? { ...b, fileName: formattedFileName, url: result.url } : b)),
      )

      showNotification("success", "Blog renamed successfully")
    } catch (error) {
      console.error("Rename error:", error)
      showNotification("error", error instanceof Error ? error.message : "Failed to rename blog")
    } finally {
      setIsRenaming(null)
    }
  }

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    // Auto-dismiss after 5 seconds
    setTimeout(() => setNotification(null), 5000)
  }

  const cancelUpload = () => {
    setShowUploadDialog(false)
    setSelectedFile(null)
    setCustomFileName("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className=" w-screen mx-auto py-32 px-32">
      {notification && (
        <Alert
          className={`relative ${
            notification.type === "success"
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <Button
            variant="ghost"
           
            className="absolute right-2 top-2 h-6 w-6 rounded-full p-0"
            onClick={() => setNotification(null)}
          >
            <X className="h-4 w-4" />
          </Button>
          {notification.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{notification.type === "success" ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      <Card className="">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="blog-pdf">Upload Blog PDF</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="blog-pdf"
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  disabled={isUploading}
                  className="flex-1"
                />
              </div>
              <p className="text-sm text-muted-foreground">Maximum file size: 20MB. Only PDF files are accepted.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Blog PDF</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="original-filename">Original Filename</Label>
              <Input id="original-filename" value={selectedFile?.name || ""} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-filename">Custom Filename (without extension)</Label>
              <Input
                id="custom-filename"
                value={customFileName}
                onChange={(e) => setCustomFileName(e.target.value)}
                placeholder="Enter custom filename"
              />
              <p className="text-sm text-muted-foreground">
                This will be displayed as the blog title. The .pdf extension will be added automatically.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelUpload} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading || !customFileName.trim()}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div>
        <h2 className="text-xl font-semibold mb-4">Uploaded Blogs</h2>
        {blogs.length === 0 ? (
          <div className="text-center py-8 bg-muted/30 rounded-lg">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">No blogs uploaded yet</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead className="w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium">
                      {isRenaming === blog.id ? (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <Input
                            ref={editInputRef}
                            defaultValue={blog.fileName.replace(/\.pdf$/i, "")}
                            className="h-8 py-1"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleRename(blog, e.currentTarget.value)
                              } else if (e.key === "Escape") {
                                setIsRenaming(null)
                              }
                            }}
                            onBlur={(e) => handleRename(blog, e.target.value)}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <a
                            href={blog.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-blue-600"
                          >
                            {blog.fileName}
                          </a>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{new Date(blog.uploadDate).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {isRenaming !== blog.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startRenaming(blog.id)}
                            disabled={isRenaming !== null}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          
                          size="sm"
                          onClick={() => handleDelete(blog.url)}
                          disabled={isDeleting === blog.url}
                        >
                          {isDeleting === blog.url ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
