import Bill from "../model/bill";
import Scaffold from "../layout/scaffold";
import Header from "../layout/header";
import TarBarNavigator from "../layout/tab_bar_navigator";
import BillList from "../layout/bill_list";

// -- test
import { randomHex } from "../utils/utils";
const getAssetDetail = (assetId) => {
  if (assetId !== "e0642b1b64b8b0214e758dd0be63242839e63db7") return [];
  return [
    {
      id: randomHex(32),
      txid: "0xaf40440a607d8ecea5236c22a70c806bcd36c29cdb81811694a3cb3f634be276",
      amount: 0.1,
      fee: 0.000021,
      message: "",
      timestamp: Date.now(),
      direction: "send",
      from: "0xe0642b1b64b8b0214e758dd0be63242839e63db7",
      to: "0xd885833741f554a0e64ffd1141887d65e0dded01",
      confirmations: 0,
    },
    {
      id: randomHex(32),
      txid: "0xa51396e2d31bef6825b25d7078a912e3d9ecaab6bdce949e2ed5193bb7c73044",
      amount: 0.1,
      fee: 0.000021,
      message: "",
      timestamp: 1625993323880,
      direction: "receive",
      from: "0xd885833741f554a0e64ffd1141887d65e0dded01",
      to: "0xe0642b1b64b8b0214e758dd0be63242839e63db7",
      confirmations: 1,
    },
    {
      id: randomHex(32),
      txid: "0xa51396e2d31bef6825b25d7078a912e3d9ecaab6bdce949e2ed5193bb7c73044",
      amount: 0.1,
      fee: 0.000021,
      message: "",
      timestamp: 1625953323880,
      direction: "send",
      from: "0xd885833741f554a0e64ffd1141887d65e0dded01",
      to: "0xe0642b1b64b8b0214e758dd0be63242839e63db7",
      confirmations: 4,
    },
    {
      id: randomHex(32),
      txid: "0xab4372209b00d0669a440e93134ee7812b779b62ac4e0b254eb18541c78af3b9",
      amount: 1,
      fee: 0.000021,
      message: "",
      timestamp: 1620719000000,
      direction: "send",
      from: "0xd885833741f554a0e64ffd1141887d65e0dded01",
      to: "0xe0642b1b64b8b0214e758dd0be63242839e63db7",
      confirmations: 2160,
    },
    {
      id: randomHex(32),
      txid: "0xab4372209b00d0669a440e93134ee7812b779b62ac4e0b254eb18541c78af3b9",
      amount: 3,
      fee: 0.000021,
      message: "",
      timestamp: 1620719218543,
      direction: "receive",
      from: "0xd885833741f554a0e64ffd1141887d65e0dded01",
      to: "0xe0642b1b64b8b0214e758dd0be63242839e63db7",
      confirmations: 214560,
    },
  ];
};

const account = (state, callback) => {
  // ++ let assetDetail = ui.getAssetDetail({ assetID });
  const bills = getAssetDetail(state.account.id)?.map((obj) => new Bill(obj));
  const header = new Header(state);
  const tarBarNavigator = new TarBarNavigator(state);
  const billList = new BillList(state, bills);
  new Scaffold(header, [tarBarNavigator, billList]);
};

export default account;
