import axios from 'axios';
type Record = { boardId: number; authToken: string; mondayAuthToken: string };
type Query = { id: string; title: string };

export const columnNameToId = async (columnName: string, record: Record) => {
  const query = `
    query {
        boards(ids:[3165097755]) {
          columns {
            id,
            title
          }
        }
    }`;

  const res = await axios({
    url: 'https://api.monday.com/v2',
    method: 'post',
    headers: {
      Authorization: record.mondayAuthToken,
      'Content-Type': 'application/json',
    },
    data: { query },
  });

  return res.data.data.boards[0].columns.find(
    (element: Query) => element.title === columnName
  ).id;
};
