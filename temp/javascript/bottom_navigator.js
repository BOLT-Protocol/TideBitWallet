import items from "../constant/bottom_navigator_data";
import TabBar from "../widget/tar-bar";
import BottomNavigatorItem from "../widget/bottom_navigator_item";

class BottomNavigator {
  constructor(state) {
    this.state = JSON.parse(JSON.stringify(state));
    this.bottomNavigatorItems = items.map(
      (item) => new BottomNavigatorItem(state, item)
    );
  }
  render(parentElement) {
    this.tabBar = new TabBar(this.bottomNavigatorItems, 0);
    this.tabBar.render(parentElement);
  }
}

export default BottomNavigator;
