// config.js

const CONFIG = {
  BLOCK_DURATION_MINUTES: 5, // ⏳ How long each video is blocked
  WHITELIST_DURATION_MINUTES: 20, // ⏱️ How long a video is unblocked after timer ends

  // 📅 Schedule settings - blocking is disabled during these time ranges
  SCHEDULE_ENABLED: true, // Enable/disable schedule feature

  // Define multiple time ranges when blocking is disabled (HH:MM format)
  ALLOWED_TIME_RANGES: [
    { start: "12:00", end: "14:00" }, // Lunch break
    { start: "20:00", end: "22:00" }, // Evening relaxation
    // Add more ranges as needed
  ],

  // 💭 Inspiring French quotes to motivate getting back to work
  INSPIRING_QUOTES: [
    // Productivity quotes
    "Le succès, c'est d'aller d'échec en échec sans perdre son enthousiasme. - Winston Churchill",
    "L'avenir appartient à ceux qui se lèvent tôt. - Proverbe français",
    "La discipline est le pont entre les objectifs et l'accomplissement. - Jim Rohn",
    "Chaque expert était autrefois un débutant. - Helen Hayes",
    "Le travail acharné bat le talent quand le talent ne travaille pas dur. - Tim Notke",
    "La seule façon de faire du bon travail est d'aimer ce que vous faites. - Steve Jobs",
    "L'action est la clé fondamentale de tout succès. - Pablo Picasso",
    "Ne remettez pas à demain ce que vous pouvez faire aujourd'hui. - Proverbe français",

    // Art quotes
    "L'art lave notre âme de la poussière du quotidien. - Pablo Picasso",
    "La créativité, c'est l'intelligence qui s'amuse. - Albert Einstein",
    "L'art est un mensonge qui nous permet de réaliser la vérité. - Pablo Picasso",
    "La beauté sauvera le monde. - Fiodor Dostoïevski",
    "L'artiste est un créateur de beauté. - Oscar Wilde",
    "L'art est la plus sublime mission de l'homme. - Léon Tolstoï",
    "La créativité prend courage. - Henri Matisse",
    "L'art est la signature de la civilisation. - Beverly Sills",

    // Parenting quotes
    "Les enfants sont les messagers que nous envoyons vers un temps que nous ne verrons pas. - John F. Kennedy",
    "L'éducation d'un enfant commence vingt ans avant sa naissance. - Napoléon Bonaparte",
    "Un enfant peut enseigner trois choses à un adulte : être content sans raison, être toujours occupé par quelque chose et savoir exiger de toutes ses forces ce qu'il désire. - Paulo Coelho",
    "Les enfants ont besoin de modèles plutôt que de critiques. - Joseph Joubert",
    "L'amour d'une mère pour son enfant ne ressemble à aucun autre sentiment au monde. - Agatha Christie",
    "Élever un enfant, c'est lui apprendre à se passer de nous. - Ernest Legouvé",
    "Les enfants sont comme des éponges, ils absorbent tout ce qui les entoure. - Proverbe français",
    "Un parent n'est pas quelqu'un qui donne la vie, mais quelqu'un qui donne l'amour. - Proverbe français",
    "Les enfants sont l'avenir de demain. - Proverbe français",
    "Il faut tout un village pour élever un enfant. - Proverbe africain",

    // General motivation
    "La vie est ce qui arrive pendant que vous êtes occupé à faire d'autres projets. - John Lennon",
    "Soyez le changement que vous voulez voir dans le monde. - Mahatma Gandhi",
    "L'avenir appartient à ceux qui croient en la beauté de leurs rêves. - Eleanor Roosevelt",
    "Le bonheur n'est pas un but, c'est une façon de voyager. - Margaret Lee Runbeck",
    "La seule personne que vous êtes destiné à devenir est celle que vous décidez d'être. - Ralph Waldo Emerson",
    "Votre limitation - c'est seulement votre imagination.",
    "Les choses se passent pour ceux qui vont les chercher. - Benjamin Franklin",
    "Croyez en vous et tout deviendra possible. - Proverbe français",
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
