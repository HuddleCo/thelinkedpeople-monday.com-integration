import { Application } from 'express';
import webhookRouter from './api/controllers/webhook/router';
import healthRouter from './api/controllers/health/router';

export default function routes(app: Application): void {
  app.use('/webhook', webhookRouter);
  app.use('/health', healthRouter);
}
