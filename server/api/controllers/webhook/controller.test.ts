import { expect } from 'chai';
import request from 'supertest';
import Server from '../../..';

describe('Webhook', () => {
  context('when authenticated', () =>
    xit('should be ok', () =>
      request(Server)
        .post(`/webhook/${process.env.AUTH_TOKEN}`)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .expect(200)
        .expect('Content-Type', /json/)
        .then((r) => {
          expect(r.body)
            .to.be.an('object')
            .that.has.property('message')
            .equal('ok');
        }))
  );

  context('when unauthenticated', () => {
    it('should be unauthenticated', () =>
      request(Server)
        .post(`/webhook/FAKE-${process.env.AUTH_TOKEN}`)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .expect(401)
        .expect('Content-Type', /json/)
        .then((r) => {
          expect(r.body)
            .to.be.an('object')
            .that.has.property('message')
            .equal('authToken unrecognised');
        }));
  });
});
