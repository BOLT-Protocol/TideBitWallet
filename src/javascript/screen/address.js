import "../widget/button";
import header from "../layout/header";
// let address = ui.getReceiveAddress({ accountID });

const address = (scaffold, state) => {
  scaffold.header = header(state);
  const button = document.createElement("default-button");
  button.style = ["round", "outline"];
  scaffold.body = button;
  button.text = "Copy Wallet Address";
  button.suffix = `<i class="far fa-copy"></i>`;
  button.onPressed = () => {
    console.log("click");
  };
};

export default address;
