const bottomNavigatorItem = (iconHtml) => {
    const markup = `
    <input type="radio" name="bottom-navigator" class="bottom-navigator__item" id="settings">
    <label class="bottom-navigator__button" for="settings">
        <div class="bottom-navigator__icon">${iconHtml}</div>
    </label>
    `;
    return markup;
};

export default bottomNavigatorItem;