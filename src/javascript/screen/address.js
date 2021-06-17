import Scaffold from "../layout/scaffold";
import Header from "../layout/header";
import AddressContent from "../layout/address_content";



const address = (state, callback) => {
  // ++ ui.getReceiveAddress({ accountID });
  const address = "0xd885833741f554a0e64ffd1141887d65e0dded01"; // --
  const header = new Header(state);
  const addressContent = new AddressContent(state, address);
  new Scaffold(header, addressContent);
};

export default address;
