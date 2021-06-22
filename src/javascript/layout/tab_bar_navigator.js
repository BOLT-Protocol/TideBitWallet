import items from "../constant/tab_bar_data";
import TabBar from "../widget/tar-bar";
import TabBarItem from "../widget/tab_bar_item";
import route from "../controller/route";

class TarBarNavigator {
  constructor(state) {
    this.state = JSON.parse(JSON.stringify(state));
    this.tabBarItems = items.map((item) => {
      const state = JSON.parse(JSON.stringify(this.state));
      state.screen = item.screen;
      return new TabBarItem(state, item.title, item.title.toLowerCase(), (state) =>
        route(state)
      );
    });
  }
  render(parentElement, position) {
    this.tabBar = new TabBar(this.tabBarItems);
    this.tabBar.render(parentElement, position);
  }
}

export default TarBarNavigator;