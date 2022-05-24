import { expect } from 'chai';
import request from 'supertest';
import Server from '../../..';

describe('Webhook', () => {
  context('when authenticated as Huddle', () =>
    xit('should be ok', () =>
      request(Server)
        .post(`/webhook/${process.env.HUDDLECO_AUTH_TOKEN}`)
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

  context('when authenticated as The Coaching Directory', () =>
    xit('should be ok', () =>
      request(Server)
        .post(`/webhook/${process.env.THECOACHINGDIRECTORY_AUTH_TOKEN}`)
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

  context('when authenticated as Sally A Curtis', () =>
    xit('should be ok', () =>
      request(Server)
        .post(`/webhook/${process.env.SALLY_A_CURTIS_AUTH_TOKEN}`)
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
        .post(`/webhook/FAKE-${process.env.HUDDLECO_AUTH_TOKEN}`)
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
