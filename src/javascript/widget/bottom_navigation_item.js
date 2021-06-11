class BottomNavigatorItem extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", (event) => {
      // this.callback({ ...state, screen: itemData.screen });
    });
  }

  // set callback(func) {
  //   this.callback = func;
  // }

  set child(data) {
    this.className = "bottom-navigator";
    this.itemData = data.itemData;
    this.state = data.state;
    this.insertAdjacentHTML(
      "afterbegin",
      bottomNavigatorItem(this.itemData, this.state)
    );
  }
}

const bottomNavigatorItem = (itemData, state) => {
  const markup = `
      <input type="radio" name="bottom-navigator" class="bottom-navigator__item" id="${
        itemData.screen
      }" ${
    itemData.checked || itemData.screen === state.screen ? "checked" : ""
  }>
      <label class="bottom-navigator__button" for="${itemData.screen}">
          <div class="bottom-navigator__icon">${itemData.iconHtml}</div>
      </label>
      `;
  return markup;
};

export default BottomNavigatorItem;
