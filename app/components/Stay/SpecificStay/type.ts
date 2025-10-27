export interface Landlord {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  email: string;
  phoneNumber: string;
  isLandlordVerified: boolean;
}

export interface PricingPlan {
  type: string;
  price: number;
}

// Types
export interface Accommodation {
  id: string;
  title: string;
  description: string;
  type: string;
  address: string;
  city: string;
  country: string;
  banner: string;
  includeBills: boolean | null;
  deposit: number | null;
  furnishing: string | null;
  bathrooms: number;
  bedrooms: number;
  size: number | null;
  amenities: string[];
  rules: string[];
  images: string[];
  availableFrom: string;
  minTerm: number;
  maxTerm: number;
  isAvailable: boolean;
  landlord: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string | null;
    email: string;
    phoneNumber: string;
    isLandlordVerified: boolean;
  };
  averageRating: number | null;
  totalRatings: number;
  pricingPlans: Array<{
    type: string;
    price: number;
  }>;
}
