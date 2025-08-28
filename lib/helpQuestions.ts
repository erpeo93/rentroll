// lib/helpQuestions.ts

export type HelpQuestion = {
  id: string;
  text: string;
  options: string[];
};

export const improvementQuestions: HelpQuestion[] = [
  {
    id: "why_needed",
    text: "Per cosa avevi in mente di usare il nostro servizio?",
    options: ["Serata giochi", "Festa di compleanno", "Team building", "Evento Scolastico", "Altro"]
  },
  {
    id: "how_often",
    text: "Con quale frequenza organizzeresti eventi che includono i nostri prodotti?",
    options: ["Una volta al mese", "2-3 volte al mese", "Una volta alla settimana", "piu' volte alla settimana", "Occasionalmente"]
  },
  {
    id: "preferred_items",
    text: "Cosa ti piacerebbe vedere nel nostro catalogo?",
    options: ["Piu' giochi da tavolo", "Videogiochi", "Libri", "Film", "Snack e bevande", "Oggetti da collezionismo"]
  }
  // Add more as needed
];