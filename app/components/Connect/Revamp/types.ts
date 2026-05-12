export type Mode = "college" | "course";

export type AlumniCard = {
  id: string;
  code: string;
  initials: string;
  variant?: "av-2" | "av-3" | "av-4" | "av-5" | "av-6" | "av-7" | "av-8";
  title: string;
  subtitle: string;
  rating: string;
  sessions: string;
  available?: boolean;
};

export type Group = {
  key: string;
  short: string;
  iconClass: "g1" | "g2" | "g3" | "g4" | "g5" | "g6";
  name: string;
  meta: string;
  cards: AlumniCard[];
};
