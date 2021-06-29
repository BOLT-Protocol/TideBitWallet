class SafeSigner {
  constructor(signFunction) {
    this.signFunction = signFunction;
  }

  sign(data) {
    return this.signFunction(data);
  }
}

export default SafeSigner;