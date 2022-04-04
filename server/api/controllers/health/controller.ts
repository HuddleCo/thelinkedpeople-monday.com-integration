import { Request, Response } from 'express';

export class Controller {
  get(_req: Request, res: Response): void {
    res.status(200).json({ message: 'ok' });
  }
}
export default new Controller();
