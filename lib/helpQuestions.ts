// lib/helpQuestions.ts

export type HelpQuestion = {
  id: string;
  text: string;
  options: string[];
};

export const improvementQuestions: HelpQuestion[] = [
  {
    id: "why_needed",
    text: "What would you use our service for?",
    options: ["Game nights", "Birthday parties", "Team building", "School events", "Other"]
  },
  {
    id: "how_often",
    text: "How often would you rent items?",
    options: ["Once a month", "2-3 times a month", "Weekly", "Only occasionally"]
  },
  {
    id: "preferred_items",
    text: "What types of items would you be most interested in?",
    options: ["Board Games", "Video Games", "Books", "Films", "Snacks"]
  }
  // Add more as needed
];