import Header from "../layout/header";
import AddressContent from "../widget/address_content";



const address = (scaffold, state, callback) => {
  // ++ ui.getReceiveAddress({ accountID });
  const address = "0xd885833741f554a0e64ffd1141887d65e0dded01"; // --
  const header = new Header(state);
  const addressContent = new AddressContent(state, address);
  header.render(scaffold.header);
  addressContent.render(scaffold.body);
};

export default address;
