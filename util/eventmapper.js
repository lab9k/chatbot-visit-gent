const _ = require('./util');
const eb = require('./eventBus');

class EventMapper {
  constructor() {
    this._events = [];
    _.fetch('https://datatank.stad.gent/4/toerisme/gentsefeestenevents.json')
      .then(data => data.json())
      .then((json) => {
        console.log('data loaded');
        try {
          this.events = json.filter(el => el.location !== null && el.isAccessibleForFree);
          eb.multiDispatch('data_ready');
        } catch (error) {
          console.error(error);
        }
      })
      .catch(error =>
        console.log(error));
  }

  get events() {
    return this._events.slice();
  }

  set events(value) {
    this._events = value;
  }
}

module.exports = EventMapper;
