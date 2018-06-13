const eb = require('./eventBus');
const _ = require('./util');

class LocationMapper {
  constructor() {
    this.toilets = [];
    this.squares = [];
    _.fetch('https://datatank.stad.gent/4/cultuursportvrijetijd/gentsefeestenlocaties.json')
      .then((data) => data.json())
      .then((json) => {
        this.squares.push(...json.filter((el) => _.isSquare(el)));
        return this.squares;
      })
      .then((squares) => {
        const promises = [];
        squares.forEach((square) => {
          // get long and lat for each square
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
          eb.dispatch('data_ready');
        });
        return this.squares;
      })
      .catch(console.error);
    // const toiletsPromise = _.fetch();

    // Promise.all([squarePromise]).then(() => eb.dispatch('data_ready')).catch(console.error);
  }

  getSquares() {
    return this.squares;
  }
}

module.exports = LocationMapper;
