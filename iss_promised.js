const needle = require('needle');

const fetchMyIP = function() {
  return needle('get', 'https://api.ipify.org?format=json')
    .then(response => response.body.ip);
};

const fetchCoordsByIP = function(ip) {
  return needle('get', `http://ipwho.is/${ip}`)
    .then(response => {
      const body = response.body;
      if (!body.success) {
        throw new Error(`Failed to get coordinates for IP: ${body.message}`);
      }
      return {
        latitude: body.latitude,
        longitude: body.longitude,
      };
    });
};

const fetchISSFlyOverTimes = function(coords) {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  return needle('get', url)
    .then(response => response.body.response);
};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes);
};

module.exports = { nextISSTimesForMyLocation };
