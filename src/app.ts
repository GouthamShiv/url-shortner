import express, { json } from 'express';
import config from 'config';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import log from './utils/logger';
import dbConnection from './utils/db';
import urlRouter from './routes/url.routes';
import index from './routes/index';
// import cors from './utils/cors';

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
});

const server = express().disable('x-powered-by');
server.use(json());
// server.use(cors);
server.use(limiter);
server.use(helmet());

server.use('/', index);
server.use('/api/url', urlRouter);

dbConnection();

const PORT = config.get<string>('app.PORT');

server.listen(PORT, () => log.info(`Server to shorten URLs successfully started on port ${PORT}`));
