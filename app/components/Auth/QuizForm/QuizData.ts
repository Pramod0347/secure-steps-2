
type AuthQuestion = {
    id: number
    question: string
    caption?: string
    options?: string[]
    type?: "text" | "email" | "tel" | "otp" | "email-phone"
  }


const AuthQuestion: AuthQuestion[] = [
  { id: 0, question: "What's your name?", type: "text" },
  {
    id: 1,
    question: "Where's Your Dream Campus?",
    caption: "Think big, think global! 🌎",
    options: ["United Kingdom", "United States", "Europe Region", "Ireland", "Australia", "Singapore", "UAE", "Canada"],
  },
  {
    id: 2,
    question: "How Did Your Family Celebrate Your 12th-Grade Results?",
    options: [
      "10-70%: A small treat",
      "70-80%: A couple of cakes",
      "80-90%: A dessert party",
      "90-100%: A truckload of sweets",
    ],
  },
  {
    id: 3,
    question: "Did You (or Your Parents) Dream of You Becoming...",
    options: ["Engineer (PCM)", "Doctor (BIPC)", "Chartered Accountant (CEC)", "Something else (tell us your dream!)"],
  },
  {
    id: 4,
    question: "How Would You Describe Your University Grades and GPA?",
    options: [
      "A (3.7 - 4.0) – Above and beyond!",
      "B (2.7 - 3.6) – Good, but could be better.",
      "C (1.7 - 2.6) – Can't eat dinner without stressing.",
      "D (1.0 - 1.6) – Please don't come home (yet)",
      "F (Below 1.0) – Might need a new family (just kidding... maybe)",
    ],
  },
  {
    id: 5,
    question: "When Did You Get Your First Job? And How Long Were You in 'Ghost Mode' (Gap year) After Graduation?",
    options: [
      "3-6 months—quick o the mark!",
      "6-12 months—took a bit of time to find the right fit.",
      "Never went into ghost mode—job came right away!",
      "Still in ghost mode—where's the job fairy when you need one?",
    ],
  },
  {
    id: 6,
    question: "What Does Your Dream Career Look Like?",
    options: [
      "A techie role—coding, building, and innovating.",
      "A management role—leading teams, making decisions.",
      "A data scientist—uncovering insights through data.",
      "An entrepreneur—starting my own venture.",
      "Something else—tell us your dream career!",
    ],
  },
  { id: 7, question: "What's your email address and phone number?", type: "email-phone" },
  { id: 8, question: "Please enter the OTP sent to your email", type: "otp" },
]

export default AuthQuestion;
