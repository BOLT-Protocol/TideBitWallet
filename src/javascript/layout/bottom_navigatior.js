import * as bottomNavigatorBar from "../widget/bottom_navigator_bar";
import bottomNavigatorItem from "../widget/bottom_navigation_item";
import itemsData from "../constant/bottom_navigator_data";

// parentElement = document.querySelector('.scaffold');
const bottomNavigator = (parentElement) => {
  parentElement.insertAdjacentHTML("beforeend", bottomNavigatorBar.widget);
  const bottomNavigatorBarEl = document.querySelector(
    bottomNavigatorBar.className
  );
  itemsData.forEach((itemData) => {
    bottomNavigatorBarEl.insertAdjacentHTML(
      "beforeend",
      bottomNavigatorItem(itemData.iconHtml)
    );
  });
};

export default bottomNavigator;
