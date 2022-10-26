import axios from 'axios';

class Geocode {
  private request = async (address: string) =>
    await axios({
      url: `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
        address
      )}.json`,
      method: 'GET',
      params: { key: process.env.TOMTOM_API_KEY },
    });

  convertAddress = async (address: string | undefined) => {
    if (address !== undefined) {
      if (process.env.TOMTOM_API_KEY) {
        const res = await this.request(address);
        return {
          lat: res.data.results[0].position.lat,
          lng: res.data.results[0].position.lon,
          address: address,
        };
      } else {
        throw new Error('TOMTOM API Key missing!');
      }
    } else {
      return {};
    }
  };
}

export const geocode = new Geocode();
