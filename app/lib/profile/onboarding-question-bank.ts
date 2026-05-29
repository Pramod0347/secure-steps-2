import { EducationLevel, OnboardingAnswerType } from "@prisma/client"

export type OnboardingQuestionDef = {
  key: string
  label: string
  answerType: OnboardingAnswerType
  options?: string[]
  required?: boolean
}

type QuestionBank = Record<EducationLevel, OnboardingQuestionDef[]>

export const ONBOARDING_QUESTION_BANK: QuestionBank = {
  HIGH_SCHOOL: [],
  BACHELOR: [
    {
      key: "preferred_intake",
      label: "Preferred Intake",
      answerType: "SINGLE_SELECT",
      options: ["SEP 26", "JULY 26", "JAN 27", "MAR 27", "LATER"],
    },
    {
      key: "overall_percentage_12th",
      label: "Overall percentage in 12th class",
      answerType: "TEXT",
      required: true,
    },
    {
      key: "subject_combinations_12th_ibdp",
      label: "Subject combinations in 12th class or IBDP",
      answerType: "TEXT",
      required: true,
    },
    {
      key: "board_12th",
      label: "Board in 12th class",
      answerType: "SINGLE_SELECT",
      options: ["CBSE", "ICSE", "IB", "STATE", "OTHER"],
    },
    {
      key: "ibdp_score_band",
      label: "IBDP point score band",
      answerType: "SINGLE_SELECT",
      options: ["24-31", "32-38", "39-45", "NA"],
    },
    {
      key: "year_of_passing_12th",
      label: "Year of passing 12th class",
      answerType: "TEXT",
      required: true,
    },
    {
      key: "backlogs_or_repeats",
      label: "No. of backlogs/repeats",
      answerType: "TEXT",
      required: true,
    },
    {
      key: "education_gap",
      label: "Education gap (between studies / after studies)",
      answerType: "SINGLE_SELECT",
      options: ["NO GAPS", "1 YR GAP", "2 YR GAP", "3 YR GAP", "3+ YR GAP"],
    },
    {
      key: "work_experience_band",
      label: "Work experience / internship project",
      answerType: "SINGLE_SELECT",
      options: ["NO", "0-6 MONTHS", "6-12 MONTHS", "12+ MONTHS"],
    },
    {
      key: "overall_ielts_score",
      label: "Overall IELTS score",
      answerType: "TEXT",
    },
    {
      key: "individual_ielts_toefl_pte_scores",
      label: "Individual IELTS / TOEFL / PTE scores",
      answerType: "TEXT",
    },
    {
      key: "sat_score_band",
      label: "SAT score band",
      answerType: "SINGLE_SELECT",
      options: ["NOT APPEARED", "1400-1600", "1300-1399", "1200-1300", "1100-1199", "920-1099", "400-919"],
    },
    {
      key: "budget_constraint",
      label: "Budget constraint (total program cost)",
      answerType: "SINGLE_SELECT",
      options: ["NO CONSTRAINT", "30-40 LAKHS", "20-30 LAKHS", "10-20 LAKHS", "LESS THAN 10 LAKHS"],
    },
    {
      key: "country_preferences",
      label: "Country preference (max 2)",
      answerType: "MULTI_SELECT",
      options: ["USA", "Canada", "UK", "Australia", "New Zealand", "Ireland", "Germany", "Rest Europe", "Malaysia", "Singapore", "Other Countries"],
    },
    {
      key: "previous_visa_rejection",
      label: "Previous visa rejections (if any)",
      answerType: "SINGLE_SELECT",
      options: ["NO", "YES"],
    },
    {
      key: "travel_history",
      label: "Travel history (countries visited)",
      answerType: "TEXT",
    },
    {
      key: "course_preference",
      label: "Course preference",
      answerType: "TEXT",
      required: true,
    },
    {
      key: "university_preference",
      label: "University/college preference",
      answerType: "TEXT",
    },
    {
      key: "program_type",
      label: "Program type sought",
      answerType: "SINGLE_SELECT",
      options: ["DEGREE PROGRAM", "DIPLOMA PROGRAM", "CERTIFICATE"],
    },
    {
      key: "expectations",
      label: "Your expectations",
      answerType: "TEXT",
    },
    {
      key: "emergency_contact_number",
      label: "Emergency contact number",
      answerType: "TEXT",
      required: true,
    },
  ],
  MASTER: [
    {
      key: "preferred_intake",
      label: "Preferred Intake",
      answerType: "SINGLE_SELECT",
      options: ["SEP 26", "JULY 26", "JAN 27", "MAR 27", "LATER"],
    },
    {
      key: "overall_percentage_12th",
      label: "Overall percentage in 12th class",
      answerType: "TEXT",
      required: true,
    },
    {
      key: "subject_combinations_12th_ibdp",
      label: "Subject combinations in 12th class or IBDP",
      answerType: "TEXT",
      required: true,
    },
    {
      key: "board_12th",
      label: "Board in 12th class",
      answerType: "SINGLE_SELECT",
      options: ["CBSE", "ICSE", "IB", "STATE", "OTHER"],
    },
    {
      key: "ibdp_score_band",
      label: "IBDP point score band",
      answerType: "SINGLE_SELECT",
      options: ["24-31", "32-38", "39-45", "NA"],
    },
    {
      key: "graduation_course_name",
      label: "Graduation (UG) course name",
      answerType: "TEXT",
      required: true,
    },
    {
      key: "graduation_duration",
      label: "Graduation duration",
      answerType: "SINGLE_SELECT",
      options: ["5 YEARS", "4 YEARS", "3 YEARS", "2 YEARS", "LESS THAN 2 YEARS"],
    },
    {
      key: "bachelors_percentage_or_cgpa",
      label: "Overall % or CGPA in Bachelors",
      answerType: "TEXT",
      required: true,
    },
    {
      key: "year_of_passing_12th",
      label: "Year of passing 12th class",
      answerType: "TEXT",
      required: true,
    },
    {
      key: "year_of_passing_graduation",
      label: "Year of passing graduation",
      answerType: "TEXT",
      required: true,
    },
    {
      key: "backlogs_or_repeats",
      label: "No. of backlogs/repeats",
      answerType: "TEXT",
      required: true,
    },
    {
      key: "education_gap",
      label: "Education gap (between studies / after studies)",
      answerType: "SINGLE_SELECT",
      options: ["NO GAPS", "1 YR GAP", "2 YR GAP", "3 YR GAP", "3+ YR GAP"],
    },
    {
      key: "work_experience_band",
      label: "Work experience / internship",
      answerType: "SINGLE_SELECT",
      options: ["NO", "0-6 MONTHS", "6-12 MONTHS", "2 YEARS", "3 YEARS", "3+ YEARS"],
    },
    {
      key: "overall_ielts_toefl_pte",
      label: "Overall IELTS / TOEFL / PTE score or expected",
      answerType: "TEXT",
      required: true,
    },
    {
      key: "individual_ielts_toefl_pte_scores",
      label: "Individual IELTS / TOEFL / PTE scores",
      answerType: "TEXT",
    },
    {
      key: "gmat_band",
      label: "GMAT score band",
      answerType: "SINGLE_SELECT",
      options: ["NOT APPEARED", "700-800", "600-699", "500-599", "450-499", "300-449"],
    },
    {
      key: "gre_band",
      label: "GRE score band",
      answerType: "SINGLE_SELECT",
      options: ["NOT APPEARED", "310-360", "300-310", "286-300", "279-285", "200-278"],
    },
    {
      key: "budget_constraint",
      label: "Budget constraint (total program cost)",
      answerType: "SINGLE_SELECT",
      options: ["NO CONSTRAINT", "30-40 LAKHS", "20-30 LAKHS", "10-20 LAKHS", "LESS THAN 10 LAKHS"],
    },
    {
      key: "country_preferences",
      label: "Country preference (max 2)",
      answerType: "MULTI_SELECT",
      options: ["USA", "Canada", "UK", "Australia", "New Zealand", "Ireland", "Germany", "Rest Europe", "Malaysia", "Singapore", "Other Countries"],
    },
    {
      key: "previous_visa_rejection",
      label: "Previous visa rejections (if any)",
      answerType: "SINGLE_SELECT",
      options: ["NO", "YES"],
    },
    {
      key: "course_preference_pg",
      label: "Course preference for post graduation",
      answerType: "TEXT",
      required: true,
    },
    {
      key: "university_preference",
      label: "University/college preference",
      answerType: "TEXT",
    },
    {
      key: "program_type_pg",
      label: "Program type sought",
      answerType: "SINGLE_SELECT",
      options: ["DEGREE", "DIPLOMA", "CERTIFICATE"],
    },
    {
      key: "expectations",
      label: "Your expectations",
      answerType: "TEXT",
    },
    {
      key: "emergency_contact_number",
      label: "Emergency contact number",
      answerType: "TEXT",
      required: true,
    },
  ],
  PHD: [
    {
      key: "preferred_intake",
      label: "Preferred Intake",
      answerType: "SINGLE_SELECT",
      options: ["SEP 26", "JULY 26", "JAN 27", "MAR 27", "LATER"],
    },
    {
      key: "overall_percentage_12th",
      label: "Overall percentage in 12th class",
      answerType: "TEXT",
      required: true,
    },
    {
      key: "overall_score_10th",
      label: "Overall score in 10th class",
      answerType: "TEXT",
      required: true,
    },
    {
      key: "overall_score_12th",
      label: "Overall score in 12th class",
      answerType: "TEXT",
      required: true,
    },
    {
      key: "subject_combinations_12th_ibdp",
      label: "Subject combinations in 12th class or IBDP",
      answerType: "TEXT",
      required: true,
    },
    {
      key: "board_12th",
      label: "Board in 12th class",
      answerType: "SINGLE_SELECT",
      options: ["CBSE", "ICSE", "IB", "STATE", "OTHER"],
    },
    {
      key: "ibdp_score_band",
      label: "IBDP point score band",
      answerType: "SINGLE_SELECT",
      options: ["24-31", "32-38", "39-45", "NA"],
    },
    {
      key: "emergency_contact_number",
      label: "Emergency contact number",
      answerType: "TEXT",
      required: true,
    },
    {
      key: "graduation_course_name",
      label: "Graduation (UG) course name",
      answerType: "TEXT",
      required: true,
    },
    {
      key: "graduation_duration",
      label: "Graduation duration",
      answerType: "SINGLE_SELECT",
      options: ["5 YEARS", "4 YEARS", "3 YEARS", "2 YEARS", "LESS THAN 2 YEARS"],
    },
    {
      key: "overall_score_graduation",
      label: "Overall score in graduation",
      answerType: "TEXT",
      required: true,
    },
    {
      key: "post_graduation_course_name",
      label: "Post graduation (PG) course name",
      answerType: "SINGLE_SELECT",
      options: ["NO", "YES"],
    },
    {
      key: "post_graduation_duration",
      label: "Post graduation (PG) duration",
      answerType: "SINGLE_SELECT",
      options: ["1 YEAR", "2 YEARS", "3 YEARS", "LESS THAN 2 YEARS"],
    },
    {
      key: "overall_score_post_graduation",
      label: "Overall score in post graduation",
      answerType: "TEXT",
      required: true,
    },
    {
      key: "work_experience_band",
      label: "Work experience / internship",
      answerType: "SINGLE_SELECT",
      options: ["NO", "0-6 MONTHS", "6-12 MONTHS", "2 YEARS", "3 YEARS", "3+ YEARS"],
    },
    {
      key: "education_gap",
      label: "Education gap (between studies / after studies)",
      answerType: "SINGLE_SELECT",
      options: ["NO GAPS", "1 YR GAP", "2 YR GAP", "3 YR GAP", "3+ YR GAP"],
    },
    {
      key: "overall_ielts_toefl_pte",
      label: "Overall IELTS / TOEFL / PTE score or expected",
      answerType: "TEXT",
      required: true,
    },
    {
      key: "individual_ielts_toefl_pte_scores",
      label: "Individual IELTS / TOEFL / PTE scores",
      answerType: "TEXT",
    },
    {
      key: "gmat_band",
      label: "GMAT score band",
      answerType: "SINGLE_SELECT",
      options: ["NOT APPEARED", "700-800", "600-699", "500-599", "450-499", "300-449"],
    },
    {
      key: "gre_band",
      label: "GRE score band",
      answerType: "SINGLE_SELECT",
      options: ["NOT APPEARED", "310-360", "300-310", "286-300", "279-285", "200-278"],
    },
    {
      key: "budget_constraint",
      label: "Budget constraint (total program cost)",
      answerType: "SINGLE_SELECT",
      options: ["NO CONSTRAINT", "30-40 LAKHS", "20-30 LAKHS", "10-20 LAKHS", "LESS THAN 10 LAKHS"],
    },
    {
      key: "country_preferences",
      label: "Country preference (max 2)",
      answerType: "MULTI_SELECT",
      options: ["USA", "Canada", "UK", "Australia", "New Zealand", "Ireland", "Germany", "Rest Europe", "Malaysia", "Singapore", "Other Countries"],
    },
    {
      key: "previous_visa_rejection",
      label: "Previous visa rejections (if any)",
      answerType: "SINGLE_SELECT",
      options: ["NO", "YES"],
    },
    {
      key: "travel_history",
      label: "Travel history (countries visited)",
      answerType: "TEXT",
    },
    {
      key: "course_preference",
      label: "Course preference and specialization",
      answerType: "TEXT",
      required: true,
    },
    {
      key: "age_consideration_preference",
      label: "Age consideration preference",
      answerType: "TEXT",
    },
    {
      key: "university_preference",
      label: "University/college preference",
      answerType: "TEXT",
    },
    {
      key: "program_type_phd",
      label: "Program type sought",
      answerType: "SINGLE_SELECT",
      options: ["POST GRADUATION DEGREE PROGRAM", "PHD PROGRAM", "POST GRADUATION DIPLOMA PROGRAM"],
    },
    {
      key: "expectations",
      label: "Your expectations",
      answerType: "TEXT",
    },
  ],
}
