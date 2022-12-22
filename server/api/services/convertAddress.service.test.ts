import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { afterEach, beforeEach } from 'mocha';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { geocode } from './convertAddress.service';
import sinon from 'sinon';

chai.use(chaiAsPromised);

describe('ConvertAddress Service', () => {
  context('when stubbing environment variables', () => {
    const sandbox = sinon.createSandbox();
    beforeEach(() => {
      sandbox.stub(process, 'env').value({ TOMTOM_API_KEY: undefined });
    });
    afterEach(() => {
      sandbox.restore();
    });

    it('should throw an error if TOMTOM_API_KEY is missing', async () =>
      expect(
        geocode.convertAddress('123 Smith Street, Townsville')
      ).to.eventually.be.rejectedWith(/TOMTOM_API_KEY/));
  });

  context('when the response has results', () => {
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
            {
              position: {
                lat: '111.111',
                lon: '-222.222',
              },
            },
          ],
        });
    });

    afterEach(() => {
      mock.restore();
    });

    it('should return the first geolocation', () =>
      expect(geocode.convertAddress('Adelaide')).to.eventually.deep.equals({
        address: 'Adelaide',
        lat: '123.456',
        lng: '-123.456',
      }));

    context('when the response has no results', () => {
      let mock: MockAdapter;
      beforeEach(() => {
        mock = new MockAdapter(axios);
        mock
          .onGet(/https:\/\/api\.tomtom\.com\/search\/2\/geocode\/Adelaide/)
          .reply(200, { results: [] });
      });

      afterEach(() => {
        mock.restore();
      });

      it('should return an empty object ', () =>
        expect(geocode.convertAddress('Adelaide')).to.eventually.deep.equals(
          {}
        ));
    });

    it('should return empty object when address is undefined', async () =>
      expect(await geocode.convertAddress(undefined)).to.deep.equals({}));
  });
});
