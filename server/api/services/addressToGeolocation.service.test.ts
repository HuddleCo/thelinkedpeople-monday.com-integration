import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { afterEach, beforeEach } from 'mocha';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import service from './addressToGeolocation.service';
import sinon from 'sinon';

chai.use(chaiAsPromised);

describe('ConvertAddress Service', () => {
  context('when stubbing environment variables', () => {
    const subject = () => service('Adelaide');

    const sandbox = sinon.createSandbox();
    beforeEach(() => {
      sandbox.stub(process, 'env').value({ TOMTOM_API_KEY: undefined });
    });
    afterEach(() => {
      sandbox.restore();
    });

    it('should throw an error if TOMTOM_API_KEY is missing', async () =>
      expect(subject()).to.eventually.be.rejectedWith(/TOMTOM/));
  });

  context('when the response has results', () => {
    const subject = () => service('Adelaide');

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

    it('should return the first geolocation', async () =>
      expect(await subject()).to.deep.equals({
        latitude: '123.456',
        longitude: '-123.456',
      }));

    context('when the response has no results', () => {
      const subject = () => service('Adelaide');

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

      it('should return an empty object ', async () =>
        expect(await subject()).to.deep.equals({
          latitude: '',
          longitude: '',
        }));
    });

    context('when the address is underfined', () => {
      const subject = () => service(undefined);
      it('should return empty object when address is undefined', async () =>
        expect(await subject()).to.deep.equals({
          latitude: '',
          longitude: '',
        }));
    });
  });
});
