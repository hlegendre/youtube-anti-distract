# ⏳ YouTube Block Timer Extension

A minimal Chrome extension that helps you reduce YouTube distractions by **blocking videos temporarily** and allowing
access after a short wait. Perfect for breaking the doomscroll habit while still letting you enjoy content — just on
your own terms.

---

## 🚀 Features

- 🔒 **Auto-block YouTube videos**
    - Any time you open a YouTube video, a timer starts and blocks the page. (`watch?v=...`)
- ⏲️ **Customizable block duration**
    - Choose how long you want the video to be blocked (default: 5 minutes).
- ✅ **Automatic unblocking after timer**
    - After the countdown, you’re redirected to the original video.
- 🕓 **Temporary whitelist**
    - After unblocking, the video remains accessible for a configurable period (default: 20 minutes).
- 🔁 **Multi-tab & multi-window support**
    - Each tab tracks its own timers independently.

---

## ⚙️ Configuration

All settings can be easily changed in `config.js`:

```js
// config.js
const CONFIG = {
    BLOCK_DURATION_MINUTES: 5,      // Time to block a video
    WHITELIST_DURATION_MINUTES: 20, // Time to allow video after unblock
};
```

## Installation

To load the extension locally in Chrome:

1. **Clone or download this repository**
2. **Open Chrome and go to:**
   ``chrome://extensions/``
3. Enable Developer mode (top right corner)
4. Click Load unpacked and select the project folder you just cloned
5. The extension should now be active. Open any YouTube video and watch the block timer activate

## How It Works

1. You open a YouTube video (e.g., watch?v=...)
2. The extension checks if the video is whitelisted
   - If not, it blocks the page and starts a countdown
3. After the timer, you’re redirected to the original video
4. That video is now temporarily whitelisted
   - You can rewatch it without waiting for a set period (e.g., 20 minutes)
5. If you revisit it after the whitelist expires, the block timer starts again

## Privacy
This extension does not collect any data, send any requests, or track your browsing activity. All data is stored locally
in Chrome’s extension storage and is used only for timing and redirection logic.

> That extension was built fully with LLM.