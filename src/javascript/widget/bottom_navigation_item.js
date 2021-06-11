const bottomNavigatorItem = (itemData, screen) => {
  const markup = `
    <input type="radio" name="bottom-navigator" class="bottom-navigator__item" id="${
      itemData.screen
    }" ${itemData.checked || itemData.screen === screen ? "checked" : ""}>
    <label class="bottom-navigator__button" for="${itemData.screen}">
        <div class="bottom-navigator__icon">${itemData.iconHtml}</div>
    </label>
    `;
  return markup;
};

export default bottomNavigatorItem;
