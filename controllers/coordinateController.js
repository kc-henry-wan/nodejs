const axios = require('axios');
const { PharmacyBranch } = require('../models');

async function updateCoordinates(req, res) {
  try {
    const branches = await PharmacyBranch.findAll({
      where: {
        [Op.or]: [
          { longitude: { [Op.eq]: null } },
          { longitude: 0 },
          { latitude: { [Op.eq]: null } },
          { latitude: 0 },
        ],
      },
    });

    for (const branch of branches) {
      const fullAddress = `${branch.address_1} ${branch.address_2 || ''} ${branch.postal_code}`;
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: fullAddress,
          format: 'json',
        },
        headers: {
          'User-Agent': 'PHARMACY', // Nominatim requires a custom User-Agent string
        },
      });

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        branch.latitude = parseFloat(lat);
        branch.longitude = parseFloat(lon);
        await branch.save();
      } else {
        console.warn(`Geocoding failed for address: ${fullAddress}`);
      }
    }

    res.status(200).json({ message: 'Pharmacy branch coordinates updated successfully.' });
  } catch (error) {
    console.error("Error updating coordinates:", error);
    res.status(500).json({ message: 'Failed to update coordinates.' });
  }
}

module.exports = {
  updateCoordinates,
};

////const axios = require('axios');
//const { PharmacyBranch } = require('../models'); // Adjust this path as needed
//
//// Replace with your Google Maps API Key
//const GOOGLE_MAPS_API_KEY = '';
//
//async function updateCoordinates(req, res) {
//  try {
//    // Fetch all branches
//    const branches = await PharmacyBranch.findAll();
//
//    // Iterate over each branch to get and update coordinates
//    for (const branch of branches) {
//      const fullAddress = `${branch.address_1} ${branch.address_2 || ''} ${branch.postal_code}`;
//      
//      // Make a request to Google Maps Geocoding API
//      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
//        params: {
//          address: fullAddress,
//          key: GOOGLE_MAPS_API_KEY,
//        },
//      });
//      
//      const data = response.data;
//
//      if (data.status === 'OK' && data.results.length > 0) {
//        const { lat, lng } = data.results[0].geometry.location;
//        
//        // Update latitude and longitude in the database
//        branch.latitude = lat;
//        branch.longitude = lng;
//        await branch.save();
//      } else {
//        console.warn(`Geocoding failed for address: ${fullAddress}`);
//      }
//    }
//
//    res.status(200).json({ message: 'Pharmacy branch coordinates updated successfully.' });
//  } catch (error) {
//    console.error("Error updating coordinates:", error);
//    res.status(500).json({ message: 'Failed to update coordinates.' });
//  }
//}
//
//module.exports = {
//  updateCoordinates,
//};
