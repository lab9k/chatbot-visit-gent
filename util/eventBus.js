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
    this.events[type].forEach((cb) => cb(data));
  }
}

module.exports = new EventBus();
