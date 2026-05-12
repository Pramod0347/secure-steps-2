import { Group } from "./types";

export const collegeGroups: Group[] = [
  {
    key: "manchester",
    short: "UoM",
    iconClass: "g1",
    name: "University of Manchester",
    meta: "Russell Group · UK · 4 alumni available",
    cards: [
      { id: "ss-0421", code: "SS-0421 · Alumni", initials: "AK", title: "MSc Data Science", subtitle: "Class of 2024 · Ex-Flipkart", rating: "4.9", sessions: "38", available: true },
      { id: "ss-0488", code: "SS-0488 · Alumni", initials: "PS", variant: "av-2", title: "MSc Business Analytics", subtitle: "Class of 2023 · Deloitte", rating: "4.8", sessions: "22", available: true },
      { id: "ss-0551", code: "SS-0551 · Student Y2", initials: "RM", variant: "av-3", title: "MSc Finance", subtitle: "Year 2 · ongoing", rating: "5.0", sessions: "14" },
      { id: "ss-0622", code: "SS-0622 · Alumni", initials: "SK", variant: "av-4", title: "MSc Computer Science", subtitle: "Class of 2024 · Amazon UK", rating: "4.9", sessions: "19", available: true },
    ],
  },
  {
    key: "warwick",
    short: "WBS",
    iconClass: "g2",
    name: "University of Warwick",
    meta: "Russell Group · UK · 4 alumni available",
    cards: [
      { id: "ss-0189", code: "SS-0189 · Student Y2", initials: "RS", variant: "av-5", title: "MBA (WBS)", subtitle: "Year 2 · ex-Consulting", rating: "5.0", sessions: "42", available: true },
      { id: "ss-0344", code: "SS-0344 · Alumni", initials: "DT", variant: "av-6", title: "MSc Marketing", subtitle: "Class of 2024 · Unilever", rating: "4.9", sessions: "18" },
      { id: "ss-0402", code: "SS-0402 · Alumni", initials: "KN", variant: "av-7", title: "MSc Economics", subtitle: "Class of 2023 · Bank of England", rating: "4.8", sessions: "26", available: true },
      { id: "ss-0498", code: "SS-0498 · Student Y1", initials: "AV", variant: "av-8", title: "MSc Int. Management", subtitle: "Year 1 · ongoing", rating: "5.0", sessions: "9", available: true },
    ],
  },
];

export const courseGroups: Group[] = [
  {
    key: "ds",
    short: "DS",
    iconClass: "g3",
    name: "Data Science & Analytics",
    meta: "Across UK/USA · 6 mentors",
    cards: [
      { id: "ss-0421", code: "SS-0421 · Alumni", initials: "AK", title: "UoM · MSc Data Science", subtitle: "Class of 2024 · Ex-Flipkart", rating: "4.9", sessions: "38", available: true },
      { id: "ss-0194", code: "SS-0194 · Alumni", initials: "MJ", variant: "av-2", title: "UCL · MSc Data Science", subtitle: "Class of 2023 · Revolut", rating: "4.8", sessions: "17", available: true },
      { id: "ss-0771", code: "SS-0771 · Student Y2", initials: "NT", variant: "av-3", title: "CMU · MS Analytics", subtitle: "Year 2 · ongoing", rating: "4.9", sessions: "11" },
      { id: "ss-0512", code: "SS-0512 · Alumni", initials: "KR", variant: "av-4", title: "Edinburgh · MSc DS", subtitle: "Class of 2024 · Tesco Tech", rating: "5.0", sessions: "24", available: true },
    ],
  },
  {
    key: "mba",
    short: "MBA",
    iconClass: "g4",
    name: "MBA & Management",
    meta: "Across UK/Europe · 5 mentors",
    cards: [
      { id: "ss-0189", code: "SS-0189 · Student Y2", initials: "RS", variant: "av-5", title: "Warwick MBA", subtitle: "Year 2 · ex-Consulting", rating: "5.0", sessions: "42", available: true },
      { id: "ss-0901", code: "SS-0901 · Alumni", initials: "PJ", variant: "av-6", title: "HEC Paris MBA", subtitle: "Class of 2023 · L'Oreal", rating: "4.8", sessions: "21" },
      { id: "ss-0887", code: "SS-0887 · Alumni", initials: "DN", variant: "av-7", title: "Imperial MBA", subtitle: "Class of 2024 · Barclays", rating: "4.9", sessions: "19", available: true },
      { id: "ss-1024", code: "SS-1024 · Student Y1", initials: "SU", variant: "av-8", title: "INSEAD MiM", subtitle: "Year 1 · ongoing", rating: "4.9", sessions: "8", available: true },
    ],
  },
];

export const filterChips = ["All", "UK", "USA", "Canada", "Russell Group", "Ivy League", "Available now"];

export const alumniDirectory = [
  ...collegeGroups.flatMap((group) => group.cards),
  ...courseGroups.flatMap((group) => group.cards),
].reduce<typeof collegeGroups[0]["cards"]>((acc, card) => {
  if (!acc.find((item) => item.id === card.id)) acc.push(card);
  return acc;
}, []);
