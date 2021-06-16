import itemsData from "../constant/bottom_navigator_data";
import BottomNavigatorItem from "../widget/bottom_navigator_item";
import route from "../utils/route";

const bottomNavigator = (state) => {
  const bottomNavigatorBar = document.createElement("footer");
  bottomNavigatorBar.classList = ["bottom-navigator"];
  itemsData.forEach((itemData) => {
    const navigatorItem = new BottomNavigatorItem(state, itemData, (state) =>
      route(state)
    );
    navigatorItem.render(bottomNavigatorBar);
  });
  return bottomNavigatorBar;
};

export default bottomNavigator;
