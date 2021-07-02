import { randomHex } from "./helpers/helper";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ InstallID: randomHex(32) });
});
