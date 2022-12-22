import axios from 'axios';
import Mustache from 'mustache';

const EMPTY_RESPONSE = {
  latitude: '',
  longitude: '',
};

const getLocation = async (
  address: string | undefined,
  url: string,
  apiKey: string | undefined
) => {
  if (address == undefined) {
    return EMPTY_RESPONSE;
  }

  if (!apiKey) {
    throw new Error(
      'The API key for TOMTOM is missing. Please ensure it is specified.'
    );
  }

  const results = await positions(address, url, apiKey);

  if (!results.length) {
    return EMPTY_RESPONSE;
  }

  return {
    latitude: results[0].position.lat,
    longitude: results[0].position.lon,
  };
};

const positions = async (address: string, url: string, apiKey: string) => {
  const {
    data: { results },
  } = await axios({
    method: 'GET',
    url: Mustache.render(url, {
      address: encodeURIComponent(address),
    }),
    params: { key: apiKey },
  });
  return results;
};

export default async (
  address: string | undefined
): Promise<{ latitude: string; longitude: string }> =>
  getLocation(
    address,
    `https://api.tomtom.com/search/2/geocode/{{address}}.json`,
    process.env.TOMTOM_API_KEY
  );
