import itemsData from "../constant/tab_bar_data";
import route from "../utils/route";
class TabBarItem extends HTMLElement {
  constructor() {
    super();
    this.markup = (itemData) => `
        <input type="radio" name="tab-bar" class="tab-bar__item" id=${itemData.title.toLowerCase()} checked>
        <label class="tab-bar__button" for=${itemData.title.toLowerCase()}>
          <div class="tab-bar__icon"></div>
          <div class="tab-bar__text">${itemData.title}</i></div>
        </label>
        `;
    this.addEventListener("click", (_) => {
      this.state.screen = this.itemData.screen;
      route(this.state);
    });
  }
  set type(val) {
    this.setAttribute(val, "");
  }

  set child(data) {
    this.itemData = data.itemData;
    this.state = JSON.parse(JSON.stringify(data.state));
    this.insertAdjacentHTML("afterbegin", this.markup(this.itemData));
    this.type = this.itemData.title.toLowerCase();
  }
}

customElements.define("tab-bar-item", TabBarItem);

const tabNavigator = (state) => {
  const tabBar = document.createElement("div");
  tabBar.className = "tab-bar";
  itemsData.forEach((itemData) => {
    const tabBarItem = document.createElement("tab-bar-item");
    tabBarItem.child = {
      itemData: itemData,
      state: state,
    };
    tabBar.insertAdjacentElement("beforeend", tabBarItem);
  });
  return tabBar;
};

export default tabNavigator;
