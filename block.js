function getVideoId(url) {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
}


function updateTimer(endTime, redirectUrl) {
    const now = Date.now();
    const diff = endTime - now;

    if (diff <= 0) {
        const videoId = getVideoId(redirectUrl);
        const whitelistExpireTime = now + CONFIG.WHITELIST_DURATION_MINUTES * 60 * 1000;

        if (videoId) {
            chrome.storage.local.get(["whitelist"], (data) => {
                const whitelist = data.whitelist || {};
                whitelist[videoId] = whitelistExpireTime;
                chrome.storage.local.set({ whitelist }, () => {
                    window.location.href = redirectUrl || "https://www.youtube.com";
                });
            });
        } else {
            window.location.href = redirectUrl || "https://www.youtube.com";
        }
        return;
    }

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    document.getElementById("timer").textContent =
        `Come back in ${minutes}:${seconds.toString().padStart(2, "0")}`;

    setTimeout(() => updateTimer(endTime, redirectUrl), 1000);
}

const urlParams = new URLSearchParams(window.location.search);
const until = parseInt(urlParams.get("until"), 10);
const redirect = urlParams.get("redirect");

updateTimer(until, decodeURIComponent(redirect));
