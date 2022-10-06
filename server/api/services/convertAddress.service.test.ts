import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { afterEach, beforeEach } from 'mocha';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { geocode } from './convertAddress.service';

chai.use(chaiAsPromised);

describe('ConvertAddress Service', () => {
  it('should not be null', () => expect(geocode).not.to.be.null);
  it('convertAddress should be a function', () =>
    expect(geocode.convertAddress).to.be.a('function'));

  context('when stubbing the web requests', () => {
    let mock: MockAdapter;
    beforeEach(() => {
      mock = new MockAdapter(axios);
      mock
        .onGet(/https:\/\/api\.tomtom\.com\/search\/2\/geocode\/Adelaide/)
        .reply(200, {
          results: [
            {
              position: {
                lat: '123.456',
                lon: '-123.456',
              },
            },
          ],
        });
    });

    afterEach(() => {
      mock.restore();
    });

    it('should return a geolocation ', () =>
      expect(geocode.convertAddress('Adelaide')).to.eventually.deep.equals({
        address: 'Adelaide',
        lat: '123.456',
        lng: '-123.456',
      }));

    it('should return empty object when address is undefined', async () =>
      expect(await geocode.convertAddress(undefined)).to.deep.equals({}));
  });
});
