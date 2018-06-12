const isNear = (currentLocation, place, radius = 1) => {
  if (currentLocation.lat + radius > place.lat) {
    return true;
  }
  return false;
};

const getDistance = (currentLocation, location) => {
  const { lat: lat1, lon: lon1 } = currentLocation;
  const { lat: lat2, lon: lon2 } = location;
  // find distance between 2 points
  return lat1 + lat2 + lon1 + lon2;
};

module.exports = {
  isNear,
  getDistance,
};
