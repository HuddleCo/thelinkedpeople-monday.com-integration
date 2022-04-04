// import mondaySdk from 'monday-sdk-js';

// const getBoardColumnsQuery = (boardId: string): string =>
//   `
//     query {
//       boards (ids: [${boardId}]) {
//         columns {
//           title
//           id
//         }
//       }
//     }
//   `;

// const createItemQuery = (
//   boardId: string,
//   name: string,
//   columnValues: object
// ): string =>
//   `
//     mutation {
//       create_item (
//         board_id: ${boardId},
//         item_name: "${name}",
//         column_values: ${JSON.stringify(JSON.stringify(columnValues))}
//       ) {
//         id
//       }
//     }
//   `;

// const createUpdateQuery = (itemId: string, message: string): string =>
//   `
//     mutation {
//       create_update (item_id: ${itemId}, body: "${message}") {
//         id
//       }
//     }
//   `;

// const squishColumns = (columns: Array<{ title: string; id: string }>) =>
//   columns.reduce(
//     (previous, { title, id }) => Object.assign(previous, { [title]: id }),
//     {}
//   );
// export class EntryService {
//   create(
//     boardId: string,
//     mondayDeveloperToken: string,
//     name: string,
//     nameColumn: string,
//     business: string,
//     businessColumn: string,
//     contactNumber: string,
//     contactNumberColumn: string,
//     email: string,
//     emailColumn: string,
//     message: string
//   ): Promise<boolean> {
//     const monday = mondaySdk();
//     monday.setToken(mondayDeveloperToken);
//     return monday
//       .api(getBoardColumnsQuery(boardId))
//       .then(({ data }) => data.boards[0].columns)
//       .then((columns) => squishColumns(columns))
//       .then((ids: { [key: string]: string }) =>
//         monday.api(
//           createItemQuery(boardId, name, {
//             [ids[nameColumn]]: name,
//             [ids[businessColumn]]: business,
//             [ids[contactNumberColumn]]: {
//               phone: contactNumber.replace(/\s+/g, ''),
//               countryShortName: 'AU',
//             },
//             [ids[emailColumn]]: { email, text: email },
//           })
//         )
//       )
//       .then(({ data }) =>
//         monday.api(createUpdateQuery(data.create_item.id, message))
//       )
//       .then(() => true);
//   }
// }

// export default new EntryService();
