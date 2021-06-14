import Bill from "../model/bill";

import items from "../constant/tab_bar_data";

import header from "../layout/header";
import TabBar from "../layout/tar-bar";

import billList from "../widget/bill_list";
import TabBarItem from "../widget/tab_bar_item";

import route from "../utils/route";
import { randomHex } from "../utils/utils";

// ++ let assetDetail = ui.getAssetDetail({ assetID });

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

const account = (scaffold, state) => {
  const bills = getAssetDetail(state.account.id)?.map((obj) => new Bill(obj));
  const tabBar = new TabBar();
  scaffold.header = header(state);
  scaffold.body = [tabBar.element, billList(state, bills)];
  items.forEach((item) => {
    state.screen = item.screen;
    new TabBarItem(
      state,
      tabBar.element,
      item.title,
      item.title.toLowerCase(),
      (val) => route(val)
    );
  });
};

export default account;
