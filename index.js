const { fetchCoordsByIP } = require('./iss');

// Replace with a valid IP or use the one from your fetchMyIP result
fetchCoordsByIP('162.245.144.188', (error, coordinates) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log('It worked! Returned coordinates:', coordinates);
});

// EXAMPLE OUTPUT:
// It worked! Returned coordinates: { latitude: 49.2767, longitude: -123.13 }
