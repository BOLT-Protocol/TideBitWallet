import { randomHex } from "../ui/javascript/utils/utils";
import "./index";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ InstallID: randomHex(32) });
});
