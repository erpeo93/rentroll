export type Product = {
  id: string;
  name: string;
  category: "board game" | "video game" | "book" | "film";
  value: number; // Monetary value for balance logic
};