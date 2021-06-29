import { validateMnemonic, mnemonicToSeedSync } from "bip39";

class Mnemonic {
  /**
   * @method checkMnemonicVaildity
   * @param {string} mnemonic
   * @returns {boolean} valid
   */
  checkMnemonicVaildity(mnemonic) {
    return validateMnemonic(mnemonic);
  }

  /**
   * @method mnemonicToSeed
   * @param {string} mnemonic
   * @param {string} password
   * @returns {Buffer} seed
   */
  mnemonicToSeed(mnemonic, password) {
    const seed = mnemonicToSeedSync(mnemonic, password);
    return seed;
  }
}

export default Mnemonic;
