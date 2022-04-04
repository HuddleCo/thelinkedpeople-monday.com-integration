import express, { Application } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import * as OpenApiValidator from 'express-openapi-validator';
import l from './logger';

import errorHandler from '../api/middlewares/error.handler';

const limit = process.env.REQUEST_LIMIT || '100kb';
const app = express();

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
    routes(app);
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
