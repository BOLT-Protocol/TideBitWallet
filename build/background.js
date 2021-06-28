
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ InstallID: '1234' });
});
