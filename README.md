# ⏳ YouTube Block Timer Extension

A minimal Chrome extension that helps you reduce YouTube distractions by **blocking videos temporarily** and allowing
access after a short wait. Perfect for breaking the doomscroll habit while still letting you enjoy content — just on
your own terms.

---

## 🚀 Features

- 🔒 **Auto-block YouTube videos & homepage**
  - Blocks both video pages (`watch?v=...`) and the YouTube homepage to prevent idle browsing.
- ⏲️ **Customizable block duration**
  - Choose how long content is blocked (default: 5 minutes).
- ✅ **Automatic unblocking after timer**
  - After the countdown, you’re redirected to the intended page.
- 🕓 **Temporary whitelist**
  - After unblocking (including successful bypass), the item remains accessible for a configurable period (default: 20 minutes).
- 🔁 **Multi-tab & history-aware**
  - Works across tabs and SPA navigation (pushState/replaceState/url changes).
- 🧠 **Bypass flow (5 steps, configurable)**
  - You can bypass the block with a conscious intent and process: writing a reflection text with minimum word count, mandatory reflection timer, mental math challenge, final confirmation by typing a specific phrase.
- 📅 **Scheduling windows (allowlist time ranges)**
  - Define time ranges when blocking is disabled (e.g., lunch, evening). Handy for guilt-free leisure windows.
- ✨ **Inspiring quotes**
  - Beautiful block screen with French quotes to nudge you back to focus.

---

## ⚙️ Configuration

All settings can be changed in `config.js`:

```js
// config.js
const CONFIG = {
  BLOCK_DURATION_MINUTES: 5, // How long each page is blocked
  WHITELIST_DURATION_MINUTES: 20, // Grace period after unblock/bypass

  // Bypass flow
  BYPASS_MIN_WORDS: 20, // Minimum words required for reflection
  BYPASS_REFLECTION_TIME_SECONDS: 15, // Mandatory wait before continuing
  BYPASS_CONFIRMATION_PHRASE: "JE SUIS SÛR", // Phrase to type for final confirmation

  // Schedule: blocking is disabled during these ranges (HH:MM)
  SCHEDULE_ENABLED: true,
  ALLOWED_TIME_RANGES: [
    { start: "12:00", end: "14:00" }, // Lunch break
    { start: "20:00", end: "22:00" }, // Evening relaxation
  ],

  // Block page quotes (French)
  INSPIRING_QUOTES: [
    "L'avenir appartient à ceux qui se lèvent tôt. - Proverbe français",
    // ... add or customize quotes
  ],
};
```

Notes:

- To disable scheduling entirely, set `SCHEDULE_ENABLED` to `false` or leave `ALLOWED_TIME_RANGES` empty.
- The bypass, when completed, adds the current page to the same temporary whitelist as the normal timer completion.

## Installation

To load the extension locally in Chrome:

1. **Clone or download this repository**
2. **Open Chrome and go to:** `chrome://extensions/`
3. Enable Developer mode (top right corner)
4. Click Load unpacked and select the project folder
5. Open YouTube to see the block screen; try the homepage and a video page

## How It Works

1. You open the YouTube homepage or a video page.
2. If you’re not within an allowed schedule window and the page isn’t whitelisted, the extension blocks and starts a countdown.
3. After the timer ends, you’re redirected back and the page is temporarily whitelisted.
4. Alternatively, you can complete the bypass flow to immediately whitelist for the configured grace period.
5. When the whitelist expires, blocking resumes as normal.

## Privacy

This extension does not collect any data, send any requests, or track your browsing activity. All data is stored locally in Chrome’s extension storage and is used only for timing and redirection logic.

> This extension was built fully with an LLM (+ a bit of human direction and feedback).
