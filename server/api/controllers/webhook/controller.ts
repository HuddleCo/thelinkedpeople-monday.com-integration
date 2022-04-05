import { Request, Response } from 'express';
import l from '../../../common/logger';

export class Controller {
  post(req: Request, res: Response): void {
    if (req.params.authToken !== process.env.AUTH_TOKEN) {
      res.status(401).json({ message: 'authToken unrecognised' });
      return;
    }

    l.debug(`body: ${JSON.stringify(req.body)}`);
    res.status(200).json({ message: 'ok' });
  }
}
export default new Controller();
