const needle = require('needle');

/**
 * Retrieves the user's IP address.
 */
const fetchMyIP = function(callback) {
  needle.get('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      return callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
    }
    callback(null, body.ip);
  });
};

/**
 * Retrieves geographical coordinates for a given IP address.
 */
const fetchCoordsByIP = function(ip, callback) {
  needle.get(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) return callback(error, null);

    if (!body.success) {
      const message = `Success status was ${body.success}. Server message says: ${body.message} when fetching for IP ${body.ip}`;
      return callback(Error(message), null);
    }

    callback(null, { latitude: body.latitude, longitude: body.longitude });
  });
};

/**
 * Retrieves ISS flyover times for given lat/lon coordinates.
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  needle.get(url, (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      return callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
    }

    callback(null, body.response);
  });
};

/**
 * Orchestrates all API requests to determine ISS flyover times for the user's location.
 */
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) return callback(error, null);

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) return callback(error, null);

      fetchISSFlyOverTimes(coords, (error, passes) => {
        if (error) return callback(error, null);

        callback(null, passes);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };
