// index.js
const { fetchMyIP } = require('./iss');

// TEMP TEST (can comment out later)
fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log('It worked! Returned IP:', ip);
});
