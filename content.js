function isVideoPage(url) {
  return url.includes("watch?v=");
}

function isHomePage(url) {
  // Check if it's the YouTube homepage (youtube.com or youtube.com/)
  return (
    url === "https://www.youtube.com/" || url === "https://www.youtube.com"
  );
}

function getVideoId(url) {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

function handleNavigation(url) {
  // Check if it's a video page or homepage that should be blocked
  const isVideo = isVideoPage(url);
  const isHome = isHomePage(url);

  if (!isVideo && !isHome) return;

  if (window._lastCheckedUrl === url) return;
  window._lastCheckedUrl = url;

  // 📅 Check if we're within the allowed schedule - if so, skip blocking
  if (isWithinAllowedSchedule()) {
    console.log("Within allowed schedule - blocking disabled");
    return;
  }

  chrome.storage.local.get(
    ["whitelist", "blockTimers", "blockDurationMinutes"],
    (data) => {
      const whitelist = data.whitelist || {};
      const now = Date.now();

      // For video pages, check whitelist
      if (isVideo) {
        const videoId = getVideoId(url);
        if (!videoId) return;

        // ✅ Check if videoId is in whitelist and not expired
        if (whitelist[videoId]) {
          if (now < whitelist[videoId]) {
            // Still within 20 min grace period — skip block
            return;
          } else {
            // Expired — remove from whitelist
            delete whitelist[videoId];
            chrome.storage.local.set({ whitelist });
          }
        }
      }

      const blockTimers = data.blockTimers || {};
      const blockDuration = CONFIG.BLOCK_DURATION_MINUTES * 60 * 1000;
      const newEndTime = now + blockDuration;

      // Use a consistent key for homepage blocking
      const blockKey = isHome ? "youtube_homepage" : url;
      blockTimers[blockKey] = { endTime: newEndTime };

      chrome.storage.local.set({ blockTimers }, () => {
        const blockUrl =
          chrome.runtime.getURL("block.html") +
          "?until=" +
          newEndTime +
          "&redirect=" +
          encodeURIComponent(url);
        window.location.href = blockUrl;
      });
    }
  );
}

function setupNavigationWatcher() {
  // Initial check
  handleNavigation(window.location.href);

  // Patch history API
  const pushState = history.pushState;
  const replaceState = history.replaceState;

  history.pushState = function (...args) {
    const result = pushState.apply(this, args);
    setTimeout(() => handleNavigation(window.location.href), 50);
    return result;
  };

  history.replaceState = function (...args) {
    const result = replaceState.apply(this, args);
    setTimeout(() => handleNavigation(window.location.href), 50);
    return result;
  };

  window.addEventListener("popstate", () => {
    setTimeout(() => handleNavigation(window.location.href), 50);
  });

  // 💡 Fallback: Poll for URL changes
  let lastUrl = location.href;
  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      handleNavigation(location.href);
    }
  }, 500); // Adjust as needed
}

setupNavigationWatcher();
