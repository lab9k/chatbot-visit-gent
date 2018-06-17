/**
 *
 *
 * @param {{lat:number,long:number}} targetLocation object with at least lat and long properties.
 * @param {[{lat:number,long:number}]} locationData array of objects.
 * should have at least lat and long properties
 * @returns object from locationData which is closest to the targetLocation.
 */
function closestLocation(targetLocation, locationData) {
  function vectorDistance(dx, dy) {
    return Math.sqrt(dx * dx + dy * dy);
  }

  function locationDistance(location1, location2) {
    const dx = location1.lat - location2.lat;
    const dy = location1.long - location2.long;
    return vectorDistance(dx, dy);
  }

  return locationData.reduce((prev, curr) => {
    const prevDistance = locationDistance(targetLocation, prev);
    const currDistance = locationDistance(targetLocation, curr);
    return prevDistance < currDistance ? prev : curr;
  });
}

module.exports = {
  closestLocation
};
