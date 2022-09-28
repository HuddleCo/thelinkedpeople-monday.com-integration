import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { after } from 'mocha';

import { geocode } from './convertAddress.service';

chai.use(chaiAsPromised);

describe('ConvertAddress Service', () => {
  it('should not be null', () => expect(geocode).not.to.be.null);
  it('convertAddress should be a function', () =>
    expect(geocode.convertAddress).to.be.a('function'));
  it('should throw an error when there is not auth token', async () =>
    await expect(geocode.convertAddress('Adelaide')).to.be.rejectedWith(/403/));

  context('when there is a valid auth token', () => {
    const env = process.env;

    before(() => {
      process.env = { TOMTOM_API_KEY: 'DPyjUL0gJc2edmvD2hnFjP32tYgtSdKn' };
    });

    after(() => {
      process.env = env;
    });

    it('should not throw an error', async () =>
      await expect(geocode.convertAddress('Adelaide')).to.not.be.rejectedWith(
        /403/
      ));

    it('should have a latitude', async () =>
      expect(await geocode.convertAddress('Adelaide')).to.have.property('lat'));
    it('should have a longitude', async () =>
      expect(await geocode.convertAddress('Adelaide')).to.have.property('lng'));
    it('should have an address', async () =>
      expect(await geocode.convertAddress('Adelaide')).to.have.property(
        'address'
      ));
  });
});

// import axios, { AxiosRequestConfig } from 'axios';

// class Geocode {
//   convertAddress = async (address: string | undefined) => {
//     if (address !== undefined) {
//       const args: AxiosRequestConfig = {
//         url: `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
//           address
//         )}.json`,
//         method: 'GET',
//         params: { key: process.env.TOMTOM_API_KEY },
//       };
//       console.log(`await axios(${JSON.stringify(args)})`);
//       const res = await axios(args);
//       console.log('res:');
//       console.log(JSON.stringify(res));
//       const returnVal = {
//         lat: res.data.results[0].position.lat,
//         lng: res.data.results[0].position.lon,
//         address: address,
//       };

//       return returnVal;
//     } else {
//       return {};
//     }
//   };
// }

// export const geocode = new Geocode();
