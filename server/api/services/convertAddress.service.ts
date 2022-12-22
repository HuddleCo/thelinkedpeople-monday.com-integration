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
    if (address == undefined) {
      return {};
    }
    if (!process.env.TOMTOM_API_KEY) {
      throw new Error(
        'TOMTOM_API_KEY is missing. Please check that TOMTOM_API_KEY is added in the environment.'
      );
    }

    const { data } = await this.request(address);
    if (!data.results.length) {
      return {};
    }

    return {
      lat: data.results[0].position.lat,
      lng: data.results[0].position.lon,
      address,
    };
  };
}

export const geocode = new Geocode();
