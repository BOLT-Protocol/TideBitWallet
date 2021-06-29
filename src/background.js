import { randomHex } from "./javascript/utils/utils";

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ InstallID: randomHex(32) });
  });
  