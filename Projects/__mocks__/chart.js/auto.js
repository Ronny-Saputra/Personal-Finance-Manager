export default class Chart {
    constructor(ctx, config) {
      // you can record ctx/config if needed
      this.ctx = ctx;
      this.config = config;
    }
    destroy() {
      // no-op
    }
  }