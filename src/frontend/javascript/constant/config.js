class Mode {
  _debugMode = false;
  set debug(value) {
    this._debugMode = value;
  }
  get debug() {
    return this._debugMode;
  }
}

const mode = new Mode();

export default mode;
