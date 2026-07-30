export type GenderPresentation = "Women" | "Men" | "Unisex";
export type SkinTone = "Light" | "Medium" | "Tan" | "Deep";
export type FaceShape = "Oval" | "Round" | "Square" | "Heart" | "Diamond";
export type HairTexture = "Straight" | "Wavy" | "Curly" | "Coily";
export type HairLength = "Short" | "Medium" | "Long";
export type ServiceCategory =
  | "Hair"
  | "Hair Colour"
  | "Makeup"
  | "Skincare"
  | "Grooming"
  | "Bridal"
  | "Fashion & Accessories"
  | "Complete Look";

export interface AvatarPreview {
  avatarId: string;
  serviceId?: string;
  image: string;
  spriteIndex: number;
  label: string;
  isExact: boolean;
}

export interface Avatar {
  id: string;
  displayName: string;
  genderPresentation: GenderPresentation;
  skinTone: SkinTone;
  faceShape: FaceShape;
  ageGroup: "20s" | "30s" | "40s+";
  hairLength: HairLength;
  hairTexture: HairTexture;
  frontView: string;
  sideView?: string;
  thumbnail: string;
  spriteIndex: number;
}

export interface ServiceVariant {
  id: string;
  name: string;
  priceDelta: number;
  durationDelta: number;
}

export interface SalonService {
  id: string;
  slug: string;
  name: string;
  category: ServiceCategory;
  description: string;
  benefit: string;
  duration: number;
  price: number;
  rating: number;
  reviewCount: number;
  specialistIds: string[];
  occasions: string[];
  maintenance: string;
  products: string[];
  preparation: string;
  aftercare: string;
  importantNotes: string;
  genderCategory: GenderPresentation;
  previewIndex: number;
  isPopular: boolean;
  availableToday: boolean;
  variants?: ServiceVariant[];
  incompatibleWith?: string[];
}

export interface BeautyLook {
  id: string;
  name: string;
  avatarId: string;
  serviceIds: string[];
  createdAt: string;
}

export interface SavedLook extends BeautyLook {
  updatedAt: string;
}

export interface SalonPackage {
  id: string;
  slug: string;
  name: string;
  description: string;
  serviceIds: string[];
  regularPrice: number;
  price: number;
  duration: number;
  occasions: string[];
  specialistIds: string[];
  previewIndex: number;
  featured?: boolean;
}

export interface Specialist {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  reviewCount: number;
  serviceIds: string[];
  nextAvailable: string;
  spriteIndex: number;
  bio: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  distance: string;
  phone: string;
  hours: string;
}

export interface AvailabilitySlot {
  id: string;
  branchId: string;
  specialistId: string;
  date: string;
  time: string;
  available: boolean;
}

export interface Customer {
  fullName: string;
  mobile: string;
  email: string;
  notes?: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  serviceIds: string[];
  lookId?: string;
  branchId: string;
  specialistId: string;
  date: string;
  time: string;
  customer: Customer;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  duration: number;
  status: "Confirmed" | "Cancelled" | "Rescheduled";
}

export interface Recommendation {
  id: string;
  serviceIds: string[];
  rationale: string;
  estimatedPrice: number;
  estimatedDuration: number;
}

export interface Testimonial {
  id: string;
  name: string;
  occasion: string;
  quote: string;
  rating: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  serviceId?: string;
}

export interface BookingDraft {
  serviceIds: string[];
  lookId?: string;
  branchId: string;
  specialistId: string;
  date: string;
  time: string;
  customer: Customer;
}
