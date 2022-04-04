// import 'mocha';
// import { expect } from 'chai';
// import nock from 'nock';
// import EntryService from './entry.service';

// describe('EntryService', () => {
//   nock('https://api.monday.com', {
//     reqheaders: {
//       authorization: 'TOKEN',
//       'content-type': 'application/json',
//     },
//   })
//     .post('/v2')
//     .reply(200, {
//       data: { boards: [{ columns: [] }] },
//     })
//     .post('/v2')
//     .reply(200, {
//       data: { create_item: { id: '123' } },
//     })
//     .post('/v2')
//     .reply(200, {
//       data: { create_update: { id: '123' } },
//     });
//   beforeEach(() => {
//     nock.disableNetConnect();
//   });
//   afterEach(() => {
//     nock.cleanAll();
//     nock.enableNetConnect();
//   });

//   it('returns successfully', () =>
//     EntryService.create(
//       'board_id_1',
//       'TOKEN',
//       'John Smith',
//       'Full Name',
//       'CompanyCo',
//       'Company',
//       'john.smith@sample.com',
//       'Email',
//       '0412123456',
//       'Phone',
//       'This is a message'
//     ).then((r) => expect(r).to.equal(true)));
// });
