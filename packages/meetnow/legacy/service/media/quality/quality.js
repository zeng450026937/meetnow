class Quality {
  constructor(options = {}) {
    this.kind = options.kind || '';
    this.label = options.label || '';
  }

  get id() {
    return this.kind + this.label;
  }
}

export default Quality;
