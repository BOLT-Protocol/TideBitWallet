import BottomNavigatorItem from "../widget/bottom_navigation_item";
import itemsData from "../constant/bottom_navigator_data";

customElements.define("bottom-navigator-item", BottomNavigatorItem);

const bottomNavigator = (state, callback) => {
  const bottomNavigatorBar = document.createElement("footer");
  bottomNavigatorBar.classList = ["bottom-navigator"];
  itemsData.forEach((itemData) => {
    const navigatorItem = document.createElement("bottom-navigator-item");
    navigatorItem.callback = callback;
    navigatorItem.child = {
      itemData: itemData,
      state: state,
    };
    bottomNavigatorBar.insertAdjacentElement("beforeend", navigatorItem);
  });
  return bottomNavigatorBar;
};

export default bottomNavigator;
