import items from "../constant/bottom_navigator_data";
import TabBar from "../widget/tar-bar";
import BottomNavigatorItem from "../widget/bottom_navigator_item";
import route from "../controller/route";

class BottomNavigator {
  constructor(state, focusIndex) {
    this.focusIndex = focusIndex;
    this.state = JSON.parse(JSON.stringify(state));
    this.bottomNavigatorItems = items.map(
      (item) => new BottomNavigatorItem(state, item, (state) => route(state))
    );
  }
  render(parentElement) {
    this.tabBar = new TabBar(this.bottomNavigatorItems, this.focusIndex);
    this.tabBar.render(parentElement);
  }
}

export default BottomNavigator;
