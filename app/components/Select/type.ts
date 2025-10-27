export interface TuitionFee {
  domestic: number
  international: number
}

export interface Department {
  name: string
  description: string
  courses: Course[]
}

export interface AffiliatedCollege {
  name: string
  description: string
  location: string
  country: string
  established: number
  website: string
  email: string
  phone: string
  logoUrl: string
  imageUrls: string[]
  ranking: number
  totalStudents: number
  acceptance: number
  facilities: string[]
  hasHostel: boolean
  hostelFee: number
  departments: Department[]
}

export interface University {
  id?: string
  name: string
  description: string
  location: string
  country: string
  website: string
  established: Date
  banner: string
  logoUrl?: string
  imageUrls: string[]
  facilities: string[]
  courses: Course[]
}

export interface Course {
  id?: string
  name: string
  description: string
  fees: string
  duration: string
  degreeType: string
  ieltsScore: string
  ranking: string
  intake: string[]
  websiteLink?: string
}