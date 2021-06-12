import header from "../layout/header";
// let address = ui.getReceiveAddress({ accountID });
const address = (scaffold, state) => {
    console.log(JSON.stringify(state));
    scaffold.header = header(state);
}

export default address;