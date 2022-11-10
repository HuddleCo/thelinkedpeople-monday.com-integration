import axios from 'axios';
import moment from 'moment';
import { Request, Response } from 'express';
import l from '../../../common/logger';

type Record = { boardId: number; authToken: string; mondayAuthToken: string };
const database: Array<Record> = [
  {
    boardId: 1964029256,
    authToken: process.env.HUDDLECO_AUTH_TOKEN || '',
    mondayAuthToken: process.env.MONDAY_AUTH_TOKEN || '',
  },
  {
    boardId: 2706715613,
    authToken: process.env.SALLY_A_CURTIS_AUTH_TOKEN || '',
    mondayAuthToken: process.env.MONDAY_AUTH_TOKEN || '',
  },
  {
    boardId: 2890900002,
    authToken: process.env.THECOACHINGDIRECTORY_AUTH_TOKEN || '',
    mondayAuthToken: process.env.THECOACHINGDIRECTORY_MONDAY_AUTH_TOKEN || '',
  },
  {
    boardId: 2890960150,
    authToken: process.env.KRISTI_AUTH_TOKEN || '',
    mondayAuthToken: process.env.THECOACHINGDIRECTORY_MONDAY_AUTH_TOKEN || '',
  },
  {
    boardId: 3503954392,
    authToken: process.env.ELIZABETH_AUTH_TOKEN || '',
    mondayAuthToken: process.env.THECOACHINGDIRECTORY_MONDAY_AUTH_TOKEN || '',
  },
  {
    boardId: 3503956486,
    authToken: process.env.VANESSA_AUTH_TOKEN || '',
    mondayAuthToken: process.env.THECOACHINGDIRECTORY_MONDAY_AUTH_TOKEN || '',
  },
];

const query = `
  mutation (
    $boardId: Int!,
    $itemName: String!,
    $columnValues: JSON!
  ) {
    create_item (
      board_id: $boardId,
      item_name: $itemName, 
      column_values: $columnValues
    ) { id }
  }`;

const getRecord = (token: string | undefined): Record | undefined =>
  database.find(({ authToken }) => authToken === token);

const status = (label: string | undefined) => ({ label: label || '' });
const text = (value: string | undefined) => value || '';
const link = (url: string | undefined) => ({ url: url || '', text: url || '' });
const email = (email: string | undefined) => ({
  email: email || '',
  text: email || '',
});
const phone = (phone: string | undefined) => ({
  phone: (phone || '').match(/[+0-9]/g) ? (phone || '').replace(/ /g, '') : '',
});
const date = (date: string | undefined) => ({
  date: moment(date || '').isValid()
    ? moment(date || '').format('YYYY-MM-DD')
    : '',
});

const itemName = (
  profileName: string | undefined,
  companyName: string | undefined
) =>
  [profileName, companyName]
    .filter((string) => (string || '').length)
    .join(' - ');

const doWork = (record: Record, req: Request) => {
  const columnValues = {
    dup__of_relationship_to_me: status('Lead Gen'),
    text: text(req.body.profile_full_name),
    dup__of_company8: text(req.body.profile_title),
    link: link(req.body.profile_linkedin_url),
    email: email(req.body.profile_email),
    phone: phone(req.body.profile_phone_number),
    text2: text(req.body.company_name),
    dup__of_linkedin: link(req.body.company_website),
    dup__of_company: text(req.body.company_employee_count),
    dup__of_company_size: text(req.body.company_industry),
    date: date(req.body.connectedAt_date),
    text8: text(req.body.campaign_name),
    link_1: link(req.body.message_thread_url),
  };

  const variables = {
    boardId: record.boardId,
    itemName: itemName(req.body.profile_full_name, req.body.company_name),
    columnValues: JSON.stringify(columnValues),
  };

  l.debug(query);
  l.debug(variables);

  return axios({
    url: 'https://api.monday.com/v2',
    method: 'post',
    headers: {
      Authorization: record.mondayAuthToken,
      'Content-Type': 'application/json',
    },
    data: { query, variables },
  });
};

export class Controller {
  post(req: Request, res: Response): void {
    l.debug(`body: ${JSON.stringify(req.body)}`);

    const record = getRecord(req.params.authToken);

    if (!record) {
      res.status(401).json({ message: 'authToken unrecognised' });
      return;
    }

    doWork(record, req)
      .then((data) => {
        l.debug(data);
        res.status(200).json({ message: 'ok' });
      })
      .catch((error) => {
        l.debug(error);
        res.status(500).json({ message: error.message });
      });
  }
}
export default new Controller();
