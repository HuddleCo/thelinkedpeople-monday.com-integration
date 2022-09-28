import axios, { AxiosRequestConfig } from 'axios';
import l from '../../common/logger';

class Geocode {
  convertAddress = async (address: string | undefined) => {
    if (address !== undefined) {
      const args: AxiosRequestConfig = {
        url: `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
          address
        )}.json`,
        method: 'GET',
        params: { key: process.env.TOMTOM_API_KEY },
      };
      l.debug(`await axios(${JSON.stringify(args)})`);
      const res = await axios(args);
      l.debug('res:');
      l.debug(JSON.stringify(res));
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
