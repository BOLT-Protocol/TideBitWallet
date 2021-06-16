import itemsData from "../constant/bottom_navigator_data";
import route from "../utils/route";
class BottomNavigatorItem extends HTMLElement {
  constructor() {
    super();
    this.markup = (itemData, state) => {
      const markup = `
          <input type="radio" name="bottom-navigator" class="bottom-navigator__item" id="${
            itemData.screen
          }" ${
        itemData.checked || itemData.screen === state.screen ? "checked" : ""
      }>
          <label class="bottom-navigator__button" for="${itemData.screen}">
              <div class="bottom-navigator__icon"><i class="fas fa-${itemData.icon}"></i></div>
          </label>
          `;
      return markup;
    };
    this.addEventListener("click", (_) => {
      this.state.screen = this.itemData.screen;
      route(this.state);
    });
  }

  set child(data) {
    this.className = "bottom-navigator";
    this.itemData = data.itemData;
    this.state = JSON.parse(JSON.stringify(data.state));
    this.insertAdjacentHTML(
      "afterbegin",
      this.markup(this.itemData, this.state)
    );
  }
}

customElements.define("bottom-navigator-item", BottomNavigatorItem);

const bottomNavigator = (state) => {
  const bottomNavigatorBar = document.createElement("footer");
  bottomNavigatorBar.classList = ["bottom-navigator"];
  itemsData.forEach((itemData) => {
    const navigatorItem = document.createElement("bottom-navigator-item");
    navigatorItem.child = {
      itemData: itemData,
      state: state,
    };
    bottomNavigatorBar.insertAdjacentElement("beforeend", navigatorItem);
  });
  return bottomNavigatorBar;
};

export default bottomNavigator;
