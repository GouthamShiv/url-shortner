import logger from 'pino';
import dayjs from 'dayjs';
import config from 'config';

const level = config.get<string>('app.LOG_LEVEL');

const log = logger({
  transport: {
    target: 'pino-pretty',
  },
  level,
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default log;
