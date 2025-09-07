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
