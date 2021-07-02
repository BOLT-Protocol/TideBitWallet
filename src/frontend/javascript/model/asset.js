class Asset {
  constructor({
    accountcurrencyId,
    accountType,
    name,
    symbol,
    network,
    decimals,
    publish,
    image,
    balance,
    inFiat,
  }) {
    this.id = accountcurrencyId;
    this.accountType = accountType
    this.name = name;
    this.symbol = symbol;
    this.network = network;
    this.decimals = decimals;
    this.publish = publish || true; // -- temporary
    this.image = image;
    this.balance = balance;
    this.inFiat = inFiat || "0"; // -- temporary
  }
}
export default Asset;
