export type Property = {
    id: string
    name: string
    location: {
      address: string
      country: string
      city: string
      postcode: string
    }
    price: number
    rating: number
    image: string
    details: {
      bedrooms: number
      bathrooms: number
      propertyType: string
      amenities: string[]
    }
  }
  
  