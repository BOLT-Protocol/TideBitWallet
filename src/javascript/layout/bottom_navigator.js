import items from "../constant/bottom_navigator_data";
import TabBar from "../widget/tar-bar";
import BottomNavigatorItem from "../widget/bottom_navigator_item";

class BottomNavigator {
  constructor(focusIndex) {
    this.focusIndex = focusIndex;
    this.bottomNavigatorItems = items.map(
      (item) => new BottomNavigatorItem(item)
    );
  }
  render(parentElement) {
    this.tabBar = new TabBar(this.bottomNavigatorItems, this.focusIndex);
    this.tabBar.render(parentElement);
  }
}

export default BottomNavigator;
