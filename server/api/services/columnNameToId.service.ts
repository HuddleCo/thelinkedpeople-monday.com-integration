import axios from 'axios';
import { Record } from '../types';

type Query = { id: string; title: string };

const query = `
  query($boardId: Int!) {
    boards(ids: [$boardId]) {
      columns {
        id,
        title
      }
    }
  }`;

const request = (authorization: string, boardId: number) =>
  axios({
    url: 'https://api.monday.com/v2',
    method: 'post',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    data: {
      query,
      variables: {
        boardId,
      },
    },
  });

export default async (columnName: string, record: Record) => {
  const { data } = await request(record.mondayAuthToken, record.boardId);

  return data.data.boards[0].columns.find(
    (element: Query) => element.title === columnName
  ).id;
};
