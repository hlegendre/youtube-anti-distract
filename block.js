function getVideoId(url) {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

function getRandomQuote() {
  if (!CONFIG.INSPIRING_QUOTES || CONFIG.INSPIRING_QUOTES.length === 0) {
    return {
      text: "Concentrez-vous sur ce qui compte vraiment.",
      author: "Citation par défaut",
    };
  }

  const randomIndex = Math.floor(
    Math.random() * CONFIG.INSPIRING_QUOTES.length
  );
  const fullQuote = CONFIG.INSPIRING_QUOTES[randomIndex];

  // Split quote and author (format: "Quote text - Author")
  const lastDashIndex = fullQuote.lastIndexOf(" - ");
  if (lastDashIndex !== -1) {
    return {
      text: fullQuote.substring(0, lastDashIndex).trim(),
      author: fullQuote.substring(lastDashIndex + 3).trim(),
    };
  } else {
    return {
      text: fullQuote,
      author: "Citation inspirante",
    };
  }
}

function displayQuote() {
  const quote = getRandomQuote();
  document.getElementById("quote-text").textContent = quote.text;
  document.getElementById("quote-author").textContent = quote.author;
}

function updateTimer(endTime, redirectUrl) {
  const now = Date.now();
  const diff = endTime - now;

  if (diff <= 0) {
    const videoId = getVideoId(redirectUrl);
    const whitelistExpireTime =
      now + CONFIG.WHITELIST_DURATION_MINUTES * 60 * 1000;

    // Only add to whitelist if it's a video page (not homepage)
    if (videoId) {
      chrome.storage.local.get(["whitelist"], (data) => {
        const whitelist = data.whitelist || {};
        whitelist[videoId] = whitelistExpireTime;
        chrome.storage.local.set({ whitelist }, () => {
          window.location.href = redirectUrl || "https://www.youtube.com";
        });
      });
    } else {
      // For homepage or other non-video pages, just redirect without whitelisting
      window.location.href = redirectUrl || "https://www.youtube.com";
    }
    return;
  }

  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  document.getElementById(
    "timer"
  ).textContent = `Come back in ${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;

  setTimeout(() => updateTimer(endTime, redirectUrl), 1000);
}

const urlParams = new URLSearchParams(window.location.search);
const until = parseInt(urlParams.get("until"), 10);
const redirect = urlParams.get("redirect");

// Display a random quote when the page loads
displayQuote();

updateTimer(until, decodeURIComponent(redirect));
