import { currentView } from "../utils/utils";
import Scaffold from "../layout/scaffold";
import Header from "../layout/header";
import AddressContent from "../layout/address_content";

class Address {
  constructor() {}
  initialize(screen, asset) {
    // ++ ui.getReceiveAddress({ asset.id });
    this.address = "0xd885833741f554a0e64ffd1141887d65e0dded01"; // --
    this.header = new Header(screen);
    this.addressContent = new AddressContent(asset, this.address);
    this.scaffold = new Scaffold(this.header, this.addressContent);
  }
  render(screen, asset) {
    const view = currentView();
    if (!view || view !== "address" || !this.scaffold) {
      this.initialize(screen, asset);
    }
  }
  // ++ Emily 2021/6/22
  update(event, address) {}
}

const address = new Address();

export default address;
