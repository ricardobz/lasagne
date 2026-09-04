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

// The one line the UI checkbox and the README both name by hand. It is a single
// string, not a pool: promising a specific opening line and then rolling a die
// over five of them is how the toggle used to deliver it 20% of the time.
export const CLASSIC_OPENER = "Lasagna ipsum dolor sit amet";

// Italian brainrot: the AI-meme creature names. Kept as whole phrases rather
// than single tokens, since the joke only survives if the name stays intact.
export const BRAINROT = [
  "tralalero tralala", "bombardiro crocodilo", "tung tung tung sahur",
  "lirili larila", "boneca ambalabu", "brr brr patapim",
  "cappuccino assassino", "ballerina cappuccina", "chimpanzini bananini",
  "trippi troppi", "bombombini gusini", "frigo camelo",
  "la vaca saturno saturnita", "glorbo fruttodrillo", "burbaloni luliloli",
  "trulimero trulicina", "orangutini ananasini", "zibra zubra zibralini",
  "girafa celeste", "crocodilo potatino", "talpa di ferro",
  "svinino bombondino", "bobrito bandito", "tigroligre frutonni",
  "cocofanto elefanto", "rhino toasterino", "blueberrinni octopusini",
  "graipuss medussi", "bananita dolphinita", "perochello lemonchello",
  "espresso signora", "tortinni porcinni", "pot hotspot",
  "u din din din dun", "tric trac baraboom"
];

export const BRAINROT_OPENERS = [
  "Tralalero tralala ipsum dolor sit amet",
  "Bombardiro crocodilo ipsum lasagna",
  "Tung tung tung sahur ipsum dolor",
  "Lasagna ipsum brr brr patapim"
];

export const PUNCTUATION = [".", ".", ".", ".", "!", "?", "..."];
