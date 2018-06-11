const isNear = (currentLocation, place, radius = 1) => {
  if (currentLocation.lat + radius > place.lat) {
    return true;
  }
  return false;
};

module.exports = {
  isNear,
};
