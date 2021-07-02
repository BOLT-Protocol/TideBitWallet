import Header from "../layout/header";
import MnemonicForm from "../layout/mnemonic_form";
import Scaffold from "../layout/scaffold";
import { initUser } from "../utils/utils";

class Mnemonic {
  constructor() {}
  render(screen, wallet) {
    this.header = new Header(screen);
    this.body = new MnemonicForm((data) => initUser(wallet, data));
    this.scaffold = new Scaffold(this.header, this.body);
    this.body.parent = this.scaffold;
  }
}

const MnemonicScreen = new Mnemonic();

export default MnemonicScreen;
