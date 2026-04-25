"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"

export interface StudentReview {
  id?: string
  name: string
  review: string
}

interface StudentReviewsFormProps {
  reviews: StudentReview[]
  onChange: (reviews: StudentReview[]) => void
  disabled?: boolean
  maxReviews?: number
}

export function StudentReviewsForm({
  reviews = [],
  onChange,
  disabled = false,
  maxReviews = 8,
}: StudentReviewsFormProps) {
  const [draft, setDraft] = useState<StudentReview>({ name: "", review: "" })

  const canAdd = useMemo(() => {
    return draft.name.trim().length > 0 && draft.review.trim().length > 0 && reviews.length < maxReviews
  }, [draft, reviews.length, maxReviews])

  const addReview = () => {
    if (!canAdd) return

    onChange([
      ...reviews,
      {
        id: crypto.randomUUID(),
        name: draft.name.trim(),
        review: draft.review.trim(),
      },
    ])
    setDraft({ name: "", review: "" })
  }

  const removeReview = (id?: string, index?: number) => {
    if (id) {
      onChange(reviews.filter((review) => review.id !== id))
      return
    }

    if (typeof index === "number") {
      onChange(reviews.filter((_, i) => i !== index))
    }
  }

  const updateReview = (index: number, patch: Partial<StudentReview>) => {
    onChange(reviews.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Student Reviews</h3>
        <p className="text-sm text-gray-500 mt-1">These are shown in the &quot;What Our Students Say&quot; section.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Student Name"
          placeholder="e.g. Alex Johnson"
          value={draft.name}
          onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
          disabled={disabled}
        />

        <div className="flex items-end">
          <Button type="button" onClick={addReview} disabled={disabled || !canAdd} className="w-full bg-[#3B367D] hover:bg-[#3B367D]/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Review
          </Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="review-draft" className="block text-sm font-medium text-gray-700">
          Review Text
        </label>
        <textarea
          id="review-draft"
          className="min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B367D] focus-visible:ring-offset-2"
          placeholder="Write the student review"
          value={draft.review}
          onChange={(e) => setDraft((prev) => ({ ...prev, review: e.target.value }))}
          disabled={disabled}
        />
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Added Reviews ({reviews.length})</h4>
          {reviews.map((item, index) => (
            <div key={item.id || index} className="border rounded-md p-3 space-y-3">
              <Input
                label="Name"
                value={item.name}
                onChange={(e) => updateReview(index, { name: e.target.value })}
                disabled={disabled}
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Review</label>
                <textarea
                  className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={item.review}
                  onChange={(e) => updateReview(index, { review: e.target.value })}
                  disabled={disabled}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeReview(item.id, index)}
                  disabled={disabled}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed p-4 text-sm text-gray-500">
          No student reviews added yet.
        </div>
      )}
    </div>
  )
}
