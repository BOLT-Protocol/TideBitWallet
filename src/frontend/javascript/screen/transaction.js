import Scaffold from "../layout/scaffold";
import Header from "../layout/header";
import Form from "../layout/form";
import { currentView } from "../utils/utils";

class Transaction {
  constructor() {}

  async initialize(screen, asset, fiat, wallet) {
    this.wallet = wallet;
    this.header = new Header(screen);
    this.form = new Form(wallet, asset, fiat);
    this.scaffold = new Scaffold(this.header, this.form);
    this.form.parent = this.scaffold;
  }
  render(screen, asset, fiat, wallet) {
    const view = currentView();
    if (!view || view !== "transaction" || !this.scaffold) {
      this.initialize(screen, asset, fiat, wallet);
    }
  }
}

const transaction = new Transaction();

export default transaction;
