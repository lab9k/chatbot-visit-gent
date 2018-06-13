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

  dispatch(type) {
    if (!this.events[type]) {
      return;
    }
    this.events[type].forEach((cb) => cb());
  }
}

module.exports = new EventBus();
