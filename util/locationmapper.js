const eb = require('./eventBus');
const _ = require('./util');

class LocationMapper {
  constructor() {
    this.toilets = [];
    this.squares = [];
    const l1 = _.fetch('https://datatank.stad.gent/4/cultuursportvrijetijd/gentsefeestenlocaties.json')
      .then((data) => data.json())
      .then((json) => {
        this.squares.push(...json.filter((el) => _.isSquare(el)));
        return this.squares;
      })
      .then((squares) => {
        const promises = [];
        squares.forEach((square) => {
          // get a clean name for every square (one that returns results on the api)
          const name = `Gent ${square.name.nl.split('/')[0]
            .trim()
            .replace(/ /g, '+')
            .replace(/ç/g, 'c')
            .replace('Korenlei-Graslei', 'Graslei')
            .replace('Sint-Bavo+Humaniora+-+Reep+4', 'Sint-Bavohumaniora')}`;
          // fetch
          const locPromise = _.fetch(`https://nominatim.openstreetmap.org/search?q=${name}&format=json&polygon=1&addressdetails=1`)
            .then((data) => data.json());
          promises.push(locPromise);
        });
        // when all coordinates have been fetched,
        // we can map the fetched data into the current squares array.
        // We start the server by dispatching the data_ready event.
        Promise.all(promises).then((data) => {
          this.squares = this.squares.map((info, i) => {
            const { lat, lon, display_name } = data[i][0];
            return {
              ...info,
              lat,
              long: lon,
              display_name
            };
          });
        });
        return this.squares;
      })
      .catch(console.error);
    const t1 = _.fetch('https://datatank.stad.gent/4/infrastructuur/publieksanitair.geojson')
      .then((data) => data.json())
      .then((json) => {
        this.toilets.push(...json.coordinates.map((el) => ({ lat: el[1], long: el[0] })));
      });
    const t2 = _.fetch('https://datatank.stad.gent/4/infrastructuur/publieksanitair.geojson').then((data) => data.json())
      .then((json) => {
        this.toilets.push(...json.coordinates.map((el) => ({ lat: el[1], long: el[0] })));
      });
    Promise.all([l1, t1, t2]).then(() => {
      eb.dispatch('data_ready');
    }).catch(console.error);
  }

  getSquares() {
    return this.squares.slice();
  }
  getToilets() {
    return this.toilets.slice();
  }
}

module.exports = LocationMapper;
