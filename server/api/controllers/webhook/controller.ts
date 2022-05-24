import axios from 'axios';
import moment from 'moment';
import { Request, Response } from 'express';
import l from '../../../common/logger';

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

const itemName = (profileName: string, companyName: string) =>
  companyName.length ? `${profileName} - ${companyName}` : profileName;

const safeDate = (date: string, format: string) => {
  try {
    return moment(date).format(format);
  } catch (error) {
    return '';
  }
};

const safePhoneNumber = (phone: string) =>
  phone.match(/[+0-9]/g) ? phone.replace(/ /g, '') : '';

const doWork = (boardId: number, req: Request, res: Response) => {
  const columnValues = {
    dup__of_relationship_to_me: {
      label: 'Lead Gen',
    },
    text: req.body.profile_full_name,
    dup__of_company8: req.body.profile_title,
    link: {
      url: req.body.profile_linkedin_url,
      text: req.body.profile_linkedin_url,
    },
    email: {
      email: req.body.profile_email,
      text: req.body.profile_email,
    },
    phone: {
      phone: safePhoneNumber(req.body.profile_phone_number),
    },
    text2: req.body.company_name,
    dup__of_linkedin: {
      url: req.body.company_website,
      text: req.body.company_website,
    },
    dup__of_company: req.body.company_employee_count,
    dup__of_company_size: req.body.company_industry,
    date: {
      date: safeDate(req.body.connectedAt_date, 'YYYY-MM-DD'),
    },
    text8: req.body.campaign_name,
  };

  const variables = {
    boardId,
    itemName: itemName(req.body.profile_full_name, req.body.company_name),
    columnValues: JSON.stringify(columnValues),
  };

  l.debug(query);
  l.debug(variables);

  axios({
    url: 'https://api.monday.com/v2',
    method: 'post',
    headers: {
      Authorization: process.env.MONDAY_AUTH_TOKEN || '',
      'Content-Type': 'application/json',
    },
    data: { query, variables },
  })
    .then(({ data }) => {
      l.debug(data);
      res.status(200).json({ message: 'ok' });
    })
    .catch((error) => {
      l.debug(error);
      res.status(500).json({ message: error.message });
    });
};

const authenticated = (authToken: string) =>
  authToken === process.env.HUDDLECO_AUTH_TOKEN ||
  authToken === process.env.THECOACHINGDIRECTORY_AUTH_TOKEN ||
  authToken === process.env.SALLY_A_CURTIS_AUTH_TOKEN;

export class Controller {
  post(req: Request, res: Response): void {
    l.debug(`body: ${JSON.stringify(req.body)}`);

    if (!authenticated(req.params.authToken)) {
      res.status(401).json({ message: 'authToken unrecognised' });
      return;
    }

    if (req.params.authToken === process.env.HUDDLECO_AUTH_TOKEN) {
      doWork(1964029256, req, res);
    } else if (
      req.params.authToken === process.env.THECOACHINGDIRECTORY_AUTH_TOKEN
    ) {
      doWork(2662488030, req, res);
    } else if (req.params.authToken === process.env.SALLY_A_CURTIS_AUTH_TOKEN) {
      doWork(2706715613, req, res);
    }
  }
}
export default new Controller();
