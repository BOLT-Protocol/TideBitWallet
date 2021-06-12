import header from "../layout/header";

const transaction = (scaffold, state) => {
    console.log(JSON.stringify(state));
    scaffold.header = header(state);
}

export default transaction;