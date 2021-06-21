/**
   * @param {String only 4 type: "error", "success", "loading", "confirm"} type
   * @param {String: show on the dialog} text
   * @param {function} onConfirm
   * @param {default true} cancellable
   */
export const open = (type, text, onConfirm, cancellable = true) => {
  const popover = document.querySelector("pop-over");
  popover.open = true;
  if (cancellable) {
    popover.cancellable = cancellable;
  }
  switch (type) {
    case "error":
      popover.errorPopup(text);
      break;
    case "success":
      popover.successPopup(text);
      break;
    case "loading":
      popover.loadingPopup(text);
      break;
    case "confirm":
      popover.confirmPopup(text, onConfirm);
      break;
  }
};
export const close = (timeout) => {
  const popover = document.querySelector("pop-over");
  if (timeout !== undefined) {
    setTimeout(() => {
      popover.open = false;
    }, timeout);
  } else {
    popover.open = false;
  }
};
