import { Star } from "lucide-react"
import type { Property } from "./types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        <img src={property.image || "/placeholder.svg"} alt={property.name} className="object-cover w-full h-full" />
      </div>
      <CardHeader className="p-4">
        <div className="text-sm text-muted-foreground">
          {property.location.city}, {property.location.country}
        </div>
        <h3 className="text-xl font-semibold">{property.name}</h3>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex justify-between items-center">
        <div className="text-lg font-bold">
          ${property.price} <span className="text-sm font-normal">per night</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-5 h-5 fill-primary text-primary" />
          <span className="font-medium">{property.rating}</span>
        </div>
      </CardContent>
    </Card>
  )
}

