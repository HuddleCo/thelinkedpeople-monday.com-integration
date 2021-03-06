import pino from 'pino';

const l = pino({
  name: process.env.APP_ID,
  level: process.env.LOG_LEVEL,
  enabled: process.env.LOG_ENABLED === 'true',
});

export default l;
