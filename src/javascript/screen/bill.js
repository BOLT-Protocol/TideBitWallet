import header from "../layout/header";

const bill = (scaffold, state) => {
    console.log(JSON.stringify(state));
    scaffold.header = header(state);
}

export default bill;