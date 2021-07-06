import { currentView } from "../utils/utils";
import Scaffold from "../layout/scaffold";
import Header from "../layout/header";
import AddressContent from "../layout/address_content";

class Address {
  constructor() {}
  initialize(screen, asset, wallet) {
    console.log("wallet getReceivingAddress", wallet); // -- test
    wallet.getReceivingAddress({ accountID: asset.id }).then((data) => {
      this.scaffold.closePopover();
      console.log(data); // -- test
      this.address = Array.isArray(data) ? data[0] : data;
      this.update(this.address);
    });
    this.header = new Header(screen);
    this.addressContent = new AddressContent(asset);
    this.scaffold = new Scaffold(this.header, this.addressContent);
    this.scaffold.openPopover("loading");
  }
  render(screen, asset, wallet) {
    const view = currentView();
    if (!view || view !== "address" || !this.scaffold) {
      this.initialize(screen, asset, wallet);
    }
  }
  update(address) {
    this.addressContent.update(address);
  }
}

const address = new Address();

export default address;
