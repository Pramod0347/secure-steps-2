import { AlumniCard } from "../Revamp/types";

export type AlumniProfileModel = {
  profile: AlumniCard;
  currentRole: string;
  profileCode: string;
  universityLine: string;
};

export function getCurrentRole(subtitle: string) {
  const lower = subtitle.toLowerCase();
  if (lower.includes("flipkart")) return "Data Scientist at Flipkart UK";
  if (lower.includes("deloitte")) return "Consultant at Deloitte";
  if (lower.includes("amazon")) return "Engineer at Amazon UK";
  if (lower.includes("bank")) return "Analyst at Bank of England";
  return "Working professional";
}

export function buildAlumniProfileModel(profile: AlumniCard): AlumniProfileModel {
  return {
    profile,
    currentRole: getCurrentRole(profile.subtitle),
    profileCode: profile.code.split("·")[0].trim(),
    universityLine: profile.subtitle.split("·")[0]?.trim() || profile.subtitle,
  };
}

export const sessionItems = [
  { type: "1:1 Call", name: "Quick Chat", desc: "Ask specific questions about college life and first semester setup.", duration: "30 min", price: "₹999" },
  { type: "1:1 Call", name: "Deep Dive Session", desc: "Career path, subject selection and internship strategy discussion.", duration: "60 min", price: "₹1,799" },
  { type: "Priority DM", name: "7-day Priority DM", desc: "Text support for one week with responses on priority.", duration: "7 days", price: "₹1,299" },
  { type: "Digital Guide", name: "Course + City Guide", desc: "Detailed PDF notes on modules, housing and budgeting.", duration: "Instant", price: "₹699" },
] as const;

export const tabs = ["All", "1:1 Call", "Priority DM", "Digital Guide"] as const;
