const fetch = require('node-fetch');

const findLang = (url) => {
  const pattern = /visit.gent.be\/([a-z]{2})\//g;
  const match = pattern.exec(url);
  return match[1];
};

const fetchPointsOfInterest = () =>
  fetch('https://visit.gent.be/en/lod/poi').then(data => data.json());

const combineUrls = (json) => {
  const combinedLang = [];
  json.forEach((el) => {
    const exists = combinedLang.find(i => i['@id'] === el['@id']);
    if (exists) {
      const lang = findLang(el.url);
      exists.url[lang] = [el.url];
    } else {
      const lang = findLang(el.url);
      const urlField = {};
      urlField[lang] = [el.url];
      const newEl = Object.assign({}, el);
      newEl.url = urlField;
      combinedLang.push(newEl);
    }
  });
  return combinedLang;
};

const filterProperties = (element) => {
  const i = {
    '@id': element['@id'],
    description: element.description,
    keywords: element.keywords,
    contactPoint: element.contactPoint,
    image: element.image,
    name: element.name,
    url: element.url,
    '@type': element['@type'],
    mainEntityOfPage: element.mainEntityOfPage
  };
  return i;
};

const isSquare = (element) => {
  const square = 'https://gentsefeesten.stad.gent/api/v1/ns/location-type/square';
  if (!element.additionalType) {
    return false;
  }
  const ret = element.containedInPlace === null && element.additionalType.includes(square);
  return ret;
};

// Fisher-Yates shuffle, no side effects
const shuffleArray = (a) => { 
  let i = a.length, t, j;
  a = a.slice();
  while (--i) t = a[i], a[i] = a[j = ~~(Math.random() * (i+1))], a[j] = t;
  return a;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  combineUrls,
  findLang,
  filterProperties,
  fetchPointsOfInterest,
  fetch,
  isSquare,
  shuffleArray,
  getRandomInt
};
