export const isBrowser = function () {
  try {
    return this === window;
  } catch (e) {
    return false;
  }
};
