class EventBus {
  constructor() {
    this.events = {};
  }

  on(type, cb) {
    if (!this.events[type]) {
      this.events[type] = [];
    }
    this.events[type].push(cb);
  }

  dispatch(type, data) {
    if (!this.events[type]) {
      return;
    }
    this.events[type].forEach(cb => cb(data));
  }

  /**
   *  This is a hack, use with caution.
   *  reverse observer. You can use this function if you want to wait for multiple events,
   *  originating in different parts of your application.
   *
   * @param {string} type type of event to listen to.
   * @param {Function} cb callback function to be executed.
   * @param {number} count amount of confirmations to wait before executing all callbacks.
   * @memberof EventBus
   */
  multi(type, cb, count) {
    if (!this.events[type]) {
      this.events[type] = { count, cb: [] };
    }
    this.events[type].cb.push(cb);
  }

  multiDispatch(type) {
    if (!this.events[type]) {
      return;
    }
    if (this.events[type].count > 1) {
      this.events[type].count -= 1;
      return;
    }
    this.events[type].cb.forEach(cb => cb());
  }
}

module.exports = new EventBus();
