import Header from "../layout/header";
import MnemonicForm from "../layout/mnemonic_form";
import Scaffold from "../layout/scaffold";
class Mnemonic {
  constructor() {}
  render(screen, callback) {
    this.header = new Header(screen);
    this.body = new MnemonicForm(callback);
    this.scaffold = new Scaffold(this.header, this.body);
    this.body.parent = this.scaffold;
  }
}

const MnemonicScreen = new Mnemonic();

export default MnemonicScreen;
