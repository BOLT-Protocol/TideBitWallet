import header from "../layout/header";

const address = (scaffold, state) => {
    console.log(JSON.stringify(state));
    scaffold.header = header(state);
}

export default address;