import bottomNavigatorItem from "../widget/bottom_navigation_item";
import itemsData from "../constant/bottom_navigator_data";

// parentElement = document.querySelector('.scaffold');
const bottomNavigator = () => {
  const bottomNavigatorBar = document.createElement("footer");
  bottomNavigatorBar.classList = ["bottom-navigator"];
  itemsData.forEach((itemData) => {
    bottomNavigatorBar.insertAdjacentHTML(
      "beforeend",
      bottomNavigatorItem(itemData)
    );
  });
  return bottomNavigatorBar;
};

export default bottomNavigator;
