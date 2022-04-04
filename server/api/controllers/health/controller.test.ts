import 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import Server from '../../..';

describe('Health', () => {
  it('should be healthy', () =>
    request(Server)
      .get('/health')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((r) => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('message')
          .equal('ok');
      }));
});
