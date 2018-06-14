function closestLocation(targetLocation, locationData) {
  function vectorDistance(dx, dy) {
    return Math.sqrt((dx * dx) + (dy * dy));
  }

  function locationDistance(location1, location2) {
    const dx = location1.lat - location2.lat;
    const dy = location1.long - location2.long;
    return vectorDistance(dx, dy);
  }

  return locationData.reduce((prev, curr) => {
    const prevDistance = locationDistance(targetLocation, prev);
    const currDistance = locationDistance(targetLocation, curr);
    return (prevDistance < currDistance) ? prev : curr;
  });
}

module.exports = {
  closestLocation,
};
