"use client"

import { useState } from "react"
import { PropertyCard } from "./PropertyCard"
import { properties } from "./properties"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PropertiesPage() {
  const [country, setCountry] = useState<string>("all")
  const [minPrice, setMinPrice] = useState<number>(0)
  const [maxPrice, setMaxPrice] = useState<number>(2000)
  const [bedrooms, setBedrooms] = useState<string>("all")

  const filteredProperties = properties.filter((property) => {
    const matchesCountry = country === "all" || property.location.country === country
    const matchesPrice = property.price >= minPrice && property.price <= maxPrice
    const matchesBedrooms = bedrooms === "all" || property.details.bedrooms === Number.parseInt(bedrooms, 10)

    return matchesCountry && matchesPrice && matchesBedrooms
  })

  return (
    <div className="container mx-auto py-8 ">
      <Card className="mb-8  border-0">
        <CardHeader>
          <CardTitle>Property Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">All Countries</option>
                <option value="UK">United Kingdom</option>
                <option value="US">United States</option>
                <option value="Canada">Canada</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Price Range (per night)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  placeholder="Min"
                  min={0}
                  max={maxPrice}
                />
                <span>to</span>
                <Input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  placeholder="Max"
                  min={minPrice}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <select
                id="bedrooms"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">Any</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-7">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  )
}

