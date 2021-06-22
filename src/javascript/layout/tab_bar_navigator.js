import items from "../constant/tab_bar_data";
import TabBar from "../widget/tar-bar";
import TabBarItem from "../widget/tab_bar_item";

class TarBarNavigator {
  constructor() {
    this.tabBarItems = items.map((item) => {
      return new TabBarItem(item);
    });
  }
  render(parentElement, position) {
    this.tabBar = new TabBar(this.tabBarItems);
    this.tabBar.render(parentElement, position);
  }
}

export default TarBarNavigator;
