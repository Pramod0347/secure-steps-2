import type { StaticImageData } from "next/image"

// Images
import StickyImg1 from "@/app/assets/Home/Sticky-1.png"
import StayImg from "@/app/assets/Home/Sticky-2.png"
import ConnectImg from "@/app/assets/Home/Sticky-3.png"
import CommunityImg from "@/app/assets/Home/Sticky-4.png"

// Icons
import SelectIcon from "@/app/assets/Home/SelectIcon.svg"
import StayIcon from "@/app/assets/Home/StayIcon.svg"
import ConnectIcon from "@/app/assets/Home/ConIcon.svg"
import CommunityIcon from "@/app/assets/Home/ComIcon.svg"

interface Feature {
  text: string
}

interface ContentCard {
  id?: string
  title: string
  tier?: string
  price?: string
  description?: string
  variant: "blue" | "red"
  features?: Feature[]
  feature2?:Feature[]
}

interface StickyScrollItem {
  id: string
  image: string | StaticImageData
  icon: string
  topInfo?: string
  description: string
  price?: string
  priceNote?: string
  contentCards?: ContentCard[]
  learnMoreLink?: string
  location?: string
  overlayTitle?: string
}

const StickyScrollData: StickyScrollItem[] = [
  {
    id: "select",
    image: StickyImg1,
    icon: SelectIcon,
    description:
      "Seek clarity on which is the best path ahead for you. Talk to our experts and understand the academic programs best-suited to your interests, aptitude and talents.",
    price:"2,999",
    contentCards: [
      {
        title: "5 ways to prep",
        description: "for your higher education degree: how to upskill and meet requirements for a successful journey.",
        variant: "blue",
      },
      {
        title: "7 mistakes",
        description: "to avoid while choosing the right course and the country to pursue it in.",
        variant: "blue",
      },
      {
        title: "8 Career strategies",
        description: "you must know before you kickstart your higher education journey.",
        variant: "blue",
      },
      {
        title: "Psychometric Assessments",
        description: "to discover your hidden passion and shape your career with ease!",
        variant: "blue",
      },
    ],
    learnMoreLink: "/counselling",
  },
  {
    id: "connect",
    image: StayImg,
    icon: ConnectIcon,
    topInfo: "*The pricing includes the application fee for all universities",
    description:
      "Zero Stress, Zero Hidden Costs – Just Admissions Done Right!.Trying to figure out how admission processes work and what documents are required at every stage of the process can be daunting if you don't know what you're doing. Let the experts handle the process while you focus on your journey.",
    contentCards: [
      {
        title: "Secure Support",
        price:" 9,999",
        description: "We'll guide to navigate to the process.",
        variant: "blue",
        features: [
          { text: "Part-time Job Guidance" },
          { text: "International Banking Support" },
          { text: "International SIM Assistance" },
          { text: "Career Counseling" },
          { text: "Lifestyle Improvement Tips" },
          { text: "Credit Score Management" },
          
        ],
        feature2:[
         
          { text: "University Applications" },
          { text: "Document Preparation" },
          { text: "Application Tracking" },
          { text: "Admission Guidance" },
          { text: "Pre-departure Support" }
        ]
      },
    ],
    learnMoreLink: "/success",
  },
  {
    id: "stay",
    image: ConnectImg,
    icon: StayIcon,
    topInfo: "*The pricing does not include the application fee for the university",
    description:
      "Navigating university applications can be overwhelming, but with this package, you don’t have to worry about a thing! we cover ALL your university application fees no extra charges, no surprises. One payment, total peace of mind. Ready to begin? Get Started Now!",
    contentCards: [
      {
        title: "UK Universities",
        tier: "Apply to 3 Tier-1 & 4 Tier-2",
        price:"29,999",
        variant: "blue",
        features: [
          { text: "University Applications" },
          { text: "Document Preparation" },
          { text: "Application Tracking" },
          { text: "Admission Guidance" },
          { text: "Pre-departure Support" }
        ]
      },
      {
        title: "USA/ Dubai/ Australia/ Canada",
        tier: "Apply to 3 Ivy League & 4 Tier-2",
        // tier: "3 Ivy League & 4 Tier 2",
        price:"69,999",
        variant: "blue",
        features: [
          { text: "Premium University Selection" },
          { text: "Personalized Application Strategy" },
          { text: "Interview Preparation" },
          { text: "Scholarship Application" },
          { text: "Visa Counseling" }
        ]
      },
    ],
    learnMoreLink: "/admissions",
  },
  {
    id: "community",
    image: CommunityImg,
    icon: CommunityIcon,
    description:
      "At Secure Steps, we promise to stand with you to get your cozy home in the UK.",
    location: "UK",
    contentCards: [
      {
        title: "Cost Per Individual",
        price: "15,000",
        variant: "blue",
        features: [
          { text: "All Pre-departure Services" },
          { text: "Afforable Accommodation" },
          { text: "Find You a FlatMate" },
          { text: "Guarantor" },
          { text: "Documentation Assistance" },
          { text: "Rental Negotiation" }
        ]
      }
    ],
    learnMoreLink: "/uk-package",
  },
]

export default StickyScrollData