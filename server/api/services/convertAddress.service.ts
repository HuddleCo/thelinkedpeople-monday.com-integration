import axios from 'axios';

class Geocode {
  convertAddress = async (address: string | undefined) => {
    if (address !== undefined) {
      const res = await axios({
        url: `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
          address
        )}.json`,
        method: 'GET',
        params: { key: process.env.TOMTOM_API_KEY },
      });
      const returnVal = {
        lat: res.data.results[0].position.lat,
        lng: res.data.results[0].position.lon,
        address: address,
      };

      return returnVal;
    } else {
      return {};
    }
  };
}

export const geocode = new Geocode();
