import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { ChevronDown, X } from 'lucide-react';

export interface Course {
    id: string;
    name: string;
    description: string | null;
    fees: string;
    duration: string;
    degreeType: string;
    ieltsScore: string;
    ranking: string;
    intake: string[];
    websiteLink: string | null;
}

interface DocumentItem {
    name: string;
    file: File;
}

interface ApplicationFormData {
    courseId: string;
    documents: DocumentItem[];
    additionalNotes?: string;
    loanRequired: boolean;
}

interface UniversityApplicationModalProps {
    universityId: string;
    isOpen: boolean;
    onClose: () => void;
    courses: Course[];
    universityName?: string; // Added to display the university name
}

const UniversityApplicationModal = ({
    universityId,
    isOpen,
    onClose,
    courses,
    universityName
}: UniversityApplicationModalProps) => {
    const [formData, setFormData] = useState<ApplicationFormData>({
        courseId: '',
        documents: [],
        additionalNotes: '',
        loanRequired: false
    });
    const [documentName, setDocumentName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Reset form when modal opens or university changes
    useEffect(() => {
        if (isOpen) {
            setFormData({
                courseId: courses.length > 0 ? courses[0].id : '',
                documents: [],
                additionalNotes: '',
                loanRequired: false
            });
            setError(null);
        }
    }, [isOpen, universityId, courses]);

    // Handle click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && documentName.trim()) {
            setFormData(prev => ({
                ...prev,
                documents: [...prev.documents, { name: documentName.trim(), file }]
            }));
            setDocumentName('');
            e.target.value = '';
        }
    };

    const removeDocument = (index: number) => {
        setFormData(prev => ({
            ...prev,
            documents: prev.documents.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!formData.courseId) {
                setError("Please select a course");
                return;
            }

            const formDataToSubmit = new FormData();
            formDataToSubmit.append('courseId', formData.courseId);
            formDataToSubmit.append('loanRequired', String(formData.loanRequired));
            if (formData.additionalNotes) {
                formDataToSubmit.append('additionalNotes', formData.additionalNotes);
            }

            formData.documents.forEach((doc) => {
                formDataToSubmit.append('documents', doc.file);
                formDataToSubmit.append('documentNames', doc.name);
            });

            const response = await fetch(`/api/universities/apply?id=${universityId}`, {
                method: 'POST',
                body: formDataToSubmit,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit application');
            }

            toast.success("Application submitted successfully");
            onClose();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Something went wrong");
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleCourseSelect = (courseId: string) => {
        setFormData(prev => ({ ...prev, courseId }));
        setIsDropdownOpen(false);
    };

    const selectedCourse = courses.find(course => course.id === formData.courseId);

    if (!isOpen) return null;

    return (
        <div className="fixed  no-scrollbar inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* className="max-w-4xl w-full h-auto max-h-[80vh] my-8 overflow-hidden" */}
            <div className="bg-white rounded-[5px] max-w-4xl w-[90vw] h-[65vh] md:max-h-[80vh] my-8 overflow-hidden flex flex-col">
                <div className='flex flex-row items-start justify-between'>
                    <div className="px-6 py-4 border-b">
                        <h2 className="md:text-2xl text-lg font-bold">Apply for {universityName || "University"}</h2>
                        <p className="text-gray-600 mt-1 text-xs md:text-base">Please fill in the details below to submit your application.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black transition-colors py-4 pr-4"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto no-scrollbar custom-scrollbar">
                    {/* Custom Course Dropdown */}
                    <div className="space-y-2" ref={dropdownRef}>
                        <label className="block text-sm font-medium">
                            Course
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full rounded-[6px] border border-gray-300 p-2 text-left flex justify-between items-center bg-white"
                            >
                                <span className="truncate">
                                    {selectedCourse
                                        ? `${selectedCourse.name} - ${selectedCourse.degreeType}`
                                        : "Select Course"}
                                </span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-[6px] shadow-lg max-h-48 overflow-y-auto">
                                    {courses.map((course) => (
                                        <button
                                            key={course.id}
                                            type="button"
                                            onClick={() => handleCourseSelect(course.id)}
                                            className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                        >
                                            {course.name} - {course.degreeType}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Document Upload Section */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Documents
                        </label>
                        <div className="space-y-4">
                            {formData.documents.length > 0 && (
                                <div className="space-y-2">
                                    {formData.documents.map((doc, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-[6px]">
                                            <div>
                                                <p className="font-medium">{doc.name}</p>
                                                <p className="text-sm text-gray-500">{doc.file.name}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeDocument(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Document Name (e.g., Passport, Transcripts)"
                                    value={documentName}
                                    onChange={(e) => setDocumentName(e.target.value)}
                                    className="w-full rounded-[6px] border border-gray-300 p-2"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        disabled={!documentName.trim()}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className={`cursor-pointer px-4 py-2 rounded-[6px] border border-gray-300 hover:bg-gray-50 transition-colors ${!documentName.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Upload Document here
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-2">
                        <label htmlFor="notes" className="block text-sm font-medium">
                            Additional Notes
                        </label>
                        <textarea
                            id="notes"
                            className="w-full rounded-[6px] border border-gray-300 p-2"
                            rows={3}
                            value={formData.additionalNotes}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                additionalNotes: e.target.value
                            }))}
                            placeholder="Any additional information you'd like to share..."
                        />
                    </div>

                    {/* Loan Required Checkbox */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="loanRequired"
                            checked={formData.loanRequired}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                loanRequired: e.target.checked
                            }))}
                            className="rounded border-gray-300"
                        />
                        <label htmlFor="loanRequired" className="text-sm font-medium">
                            I require a loan for this program
                        </label>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm mt-2">
                            {error}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t flex justify-end gap-4 mt-auto">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-[6px] border border-gray-300 hover:bg-gray-50 transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`px-4 py-2 rounded-[6px] bg-[#DA202E] text-white hover:bg-opacity-90 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UniversityApplicationModal;