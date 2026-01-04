'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AmenitiesList } from './AmenitiesList'
import { RulesList } from './RulesList'
import { toast } from 'sonner'
import { ImageUpload } from './ImageUpload'
import { PricingPlans } from './PricingPlans'

interface Accommodation {
    title: string
    description: string
    type: 'STUDIO' | 'APARTMENT' | 'HOUSE'
    address: string
    city: string
    country: string
    deposit: number
    furnishing: 'FURNISHED' | 'UNFURNISHED' | 'PARTIAL'
    bathrooms: number
    bedrooms: number
    size: number
    amenities: string[]
    rules: string[]
    images: string[]
    availableFrom: string
    minTerm: number
    maxTerm: number
    banner: string
    pricingPlans: Array<{ type: string, price: number }>
}

export function AccommodationForm() {
    const [formData, setFormData] = useState<Partial<Accommodation>>({
        type: 'STUDIO',
        furnishing: 'FURNISHED',
        // banner:"https://via.placeholder.com/400x300?text=No+Image+Available",
        amenities: [],
        rules: [],
        // images: ["https://via.placeholder.com/400x300?text=No+Image+Available","https://via.placeholder.com/400x300?text=No+Image+Available"],
        images: [],
        pricingPlans: []
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {

            const NextUrl = process.env.NEXTAUTH_URL || window.location.origin;


            const response = await fetch(`${NextUrl}/api/accommodations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });


            if (!response.ok) {
                throw new Error('Failed to create accommodation')
            }

            toast.success("Accommodation created successfully.")
            window.location.href = '/stay'
        } catch (error) {
            toast.error("Error occurred.")
            console.error('Error:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">New Accommodation</h2>

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Images</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <span className="text-sm text-gray-500">Banner Image</span>
                            <ImageUpload
                                value={formData.banner}
                                onChange={(url) => setFormData(prev => ({ ...prev, banner: url }))}
                                className="h-40 w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <span className="text-sm text-gray-500">Additional Images</span>
                            <div className="grid grid-cols-2 gap-2">
                                {formData.images?.map((image, index) => (
                                    <div key={index} className="relative h-20">
                                        <Image src={image} alt={`Additional image ${index + 1}`} fill className="object-cover rounded-md" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, images: prev.images?.filter((_, i) => i !== index) }))}
                                            className="absolute top-1 right-1 bg-black text-white rounded-full p-1 hover:bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                {formData.images && formData.images.length < 4 && (
                                    <ImageUpload
                                        onChange={(url) => setFormData(prev => ({ ...prev, images: [...(prev.images || []), url] }))}
                                        className="h-20 w-full"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            placeholder='title'
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            value={formData.title || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                            Type
                        </label>
                        <select
                            id="type"
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            value={formData.type}
                            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'STUDIO' | 'APARTMENT' | 'HOUSE' }))}
                        >
                            <option value="STUDIO">Studio</option>
                            <option value="APARTMENT">Apartment</option>
                            <option value="HOUSE">House</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="deposit" className="block text-sm font-medium text-gray-700">
                            Deposit
                        </label>
                        <input
                            id="deposit"
                            type="number"
                            placeholder='deposit'
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            value={formData.deposit || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, deposit: parseFloat(e.target.value) }))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="furnishing" className="block text-sm font-medium text-gray-700">
                            Furnishing
                        </label>
                        <select
                            id="furnishing"
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            value={formData.furnishing}
                            onChange={(e) => setFormData(prev => ({ ...prev, furnishing: e.target.value as 'FURNISHED' | 'UNFURNISHED' | 'PARTIAL' }))}
                        >
                            <option value="furnished">Furnished</option>
                            <option value="unfurnished">Unfurnished</option>
                            <option value="partially_furnished">Partially Furnished</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
                            Bathrooms
                        </label>
                        <input
                            id="bathrooms"
                            type="number"
                            placeholder='bathrooms'
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            value={formData.bathrooms || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) }))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
                            Bedrooms
                        </label>
                        <input
                            id="bedrooms"
                            type="number"
                            placeholder='bedrooms'
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            value={formData.bedrooms || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) }))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                            Size (sqm)
                        </label>
                        <input
                            id="size"
                            type="number"
                            placeholder='size'
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            value={formData.size || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <input
                            id="address"
                            type="text"
                            placeholder='address'
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            value={formData.address || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                            required
                        />
                    </div>
                </div>


                {/* Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    

                    <div className="space-y-2">
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                            City
                        </label>
                        <input
                            id="city"
                            type="text"
                            placeholder='city'
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            value={formData.city || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                            Country
                        </label>
                        <input
                            id="country"
                            type="text"
                            placeholder='country'
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            value={formData.country || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                            required
                        />
                    </div>
                </div>

                <PricingPlans
                        plans={formData.pricingPlans || []}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange={(pricingPlans:any) => setFormData(prev => ({ ...prev, pricingPlans: pricingPlans }))}
                    />

                {/* Description */}
                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        rows={4}
                        placeholder='Enter your description'
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        value={formData.description || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        required
                    />
                </div>

                {/* Amenities */}
                <AmenitiesList
                    amenities={formData.amenities || []}
                    onChange={(amenities) => setFormData(prev => ({ ...prev, amenities }))}
                />

                {/* Rules */}
                <RulesList
                    rules={formData.rules || []}
                    onChange={(rules) => setFormData(prev => ({ ...prev, rules }))}
                />

                {/* Availability */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div className="space-y-2">
                        <label htmlFor="availableFrom" className="block text-sm font-medium text-gray-700">
                            Available From
                        </label>
                        <input
                            id="availableFrom"
                            type="date"
                            placeholder='availableFrom'
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            value={formData.availableFrom || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, availableFrom: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="minTerm" className="block text-sm font-medium text-gray-700">
                            Minimum Term (months)
                        </label>
                        <input
                            id="minTerm"
                            type="number"
                            placeholder='minTerm'
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            value={formData.minTerm || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, minTerm: parseInt(e.target.value) }))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="maxTerm" className="block text-sm font-medium text-gray-700">
                            Maximum Term (months)
                        </label>
                        <input
                            id="maxTerm"
                            type="number"
                            placeholder='maxTerm'
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            value={formData.maxTerm || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, maxTerm: parseInt(e.target.value) }))}
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full sm:w-auto bg-black text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors text-sm sm:text-base font-medium"
                >
                    Create Accommodation
                </button>
            </div>
        </form>
    )
}
