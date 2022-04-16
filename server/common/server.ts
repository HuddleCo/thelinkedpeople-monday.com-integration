import express, { Application } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import * as OpenApiValidator from 'express-openapi-validator';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

import l from './logger';
import errorHandler from '../api/middlewares/error.handler';

const limit = process.env.REQUEST_LIMIT || '100kb';
const app = express();

Sentry.init({
  dsn:
    process.env.SENTRY_DSN || 'https://examplePublicKey@o0.ingest.sentry.io/0',
  environment: process.env.NODE_ENV || 'development',
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
});

export default class ExpressServer {
  private routes: (app: Application) => void;

  constructor() {
    const root = path.normalize(`${__dirname}/../..`);
    app.use(bodyParser.json({ limit }));
    app.use(
      bodyParser.urlencoded({
        extended: true,
        limit,
      })
    );
    app.use(bodyParser.text({ limit }));
    app.use(express.static(`${root}/public`));

    const apiSpec = path.join(__dirname, 'api.yml');
    const validateResponses = !!(
      process.env.OPENAPI_ENABLE_RESPONSE_VALIDATION &&
      process.env.OPENAPI_ENABLE_RESPONSE_VALIDATION.toLowerCase() === 'true'
    );
    app.use('/api/spec', express.static(apiSpec));
    app.use(
      OpenApiValidator.middleware({
        apiSpec,
        validateResponses,
        ignorePaths: /.*\/spec(\/|$)/,
      })
    );
  }

  router(routes: (app: Application) => void): ExpressServer {
    app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
    app.use(Sentry.Handlers.tracingHandler());
    routes(app);
    app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);
    app.use(errorHandler);
    return this;
  }

  listen(port: number): Application {
    const welcome = (p: number) => (): void =>
      l.info(
        `running in ${process.env.NODE_ENV || 'development'} on port: ${p}`
      );

    http.createServer(app).listen(port, welcome(port));

    return app;
  }
}
