import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Edit2, Save, X } from "lucide-react"
import { toast } from "sonner"

export interface FAQ {
  id: string
  question: string
  answer: string
}

interface FAQFormProps {
  faqs: FAQ[]
  onChange: (faqs: FAQ[]) => void
  disabled?: boolean
}

// Add default parameter to prevent undefined errors
export function FAQForm({ faqs = [], onChange, disabled = false }: FAQFormProps) {
  const [newFAQ, setNewFAQ] = useState<Omit<FAQ, 'id'>>({
    question: "",
    answer: "",
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null)

  console.log("this is faqs......")
  console.log("this is faqs......:",faqs)

  const handleAddFAQ = () => {
    if (!newFAQ.question.trim() || !newFAQ.answer.trim()) {
      toast.error("Please fill in both question and answer")
      return
    }

    const faq: FAQ = {
      id: Date.now().toString(),
      question: newFAQ.question.trim(),
      answer: newFAQ.answer.trim(),
    }

    onChange([...faqs, faq])
    setNewFAQ({ question: "", answer: "" })
    toast.success("FAQ added successfully")
  }

  const handleRemoveFAQ = (id: string) => {
    onChange(faqs.filter(faq => faq.id !== id))
    toast.success("FAQ removed")
  }

  const handleEditFAQ = (faq: FAQ) => {
    setEditingId(faq.id)
    setEditingFAQ({ ...faq })
  }

  const handleSaveEdit = () => {
    if (!editingFAQ || !editingFAQ.question.trim() || !editingFAQ.answer.trim()) {
      toast.error("Please fill in both question and answer")
      return
    }

    onChange(faqs.map(faq => 
      faq.id === editingId 
        ? { ...editingFAQ, question: editingFAQ.question.trim(), answer: editingFAQ.answer.trim() }
        : faq
    ))
    setEditingId(null)
    setEditingFAQ(null)
    toast.success("FAQ updated successfully")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingFAQ(null)
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Frequently Asked Questions</h3>
        <p className="text-sm text-gray-600">Add frequently asked questions and their answers for this university.</p>
      </div>

      {/* Add New FAQ Form */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-900">Add New FAQ</h4>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question *
            </label>
            <Input
              placeholder="Enter FAQ question"
              value={newFAQ.question}
              onChange={(e) => setNewFAQ(prev => ({ ...prev, question: e.target.value }))}
              disabled={disabled}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Answer *
            </label>
            <textarea
              className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3c387e] focus-visible:ring-offset-2"
              placeholder="Enter FAQ answer"
              value={newFAQ.answer}
              onChange={(e) => setNewFAQ(prev => ({ ...prev, answer: e.target.value }))}
              disabled={disabled}
            />
          </div>

          <Button
            type="button"
            onClick={handleAddFAQ}
            disabled={disabled || !newFAQ.question.trim() || !newFAQ.answer.trim()}
            className="bg-[#3c387e] hover:bg-[#3c387e]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add FAQ
          </Button>
        </div>
      </div>

      {/* Existing FAQs */}
      {faqs.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Added FAQs ({faqs.length})</h4>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white border rounded-lg p-4">
                {editingId === faq.id && editingFAQ ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question *
                      </label>
                      <Input
                        value={editingFAQ.question}
                        onChange={(e) => setEditingFAQ(prev => prev ? { ...prev, question: e.target.value } : null)}
                        disabled={disabled}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Answer *
                      </label>
                      <textarea
                        className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3c387e] focus-visible:ring-offset-2"
                        value={editingFAQ.answer}
                        onChange={(e) => setEditingFAQ(prev => prev ? { ...prev, answer: e.target.value } : null)}
                        disabled={disabled}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={handleSaveEdit}
                        disabled={disabled}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={disabled}
                        size="sm"
                        variant="outline"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-gray-900 flex-1 mr-4">
                        Q: {faq.question}
                      </h5>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          type="button"
                          onClick={() => handleEditFAQ(faq)}
                          disabled={disabled}
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleRemoveFAQ(faq.id)}
                          disabled={disabled}
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed pl-2">
                      A: {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {faqs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No FAQs added yet. Add your first FAQ above.</p>
        </div>
      )}
    </div>
  )
}