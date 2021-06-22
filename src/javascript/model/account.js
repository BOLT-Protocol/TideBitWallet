class Asset {
  constructor(
    id,
    name,
    symbol,
    network,
    decimals,
    publish,
    image,
    balance,
    inUSD
  ) {
    this.id = id;
    this.name = name;
    this.symbol = symbol;
    this.network = network;
    this.decimals = decimals;
    this.publish = publish;
    this.image = image;
    this.balance = balance;
    this.inUSD = inUSD;
  }
}
