import type { Property } from "./types"

export const properties: Property[] = [
  // UK Properties
  {
    id: "uk-1",
    name: "Victorian Manor House",
    location: {
      address: "123 Kensington Gardens",
      country: "UK",
      city: "London",
      postcode: "SW7 2AP",
    },
    price: 450,
    rating: 4.8,
    image: "https://plus.unsplash.com/premium_photo-1680300960892-bd11b59b469b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: {
      bedrooms: 5,
      bathrooms: 4,
      propertyType: "Manor",
      amenities: ["Garden", "Pool", "Tennis Court"],
    },
  },
  {
    id: "uk-2",
    name: "Cotswold Cottage",
    location: {
      address: "45 High Street",
      country: "UK",
      city: "Bath",
      postcode: "BA1 5AL",
    },
    price: 280,
    rating: 4.9,
    image: "https://plus.unsplash.com/premium_photo-1680300960892-bd11b59b469b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: {
      bedrooms: 3,
      bathrooms: 2,
      propertyType: "Cottage",
      amenities: ["Garden", "Fireplace"],
    },
  },
  // Add 8 more UK properties...

  // US Properties
  {
    id: "us-1",
    name: "Hampton Beach House",
    location: {
      address: "789 Ocean Drive",
      country: "US",
      city: "The Hamptons",
      postcode: "NY 11937",
    },
    price: 850,
    rating: 4.7,
    image: "https://plus.unsplash.com/premium_photo-1680300960892-bd11b59b469b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: {
      bedrooms: 6,
      bathrooms: 5,
      propertyType: "Beach House",
      amenities: ["Beach Access", "Pool", "Home Theater"],
    },
  },
  {
    id: "us-2",
    name: "Manhattan Penthouse",
    location: {
      address: "123 Park Avenue",
      country: "US",
      city: "New York",
      postcode: "NY 10022",
    },
    price: 1200,
    rating: 4.9,
    image: "https://plus.unsplash.com/premium_photo-1680300960892-bd11b59b469b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: {
      bedrooms: 4,
      bathrooms: 4.5,
      propertyType: "Penthouse",
      amenities: ["Doorman", "Gym", "Terrace"],
    },
  },
  // Add 8 more US properties...

  // Canadian Properties
  {
    id: "ca-1",
    name: "Banff Mountain Lodge",
    location: {
      address: "456 Mountain View",
      country: "Canada",
      city: "Banff",
      postcode: "T1L 1K2",
    },
    price: 520,
    rating: 4.8,
    image: "https://plus.unsplash.com/premium_photo-1680300960892-bd11b59b469b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: {
      bedrooms: 4,
      bathrooms: 3,
      propertyType: "Lodge",
      amenities: ["Mountain View", "Hot Tub", "Ski Storage"],
    },
  },
  {
    id: "ca-2",
    name: "Vancouver Harbor Suite",
    location: {
      address: "789 Waterfront Road",
      country: "Canada",
      city: "Vancouver",
      postcode: "V6C 3E1",
    },
    price: 380,
    rating: 4.6,
    image: "https://plus.unsplash.com/premium_photo-1680300960892-bd11b59b469b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: {
      bedrooms: 2,
      bathrooms: 2,
      propertyType: "Apartment",
      amenities: ["Harbor View", "Gym", "Parking"],
    },
  },
  // Add 8 more Canadian properties...
]

