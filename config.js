// config.js

const CONFIG = {
  BLOCK_DURATION_MINUTES: 5, // ⏳ How long each video is blocked
  WHITELIST_DURATION_MINUTES: 20, // ⏱️ How long a video is unblocked after timer ends

  // 🚨 Bypass settings
  BYPASS_MIN_WORDS: 20, // Minimum words required for bypass justification
  BYPASS_REFLECTION_TIME_SECONDS: 15, // Time in seconds for reflection step
  BYPASS_CONFIRMATION_PHRASE: "JE SUIS SÛR", // Phrase to type to confirm bypass

  // 📅 Schedule settings - blocking is disabled during these time ranges
  SCHEDULE_ENABLED: true, // Enable/disable schedule feature
  ALLOWED_TIME_RANGES: [
    { start: "05:45", end: "07:15" }, // Morning work
    { start: "12:00", end: "14:00" }, // Lunch break
    { start: "20:00", end: "22:00" }, // Evening relaxation
    // Add more ranges as needed
  ],

  // 💭 Inspiring French quotes to motivate getting back to work
  INSPIRING_QUOTES: [
    // Productivity quotes
    "L'avenir appartient à ceux qui se lèvent tôt. - Proverbe français",
    "La discipline est le pont entre les objectifs et l'accomplissement. - Jim Rohn",
    "Le travail acharné bat le talent quand le talent ne travaille pas dur. - Tim Notke",
    "L'action est la clé fondamentale de tout succès. - Pablo Picasso",
    "Ne remettez pas à demain ce que vous pouvez faire aujourd'hui. - Proverbe français",

    // Art quotes
    "L'invention, il faut l'avouer humblement, ne consiste pas à créer à partir du vide mais à partir du chaos. - Mary Shelley",
    "Si vous êtes coincé, éloignez-vous de votre bureau. Promenez-vous, prenez un bain, allez dormir, faites une tarte, dessinez, écoutez de la musique, méditez, faites de l'exercice. - Hilary Mantel",
    "La créativité, c'est l'intelligence qui s'amuse. - Albert Einstein",
    "La créativité prend courage. - Henri Matisse",
    "L'art est la plus sublime mission de l'homme. - Léon Tolstoï",

    // Parenting quotes
    "Les enfants ne sont pas une distraction pour un travail plus important. Ils sont le travail le plus important. - C.S. Lewis",
    "Les enfants ont besoin de votre présence plus que de vos cadeaux. - Jesse Jackson",
    "L'éducation est l'arme la plus puissante que l'on puisse utiliser pour changer le monde. - Nelson Mandela",
    "Les enfants sont les messagers que nous envoyons vers un temps que nous ne verrons pas. - John F. Kennedy",
    "Un parent n'est pas quelqu'un qui donne la vie, mais quelqu'un qui donne l'amour. - Proverbe français",
    "Les enfants ont besoin de modèles plutôt que de critiques. - Joseph Joubert",

    // General motivation
    "La vie est ce qui arrive pendant que vous êtes occupé à faire d'autres projets. - John Lennon",
    "Soyez le changement que vous voulez voir dans le monde. - Mahatma Gandhi",
    "L'avenir appartient à ceux qui croient en la beauté de leurs rêves. - Eleanor Roosevelt",
    "La seule personne que vous êtes destiné à devenir est celle que vous décidez d'être. - Ralph Waldo Emerson",
    "Les choses se passent pour ceux qui vont les chercher. - Benjamin Franklin",
  ],
};

/**
 * Convert HH:MM format to minutes since midnight
 * @param {string} timeStr - Time in "HH:MM" format
 * @returns {number} Minutes since midnight
 */
function timeStringToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Check if the current time is within any of the allowed time ranges
 * @returns {boolean} true if blocking should be disabled (within any allowed time range), false otherwise
 */
function isWithinAllowedSchedule() {
  if (
    !CONFIG.SCHEDULE_ENABLED ||
    !CONFIG.ALLOWED_TIME_RANGES ||
    CONFIG.ALLOWED_TIME_RANGES.length === 0
  ) {
    return false; // Schedule disabled or no ranges defined, blocking is always active
  }

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  // Check if current time falls within any of the allowed ranges
  for (const range of CONFIG.ALLOWED_TIME_RANGES) {
    const startTimeInMinutes = timeStringToMinutes(range.start);
    const endTimeInMinutes = timeStringToMinutes(range.end);

    // Handle case where allowed time spans midnight (e.g., 22:00 to 06:00)
    if (startTimeInMinutes > endTimeInMinutes) {
      if (
        currentTimeInMinutes >= startTimeInMinutes ||
        currentTimeInMinutes <= endTimeInMinutes
      ) {
        return true;
      }
    } else {
      // Normal case where allowed time is within the same day
      if (
        currentTimeInMinutes >= startTimeInMinutes &&
        currentTimeInMinutes <= endTimeInMinutes
      ) {
        return true;
      }
    }
  }

  return false; // Current time is not within any allowed range
}
