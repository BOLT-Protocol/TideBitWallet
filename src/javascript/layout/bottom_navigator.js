import items from "../constant/bottom_navigator_data";
import TabBar from "../widget/tar-bar";
import BottomNavigatorItem from "../widget/bottom_navigator_item";
import route from "../utils/route";

class BottomNavigator {
  constructor(state) {
    this.state = JSON.parse(JSON.stringify(state));
    this.bottomNavigatorItems = items.map(
      (item) => new BottomNavigatorItem(state, item, (state) => route(state))
    );
  }
  render(parentElement, index) {
    this.tabBar = new TabBar(this.bottomNavigatorItems, index);
    this.tabBar.render(parentElement);
  }
}

export default BottomNavigator;
