// Shared word bank for Lasagna Ipsum. Plain ESM so both the browser and the
// Netlify function can import it without a build step.

export const WORDS = [
  "lasagna", "ragu", "besciamella", "pasta", "sfoglia", "mozzarella",
  "parmigiano", "reggiano", "ricotta", "pecorino", "provolone", "burrata",
  "pomodoro", "basilico", "origano", "aglio", "cipolla", "carota",
  "sedano", "soffritto", "pancetta", "guanciale", "salsiccia", "manzo",
  "vitello", "maiale", "brodo", "vino", "rosso", "bianco",
  "forno", "teglia", "strato", "strati", "crosta", "gratinato",
  "al", "dente", "mantecato", "condito", "farcito", "abbondante",
  "noce", "moscata", "pepe", "sale", "olio", "extravergine",
  "burro", "farina", "uovo", "semola", "grano", "duro",
  "nonna", "domenica", "pranzo", "famiglia", "tavola", "bis",
  "porzione", "forchetta", "cucchiaio", "coltello", "piatto", "fondo",
  "profumo", "vapore", "filante", "croccante", "morbido", "cremoso",
  "saporito", "delizioso", "generoso", "caldo", "fumante", "dorato",
  "riposare", "tagliare", "servire", "impastare", "stendere", "infornare",
  "emilia", "romagna", "bologna", "napoli", "sicilia", "toscana",
  "trattoria", "osteria", "cucina", "ricetta", "segreto", "tradizione",

  // The everyday Italian everyone knows, food-adjacent or not.
  "ciao", "salve", "prego", "grazie", "mille", "scusi",
  "favore", "buongiorno", "buonasera", "buonanotte", "arrivederci", "pronto",
  "allora", "ecco", "certo", "davvero", "veramente", "subito",
  "basta", "forza", "andiamo", "mangia", "piano", "presto",
  "bravo", "bravissimo", "benissimo", "perfetto", "magnifico", "meraviglioso",
  "squisito", "gustoso", "appetito", "buon", "cin", "salute",
  "amore", "amico", "bello", "bella", "dolce", "festa",
  "mamma", "mia", "molto", "sempre", "grande", "gusto"
];

export const OPENERS = [
  "Lasagna ipsum dolor sit amet",
  "Lorem lasagna al forno",
  "Ipsum ragu della nonna",
  "Besciamella ipsum dolor",
  "Lasagna ipsum sfoglia sottile"
];

export const PUNCTUATION = [".", ".", ".", ".", "!", "?", "..."];
