chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ blockEndTime: 0 });
});
