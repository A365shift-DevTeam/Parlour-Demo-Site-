import { addDays, format } from "date-fns";
import type {
  Avatar,
  AvailabilitySlot,
  Branch,
  FAQ,
  SalonPackage,
  SalonService,
  ServiceCategory,
  Specialist,
  Testimonial,
} from "../types";
import { slugify } from "../lib/utils";
import type { AvatarAppearance } from "../types/avatarAppearance";

export const categories: Array<{
  name: ServiceCategory;
  label: string;
  description: string;
  previewIndex: number;
}> = [
  {
    name: "Hair",
    label: "Hair Studio",
    description: "Cuts, styling and texture-led transformations.",
    previewIndex: 0,
  },
  {
    name: "Hair Colour",
    label: "Colour Atelier",
    description: "Dimensional colour with considered maintenance.",
    previewIndex: 3,
  },
  {
    name: "Makeup",
    label: "Makeup Studio",
    description: "Polished looks from barely-there to editorial.",
    previewIndex: 6,
  },
  {
    name: "Skincare",
    label: "Skin Rituals",
    description: "Non-medical facials for comfort and radiance.",
    previewIndex: 5,
  },
  {
    name: "Grooming",
    label: "Grooming Studio",
    description: "Modern cuts, beard design and finishing.",
    previewIndex: 7,
  },
  {
    name: "Bridal",
    label: "Bridal Studio",
    description: "Complete wedding-day artistry and trials.",
    previewIndex: 4,
  },
  {
    name: "Fashion & Accessories",
    label: "Finishing Atelier",
    description: "Draping, accessories and final styling details.",
    previewIndex: 4,
  },
  {
    name: "Complete Look",
    label: "Beauty Packages",
    description: "Coordinated services, one effortless appointment.",
    previewIndex: 1,
  },
];

const avatarNames = [
  "Mira",
  "Arjun",
  "Naina",
  "Dev",
  "Kabir",
  "Isha",
  "Reyansh",
  "Amara",
  "Tara",
  "Vihaan",
  "Leela",
  "Zayn",
];
const genders: Avatar["genderPresentation"][] = [
  "Women",
  "Men",
  "Women",
  "Unisex",
  "Men",
  "Women",
  "Unisex",
  "Women",
  "Women",
  "Men",
  "Unisex",
  "Men",
];
const skinTones: Avatar["skinTone"][] = [
  "Medium",
  "Medium",
  "Tan",
  "Medium",
  "Tan",
  "Deep",
  "Medium",
  "Deep",
  "Light",
  "Tan",
  "Medium",
  "Deep",
];
const faceShapes: Avatar["faceShape"][] = [
  "Oval",
  "Square",
  "Heart",
  "Diamond",
  "Square",
  "Oval",
  "Diamond",
  "Heart",
  "Oval",
  "Square",
  "Round",
  "Diamond",
];
const textures: Avatar["hairTexture"][] = [
  "Wavy",
  "Wavy",
  "Wavy",
  "Curly",
  "Curly",
  "Straight",
  "Wavy",
  "Coily",
  "Straight",
  "Wavy",
  "Curly",
  "Coily",
];

export const avatars: Avatar[] = avatarNames.map((displayName, index) => ({
  id: `avatar-${index + 1}`,
  displayName,
  genderPresentation: genders[index],
  skinTone: skinTones[index],
  faceShape: faceShapes[index],
  ageGroup: index % 4 === 0 ? "30s" : index % 5 === 0 ? "40s+" : "20s",
  hairLength:
    index === 3 || index === 4 || index === 6 || index === 11
      ? "Short"
      : index === 5 || index === 8 || index === 10
        ? "Medium"
        : "Long",
  hairTexture: textures[index],
  frontView: "/images/avatar-library.png",
  thumbnail: "/images/avatar-library.png",
  spriteIndex: index,
}));

type ServiceSeed = Pick<
  SalonService,
  | "name"
  | "category"
  | "description"
  | "benefit"
  | "duration"
  | "price"
  | "previewIndex"
  | "genderCategory"
> &
  Partial<
    Pick<
      SalonService,
      | "occasions"
      | "maintenance"
      | "products"
      | "preparation"
      | "aftercare"
      | "importantNotes"
      | "incompatibleWith"
    >
  >;

const serviceSeeds: ServiceSeed[] = [
  {
    name: "Layered Signature Cut",
    category: "Hair",
    description: "A consultation-led cut with soft, face-framing layers and a polished finish.",
    benefit: "Movement, shape and an effortless salon finish.",
    duration: 75,
    price: 1800,
    previewIndex: 0,
    genderCategory: "Women",
    occasions: ["Everyday Beauty", "Professional", "Complete Makeover"],
  },
  {
    name: "Soft Sculpt Curls",
    category: "Hair",
    description: "Long-lasting, touchable curls shaped for balanced volume and shine.",
    benefit: "Camera-ready texture without a rigid finish.",
    duration: 60,
    price: 1600,
    previewIndex: 1,
    genderCategory: "Women",
    occasions: ["Party", "Wedding Guest", "Photoshoot"],
  },
  {
    name: "Precision Sleek Bob",
    category: "Hair",
    description: "A clean, architectural bob customised to the chosen reference length.",
    benefit: "Strong shape with an elevated, modern silhouette.",
    duration: 90,
    price: 2400,
    previewIndex: 2,
    genderCategory: "Women",
    occasions: ["Professional", "Everyday Beauty", "Complete Makeover"],
  },
  {
    name: "Bridal Low Bun",
    category: "Hair",
    description: "A secure, elegant low bun prepared for veil and jewellery placement.",
    benefit: "Refined hold designed for long wedding celebrations.",
    duration: 90,
    price: 4500,
    previewIndex: 4,
    genderCategory: "Women",
    occasions: ["Bridal", "Wedding Guest"],
  },
  {
    name: "Modern Pixie Detail",
    category: "Hair",
    description: "A precise short cut with personalised texture and controlled movement.",
    benefit: "Confident, low-fuss shape with editorial edge.",
    duration: 70,
    price: 1900,
    previewIndex: 2,
    genderCategory: "Unisex",
  },
  {
    name: "Curl Definition Ritual",
    category: "Hair",
    description: "Hydration, curl-by-curl shaping and diffused finishing for natural texture.",
    benefit: "Enhanced definition, softness and reduced frizz.",
    duration: 100,
    price: 2600,
    previewIndex: 1,
    genderCategory: "Unisex",
  },
  {
    name: "Caramel Dimension Balayage",
    category: "Hair Colour",
    description: "Hand-painted warmth with a seamless root transition and tonal gloss.",
    benefit: "Luminous dimension with graceful grow-out.",
    duration: 210,
    price: 7500,
    previewIndex: 3,
    genderCategory: "Women",
    occasions: ["Complete Makeover", "Photoshoot", "Everyday Beauty"],
  },
  {
    name: "Burgundy Velvet Gloss",
    category: "Hair Colour",
    description: "A rich burgundy tonal service with bond care and mirror-shine finishing.",
    benefit: "Expressive colour with enhanced surface shine.",
    duration: 150,
    price: 5200,
    previewIndex: 3,
    genderCategory: "Unisex",
  },
  {
    name: "Chocolate Brown Refresh",
    category: "Hair Colour",
    description: "Multi-tonal brunette refresh that restores depth and soft luminosity.",
    benefit: "Natural-looking richness and healthier-looking shine.",
    duration: 135,
    price: 4800,
    previewIndex: 3,
    genderCategory: "Unisex",
  },
  {
    name: "Global Luxe Colour",
    category: "Hair Colour",
    description: "Complete colour coverage with strand assessment, bond care and gloss.",
    benefit: "Even, dimensional tone with a conditioned finish.",
    duration: 180,
    price: 6200,
    previewIndex: 3,
    genderCategory: "Unisex",
  },
  {
    name: "No-Makeup Glow",
    category: "Makeup",
    description: "Fresh, breathable complexion work with soft definition and natural tones.",
    benefit: "Polished confidence that still feels like you.",
    duration: 60,
    price: 2800,
    previewIndex: 5,
    genderCategory: "Women",
    occasions: ["Professional", "Everyday Beauty", "Wedding Guest"],
  },
  {
    name: "Party Berry Edit",
    category: "Makeup",
    description: "Softly sculpted eyes, luminous skin and a refined berry lip.",
    benefit: "Evening impact that photographs beautifully.",
    duration: 75,
    price: 4200,
    previewIndex: 6,
    genderCategory: "Women",
    occasions: ["Party", "Festival", "Photoshoot"],
  },
  {
    name: "Bridal HD Artistry",
    category: "Makeup",
    description: "Camera-conscious bridal artistry tailored to outfit, jewellery and venue light.",
    benefit: "Long-wear refinement with a dimensional, non-heavy finish.",
    duration: 120,
    price: 9500,
    previewIndex: 4,
    genderCategory: "Women",
    occasions: ["Bridal"],
  },
  {
    name: "Editorial Soft Glam",
    category: "Makeup",
    description: "A balanced glam look with sculpted eyes, radiant skin and modern neutrals.",
    benefit: "High-impact polish without visual heaviness.",
    duration: 90,
    price: 5500,
    previewIndex: 6,
    genderCategory: "Women",
    occasions: ["Photoshoot", "Party", "Wedding Guest"],
  },
  {
    name: "Deep Hydration Facial",
    category: "Skincare",
    description: "A non-medical comfort ritual focused on cleansing, hydration and barrier care.",
    benefit: "Skin feels refreshed, supple and comfortably hydrated.",
    duration: 75,
    price: 3200,
    previewIndex: 5,
    genderCategory: "Unisex",
    maintenance: "Best repeated every 4–6 weeks following professional assessment.",
  },
  {
    name: "Vitamin C Radiance Ritual",
    category: "Skincare",
    description: "A brightening cosmetic facial with gentle exfoliation and antioxidant care.",
    benefit: "A rested, refreshed appearance and smooth-feeling skin.",
    duration: 80,
    price: 3800,
    previewIndex: 5,
    genderCategory: "Unisex",
  },
  {
    name: "De-Tan Comfort Ritual",
    category: "Skincare",
    description: "A soothing cosmetic ritual designed to refresh the appearance of sun-exposed skin.",
    benefit: "Comforting care and a more even-looking finish.",
    duration: 60,
    price: 2400,
    previewIndex: 5,
    genderCategory: "Unisex",
  },
  {
    name: "Calming Barrier Facial",
    category: "Skincare",
    description: "A gentle non-medical facial using fragrance-considered, comfort-focused products.",
    benefit: "Reduced feeling of dryness and a calm, nourished finish.",
    duration: 70,
    price: 3500,
    previewIndex: 5,
    genderCategory: "Unisex",
  },
  {
    name: "Beard Architecture",
    category: "Grooming",
    description: "Precision beard mapping, trimming, line refinement and conditioning.",
    benefit: "Balanced proportions and a clean, considered finish.",
    duration: 45,
    price: 1200,
    previewIndex: 7,
    genderCategory: "Men",
    occasions: ["Professional", "Groom", "Everyday Beauty"],
  },
  {
    name: "Gentleman's Signature Cut",
    category: "Grooming",
    description: "Consultation, precision haircut, wash and styling with product guidance.",
    benefit: "A tailored silhouette that is easy to maintain.",
    duration: 60,
    price: 1500,
    previewIndex: 7,
    genderCategory: "Men",
  },
  {
    name: "Executive Grooming Edit",
    category: "Grooming",
    description: "Haircut, beard detailing and a polished finish for important professional moments.",
    benefit: "A cohesive, confident and camera-ready appearance.",
    duration: 90,
    price: 2600,
    previewIndex: 7,
    genderCategory: "Men",
    occasions: ["Professional", "Photoshoot", "Groom"],
  },
  {
    name: "Bridal Look Trial",
    category: "Bridal",
    description: "A collaborative hair and makeup rehearsal with reference photos and notes.",
    benefit: "Confident decisions and a clear wedding-day plan.",
    duration: 150,
    price: 8500,
    previewIndex: 4,
    genderCategory: "Women",
    occasions: ["Bridal"],
  },
  {
    name: "Wedding Day Signature",
    category: "Bridal",
    description: "Complete bridal hair, makeup, draping and finishing coordination.",
    benefit: "One cohesive look managed by a dedicated lead artist.",
    duration: 240,
    price: 18000,
    previewIndex: 4,
    genderCategory: "Women",
    occasions: ["Bridal"],
  },
  {
    name: "Wedding Guest Radiance",
    category: "Bridal",
    description: "Soft occasion hair and makeup designed around attire and event timing.",
    benefit: "Elegant, comfortable styling with camera-ready polish.",
    duration: 135,
    price: 6800,
    previewIndex: 6,
    genderCategory: "Women",
    occasions: ["Wedding Guest"],
  },
  {
    name: "Signature Saree Draping",
    category: "Fashion & Accessories",
    description: "Secure, proportion-conscious draping with refined pleat and pallu placement.",
    benefit: "Comfortable movement and a clean photographic silhouette.",
    duration: 45,
    price: 1800,
    previewIndex: 4,
    genderCategory: "Women",
  },
  {
    name: "Hair Accessory Styling",
    category: "Fashion & Accessories",
    description: "Placement and secure finishing for flowers, pins, combs or jewellery.",
    benefit: "A balanced final detail designed to last through the event.",
    duration: 35,
    price: 1400,
    previewIndex: 4,
    genderCategory: "Women",
  },
  {
    name: "Professional Refresh",
    category: "Complete Look",
    description: "Express hair finish, natural makeup and eyebrow grooming in one appointment.",
    benefit: "Meeting-ready polish with minimal maintenance.",
    duration: 120,
    price: 4500,
    previewIndex: 5,
    genderCategory: "Unisex",
    occasions: ["Professional"],
  },
  {
    name: "Party Ready",
    category: "Complete Look",
    description: "Soft curls and party makeup coordinated for a complete evening look.",
    benefit: "A cohesive style with efficient chair time.",
    duration: 150,
    price: 7200,
    previewIndex: 6,
    genderCategory: "Women",
    occasions: ["Party", "Festival"],
  },
  {
    name: "Complete Makeover",
    category: "Complete Look",
    description: "Consultation-led haircut, colour gloss, makeup and finishing for a full refresh.",
    benefit: "One considered transformation with a coordinated team.",
    duration: 300,
    price: 14500,
    previewIndex: 3,
    genderCategory: "Unisex",
    occasions: ["Complete Makeover", "Photoshoot"],
  },
  {
    name: "Festival Glow Edit",
    category: "Complete Look",
    description: "Radiance facial, festive makeup and polished hairstyling.",
    benefit: "Fresh, celebration-ready styling with balanced impact.",
    duration: 195,
    price: 8900,
    previewIndex: 6,
    genderCategory: "Women",
    occasions: ["Festival", "Party"],
  },
];

const defaultProducts = ["Kérastase care", "GV Studio finishing serum", "Professional heat protection"];
const defaultPrep = "Arrive with clean, dry hair unless your confirmation notes otherwise.";
const defaultAftercare =
  "Your specialist will recommend a tailored home-care routine after assessing your hair or skin.";

type ServiceVisualEffect = Partial<
  Pick<
    AvatarAppearance,
    "hairStyle" | "hairColor" | "makeup" | "facialHair" | "accessory"
  >
>;

const serviceVisualEffects: Record<string, ServiceVisualEffect> = {
  "Layered Signature Cut": { hairStyle: "Natural Layers" },
  "Soft Sculpt Curls": { hairStyle: "Soft Curls" },
  "Precision Sleek Bob": { hairStyle: "Sleek Bob" },
  "Bridal Low Bun": { hairStyle: "Bridal Bun" },
  "Modern Pixie Detail": { hairStyle: "Textured Crop" },
  "Curl Definition Ritual": { hairStyle: "Soft Curls" },
  "Caramel Dimension Balayage": { hairColor: "Caramel Balayage" },
  "Burgundy Velvet Gloss": { hairColor: "Burgundy" },
  "Chocolate Brown Refresh": { hairColor: "Chocolate" },
  "Global Luxe Colour": { hairColor: "Chocolate" },
  "No-Makeup Glow": { makeup: "Natural Glow" },
  "Party Berry Edit": { makeup: "Soft Glam" },
  "Bridal HD Artistry": { makeup: "Bridal" },
  "Editorial Soft Glam": { makeup: "Soft Glam" },
  "Deep Hydration Facial": { makeup: "Natural Glow" },
  "Vitamin C Radiance Ritual": { makeup: "Natural Glow" },
  "De-Tan Comfort Ritual": { makeup: "Natural Glow" },
  "Calming Barrier Facial": { makeup: "Natural Glow" },
  "Beard Architecture": { facialHair: "Sculpted Beard" },
  "Gentleman's Signature Cut": { hairStyle: "Textured Crop", facialHair: "Stubble" },
  "Executive Grooming Edit": { hairStyle: "Textured Crop", facialHair: "Sculpted Beard" },
  "Bridal Look Trial": { hairStyle: "Bridal Bun", makeup: "Bridal", accessory: "Bridal Gold" },
  "Wedding Day Signature": { hairStyle: "Bridal Bun", makeup: "Bridal", accessory: "Bridal Gold" },
  "Wedding Guest Radiance": { hairStyle: "Soft Curls", makeup: "Soft Glam", accessory: "Pearl Pins" },
  "Signature Saree Draping": { accessory: "Bridal Gold" },
  "Hair Accessory Styling": { accessory: "Pearl Pins" },
  "Professional Refresh": { hairStyle: "Natural Layers", makeup: "Natural Glow" },
  "Party Ready": { hairStyle: "Soft Curls", makeup: "Soft Glam" },
  "Complete Makeover": { hairStyle: "Natural Layers", hairColor: "Caramel Balayage", makeup: "Soft Glam" },
  "Festival Glow Edit": { hairStyle: "Soft Curls", makeup: "Soft Glam", accessory: "Pearl Pins" },
};

export const services: Array<SalonService & { visualEffect: ServiceVisualEffect }> = serviceSeeds.map((seed, index) => ({
  id: `service-${index + 1}`,
  slug: slugify(seed.name),
  name: seed.name,
  category: seed.category,
  description: seed.description,
  benefit: seed.benefit,
  duration: seed.duration,
  price: seed.price,
  rating: Number((4.6 + (index % 4) * 0.1).toFixed(1)),
  reviewCount: 42 + index * 7,
  specialistIds: [`specialist-${(index % 8) + 1}`, `specialist-${((index + 3) % 8) + 1}`],
  occasions: seed.occasions ?? ["Everyday Beauty", "Complete Makeover"],
  maintenance:
    seed.maintenance ??
    (seed.category === "Hair Colour"
      ? "Refresh tone in 6–10 weeks; use colour-safe care and heat protection."
      : "Your specialist will tailor maintenance to the chosen finish and your routine."),
  products:
    seed.products ??
    (seed.category === "Skincare"
      ? ["Dermalogica professional care", "Hydrating mask", "Broad-spectrum SPF finish"]
      : defaultProducts),
  preparation:
    seed.preparation ??
    (seed.category === "Skincare"
      ? "Share sensitivities and current cosmetic products before the service."
      : defaultPrep),
  aftercare: seed.aftercare ?? defaultAftercare,
  importantNotes:
    seed.importantNotes ??
    (seed.category === "Skincare"
      ? "This cosmetic service is not a medical diagnosis or treatment. A professional assessment is completed before service."
      : "Price and duration are estimates until your in-salon consultation is complete."),
  genderCategory: seed.genderCategory,
  previewIndex: seed.previewIndex,
  visualEffect: serviceVisualEffects[seed.name] ?? {},
  isPopular: index % 3 === 0 || [1, 6, 10, 11, 14, 18, 22, 27].includes(index),
  availableToday: index % 4 !== 2,
  incompatibleWith:
    seed.name === "Precision Sleek Bob"
      ? ["Modern Pixie Detail"]
      : seed.name === "Modern Pixie Detail"
        ? ["Precision Sleek Bob", "Bridal Low Bun"]
        : seed.incompatibleWith,
  variants:
    seed.category === "Hair Colour"
      ? [
          { id: `${index}-short`, name: "Short hair", priceDelta: -800, durationDelta: -20 },
          { id: `${index}-long`, name: "Long hair", priceDelta: 1200, durationDelta: 30 },
        ]
      : undefined,
}));

const s = (name: string) => services.find((service) => service.name === name)?.id ?? "";

export const specialists: Specialist[] = [
  {
    id: "specialist-1",
    name: "Rhea Kapoor",
    specialization: "Cut & Editorial Styling",
    experience: 12,
    rating: 4.9,
    reviewCount: 328,
    serviceIds: [s("Layered Signature Cut"), s("Soft Sculpt Curls"), s("Precision Sleek Bob")],
    nextAvailable: "Today, 4:30 PM",
    spriteIndex: 0,
    bio: "Known for intuitive consultations and movement-led cuts that grow out beautifully.",
  },
  {
    id: "specialist-2",
    name: "Aarav Menon",
    specialization: "Colour Director",
    experience: 14,
    rating: 4.9,
    reviewCount: 274,
    serviceIds: [s("Caramel Dimension Balayage"), s("Chocolate Brown Refresh"), s("Global Luxe Colour")],
    nextAvailable: "Tomorrow, 11:00 AM",
    spriteIndex: 1,
    bio: "A specialist in dimensional brunettes, tonal balance and thoughtful maintenance plans.",
  },
  {
    id: "specialist-3",
    name: "Meher Sethi",
    specialization: "Bridal Makeup Artist",
    experience: 11,
    rating: 5,
    reviewCount: 412,
    serviceIds: [s("Bridal HD Artistry"), s("Wedding Day Signature"), s("Bridal Look Trial")],
    nextAvailable: "Thu, 2:00 PM",
    spriteIndex: 2,
    bio: "Creates expressive yet timeless bridal beauty with meticulous wear and photography testing.",
  },
  {
    id: "specialist-4",
    name: "Ishaan Bose",
    specialization: "Grooming & Texture",
    experience: 9,
    rating: 4.8,
    reviewCount: 191,
    serviceIds: [s("Beard Architecture"), s("Gentleman's Signature Cut"), s("Curl Definition Ritual")],
    nextAvailable: "Today, 6:00 PM",
    spriteIndex: 3,
    bio: "Combines precision grooming with an easy, contemporary approach to natural texture.",
  },
  {
    id: "specialist-5",
    name: "Neil George",
    specialization: "Senior Grooming Artist",
    experience: 10,
    rating: 4.8,
    reviewCount: 220,
    serviceIds: [s("Executive Grooming Edit"), s("Beard Architecture")],
    nextAvailable: "Fri, 12:30 PM",
    spriteIndex: 4,
    bio: "Builds sharp, wearable grooming plans for events and executive schedules.",
  },
  {
    id: "specialist-6",
    name: "Ananya Rao",
    specialization: "Skin & Makeup",
    experience: 8,
    rating: 4.9,
    reviewCount: 286,
    serviceIds: [s("Deep Hydration Facial"), s("No-Makeup Glow"), s("Calming Barrier Facial")],
    nextAvailable: "Tomorrow, 3:30 PM",
    spriteIndex: 5,
    bio: "Focuses on gentle cosmetic rituals and fresh, skin-respecting makeup finishes.",
  },
  {
    id: "specialist-7",
    name: "Rohan D'Souza",
    specialization: "Creative Stylist",
    experience: 7,
    rating: 4.7,
    reviewCount: 144,
    serviceIds: [s("Modern Pixie Detail"), s("Party Ready"), s("Festival Glow Edit")],
    nextAvailable: "Sat, 10:00 AM",
    spriteIndex: 6,
    bio: "Brings a fashion-informed eye to expressive cuts, occasion styling and complete looks.",
  },
  {
    id: "specialist-8",
    name: "Saanvi Iyer",
    specialization: "Bridal Hair & Draping",
    experience: 13,
    rating: 4.9,
    reviewCount: 356,
    serviceIds: [s("Bridal Low Bun"), s("Signature Saree Draping"), s("Hair Accessory Styling")],
    nextAvailable: "Wed, 9:30 AM",
    spriteIndex: 7,
    bio: "A bridal finishing specialist celebrated for secure styling and graceful detail.",
  },
];

export const branches: Branch[] = [
  {
    id: "branch-1",
    name: "GV Studio Lavelle Road",
    address: "18, Lavelle Road, Bengaluru",
    distance: "Central Bengaluru",
    phone: "+91 98765 43210",
    hours: "10:00 AM – 8:00 PM",
  },
  {
    id: "branch-2",
    name: "GV Studio Indiranagar",
    address: "746, 12th Main, Indiranagar, Bengaluru",
    distance: "East Bengaluru",
    phone: "+91 98765 43211",
    hours: "10:00 AM – 8:00 PM",
  },
  {
    id: "branch-3",
    name: "GV Studio Whitefield",
    address: "52, ECC Road, Whitefield, Bengaluru",
    distance: "Whitefield",
    phone: "+91 98765 43212",
    hours: "9:00 AM – 8:00 PM",
  },
];

export const packages: SalonPackage[] = [
  ["Bridal Signature", "A complete wedding-day beauty team with trial, hair, HD makeup and draping.", 24500, 21900, 330, 4],
  ["Groom Complete", "Precision haircut, beard architecture, skin comfort ritual and finishing.", 7800, 6500, 210, 7],
  ["Party Ready", "Soft curls, evening makeup and express finishing for an effortless entrance.", 8200, 7200, 150, 6],
  ["Professional Refresh", "Signature cut, natural makeup and eyebrow grooming for polished confidence.", 5900, 4900, 150, 5],
  ["Hair Transformation", "Consultation-led cut, dimensional colour, bond care and a glossy finish.", 12200, 10500, 270, 3],
  ["Skin & Glow", "Hydration facial, cosmetic radiance ritual and natural makeup finish.", 8200, 6990, 175, 5],
  ["Complete Makeover", "Hair, colour, makeup and finishing coordinated by one senior team.", 16800, 14500, 300, 1],
  ["Festive Edit", "Radiance ritual, festive makeup, hair styling and accessory placement.", 11200, 9500, 240, 6],
].map(([name, description, regularPrice, price, duration, previewIndex], index) => ({
  id: `package-${index + 1}`,
  slug: slugify(String(name)),
  name: String(name),
  description: String(description),
  serviceIds:
    index === 0
      ? [s("Bridal Look Trial"), s("Bridal HD Artistry"), s("Bridal Low Bun"), s("Signature Saree Draping")]
      : index === 1
        ? [s("Gentleman's Signature Cut"), s("Beard Architecture"), s("Deep Hydration Facial")]
        : index === 2
          ? [s("Soft Sculpt Curls"), s("Party Berry Edit")]
          : index === 3
            ? [s("Layered Signature Cut"), s("No-Makeup Glow")]
            : index === 4
              ? [s("Layered Signature Cut"), s("Caramel Dimension Balayage")]
              : index === 5
                ? [s("Deep Hydration Facial"), s("Vitamin C Radiance Ritual"), s("No-Makeup Glow")]
                : index === 6
                  ? [s("Complete Makeover")]
                  : [s("Festival Glow Edit"), s("Hair Accessory Styling")],
  regularPrice: Number(regularPrice),
  price: Number(price),
  duration: Number(duration),
  occasions: index === 0 ? ["Bridal"] : index === 1 ? ["Groom"] : ["Party", "Professional", "Festival"],
  specialistIds: [`specialist-${(index % 8) + 1}`],
  previewIndex: Number(previewIndex),
  featured: index < 3,
}));

export const testimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    name: "Aditi N.",
    occasion: "Bridal Signature",
    quote:
      "The studio helped me settle on a softer bun before my trial. The final consultation felt calm, clear and completely considered.",
    rating: 5,
  },
  {
    id: "testimonial-2",
    name: "Karan M.",
    occasion: "Groom Complete",
    quote:
      "I understood the time, finish and upkeep before I booked. The actual appointment was just as organised.",
    rating: 5,
  },
  {
    id: "testimonial-3",
    name: "Nisha R.",
    occasion: "Party Ready",
    quote:
      "Comparing a natural look with soft glam made the decision easy. I saved the look and my artist already had the brief.",
    rating: 5,
  },
  {
    id: "testimonial-4",
    name: "Leena P.",
    occasion: "Hair Transformation",
    quote:
      "The preview was treated as a reference—not a promise—and the colour consultation was refreshingly honest.",
    rating: 5,
  },
];

export const faqs: FAQ[] = [
  {
    id: "faq-1",
    question: "Are the avatars based on customer photographs?",
    answer:
      "No. Every avatar is a professionally designed, predefined static reference. GV Studio does not ask for or process a customer face or photograph.",
  },
  {
    id: "faq-2",
    question: "Will my final result look exactly like the preview?",
    answer:
      "The preview is an illustrative style reference. Results vary with hair type, skin condition, products, chosen technique and professional assessment.",
  },
  {
    id: "faq-3",
    question: "Are displayed prices final?",
    answer:
      "Prices are estimates until the in-salon consultation confirms length, product use, complexity and timing.",
  },
  {
    id: "faq-4",
    question: "Can I book without an account?",
    answer: "Yes. Review your look, choose a branch and time, then provide only the details needed for your appointment.",
  },
];

const slotTimes = ["10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM", "7:00 PM"];

export const availability: AvailabilitySlot[] = Array.from({ length: 7 }).flatMap((_, dayIndex) =>
  slotTimes.map((time, timeIndex) => ({
    id: `slot-${dayIndex}-${timeIndex}`,
    branchId: branches[(dayIndex + timeIndex) % branches.length].id,
    specialistId: specialists[(dayIndex * 2 + timeIndex) % specialists.length].id,
    date: format(addDays(new Date(), dayIndex + 1), "yyyy-MM-dd"),
    time,
    available: (dayIndex + timeIndex) % 4 !== 0,
  })),
);

export const occasions = [
  "Bridal",
  "Wedding Guest",
  "Party",
  "Festival",
  "Professional",
  "Photoshoot",
  "Everyday Beauty",
  "Complete Makeover",
];
