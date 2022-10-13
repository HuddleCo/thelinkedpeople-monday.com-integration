import axios from 'axios';
import moment from 'moment';
import { Request, Response } from 'express';
import l from '../../../common/logger';
import allData from './getData';

type Record = { board_ID: string; username: string; api_key: string };

const query = `
  mutation (
    $board_ID: Int!,
    $itemName: String!,
    $columnValues: JSON!
  ) {
    create_item (
      board_id: $board_ID,
      item_name: $itemName, 
      column_values: $columnValues
    ) { id }
  }`;

const getRecord = async (token: string | undefined) =>
  (await allData).find(({ username }) => username === token);

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
    board_ID: record.board_ID,
    itemName: itemName(req.body.profile_full_name, req.body.company_name),
    columnValues: JSON.stringify(columnValues),
  };

  l.debug(query);
  l.debug(variables);

  return axios({
    url: 'https://api.monday.com/v2',
    method: 'post',
    headers: {
      Authorization: record.api_key,
      'Content-Type': 'application/json',
    },
    data: { query, variables },
  });
};

export class Controller {
  async post(req: Request, res: Response): Promise<void> {
    l.debug(`body: ${JSON.stringify(req.body)}`);
    l.debug(`username: ${JSON.stringify(req.params)}`);
    const record = await getRecord(req.params.authToken);
    l.debug(`RECORD: ${JSON.stringify(record)}`);

    if (!record) {
      res.status(401).json({ message: 'username unrecognised' });
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
