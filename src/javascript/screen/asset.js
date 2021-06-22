import Bill from "../model/bill";
import Scaffold from "../layout/scaffold";
import Header from "../layout/header";
import TarBarNavigator from "../layout/tab_bar_navigator";
import BillList from "../layout/bill_list";
import { currentView, randomHex } from "../utils/utils";

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

class Asset {
  constructor() {}
  initialize(screen, asset, fiat) {
    this.bills = getAssetDetail(asset.id)?.map((obj) => new Bill(obj));
    //++
    window.bills = this.bills;
    this.header = new Header(screen, { fiat, asset });
    this.tarBarNavigator = new TarBarNavigator();
    this.billList = new BillList(asset, this.bills);
    this.scaffold = new Scaffold(this.header, [
      this.tarBarNavigator,
      this.billList,
    ]);
    this.scaffold.element.view = screen;
    this.screen = screen;
  }
  render(screen, asset, fiat) {
    const view = currentView();
    if (!view || view !== "asset" || !this.scaffold) {
      this.initialize(screen, asset, fiat);
    }
  }
  // ++ Emily 2021/6/22
  update(event, asset, fiat, { bills, bill }) {
    if (event === "OnUpdateAccount") {
    } else if (event === "OnUpdateCurrency") {
    }
  }
}

const asset = new Asset();

export default asset;
