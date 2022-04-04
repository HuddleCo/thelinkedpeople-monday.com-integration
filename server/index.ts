import './common/env';
import Server from './common/server';
import routes from './routes';

const port = parseInt(process.env.APP_PORT ?? '80');
export default new Server().router(routes).listen(port);
