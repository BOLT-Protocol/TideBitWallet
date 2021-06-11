import header from "../layout/header";

const account = (scaffold, state) => {
    console.log(JSON.stringify(state));
    scaffold.header = header(state);
}

export default account;