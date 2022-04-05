import axios from 'axios';
import moment from 'moment';
import { Request, Response } from 'express';
import l from '../../../common/logger';

export class Controller {
  post(req: Request, res: Response): void {
    if (req.params.authToken !== process.env.AUTH_TOKEN) {
      res.status(401).json({ message: 'authToken unrecognised' });
      return;
    }

    l.debug(`body: ${JSON.stringify(req.body)}`);

    const boardId = 1964029256;
    const itemName = `${req.body.profile_full_name} - ${req.body.company_name}`;
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
        phone: req.body.profile_phone_number,
      },
      text2: req.body.company_name,
      dup__of_linkedin: {
        url: req.body.company_website,
        text: req.body.company_website,
      },
      dup__of_company: req.body.company_employee_count,
      dup__of_company_size: req.body.company_industry,
      date: {
        date: moment(req.body.connectedAt_date).format('YYYY-MM-DD'),
      },
      text8: req.body.campaign_name,
    };

    const query = `
    mutation {
      create_item (
        board_id: ${boardId}, 
        item_name: "${itemName}", 
        column_values: "${JSON.stringify(columnValues).replace(/"/g, '\\"')}"
      ) { id }
    }`;

    l.debug(query);
    axios({
      url: 'https://api.monday.com/v2',
      method: 'post',
      headers: {
        Authorization: process.env.MONDAY_AUTH_TOKEN || '',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        query: query,
      }),
    })
      .then(({ data }) => {
        l.debug(JSON.stringify(data));
        res.status(200).json({ message: 'ok' });
      })
      .catch((error) => {
        l.debug(error);
        res.status(500).json({ message: error.message });
      });
  }
}
export default new Controller();
