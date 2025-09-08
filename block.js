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

// Bypass system variables
let currentStep = 1;
let mathAnswer = 0;
let reflectionTimer = null;

// Display a random quote when the page loads
displayQuote();

updateTimer(until, decodeURIComponent(redirect));

// Initialize bypass system
initBypassSystem();

// Set minimum words and reflection time from config
document.addEventListener("DOMContentLoaded", () => {
  const minWords = CONFIG.BYPASS_MIN_WORDS || 50;
  const reflectionTime = CONFIG.BYPASS_REFLECTION_TIME_SECONDS || 30;

  document.getElementById("minWords").textContent = minWords;
  document.getElementById("minWordsCount").textContent = minWords;
  document.getElementById("reflectionTimer").textContent = reflectionTime;

  // Set confirmation phrase text and placeholder dynamically
  const confirmationPhrase = CONFIG.BYPASS_CONFIRMATION_PHRASE || "JE SUIS SÛR";
  const phraseTextEl = document.getElementById("confirmationPhraseText");
  if (phraseTextEl) {
    phraseTextEl.textContent = confirmationPhrase;
  }
  const finalConfirmationInput = document.getElementById("finalConfirmation");
  if (finalConfirmationInput) {
    finalConfirmationInput.setAttribute("placeholder", confirmationPhrase);
  }
});

/**
 * Initialize the bypass system
 */
function initBypassSystem() {
  const bypassButton = document.getElementById("bypassButton");
  const bypassModal = document.getElementById("bypassModal");
  const cancelBypass = document.getElementById("cancelBypass");
  const nextStep = document.getElementById("nextStep");
  const reflectionText = document.getElementById("reflectionText");
  const mathAnswerInput = document.getElementById("mathAnswer");
  const finalConfirmation = document.getElementById("finalConfirmation");

  // Generate random math problem
  generateMathProblem();

  // Event listeners
  bypassButton.addEventListener("click", () => {
    bypassModal.style.display = "block";
    showStep(1);
  });

  cancelBypass.addEventListener("click", () => {
    closeModal();
  });

  nextStep.addEventListener("click", () => {
    if (validateCurrentStep()) {
      currentStep++;
      if (currentStep <= 5) {
        showStep(currentStep);
      }
    }
  });

  // Word count for reflection text
  reflectionText.addEventListener("input", () => {
    updateWordCount();
    updateNextButton();
  });

  // Math answer validation
  mathAnswerInput.addEventListener("input", () => {
    updateNextButton();
  });

  // Final confirmation validation
  finalConfirmation.addEventListener("input", () => {
    updateNextButton();
  });

  // Add keyboard event listeners for Enter key
  reflectionText.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      if (validateCurrentStep()) {
        currentStep++;
        if (currentStep <= 5) {
          showStep(currentStep);
        }
      }
    }
  });

  mathAnswerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (validateCurrentStep()) {
        currentStep++;
        if (currentStep <= 5) {
          showStep(currentStep);
        }
      }
    }
  });

  finalConfirmation.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (validateCurrentStep()) {
        currentStep++;
        if (currentStep <= 5) {
          showStep(currentStep);
        }
      }
    }
  });

  // Close modal when clicking outside
  bypassModal.addEventListener("click", (e) => {
    if (e.target === bypassModal) {
      closeModal();
    }
  });
}

/**
 * Show a specific step in the bypass process
 */
function showStep(step) {
  // Hide all step contents
  for (let i = 1; i <= 5; i++) {
    const stepContent = document.getElementById(`step${i}-content`);
    const stepIndicator = document.getElementById(`step${i}`);

    if (stepContent) {
      stepContent.style.display = "none";
    }

    if (stepIndicator) {
      stepIndicator.classList.remove("active", "completed");
      if (i < step) {
        stepIndicator.classList.add("completed");
      } else if (i === step) {
        stepIndicator.classList.add("active");
      }
    }
  }

  // Show current step content
  const currentStepContent = document.getElementById(`step${step}-content`);
  if (currentStepContent) {
    currentStepContent.style.display = "block";
  }

  // Handle step-specific logic
  switch (step) {
    case 2:
      startReflectionTimer();
      break;
    case 3:
      generateMathProblem();
      break;
    case 5:
      completeBypass();
      break;
  }

  updateNextButton();
}

/**
 * Update word count display
 */
function updateWordCount() {
  const text = document.getElementById("reflectionText").value;
  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const wordCountElement = document.getElementById("wordCount");
  const minWords = CONFIG.BYPASS_MIN_WORDS || 50;

  if (wordCount >= minWords) {
    wordCountElement.textContent = `${wordCount} mots ✓ (minimum ${minWords} requis)`;
    wordCountElement.style.color = "#4CAF50";
  } else {
    wordCountElement.textContent = `${wordCount} mots (minimum ${minWords} requis)`;
    wordCountElement.style.color = "#ff6b6b";
  }
}

/**
 * Generate a random math problem
 */
function generateMathProblem() {
  const num1 = Math.floor(Math.random() * 20) + 5;
  const num2 = Math.floor(Math.random() * 10) + 2;
  const num3 = Math.floor(Math.random() * 50) + 10;
  const operation = Math.random() > 0.5 ? "+" : "-";

  let problem, answer;
  if (operation === "+") {
    problem = `${num1} × ${num2} + ${num3}`;
    answer = num1 * num2 + num3;
  } else {
    problem = `${num1} × ${num2} - ${num3}`;
    answer = num1 * num2 - num3;
  }

  document.getElementById("mathProblem").textContent = problem + " = ";
  mathAnswer = answer;
  document.getElementById("mathAnswer").value = "";
}

/**
 * Start the reflection timer
 */
function startReflectionTimer() {
  const reflectionTime = CONFIG.BYPASS_REFLECTION_TIME_SECONDS || 30;
  let timeLeft = reflectionTime;
  const timerElement = document.getElementById("reflectionTimer");
  const nextButton = document.getElementById("nextStep");

  nextButton.disabled = true;
  nextButton.textContent = "Attendez...";

  reflectionTimer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(reflectionTimer);
      nextButton.disabled = false;
      nextButton.textContent = "Continuer";
    }
  }, 1000);
}

/**
 * Validate the current step
 */
function validateCurrentStep() {
  switch (currentStep) {
    case 1:
      const text = document.getElementById("reflectionText").value;
      const wordCount = text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
      const minWords = CONFIG.BYPASS_MIN_WORDS || 50;
      return wordCount >= minWords;

    case 2:
      return true; // Timer handles this

    case 3:
      const userAnswer = parseInt(document.getElementById("mathAnswer").value);
      return userAnswer === mathAnswer;

    case 4:
      const confirmation = document.getElementById("finalConfirmation").value;
      const requiredPhrase = CONFIG.BYPASS_CONFIRMATION_PHRASE || "JE SUIS SÛR";
      return confirmation === requiredPhrase;

    default:
      return true;
  }
}

/**
 * Update the next button state
 */
function updateNextButton() {
  const nextButton = document.getElementById("nextStep");
  const isValid = validateCurrentStep();

  if (currentStep === 2) {
    // Timer step - button is controlled by timer
    return;
  }

  nextButton.disabled = !isValid;

  if (currentStep === 5) {
    nextButton.style.display = "none";
  }
}

/**
 * Complete the bypass process
 */
function completeBypass() {
  console.log("redirect", redirect);
  // Use existing whitelist system - add to whitelist for the configured duration
  const redirectUrl = decodeURIComponent(redirect) || "https://www.youtube.com";
  const videoId = getVideoId(redirectUrl);

  // Add to whitelist using video ID or full URL as key
  const whitelistKey = videoId || redirectUrl;
  const whitelistExpireTime =
    Date.now() + CONFIG.WHITELIST_DURATION_MINUTES * 60 * 1000;

  chrome.storage.local.get(["whitelist"], (data) => {
    const whitelist = data.whitelist || {};
    whitelist[whitelistKey] = whitelistExpireTime;
    chrome.storage.local.set({ whitelist }, () => {
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 150);
    });
  });
}

/**
 * Close the bypass modal
 */
function closeModal() {
  const bypassModal = document.getElementById("bypassModal");
  bypassModal.style.display = "none";

  // Reset to step 1
  currentStep = 1;
  showStep(1);

  // Clear inputs
  document.getElementById("reflectionText").value = "";
  document.getElementById("mathAnswer").value = "";
  document.getElementById("finalConfirmation").value = "";

  // Clear timer
  if (reflectionTimer) {
    clearInterval(reflectionTimer);
    reflectionTimer = null;
  }

  // Reset next button
  const nextButton = document.getElementById("nextStep");
  nextButton.disabled = true;
  nextButton.textContent = "Continuer";
  nextButton.style.display = "block";
}
