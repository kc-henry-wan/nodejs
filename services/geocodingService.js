const axios = require('axios');
const config = require('../config/config.json');

const getCoordinates = async (fullAddress) => {
  const response = await axios.get(config.mapApi.url, {
    params: {
      q: fullAddress,
      format: 'json',
    }
  });

  if (response.data && response.data.length > 0) {
    const { lat, lon } = response.data[0];
    return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
  }

  return null;
};

module.exports = { getCoordinates };
